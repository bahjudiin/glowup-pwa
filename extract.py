#!/usr/bin/env python3
"""Extract structured GlowUp data from the Phase-1 Markdown library (files 00-27).

Outputs data.json with:
  articles  (38)  - title, category, grade, summary, key points, safety, references, read time
  products  (18)  - iHerb SKUs (12 with verified prices) + 6 catalogue entries (price not verified)
  nutrition (26)  - USDA FoodData Central values + satiety evidence
  meals     (5)   - meal templates + weekly shopping list
Nothing is invented: every field is parsed from the Markdown or from the offline USDA dataset.
"""
import json, re, subprocess, os, hashlib
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))

# The research library lives beside this script, so the pipeline is
# repo-relative rather than tied to one machine's home directory.
RES = os.environ.get("GLOWUP_RESEARCH", os.path.join(HERE, "research_library_md"))
OUT = os.environ.get("GLOWUP_DATA_JSON", os.path.join(HERE, "data.json"))

def _is_phase1(fname):
    """Phase-1 files use ALL-CAPS stems (02_FAST_FAT_LOSS.md); Phase-2 files do not
    (02_Hunger_Control_and_Satiety.md). This keeps 00-26 unambiguous."""
    if not (re.match(r"^\d\d_", fname) and fname.endswith(".md")):
        return False
    stem = fname[3:-3]
    return stem == stem.upper()

FILES = {f[:2]: os.path.join(RES, f) for f in sorted(os.listdir(RES)) if _is_phase1(f)}
print("phase-1 files:", len(FILES), sorted(FILES))

# ---------------------------------------------------------------- md parsing
def load_sections(path):
    """Return list of {level, title, lines} for every heading in the file."""
    # The library is UTF-8; without an explicit encoding the read would use
    # the platform locale (cp1252 on Windows) and turn every em dash, arrow
    # and curly quote into mojibake.
    with open(path, encoding="utf-8") as fh:
        lines = fh.read().split("\n")
    heads = []
    for i, ln in enumerate(lines):
        m = re.match(r"^(#{2,3})\s+(.*)$", ln)
        if m:
            heads.append({"level": len(m.group(1)), "title": m.group(2).strip(), "start": i})
    for idx, h in enumerate(heads):
        end = len(lines)
        for nxt in heads[idx + 1:]:
            if nxt["level"] <= h["level"]:
                end = nxt["start"]
                break
        h["lines"] = lines[h["start"] + 1:end]
    return heads, lines

def clean(t):
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1", t)      # links -> text
    t = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", t)
    t = t.replace("`", "")
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"^(?:[-*•]|\d+\.)\s+", "", t)
    return t

def blocks(lines):
    """Split section lines into ('bullet'|'para'|'table', payload) items."""
    out, buf = [], []
    for i, ln in enumerate(lines):
        s = ln.rstrip()
        if not s.strip():
            if buf: out.append(("para", " ".join(buf))); buf = []
            continue
        if s.startswith("|"):
            if buf: out.append(("para", " ".join(buf))); buf = []
            if re.match(r"^\|[\s\-:|]+\|$", s):
                continue
            # header row = the row immediately followed by a separator row
            nxt = lines[i + 1].strip() if i + 1 < len(lines) else ""
            if re.match(r"^\|[\s\-:|]+\|$", nxt):
                continue
            cells = [c.strip() for c in s.strip("|").split("|")]
            cells = [c for c in cells if c]
            if cells:
                out.append(("table", cells))
            continue
        if re.match(r"^\s*(?:[-*•]|\d+\.)\s+", s):
            if buf: out.append(("para", " ".join(buf))); buf = []
            out.append(("bullet", s))
            continue
        buf.append(s.strip())
    if buf: out.append(("para", " ".join(buf)))
    return out

def row_text(cells):
    """Render a table row as one readable line, preserving the grading column."""
    if len(cells) == 1:
        return clean(cells[0])
    head, tail = clean(cells[0]), [clean(c) for c in cells[1:]]
    return f"<b>{head}</b> — " + " · ".join(t for t in tail if t)

GRADE_RX = re.compile(r"\b(High|Moderate-High|Moderate|Low-Moderate|Low|Very Low|Absent)\b")
# A grade written in prose or at the start of a table cell ("Very low — single
# small study"). Case-insensitive and dash-agnostic.
GRADE_ANY_RX = re.compile(r"^(very\s+low|low[\s\-–]moderate|moderate[\s\-–]high|moderate|high|low|absent)\b", re.I)

def norm_grade(g):
    key = re.sub(r"\s+", " ", (g or "").strip().lower()).replace("–", "-").replace("—", "-")
    return {"high": "High", "moderate-high": "Moderate–High", "moderate": "Moderate",
            "low-moderate": "Low–Moderate", "low": "Low", "very low": "Low",
            "absent": "Low"}.get(key, "Moderate")
GRADE_ORDER = {"High": 0, "Moderate–High": 1, "Moderate": 2, "Low–Moderate": 3, "Low": 4}

def file_grade_table(heads):
    """Parse the '## 3. Evidence quality' table -> list of (claim, grade, why)."""
    for h in heads:
        if h["title"].lower().startswith("3. evidence quality"):
            rows = []
            for kind, val in blocks(h["lines"]):
                if kind == "table" and len(val) >= 2 and val[1]:
                    g = val[1]
                    if GRADE_RX.search(g):
                        rows.append({"claim": clean(val[0]), "grade": norm_grade(GRADE_RX.search(g).group(1)),
                                     "why": clean(val[2]) if len(val) > 2 else ""})
            return rows
    return []

def refs(heads):
    for h in heads:
        if h["title"].lower().startswith(("13. verified references", "8. references")):
            out = []
            for kind, val in blocks(h["lines"]):
                if kind != "bullet":
                    continue
                raw = val.strip()
                # A markdown link keeps its URL out of the text; a bare URL is
                # stripped after it. Both forms may contain parentheses.
                m = re.search(r"\((https?://[^)\s]+)\)", raw)
                if m:
                    url = m.group(1).rstrip(".,)")
                    body = raw[:m.start()] + raw[m.end():]
                else:
                    m = re.search(r"(https?://\S+)", raw)
                    url = m.group(1).rstrip(".,)") if m else ""
                    body = re.sub(r"https?://\S+", "", raw)
                body = re.sub(r"^\s*(?:[-*•]|\d+\.)\s+", "", body)
                # File 27 style: "[12196747](url) — Author. Title. *Journal*. Year. — files 15, 24"
                pm = re.match(r"^\[(\d{4,9})\]\s*[—–-]\s*(.+)$", body)
                if pm:
                    body = re.sub(r"\s*[—–-]\s*files\b.*$", "", pm.group(2)).strip()
                text = clean(body).strip()
                au = re.match(r"^([A-Z][^.]*)\.", text)
                title = ""
                tm = re.search(r"\.\s*([^.]{12,200}?)\.\s*\*", text)
                if tm: title = tm.group(1).strip()
                jm = re.search(r"\*([^*]+)\*\.?\s*(\d{4})?", text)
                journal = jm.group(1) if jm else ""
                year = jm.group(2) if jm and jm.group(2) else ""
                out.append({"author": au.group(1) if au else text[:40], "title": title,
                            "journal": journal, "year": year, "url": url})
            return [r for r in out if r["url"]]
    return []

def safety(heads):
    for h in heads:
        if h["title"].lower().startswith("9. safety"):
            items = [clean(v) for k, v in blocks(h["lines"]) if k == "bullet"]
            return items[:5]
    return []

# ------------------------------------------------- files that grade claims inline
# File 27 has no "3. Evidence quality" table and no "9. Safety" section: it
# grades each claim where it is written ("*Grade: Low — ...*") and keeps the
# cautions in blockquoted medical notes. These helpers read that shape without
# touching the numbered files, which keep their own sections.
BLOCKQUOTE_RX = re.compile(r"^\s*>")
GRADE_LINE_RX = re.compile(r"^\s*\*+\s*(Grade:\s*.+?)\*+\s*$")

def has_evidence_section(heads):
    """True when the file grades its claims in a dedicated table."""
    return any(h["title"].lower().startswith("3. evidence quality") for h in heads)

def grade_marker(lines):
    """The '*Grade: ...*' note that closes a graded subsection."""
    for ln in lines:
        m = GRADE_LINE_RX.match(ln)
        if m:
            return clean(m.group(1))
    return None

def section_items(h, inline_graded):
    """Content items of one section.

    For inline-graded files the closing grade note is moved in front of the
    claims it grades, and the blockquoted medical notes are held back — they
    become the article's safety notes instead.
    """
    items = blocks(h["lines"])
    if not inline_graded:
        return items
    out = []
    for kind, val in items:
        if kind == "para" and BLOCKQUOTE_RX.match(val.strip()):
            continue
        if kind == "para" and clean(val).startswith("<i>Grade:"):
            continue
        out.append((kind, val))
    mk = grade_marker(h["lines"])
    if mk and not any(mk in clean(v) for k, v in out if k != "table"):
        out.insert(0, ("bullet", mk))
    return out

def safety_notes(src_heads):
    """Medical notes and explicit safety notes inside the selected sections."""
    out = []
    for h in src_heads:
        for kind, val in blocks(h["lines"]):
            if kind == "para" and BLOCKQUOTE_RX.match(val.strip()):
                t = clean(re.sub(r"^\s*>\s?", "", val.strip()))
            elif kind == "table":
                t = None
                for cell in val:
                    c = clean(cell)
                    if re.search(r"safety note|contraind|medical note", c, re.I):
                        t = c
                        break
                if t is None:
                    continue
            else:
                continue
            if t and t not in out:
                out.append(t)
    return out

def unverified_note(heads, label):
    """The file's own list of claims it could not verify.

    It is kept as a caution, never as a claim: the article says plainly that
    these numbers are not established in this library.
    """
    for h in heads:
        if h["title"].lower().startswith("7. claims not verified"):
            items = []
            for kind, val in blocks(h["lines"]):
                if kind != "bullet":
                    continue
                raw = val.strip()
                num = re.match(r"^(\d+\.)\s*", raw)
                txt = clean(raw)
                items.append((num.group(1) + " " + txt) if num else txt)
            if not items:
                return None
            head = "Claims not verified in this library — the source file's full list"
            if label:
                head += " (" + label + " page)"
            return head + ": " + " ".join(items)
    return None

def section_evidence_table(src_heads):
    """Graded tables inside the selected sections -> evidence rows."""
    rows = []
    for h in src_heads:
        for kind, val in blocks(h["lines"]):
            if kind != "table" or len(val) < 3:
                continue
            gi = None
            for i, cell in enumerate(val):
                if i == 0:
                    continue
                if GRADE_ANY_RX.match(cell.strip()):
                    gi = i
                    break
            if gi is None:
                continue
            gm = GRADE_ANY_RX.match(val[gi].strip())
            rest = clean(val[gi].strip()[gm.end():].strip(" —–-:;,. "))
            why = " · ".join([clean(c) for c in val[1:gi]]
                             + ([rest] if rest else [])
                             + [clean(c) for c in val[gi + 1:]])
            grade = norm_grade(gm.group(1))
            # "Very low" becomes "Low" in the app's five-grade vocabulary; keep
            # the source's own wording so the stricter label is not lost.
            if gm.group(1).strip().lower() != grade.lower():
                why = " · ".join([gm.group(1).strip()] + ([why] if why else []))
            rows.append({"claim": clean(val[0]), "grade": grade, "why": why})
    return rows

def section_summary_rows(heads):
    """Rows of the file's executive-summary table (one per section)."""
    for h in heads:
        if h["title"].lower().startswith("1. executive"):
            rows = []
            for kind, val in blocks(h["lines"]):
                if kind == "table" and len(val) >= 2:
                    m = GRADE_ANY_RX.fullmatch(val[-1].strip())
                    if m:
                        rows.append({"section": val[0].strip(),
                                     "cells": [clean(c) for c in val[1:-1]],
                                     "grade": norm_grade(m.group(1))})
            return rows
    return []

def _toks(s):
    return {w for w in re.findall(r"[a-z]+", s.lower()) if len(w) > 2}

def pick_section_row(rows, section_title):
    """The executive-summary row for a section, matched on its words."""
    tk = _toks(re.sub(r"^\d+(\.\d+)*\s*", "", section_title or ""))
    best = None
    for r in rows:
        nt = _toks(r["section"])
        if nt and nt <= tk and (best is None or len(nt) > len(_toks(best["section"]))):
            best = r
    return best

# ---------------------------------------------------------------- article specs
CATS = [
    ("foundations", "Foundations", "How the research was graded and what fails scrutiny"),
    ("fat-loss", "Fat loss", "Deficits, rates, protocols, low-maintenance versions"),
    ("muscle", "Muscle & strength", "Protein, resistance training, retention"),
    ("fasting", "Fasting", "Schedules, evidence, what is not established"),
    ("appetite", "Appetite", "What reduces hunger and what does not"),
    ("nutrition", "Nutrition & meals", "Fibre, cheap foods, templates, shopping"),
    ("sleep", "Sleep & recovery", "Duration, timing, insomnia, caffeine"),
    ("mens-health", "Men's health", "Mortality levers, screening, bloodwork, longevity"),
    ("mens-vitality", "Men's vitality", "Sexual health, fertility, testosterone and attraction"),
    ("skin", "Skin, hair & grooming", "Sunscreen, retinoids, hair loss, appearance"),
    ("supplements", "Supplements & products", "Verdicts, prices, cost per serving"),
    ("maintenance", "Maintenance", "Regain biology, 2-kg rule, transition, early warning"),
]

# (id, title, category, file, section-selector | None=whole file, subtitle)
ARTICLES = [
    ("evidence-method", "How this library grades evidence and verifies citations", "foundations", "01", None,
     "The grading system, verification method and rules applied to every claim"),
    ("myths", "The 12 unsupported claims and myths, graded", "foundations", "23", None,
     "Myth-by-myth verdicts, including the ones that sound scientific"),
    ("fast-fat-loss", "Fast fat loss: the fastest reasonably safe rate", "fat-loss", "02", None,
     "What determines loss, how fast is safe, and what protects the result"),
    ("rate-and-plateaus", "How fast is too fast — and why weight loss slows", "fat-loss", "02",
     ["2.2", "2.5", "2.7"], "Deceleration, water weight, waist and the limits of the 3,500-kcal rule"),
    ("aggressive-safe", "The aggressive-but-safe 16-week transformation", "fat-loss", "20", None,
     "The maximum reasonable speed with muscle, sleep and adherence intact"),
    ("low-maintenance", "The low-maintenance daily protocol", "fat-loss", "19", None,
     "Minimum effective effort: the routine that survives a busy week"),
    ("recomposition", "Body recomposition and muscle retention", "muscle", "03", None,
     "When recomposition is possible, and the two signals that drive it"),
    ("exercise-neat", "Exercise, strength and NEAT: the minimum effective dose", "muscle", "10", None,
     "Mortality, body composition, steps and what exercise cannot fix"),
    ("protein", "Protein: how much, when, and from what", "muscle", "08", None,
     "Dose, distribution, source, cost per gram, and vegetarian adjustments"),
    ("fasting", "Intermittent fasting: schedules, evidence and the best default", "fasting", "04", None,
     "IF vs continuous restriction, early vs late windows, who benefits"),
    ("fasting-claims", "Fasting claims that don't survive the evidence", "fasting", "04", ["2.3"], None,
     "Autophagy timing, metabolic damage and other overreach"),
    ("appetite", "Appetite and satiety: what actually reduces hunger", "appetite", "05", None,
     "Protein, fibre, volume, sleep, behaviour, and the full-plate template"),
    ("appetite-aids", "Appetite aids that don't work — and what to do instead", "appetite", "05", ["2.6"], None,
     "The supplement shelf, tested against the evidence"),
    ("fibre", "Fibre and low-cost foods: the cheapest satiety", "nutrition", "09", None,
     "Outcomes, satiety, gut effects, cheapest fibre and protein per gram"),
    ("meal-templates", "Meal templates, food lists and eating out", "nutrition", "26", None,
     "Breakfasts, lunches, snacks, travel and restaurant rules"),
    ("shopping", "The 7-day rotation and one-page shopping list", "nutrition", "26",
     ["The 7-day rotation", "The weekly shopping list", "Batch cooking"], None,
     "A week of meals mapped to a single shopping list"),
    ("sleep", "Sleep and recovery: the free fat-loss lever", "sleep", "11", None,
     "What sleep does to intake, body composition, training and mortality"),
    ("insomnia", "Insomnia, caffeine and napping: what actually works", "sleep", "11",
     ["2.4", "2.5", "Recovery rules"], None, "Behavioural treatment, caffeine timing, recovery"),
    ("mens-health", "Men's health and longevity: mortality levers and screening", "mens-health", "12", None,
     "Blood pressure, smoking, alcohol, screening, testosterone"),
    ("anti-aging", "Anti-aging interventions, graded by evidence", "mens-health", "13", None,
     "Every popular longevity intervention, classified and costed"),
    ("longevity-table", "The graded longevity table: what each intervention actually does", "mens-health", "13",
     ["2. What the evidence establishes"], None,
     "Healthspan vs lifespan vs biomarker vs animal evidence — side by side"),
    ("bloodwork", "Bloodwork and tracking: what to measure and when", "mens-health", "25", None,
     "Useful tests, useless tests, and how to interpret a result"),
    ("skincare", "Skincare and glow-up: sunscreen, retinoids and devices", "skin", "14", None,
     "The two products with strong evidence, and what to ignore"),
    ("grooming", "Grooming and appearance: teeth, posture, clothing", "skin", "15", None,
     "The highest-return appearance interventions for men"),
    ("hair", "Hair loss and scalp: AGA treatment evidence", "skin", "24", None,
     "What works for male-pattern hair loss, and its safety profile"),
    ("supplements", "Supplements: the evidence review", "supplements", "16", None,
     "Supplement-by-supplement verdicts, safety and cost"),
    ("supplement-verdicts", "Supplement-by-supplement verdicts", "supplements", "16",
     ["✅ Creatine monohydrate", "🟡 Vitamin D3", "🟡 Omega-3", "🟡 Magnesium", "🟡 Multivitamin",
      "⚪/⛔ Not recommended"], None, "What to take, what to skip, and why"),
    ("drugs", "Expensive drugs and affordable alternatives", "supplements", "17", None,
     "GLP-1s, surgery, clinics — and what cannot be reproduced cheaply"),
    ("products", "Product directory: verified links and prices", "supplements", "18", None,
     "Verified iHerb prices, per-serving maths and purchasing rules"),
    ("free-alternatives", "Free and cheap alternatives to every product category", "supplements", "18",
     ["6. Free and cheap alternatives"], None, "What to use instead of buying anything"),
    ("maintenance", "Permanent weight maintenance: the biology of regain", "maintenance", "06", None,
     "Why regain happens, and the maintenance protocol that survives it"),
    ("regain", "Weight regain prevention and the 2-kg rule", "maintenance", "07", None,
     "Ranked causes, predictors and the prevention protocol"),
    ("post-diet", "The 12-week post-diet transition playbook", "maintenance", "21", None,
     "Daily, weekly, monthly and annual maintenance rhythm"),
    ("early-warning", "The early-warning checklist and the four reliable disruptors", "maintenance", "07",
     ["Early-warning checklist", "Handling the four reliable disruptors"], None,
     "A 60-second weekly check that catches regain early"),
    # --- file 27: Big D, men's vitality (graded inline, one article per section)
    ("big-d-sexual-function", "Sexual function and erectile function", "mens-vitality", "27",
     ["2. Sexual function", "2.1 Stress is the mechanism", "2.2 Erectile function — the facts",
      "2.3 Herbal support — graded", "2.4 Vasodilatory foods", "2.5 What to do first"],
     "Stress, sleep, cardiovascular markers — and the herbal claims, graded"),
    ("big-d-pe", "Premature ejaculation", "mens-vitality", "27",
     ["3. Premature ejaculation", "3.1 Mechanism", "3.2 Protocol"],
     "The conventional model, the behavioural protocol, and what needs a clinician"),
    ("big-d-fertility", "Fertility and sperm health", "mens-vitality", "27",
     ["4. Fertility and sperm health", "4.1 What controls sperm production",
      "4.2 Key enhancers — graded", "4.3 Baseline for both partners"],
     "Hormones, endocrine disruptors and every enhancer figure this library could not verify"),
    ("big-d-attraction", "Attraction and androgen signs", "mens-vitality", "27",
     ["5. Attraction and androgen signs", "5.1 Observable correlates", "5.2 Pheromones",
      "5.3 Practical levers"],
     "What correlates with testosterone, and what actually moves perceived attraction"),
    ("big-d-testosterone", "Fixing low testosterone", "mens-vitality", "27",
     ["6. Fixing low testosterone", "6.1 Boost LH and dopamine", "6.2 Correct the deficiencies first",
      "6.3 Manage serotonin", "6.4 Avoid the disruptors", "6.5 The order that works"],
     "Sleep, body fat, training and the deficiencies to correct before anything else"),
]

def _covers(parent, child):
    """True when child's span sits inside parent's span."""
    if parent["level"] >= child["level"]:
        return False
    start = parent["start"] + 1
    return start <= child["start"] < start + len(parent["lines"])

def pick_sections(heads, prefixes):
    """Sections named by heading-title prefixes.

    When a section and its subsections are both named, the section keeps only
    the lines that are not inside one of those subsections, so the subsection
    text is not counted twice.
    """
    picked = []
    for p in prefixes:
        for h in heads:
            if h["title"].startswith(p):
                if h not in picked:
                    picked.append(h)
                break
    picked.sort(key=lambda h: h["start"])
    out = []
    for h in picked:
        lines = h["lines"]
        kids = [c for c in picked if c is not h and _covers(h, c)]
        if kids:
            start = h["start"] + 1
            spans = sorted((c["start"], c["start"] + 1 + len(c["lines"])) for c in kids)
            own, pos = [], 0
            for a, b in spans:
                a, b = max(a, start), min(b, start + len(lines))
                if a > pos:
                    own += lines[pos:a - start]
                pos = max(pos, b - start)
            if pos < len(lines):
                own += lines[pos:]
            lines = own
        out.append({"level": h["level"], "title": h["title"], "start": h["start"], "lines": lines})
    return out

def build_article(spec):
    aid, title, cat, fkey, sel, subtitle = spec
    heads, all_lines = load_sections(FILES[fkey])
    if sel is None:
        summary_src = next((h for h in heads if h["title"].lower().startswith("1. executive")), None)
        body = []
        started = False
        for h in heads:
            if h["title"].lower().startswith("2. what the evidence"):
                started = True
            if started and h["level"] == 3:
                body.append(h)
        src_heads = body
        summary_lines = summary_src["lines"] if summary_src else []
    else:
        src_heads = pick_sections(heads, sel)
        summary_lines = []
        for h in src_heads:
            summary_lines += h["lines"]

    summary, points = [], []
    # Files that grade their claims where they are written (no dedicated
    # evidence-quality table) keep their grade notes attached to the claims
    # they grade, and their graded tables become the evidence table.
    inline_graded = not has_evidence_section(heads)
    for h in src_heads:
        for kind, val in section_items(h, inline_graded):
            if kind == "bullet":
                txt = clean(val)
                if len(txt) > (24 if inline_graded else 30):
                    (summary if len(summary) < 3 else points).append(txt)
            elif kind == "table":
                if inline_graded:
                    continue
                txt = row_text(val)
                if len(txt) > 30:
                    points.append(txt)
            elif kind == "para":
                txt = clean(val)
                if inline_graded:
                    if len(txt) > 60:
                        (summary if len(summary) < 3 else points).append(txt)
                elif len(txt) > 80 and len(summary) < 2 and sel is None:
                    summary.append(txt)
    if sel is None:
        for kind, val in blocks(summary_lines):
            if kind == "bullet" and len(summary) < 4:
                txt = clean(val)
                if txt and txt not in summary:
                    summary.append(txt)
    if len(points) < 2:
        for want in ("4. effectiveness", "11. common mistakes", "5. fastest"):
            for h in heads:
                if h["title"].lower().startswith(want):
                    for kind, val in blocks(h["lines"]):
                        if kind == "bullet" and len(clean(val)) > 35:
                            points.append(clean(val))
                        elif kind == "table":
                            t = row_text(val)
                            if len(t) > 35:
                                points.append(t)
                    break
            if len(points) >= 4:
                break
    if len(summary) < 2:
        for h in heads:
            if h["title"].lower().startswith("1. executive"):
                for kind, val in blocks(h["lines"]):
                    if kind == "bullet" and len(clean(val)) > 40:
                        summary.append(clean(val))
                    if len(summary) >= 3:
                        break
                break

    # dedupe + cap
    def dedupe(seq, n):
        seen, out = set(), []
        for s in seq:
            k = s[:60]
            if k in seen or len(s) < 25:
                continue
            seen.add(k); out.append(s)
        return out[:n]
    summary = dedupe(summary, 4)
    points = dedupe([p for p in points if p not in summary], 16 if inline_graded else 6)

    # grade: most common inline grade in the article text, else the file's grade table mode
    text = " ".join(summary + points)
    inline = [norm_grade(g) for g in re.findall(r"(?:—|–|-)\s*(High|Moderate-High|Moderate|Low-Moderate|Low)\b", text)]
    table = file_grade_table(heads)
    grades = inline if inline else [r["grade"] for r in table]

    # An inline-graded file states the grade of each section in its own
    # executive summary; that is the article's grade.
    row = None
    if inline_graded:
        sec = min(src_heads, key=lambda h: h["level"]) if src_heads else None
        row = pick_section_row(section_summary_rows(heads), sec["title"] if sec else "")
        grades = [row["grade"]] if row else grades

    grade = Counter(grades).most_common(1)[0][0] if grades else "Moderate"

    # evidence table: the file's own table, or the graded tables / summary row
    ev = table[:6]
    if inline_graded:
        ev = section_evidence_table(src_heads)[:6]
        if not ev and row:
            ev = [{"claim": row["section"], "grade": row["grade"], "why": " · ".join(row["cells"])}]

    # safety: the file's own safety section, or the medical notes of the section
    saf = safety(heads)[:4]
    if not saf and inline_graded:
        saf = safety_notes(src_heads)[:4]
        note = unverified_note(heads, row["section"] if row else "")
        if note and note not in saf:
            saf = (saf + [note])[:4]

    rs = refs(heads)
    words = len(text.split())
    return {
        "id": aid, "title": title, "category": cat, "subtitle": subtitle or (summary[0][:140] if summary else ""),
        "grade": grade, "summary": summary, "points": points,
        "safety": saf,
        "references": rs,
        "evidenceTable": ev,
        "source": f"{fkey}_{os.path.basename(FILES[fkey])[3:].replace('.md','')}.md",
        "readMinutes": max(2, round(words / 90) + 2),
        "words": words,
    }

articles = []
for spec in ARTICLES:
    if len(spec) == 7:            # split specs may carry a stray placeholder
        spec = tuple(x for i, x in enumerate(spec) if not (i == 5 and x is None))
    try:
        articles.append(build_article(spec))
    except Exception as e:
        print("FAILED", spec[0], e)
# ------------------------------------------------------------ de-duplicate articles
# Several articles were split out of a parent file; the extractor used to pad them
# with the parent's own summary/safety text, which showed the same paragraphs in
# more than one place. Owners keep the text (first article per source file), the
# children reference them instead, and articles with nothing unique are merged away.
def _norm_line(t):
    t = re.sub(r"<[^>]+>", "", t or "")
    return re.sub(r"\s+", " ", t).strip().lower()


def dedupe_articles(items):
    seen, owner_safety = set(), {}
    kept, dropped, merged = [], [], {}
    for a in items:
        a.setdefault("safetyRef", None)
        for field in ("summary", "points", "safety"):
            out = []
            for line in a[field]:
                n = _norm_line(line)
                if len(n) > 30 and n in seen:
                    continue
                out.append(line)
                if len(n) > 30:
                    seen.add(n)
            a[field] = out
        if a["safety"]:
            owner_safety[a["source"]] = a["id"]
        if not a["summary"] and not a["points"]:
            dropped.append(a)
            continue
        kept.append(a)

    for a in kept:                      # children point at the safety block they lost
        if not a["safety"]:
            ref = owner_safety.get(a["source"])
            if ref and ref != a["id"]:
                a["safetyRef"] = ref

    for dead in dropped:                # tell the parent what it absorbed
        for a in kept:
            if a["source"] == dead["source"]:
                a.setdefault("mergedFrom", []).append(dead["title"])
                break
    return kept, dropped


articles, dropped_articles = dedupe_articles(articles)
# A section-selected article can come out of dedupe_articles with points
# but no summary: its summary would have duplicated lines the whole-file
# article already claimed, so the dedupe removed it. Promote the article's
# own surviving points into its summary so every article opens with
# something. Nothing new is written - it is text already extracted.
for a in articles:
    if not a["summary"] and a["points"]:
        a["summary"] = a["points"][:3]
        a["points"] = a["points"][3:]
if dropped_articles:
    print("merged (pure duplicates):", [a["id"] for a in dropped_articles])
print("articles:", len(articles), "cats:", len({a['category'] for a in articles}))

# ---------------------------------------------------------------- products (18)
def money(x): return round(x, 4)

PRODUCTS = [
  # --- fibre (4) — verified prices
  dict(name="NOW Foods Psyllium Husk Powder, 12 oz (340 g)", brand="NOW Foods", cat="fibre", size_g=340,
       serve_g=5, price=11.30, verified=True, evidence="Moderate–High",
       purpose="Satiety, glycaemic control, LDL, regularity",
       use="3–5 g (1 tsp) in 300 ml water, 1–2×/day before the hungriest meal",
       risks="Bloating/gas if increased quickly; obstruction if taken with too little fluid",
       contra="Bowel obstruction/stricture, dysphagia, recent abdominal surgery",
       url="https://www.iherb.com/pr/now-foods-psyllium-husk-powder-12-oz-340-g/8934",
       note="Best budget entry point for fibre.", tier="budget"),
  dict(name="NOW Foods Psyllium Husk Powder, 24 oz (680 g)", brand="NOW Foods", cat="fibre", size_g=680,
       serve_g=5, price=21.31, verified=True, evidence="Moderate–High",
       purpose="Same product, bulk size", use="As above",
       risks="Same as psyllium", contra="Same as psyllium",
       url="https://www.iherb.com/pr/now-foods-psyllium-husk-powder-24-oz-680-g/21133",
       note="Lower cost per serving than the 12 oz.", tier="value"),
  dict(name="Micro Ingredients Organic Psyllium Husk Powder, 2 lb (907 g)", brand="Micro Ingredients", cat="fibre",
       size_g=907, serve_g=5, price=28.99, verified=True, evidence="Moderate–High",
       purpose="Organic psyllium, largest pack", use="As above",
       risks="Same as psyllium", contra="Same as psyllium",
       url="https://www.iherb.com/pr/micro-ingredients-organic-psyllium-husk-powder-2-lb-907-g/149845",
       note="Organic premium; verify bag seal on arrival.", tier="premium"),
  dict(name="Viva Naturals Organic Psyllium Husk Powder, 24 oz (680 g)", brand="Viva Naturals", cat="fibre",
       size_g=680, serve_g=5, price=23.39, verified=True, evidence="Moderate–High",
       purpose="Organic psyllium", use="As above",
       risks="Same as psyllium", contra="Same as psyllium",
       url="https://www.iherb.com/pr/viva-naturals-organic-psyllium-husk-powder-24-oz-680-g/113541",
       note="Highest cost per serving of the psyllium options.", tier="premium"),
  # --- creatine (4) — verified prices
  dict(name="California Gold Nutrition Sport Pure Creatine Monohydrate, 1 lb (454 g)", brand="California Gold Nutrition",
       cat="creatine", size_g=454, serve_g=5, price=19.15, verified=True, evidence="High",
       purpose="Strength, lean mass, training performance", use="3–5 g/day, any time; no loading needed",
       risks="~1 kg water retention; GI upset at large single doses",
       contra="Kidney disease (medical advice); not for children",
       url="https://www.iherb.com/pr/california-gold-nutrition-sport-pure-creatine-monohydrate-unflavored-1-lb-454-g/71026",
       note="Plain monohydrate — the only form worth buying.", tier="budget"),
  dict(name="California Gold Nutrition Sport Pure Creatine Monohydrate, 1 kg (2.2 lb)", brand="California Gold Nutrition",
       cat="creatine", size_g=1000, serve_g=5, price=32.15, verified=True, evidence="High",
       purpose="Same product, 1 kg", use="3–5 g/day",
       risks="As above", contra="As above",
       url="https://www.iherb.com/pr/california-gold-nutrition-sport-pure-creatine-monohydrate-unflavored-2-2-lbs-1-kg/143718",
       note="Cheapest creatine per day in the catalogue.", tier="value"),
  dict(name="NOW Foods Sports Micronized Creatine Monohydrate, 500 g", brand="NOW Foods", cat="creatine",
       size_g=500, serve_g=5, price=22.05, verified=True, evidence="High",
       purpose="Micronised monohydrate", use="3–5 g/day", risks="As above", contra="As above",
       url="https://www.iherb.com/pr/now-foods-sports-micronized-creatine-monohydrate-1-1-lbs-500-g/687",
       note="Trusted brand; similar cost per day to CGN 1 lb.", tier="value"),
  dict(name="Optimum Nutrition Micronized Creatine Powder, 600 g", brand="Optimum Nutrition", cat="creatine",
       size_g=600, serve_g=5, price=27.99, verified=True, evidence="High",
       purpose="Micronised monohydrate", use="3–5 g/day", risks="As above", contra="As above",
       url="https://www.iherb.com/pr/optimum-nutrition-micronized-creatine-powder-unflavored-1-32-lb-600-g/68616",
       note="Highest cost per serving of the creatine options.", tier="premium"),
  # --- vitamin D (3) — verified prices
  dict(name="NOW Foods Vitamin D-3, 2,000 IU, 120 softgels", brand="NOW Foods", cat="vitamin-d", size_g=120,
       serve_g=1, price=5.18, verified=True, evidence="High (deficiency) / null for CVD prevention",
       purpose="Correct/maintain vitamin D status", use="1 softgel/day with a fat-containing meal, only if low exposure or tested low",
       risks="Hypercalcaemia with chronic megadosing (>4,000 IU/day unmonitored)",
       contra="Hypercalcaemia, granulomatous disease, sarcoidosis (medical advice)",
       url="https://www.iherb.com/pr/now-foods-vitamin-d3-2-000-iu-120-softgels/8229",
       note="Cheapest per softgel of the D3 options.", tier="budget"),
  dict(name="California Gold Nutrition Vitamin D3, 2,000 IU, 90 softgels", brand="California Gold Nutrition",
       cat="vitamin-d", size_g=90, serve_g=1, price=4.92, verified=True,
       evidence="High (deficiency) / null for CVD prevention",
       purpose="Vitamin D3 (fish gelatin)", use="1 softgel/day", risks="As above", contra="As above",
       url="https://www.iherb.com/pr/california-gold-nutrition-vitamin-d3-50-mcg-2-000-iu-90-fish-gelatin-softgels/77548",
       note="Lowest total outlay; higher cost per softgel.", tier="budget"),
  dict(name="NOW Foods Vitamin D-3 High Potency, 2,000 IU, 240 softgels", brand="NOW Foods", cat="vitamin-d",
       size_g=240, serve_g=1, price=8.83, verified=True, evidence="High (deficiency) / null for CVD prevention",
       purpose="Vitamin D3, 8-month supply", use="1 softgel/day", risks="As above", contra="As above",
       url="https://www.iherb.com/pr/now-foods-vitamin-d-3-high-potency-2-000-iu-240-softgels/16272",
       note="Best cost per day for D3.", tier="value"),
  # --- protein (1) — verified price
  dict(name="California Gold Nutrition Sport Whey Protein Isolate, Unflavored, 5 lb (2.27 kg)",
       brand="California Gold Nutrition", cat="protein", size_g=2270, serve_g=30, price=105.00, verified=True,
       evidence="High for total protein; powder not superior to food",
       purpose="Convenience protein to reach 1.6–2.4 g/kg/day", use="1–2 scoops/day as needed to hit the target",
       risks="GI upset (isolate is low-lactose); acne in some individuals (anecdotal)",
       contra="Milk allergy (use soy/pea isolate)",
       url="https://www.iherb.com/pr/california-gold-nutrition-sport-whey-protein-isolate-unflavored-5-lb-2-27-kg/76479",
       note="More expensive per gram of protein than eggs, milk, chicken or lentils.", tier="premium"),
  # --- catalogue entries that are NOT price-verified (from file 18 §10.5-10.11)
  dict(name="Validated upper-arm blood pressure monitor", brand="Various", cat="device", size_g=None, serve_g=None,
       price=None, verified=False, evidence="High (BP measurement is a validated surrogate)",
       purpose="Detect and track hypertension — silent and common in men 40+",
       use="Measure seated, arm supported, twice daily for a week; bring readings to a clinician",
       risks="Wrist-cuff and unvalidated devices give misleading readings",
       contra="None — but do not self-adjust medication",
       url="https://www.amazon.com/s?k=validated+upper+arm+blood+pressure+monitor",
       note="Check the model against a validated-device list (e.g. validatebp.org). Typically $25–50 — not verified in this build.",
       tier="catalogue"),
  dict(name="Digital food scale", brand="Various", cat="device", size_g=None, serve_g=None, price=None,
       verified=False, evidence="Moderate (behavioural)", purpose="Weigh portions; makes protein and oil targets real",
       use="Weigh raw protein and cooking oil for the first 2–4 weeks", risks="Obsessive weighing in disordered eating",
       contra="History of eating disorder — use hand portions instead",
       url="https://www.amazon.com/s?k=digital+kitchen+scale",
       note="Typically $10–25 — not verified in this build.", tier="catalogue"),
  dict(name="Bathroom scale (or none — use weekly average at a pharmacy)", brand="Various", cat="device", size_g=None,
       serve_g=None, price=None, verified=False, evidence="Moderate (self-monitoring)",
       purpose="Weekly average weight; the backbone of the 2-kg rule",
       use="Weigh daily, judge only the 7-day average", risks="Daily emotional reacting to noise",
       contra="None", url="https://www.amazon.com/s?k=digital+bathroom+scale",
       note="A cheap scale is enough; smart scales add no decision-relevant data. Not verified in this build.", tier="catalogue"),
  dict(name="Resistance bands (set) + doorframe pull-up bar", brand="Various", cat="device", size_g=None,
       serve_g=None, price=None, verified=False, evidence="Moderate–High (resistance training)",
       purpose="Home resistance training when bodyweight progressions stall",
       use="2–4 sessions/week, progressive overload", risks="Band snapping; poorly fitted bars damaging doorframes",
       contra="Recent injury/surgery — get clearance",
       url="https://www.amazon.com/s?k=resistance+bands+set",
       note="Bodyweight training covers the first months for free. Not verified in this build.", tier="catalogue"),
  dict(name="Walking shoes", brand="Various", cat="device", size_g=None, serve_g=None, price=None, verified=False,
       evidence="High (steps and mortality)", purpose="The cheapest energy-expenditure and mortality lever",
       use="7,000–10,000 steps/day", risks="Blisters; replace worn shoes", contra="None",
       url="https://www.amazon.com/s?k=walking+shoes+men",
       note="Comfort and fit beat brand. Not verified in this build.", tier="catalogue"),
  dict(name="Broad-spectrum sunscreen SPF 50 + moisturiser", brand="Various", cat="device", size_g=None, serve_g=None,
       price=None, verified=False, evidence="High (photoaging prevention)",
       purpose="The only skincare category with strong evidence",
       use="Every morning, ~2 mg/cm² on face and neck; reapply with sun exposure",
       risks="Irritation in sensitive skin; white cast", contra="None",
       url="https://www.amazon.com/s?k=sunscreen+spf+50+broad+spectrum",
       note="Not verified in this build; choose a product you will actually use daily.", tier="catalogue"),
]

# ---------------------------------------------------------------- vendor links
# Product destinations are restricted to iHerb (verified prices) and Amazon
# (search links only — prices never claimed). No other marketplaces are linked.
def vendor_links(name, brand, iherb_url):
    from urllib.parse import quote_plus
    clean = re.sub(r"\([^)]*\)", " ", name)          # drop parentheticals
    clean = clean.split("—")[0].split("+")[0]         # first phrase only
    clean = re.sub(r"\s+", " ", clean).strip(" ,.;:")
    if brand and clean.lower().startswith(brand.lower()):
        q = clean                                     # brand already in the name
    elif brand.strip().lower() in ("any", "various", "—", "-", ""):
        q = clean
    else:
        q = (brand + " " + clean).strip()
    is_product = "/pr/" in (iherb_url or "")
    return [
        {"vendor": "iHerb",
         "kind": "product" if is_product else "search",
         "url": iherb_url if is_product else
                "https://www.iherb.com/search?kw=" + quote_plus(q)},
        {"vendor": "Amazon", "kind": "search",
         "url": "https://www.amazon.com/s?k=" + quote_plus(q)},
    ]


products = []
for p in PRODUCTS:
    per_serve = None
    serves = None
    unit, unit1 = ("softgels", "softgel") if p["cat"] == "vitamin-d" else ("g", "g")
    if p["verified"] and p["size_g"] and p["serve_g"]:
        serves = p["size_g"] / p["serve_g"]
        per_serve = p["price"] / serves
    products.append({
        "id": re.sub(r"[^a-z0-9]+", "-", p["name"].lower())[:60].strip("-"),
        "name": p["name"], "brand": p["brand"], "category": p["cat"],
        "price": p["price"], "priceVerified": p["verified"],
        "sizeG": p["size_g"], "serveG": p["serve_g"],
        "servings": round(serves, 1) if serves else None,
        "costPerServing": round(per_serve, 4) if per_serve else None,
        "costMath": (f"${p['price']:.2f} ÷ {serves:.0f} servings "
                     f"({p['size_g']:g} {unit} ÷ {p['serve_g']:g} {unit1}) = ${per_serve:.3f}/serving")
                    if serves else None,
        "evidence": p["evidence"], "purpose": p["purpose"], "use": p["use"],
        "risks": p["risks"], "contra": p["contra"], "note": p["note"], "tier": p["tier"],
        "links": vendor_links(p["name"], p["brand"], p["url"]),
        "url": vendor_links(p["name"], p["brand"], p["url"])[0]["url"],
    })
# Slugs are truncated to 60 chars, which can collide (two CGN creatine packs shared
# one id). Qualify every colliding slug with the pack size so ids stay unique.
from collections import Counter as _Counter
_slug_counts = _Counter(p["id"] for p in products)
_used = set()
for p in products:
    if _slug_counts[p["id"]] > 1:
        tag = ("%d-g" % round(p["sizeG"])) if p.get("sizeG") else "x"
        cand, n = p["id"] + "-" + tag, 2
        while cand in _used:
            cand, n = "%s-%s-%d" % (p["id"], tag, n), n + 1
        p["id"] = cand
    _used.add(p["id"])
assert len({p["id"] for p in products}) == len(products), "product ids must be unique"

print("products:", len(products), "verified:", sum(1 for p in products if p["priceVerified"]))

# ---------------------------------------------------------------- nutrition (26)
FOODS = [
    ("Chicken breast, roasted", r"^Chicken, broilers or fryers, breast, meat only, cooked, roasted", "Complete protein, ~31 g/100 g. Highest protein-per-calorie of the meats."),
    ("Egg, whole, raw", r"^Egg, whole, raw, fresh", "Scored high on the Holt satiety index at equal calories."),
    ("Milk, whole", r"^Milk, whole, 3.25% milkfat", "Liquid calories: satiating but weaker per calorie than solid food."),
    ("Greek yoghurt, plain low-fat", r"^Yogurt, Greek, plain, lowfat", "Highest protein dairy per 100 g (~10 g)."),
    ("Cottage cheese, 1%", r"^Cheese, cottage, lowfat, 1% milkfat", "~12 g protein/100 g; slow-digesting casein."),
    ("Lentils, cooked", r"^Lentils, mature seeds, cooked, boiled, without salt", "Fibre 7.9 g + protein 9 g/100 g; strongest satiety per shilling of the legumes."),
    ("Chickpeas, cooked", r"^Chickpeas \(garbanzo beans, bengal gram\), mature seeds, cooked, boiled, without salt", "Fibre 7.6 g; pulses consistently reduce appetite vs isoenergetic controls."),
    ("Kidney beans, cooked", r"^Beans, kidney, all types, mature seeds, cooked, boiled, without salt", "Fibre 6.4 g; cheap protein + fibre."),
    ("Black beans, cooked", r"^Beans, black, mature seeds, cooked, boiled, without salt", "Fibre-rich pulse; blunts post-meal glucose."),
    ("Oats, dry", r"^Cereals, oats, regular and quick, not fortified, dry", "High satiety index; β-glucan slows gastric emptying. Cook with water for volume."),
    ("Brown rice, cooked", r"^Rice, brown, long-grain, cooked", "Higher satiety index than white rice in Holt 1995; more fibre."),
    ("White rice, cooked", r"^Rice, white, long-grain, regular, cooked", "Low satiety per calorie; easy to over-eat without protein and vegetables."),
    ("Whole-wheat bread", r"^Bread, whole-wheat, commercially prepared", "White bread is the reference food (SI = 100); wholemeal scores higher."),
    ("Potato, baked with skin", r"^Potatoes, baked, flesh and skin, without salt", "Highest satiety score of 38 foods tested at 240 kcal portions (Holt 1995); 535 mg K/100 g."),
    ("Sweet potato, raw", r"^Sweet potato, raw, unprepared", "Fibre 3 g and high potassium; moderate satiety."),
    ("Tofu, firm", r"^Tofu, raw, firm, prepared with calcium sulfate", "Plant protein; lower leucine than animal sources."),
    ("Sardines, canned in oil", r"^Fish, sardine, Atlantic, canned in oil, drained solids with bone", "Protein + calcium + omega-3; calorie-dense, not a volume food."),
    ("Tuna, canned in water", r"^Fish, tuna, light, canned in water, without salt", "Highest protein per calorie in the list (~22 g/100 kcal)."),
    ("Salmon, Atlantic, farmed, cooked", r"^Fish, salmon, Atlantic, farmed, cooked, dry heat", "Omega-3 source; satiety similar to other protein foods."),
    ("Beef, ground 90% lean, cooked", r"^Beef, ground, 90% lean meat / 10% fat, patty, cooked, pan-broiled", "Beef scored high on the satiety index."),
    ("Pork loin, cooked", r"^Pork, fresh, loin, tenderloin, separable lean only, cooked, roasted", "Lean pork; protein density similar to chicken thigh."),
    ("Spinach, raw", r"^Spinach, raw", "Highest protein of the leafy greens; 558 mg K/100 g."),
    ("Broccoli, raw", r"^Broccoli, raw", "Fibre 2.6 g with very low calories; cooking reduces gas."),
    ("Cabbage, raw", r"^Cabbage, raw", "25 kcal/100 g — the best volume per calorie of the cheap vegetables."),
    ("Carrots, raw", r"^Carrots, raw", "Fibre 2.8 g; firm texture slows eating rate."),
    ("Banana, raw", r"^Bananas, raw", "Convenient carbohydrate; moderate satiety index."),
]

def usda_lookup(name, pattern):
    """Resolve USDA FoodData Central values for one food.

    Preferred path is the external lookup tool. When it is not present on
    this machine, fall back to the checked-in usda_foods.json so the
    pipeline stays reproducible instead of silently dropping every food.
    """
    tool = os.environ.get("GLOWUP_USDA_TOOL", "/home/user/tools/lookup.py")
    if os.path.exists(tool):
        out = subprocess.run(["python3", tool, pattern],
                             capture_output=True, text=True, timeout=120)
        for line in out.stdout.split("\n"):
            m = re.match(r"\s+(\d+)\s\|\s(.+?)\s+\|\s+([\d.]+) kcal\s+\|\s+P\s*([\d.\u2014]+)\s+\|\s+Fbr\s*([\d.\u2014]+)\s+\|\s+H2O\s*([\d.\u2014]+)", line)
            if m:
                dash = "\u2014"
                return dict(fdcId=int(m.group(1)), kcal=float(m.group(3)),
                            protein=None if dash in m.group(4) else float(m.group(4)),
                            fibre=None if dash in m.group(5) else float(m.group(5)),
                            water=None if dash in m.group(6) else float(m.group(6)))
    v = _usda_cache().get(name)
    return dict(v) if v else None


_USDA_CACHE = None


def _usda_cache():
    global _USDA_CACHE
    if _USDA_CACHE is None:
        try:
            with open(os.path.join(HERE, "usda_foods.json"), encoding="utf-8") as fh:
                _USDA_CACHE = json.load(fh).get("foods", {})
        except Exception:
            _USDA_CACHE = {}
    return _USDA_CACHE


nutrition = []
for name, pattern, satiety in FOODS:
    v = usda_lookup(name, pattern)
    if not v:
        print("  ! no USDA match:", name); continue
    kcal, p, fb, w = v["kcal"], v["protein"], v["fibre"], v["water"]
    nutrition.append({
        "id": re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-"), "name": name, "fdcId": v["fdcId"],
        "kcal": kcal, "protein": p, "fibre": fb, "water": w,
        "proteinPer100kcal": round(p / (kcal / 100), 1) if p else None,
        "fibrePer100kcal": round(fb / (kcal / 100), 1) if fb else None,
        "gPer100kcal": round(10000 / kcal),
        "satiety": satiety,
        "group": ("protein" if p and p >= 8 else "vegetable" if name in ("Spinach, raw", "Broccoli, raw", "Cabbage, raw", "Carrots, raw")
                  else "fruit" if name == "Banana, raw" else "carb" if kcal > 90 else "protein"),
    })
print("nutrition:", len(nutrition))

# ---------------------------------------------------------------- meals (5) + shopping list
MEALS = [
    dict(id="breakfast-default", slot="breakfast", name="3 eggs + Greek yoghurt + oats + berries",
         protein=40, fibre=8, note="The default breakfast.",
         items=["3 eggs", "200 g Greek yoghurt", "40 g oats", "Berries (or seasonal fruit)"]),
    dict(id="breakfast-overnight", slot="breakfast", name="Overnight oats",
         protein=45, fibre=9, note="2 minutes of prep the night before.",
         items=["60 g oats", "250 ml milk", "200 g yoghurt", "1 scoop whey", "Cinnamon"]),
    dict(id="lunch-chicken-rice", slot="lunch", name="Chicken + rice + frozen vegetables",
         protein=50, fibre=10, note="The workhorse — cook once, eat three times.",
         items=["200 g chicken", "200 g cooked rice", "250 g vegetables", "1 tbsp olive oil"]),
    dict(id="dinner-lentil-stew", slot="dinner", name="Lentil / chickpea stew",
         protein=25, fibre=15, note="The cheapest meal in the library.",
         items=["250 g cooked legumes", "150 g rice", "Vegetables", "Spices"]),
    dict(id="lunch-canned-fish", slot="lunch", name="Canned fish plate",
         protein=45, fibre=8, note="No cooking required.",
         items=["2 tins sardines or tuna", "2 slices bread", "Salad", "Olive oil"]),
]

ROTATION = [
    ("Mon", "Eggs + yoghurt + oats", "Chicken + rice + veg", "Lentil stew"),
    ("Tue", "Overnight oats", "Canned fish plate", "Beef stir-fry"),
    ("Wed", "Cottage cheese bowl", "Chicken + rice + veg", "Egg + veg + potato"),
    ("Thu", "Eggs + yoghurt + oats", "Lentil stew", "Chicken + vegetables"),
    ("Fri", "Overnight oats", "Chickpea salad + yoghurt", "Canned fish plate"),
    ("Sat", "Flexible meal (eat out)", "Protein + veg + 1 starch", "Home template"),
    ("Sun", "Eggs + yoghurt + oats", "Chicken + rice + veg", "Batch-cook lentils"),
]

SHOPPING = [
    ("Protein", ["Eggs (18–24)", "Milk (2–3 L)", "Plain yoghurt or cottage cheese (1 kg)",
                 "Chicken (1.5 kg) or tofu", "Canned fish (4–6 tins)",
                 "Lentils/chickpeas (500 g dry or 4 tins)", "Whey (optional)"]),
    ("Fibre & vegetables", ["Oats (1 kg)", "Frozen mixed vegetables (1.5 kg)", "Cabbage / carrots",
                            "Tomatoes / cucumber", "Onions / garlic", "Seasonal fruit (2 kg)",
                            "Potatoes or rice (1–2 kg)"]),
    ("Fats & flavour", ["Olive oil", "Spices", "Salt", "Vinegar", "Mustard", "Herbs"]),
    ("Skip", ["Juice", "Soft drinks", "Crisps / snacks", "Sugary breakfast cereals",
              "“Protein” bars", "Ice cream", "Alcohol (or 1–2 units max)"]),
]

data = {
    "meta": {
        "app": "GlowUp",
        "tagline": "Men's transformation library — evidence-graded",
        "built": "2026-11-01",
        "sources": "Men's Transformation Research Library (files 00–27)",
        "counts": {"articles": len(articles), "categories": len(CATS), "products": len(products),
                   "nutrition": len(nutrition), "meals": len(MEALS)},
        "priceVerifiedOn": "1 Nov 2026",
        "disclaimer": ("Research synthesis for information only — not medical advice. Prices marked verified were "
                       "checked on iHerb on 1 Nov 2026 and exclude shipping and local duties. Nutrition values are "
                       "USDA FoodData Central SR Legacy per 100 g and vary ±10–15% from real food."),
    },
    "categories": [{"id": c, "name": n, "blurb": b} for c, n, b in CATS],
    "articles": articles,
    "products": products,
    "nutrition": nutrition,
    "meals": MEALS, "rotation": ROTATION, "shopping": SHOPPING,
}

with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
    json.dump(data, fh, indent=1, ensure_ascii=False)
print("wrote", OUT, os.path.getsize(OUT), "bytes")
print("grades:", Counter(a["grade"] for a in articles))
print("per-category:", Counter(a["category"] for a in articles))

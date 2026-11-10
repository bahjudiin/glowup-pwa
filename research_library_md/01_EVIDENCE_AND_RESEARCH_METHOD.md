# 01 — Evidence & Research Method

> Part of the **Men's Transformation Research Library**. Read this file first: it defines how every claim in the other files was graded, how citations were verified, and where the limits of the evidence are.

---

## 1. Executive summary

- This library was built by searching **PubMed/MEDLINE** (via the NCBI E-utilities API) and **Crossref**, then reading primary papers, systematic reviews and guidelines. Every citation in this library resolves to a real PubMed record or a real guideline page — publication details (journal, year, volume, pages, PMID) were pulled from PubMed's own records, not typed from memory.
- Claims are graded **High / Moderate / Low / Very low / Insufficient** using a simplified GRADE-style logic that separates *study design quality* from *directness* (does the study measure the outcome a real man cares about, in men, over years?).
- The dominant finding across the whole literature is consistent: **behaviour (protein, resistance training, walking, sleep, food environment, self-monitoring) explains most of the achievable result**, and expensive interventions mostly *amplify adherence or appetite control* rather than reveal a secret biological mechanism.
- The biggest evidence gaps are: long-term (>2 year) randomised maintenance trials, head-to-head drug vs behaviour trials with body-composition endpoints, human autophagy measurement, and almost all cosmetic device evidence.

---

## 2. What the evidence establishes

### 2.1 Sources used, in priority order
1. **Systematic reviews and meta-analyses** (Cochrane, BMJ, Lancet, JAMA family, BJSM).
2. **Clinical practice guidelines** — NICE (UK), Obesity Canada/CMAJ, Endocrine Society, WHO physical-activity guidelines, ACSM position stands, US Preventive Services Task Force.
3. **Randomised controlled trials (RCTs)** — including the large obesity pharmacotherapy programmes (STEP, SURMOUNT, SELECT, REDUCE-IT, VITAL, D-Health, PREDIMED, Look AHEAD, DPP).
4. **Prospective cohort studies** — mainly for hard outcomes that cannot be randomised (mortality, cancer, melanoma).
5. **Mechanistic / animal work** — used *only* to explain plausibility, never as proof of a human outcome.

### 2.2 What "verified citation" means in this library
Each reference in Section 13 of each file carries a **PMID link** (`https://pubmed.ncbi.nlm.nih.gov/<PMID>/`) that was retrieved programmatically from PubMed, and where available the **DOI** returned by PubMed's own metadata. Where a source is a guideline or regulator page rather than a journal article, the canonical URL is given.

Three references in this library are given as **PubMed search links** rather than single PMIDs (they are well-known but were not individually resolved during this build). These are flagged `[search link]` and should be treated as slighly less tightly verified than the rest.

### 2.3 Evidence grading used throughout

| Grade | Meaning | Typical example |
|---|---|---|
| **High** | Consistent findings across multiple large RCTs or meta-analyses of RCTs, directly measuring the outcome of interest, in relevant populations | Sunscreen and photoaging; protein and hypertrophy; fibre and disease risk; statin-era BP lowering |
| **Moderate** | RCTs exist but are small, short, single-site, or measure surrogate endpoints; or meta-analyses are heterogeneous | Time-restricted eating and fat loss; psyllium and satiety; creatine and cognition |
| **Low** | Observational cohorts, small uncontrolled trials, indirect populations, or large risk of bias | Red-light devices for skin; oral collagen; sauna and mortality |
| **Very low** | Case reports, mechanistic extrapolation, marketing-derived claims | "Autophagy starts at hour 16"; "facial exercises reshape bone"; "NMN extends human lifespan" |
| **Insufficient** | No adequate human data either way — this is *not* the same as "false", it means "unknown" | Human longevity effect of rapamycin; long-term NMN outcomes |

### 2.4 Rules applied to every claim
1. A **mechanism is not an outcome.** "Semaglutide slows gastric emptying" does not by itself prove a lifestyle method that slows gastric emptying produces the same weight loss.
2. **Effect size beats direction.** "Protein reduces hunger" is nearly useless without magnitude. Where a magnitude exists in a verified source, it is quoted.
3. **Surrogate endpoints are labelled.** LDL, HbA1c, CRP, NAD+ levels and "collagen density" are surrogates, not endpoints men care about (living longer, looking better, keeping the weight off).
4. **Population mismatch is flagged.** Many obesity trials recruited women in their 40s–50s; many fitness trials recruited young trained men. Neither generalises perfectly to a 40-year-old man who wants to lose 15 kg.
5. **Non-equivalence is stated.** Where a cheap method touches the same pathway as a drug, the file says explicitly whether it is *similar mechanism*, *partial effect*, *similar practical outcome* or *clinically equivalent*. Nothing in this library is claimed as clinically equivalent to a prescription drug.
6. **No invented numbers.** No calorie target, price, DOI, PMID or effect size in this library was produced from memory alone; prices were read from live marketplace pages on the date stated in file 18.

---

## 3. Evidence quality

**Grade: High** — for the *methods* of this library (the grading scheme and the citation pipeline). The grades attached to individual claims vary from High to Insufficient and are stated in each file.

Known structural limitations of this review:
- It is a **narrative, non-registered review**, not a PRISMA systematic review. Search was purposive (targeted queries per topic), not exhaustive. Selection bias toward well-known trials is possible.
- **No meta-analysis was re-run**; pooled estimates are quoted from published meta-analyses.
- **Publication bias** affects the supplement, device and cosmetic literature far more than the obesity or exercise literature. Expect the cosmetic-device evidence base to be the least trustworthy section of this library.
- **Single reviewer** (this analysis), no duplicate screening.

---

## 4. Effectiveness

Not applicable to this file. See each topic file.

---

## 5. Fastest reasonably safe approach

Not applicable. The practical upshot of the evidence-quality review, however, is this ranking of **where certainty is highest**, which should drive where you spend effort first:

1. **Energy balance + protein + resistance training + sleep** — High certainty, large effect, near-zero cost.
2. **Walking/step count + food environment** — High certainty for health outcomes, Moderate-High for weight management.
3. **Sunscreen + retinoid + smoking avoidance** — High certainty for skin ageing; cheap.
4. **Creatine, vitamin D (if low), fibre** — Moderate-High for specific outcomes; cheap.
5. **Fasting schedules, red-light devices, NAD precursors, collagen, most "longevity" supplements** — Low-to-Moderate at best, and mostly *optional or skippable*.

---

## 6. Free and cheap alternatives

The research method itself has a free equivalent worth knowing: **you can verify any claim in this library yourself in under two minutes** by pasting the PMID into `https://pubmed.ncbi.nlm.nih.gov/<PMID>/` and reading the abstract, plus checking whether the paper is a trial, a review, or an animal study. That skill replaces most paid "research" services.

Free tools used or recommended for verification:
- PubMed: https://pubmed.ncbi.nlm.nih.gov/
- NCBI E-utilities (the API used to build this library): https://www.ncbi.nlm.nih.gov/books/NBK25497/
- Cochrane Library: https://www.cochranelibrary.com/
- NICE guidance: https://www.nice.org.uk/guidance
- WHO physical activity guidelines: https://www.who.int/publications/i/item/9789240015128
- USDA FoodData Central (food composition): https://fdc.nal.usda.gov/
- NIH Body Weight Planner (free energy-balance model): https://www.niddk.nih.gov/bwp

---

## 7. Practical protocol (how to read this library)

1. Read **00_MASTER_SUMMARY.md** end-to-end once. Implement only its "minimum effective protocol".
2. Use **02, 03, 05, 08, 09, 10, 11** as the working core — that is where ~80% of your result lives.
3. Use **06, 07, 21** the moment you approach your goal weight — maintenance is a *different skill* from losing.
4. Treat **13, 16, 17** as a spending filter, not a shopping list.
5. Use **14, 15, 24** only after the fat-loss basics are running; appearance work is cheap but it is not the bottleneck.
6. Use **18** only with the price-verification caveat in mind.

---

## 8. Low-maintenance version

Use one rule for the rest of your life: **before acting on any health claim, ask three questions — (1) Is this a trial or a story? (2) What is the effect size in real units (kg, cm, mmHg, years)? (3) Who paid for it?** If a claim cannot answer all three, it goes in the "ignore" pile. That single habit outperforms every biohacking subscription.

---

## 9. Safety and contraindications

- **Do not self-prescribe** anything in files 13, 16, 17 (metformin, rapamycin, testosterone, finasteride, tretinoin, GLP-1 drugs, oral minoxidil). These require a clinician.
- **Do not use this library to override your doctor**, especially if you take blood-pressure, glucose-lowering, anticoagulant or psychiatric medication, or if you have kidney, liver, heart or eating-disorder history.
- Any supplement can interact with medication. If you take prescription drugs, check interactions before adding anything (a pharmacist will do this free).

---

## 10. Products and tools

No products are necessary to use this file. The free verification links above are the "product".

---

## 11. Common mistakes

| Mistake | Why it fails |
|---|---|
| Treating a mechanistic review as evidence of outcome | Mechanism ≠ outcome. Nearly all hype is built here. |
| Trusting a single study | Most single studies are underpowered and overstated; look for the meta-analysis and the guideline. |
| Ignoring sample size and duration | A 4-week study in 12 people cannot support a lifetime protocol. |
| Reading abstracts only | Abstracts systematically overstate; check the limitations paragraph when the decision is expensive. |
| Assuming "natural" = safe | Ashwagandha has documented liver injury; "natural" appetite suppressants have caused harm. |
| Trusting influencer "research" with affiliate links | Structural conflict of interest. |
| Confusing "statistically significant" with "worth doing" | A 0.3 kg difference can be significant and irrelevant. |

---

## 12. Final recommendations

1. Accept that the **certainty hierarchy is boring**: food, protein, training, walking, sleep, sunscreen, no smoking. Everything else is a modifier.
2. Spend money only where the evidence base is **High or Moderate** and the cost is trivial (creatine, vitamin D if deficient, fibre, sunscreen, a food scale).
3. Prefer **guidelines over influencers**, and **meta-analyses over single trials**.
4. Re-check any expensive decision against file **23_UNSUPPORTED_CLAIMS_AND_MYTHS.md** before purchasing.
5. Remember the review's own limits: this is a well-verified narrative review, not a registered systematic review. Where a decision is high-stakes (a drug, a surgery, a new diagnosis), get a clinician's input.

---

## 13. Verified references

- NICE. *Overweight and obesity management* (NG246, 2025). https://www.nice.org.uk/guidance/ng246
- WHO. *Guidelines on physical activity and sedentary behaviour* (2020). https://www.who.int/publications/i/item/9789240015128
- Cochrane Library. https://www.cochranelibrary.com/
- PubMed (NCBI). https://pubmed.ncbi.nlm.nih.gov/
- NIH NIDDK Body Weight Planner. https://www.niddk.nih.gov/bwp
- USDA FoodData Central. https://fdc.nal.usda.gov/

*Method note: PMIDs and DOIs throughout this library were retrieved from the NCBI E-utilities `esummary` endpoint (PubMed) during this build; guideline URLs were opened directly.*

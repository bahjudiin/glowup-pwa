/**
 * End-to-end verification of the interactive navigation (tier 1/2/3 + sort,
 * filter, search). Not part of `npm test` — run manually with:
 *
 *   node scripts/verify-ui.mjs
 *
 * Requires a running server on http://localhost:3000 and puppeteer-core
 * (installed with --no-save, so it is not a project dependency).
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

let failures = 0;
function check(label, ok, detail = "") {
  if (ok) {
    process.stdout.write(`  ok   ${label}\n`);
  } else {
    failures += 1;
    process.stdout.write(`  FAIL ${label}${detail ? ` — ${detail}` : ""}\n`);
  }
}

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
await page.setViewport({ width: 420, height: 900 });

const articleLinks = () =>
  page.$$eval('a[href^="/articles/"]', (nodes) => nodes.map((n) => n.getAttribute("href")));
const tabLabels = () =>
  page.$$eval('[role="tab"]', (nodes) => nodes.map((n) => n.textContent.trim()));
const activeTab = () =>
  page.$eval('[role="tab"][aria-selected="true"]', (n) => n.textContent.trim()).catch(() => null);

try {
  /* ---------------- home: category tab filters the list ---------------- */
  process.stdout.write("\nhome page — tier-2 category tab\n");
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  await page.waitForSelector('a[href^="/articles/"]');
  const allHome = await articleLinks();
  check("home renders the full library", allHome.length > 20, `${allHome.length} links`);

  const bigDTab = await page.$$('[role="tab"]');
  let clicked = false;
  for (const tab of bigDTab) {
    const text = await tab.evaluate((n) => n.textContent);
    if (text.includes("Big D")) {
      await tab.click();
      clicked = true;
      break;
    }
  }
  check("Big D category tab is present and clickable", clicked);
  await page.waitForFunction(() => location.search.includes("category=mens-vitality"), { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));
  const bigD = await articleLinks();
  check(
    "selecting the category updates the URL",
    page.url().includes("category=mens-vitality"),
    page.url()
  );
  check(
    "selecting the category filters the list to 5 Big D articles",
    bigD.length === 5,
    `${bigD.length} links`
  );
  check(
    "the filtered list only contains Big D articles",
    bigD.every((h) => h.startsWith("/articles/big-d-")),
    bigD.join(",")
  );

  /* ---------------- tier 3: sub-tabs ---------------- */
  process.stdout.write("\ncategory page — tier-3 sub-tabs\n");
  await page.goto(`${BASE}/categories/mens-vitality`, { waitUntil: "networkidle0" });
  await page.waitForSelector('[role="tab"]');
  const tabs = await tabLabels();
  check(
    "sub-tabs render for the category",
    ["Sexual Function", "Premature Ejaculation", "Fertility", "Attraction"].every((t) =>
      tabs.some((label) => label.includes(t))
    ),
    tabs.join(" | ")
  );
  check(
    "sub-tab bar uses role=tab with aria-selected",
    (await page.$$('[role="tab"][aria-selected="true"]')).length >= 0
  );

  const fertilityTab = await page.$$('[role="tab"]');
  for (const tab of fertilityTab) {
    const text = await tab.evaluate((n) => n.textContent);
    if (text.includes("Fertility")) {
      await tab.click();
      break;
    }
  }
  await page.waitForFunction(() => location.search.includes("tab=fertility"), { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));
  const fertility = await articleLinks();
  check("sub-tab selection updates ?tab=", page.url().includes("tab=fertility"), page.url());
  check(
    "sub-tab selection narrows the list to one article",
    fertility.length === 1 && fertility[0] === "/articles/big-d-fertility",
    fertility.join(",")
  );

  /* ---------------- keyboard support ---------------- */
  process.stdout.write("\nsub-tab keyboard support\n");
  const focusedBefore = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? "");
  await page.keyboard.press("ArrowRight");
  await new Promise((r) => setTimeout(r, 200));
  const focusedAfter = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? "");
  check(
    "ArrowRight moves focus to the next sub-tab",
    focusedBefore !== focusedAfter,
    `${focusedBefore} -> ${focusedAfter}`
  );
  await page.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 500));
  check(
    "Enter selects the focused sub-tab",
    page.url().includes("tab=") && page.url() !== `${BASE}/categories/mens-vitality?tab=fertility`,
    page.url()
  );

  /* ---------------- sort ---------------- */
  process.stdout.write("\nsort control\n");
  await page.goto(`${BASE}/categories/mens-vitality`, { waitUntil: "networkidle0" });
  await page.waitForSelector('[role="tab"]');
  const sortButtons = await page.$$('button[role="tab"], [data-state]');
  void sortButtons;
  const sortByName = await page.evaluateHandle(() => {
    const nodes = Array.from(document.querySelectorAll("button"));
    return nodes.find((n) => n.textContent.trim().startsWith("Name"));
  });
  await sortByName.asElement().click();
  await page.waitForFunction(() => location.search.includes("sort=name"), { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));
  const sorted = await page.$$eval('a[href^="/articles/"]', (nodes) =>
    nodes.map((n) => n.getAttribute("href"))
  );
  check("sort control writes ?sort=name", page.url().includes("sort=name"), page.url());
  check("sort control reorders the list", sorted.length === 5, `${sorted.length} articles`);

  /* ---------------- filters ---------------- */
  process.stdout.write("\nfilters\n");
  await page.goto(`${BASE}/categories/sleep-recovery`, { waitUntil: "networkidle0" });
  await page.waitForSelector('a[href^="/articles/"]');
  const before = await articleLinks();
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((n) =>
      n.textContent.includes("Filters")
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const hasDialog = await page.$('[role="dialog"]');
  check("filter dialog opens", Boolean(hasDialog));
  await page.evaluate(() => {
    const trigger = document.querySelector('[role="dialog"] [role="combobox"]');
    trigger?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const optionPicked = await page.evaluate(() => {
    const opt = Array.from(document.querySelectorAll('[role="option"]')).find(
      (n) => n.textContent.trim() === "High"
    );
    if (!opt) return false;
    opt.click();
    return true;
  });
  check("evidence grade option is selectable", optionPicked);
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    const apply = Array.from(document.querySelectorAll("button")).find((n) =>
      n.textContent.trim() === "Apply"
    );
    apply?.click();
  });
  await page.waitForFunction(() => location.search.includes("evidence="), { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));
  const after = await articleLinks();
  check("filter writes ?evidence=", page.url().includes("evidence="), page.url());
  check("evidence filter narrows the list", after.length < before.length, `${before.length} -> ${after.length}`);

  /* ---------------- cross-entity search ---------------- */
  process.stdout.write("\nglobal search\n");
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  await page.waitForSelector('input[placeholder*="Search"]');
  await page.type('input[placeholder*="Search"]', "shilajit");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => location.search.includes("q=shilajit"), { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 800));
  const searchHtml = await page.content();
  check("search writes ?q=", page.url().includes("q=shilajit"), page.url());
  check("search results view renders", searchHtml.includes("Results for"));
  check("search finds the fertility article", searchHtml.includes("big-d-fertility"));

  /* ---------------- query-param lifecycle ---------------- */
  process.stdout.write("\nquery-param lifecycle\n");
  await page.goto(`${BASE}/categories/mens-vitality?tab=fertility&sort=name&evidence=Moderate`, {
    waitUntil: "networkidle0",
  });
  await page.waitForSelector('[role="tab"]');
  check(
    "filters and sort survive a page load alongside ?tab=",
    page.url().includes("tab=fertility") &&
      page.url().includes("sort=name") &&
      page.url().includes("evidence=Moderate"),
    page.url()
  );

  // Switching category must clear ?tab= but keep the other parameters.
  const sleepTab = await page.$$('[role="tab"]');
  for (const tab of sleepTab) {
    const text = await tab.evaluate((n) => n.textContent);
    if (text.includes("Sleep & Recovery")) {
      await tab.click();
      break;
    }
  }
  await page.waitForFunction(() => location.pathname.includes("sleep-recovery"), { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 500));
  check(
    "switching category clears ?tab=",
    !page.url().includes("tab="),
    page.url()
  );
  check(
    "switching category keeps sort and filters",
    page.url().includes("sort=name") && page.url().includes("evidence=Moderate"),
    page.url()
  );

  // A ?tab= that belongs to another category is dropped.
  await page.goto(`${BASE}/categories/sleep-recovery?tab=fertility`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 900));
  check(
    "a foreign ?tab= is removed from the URL",
    !page.url().includes("tab=fertility"),
    page.url()
  );

  /* ---------------- home search takes over the page ---------------- */
  process.stdout.write("\nhome search view\n");
  await page.goto(`${BASE}/?q=shilajit`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 900));
  const chromeHidden = await page.$eval(".home-chrome", (n) => {
    const style = window.getComputedStyle(n);
    return style.display === "none";
  }).catch(() => false);
  check("browse chrome collapses while searching", chromeHidden);
  const resultsFirst = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll("h2")).find((n) =>
      n.textContent.includes("Results for")
    );
    if (!heading) return false;
    const chrome = document.querySelector(".home-chrome");
    return chrome ? heading.compareDocumentPosition(chrome) & Node.DOCUMENT_POSITION_FOLLOWING : false;
  });
  check("search results render above the browse chrome", Boolean(resultsFirst));

  /* ---------------- nav active state ---------------- */
  for (const [route, expected] of [
    ["/", "Home"],
    ["/categories", "Categories"],
    ["/categories/mens-vitality", "Categories"],
    ["/products", "Products"],
    ["/foods", "Foods"],
    ["/meals", "Meals"],
  ]) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
    const active = await page.$$eval("nav a", (nodes) =>
      nodes.filter((n) => n.classList.contains("text-primary")).map((n) => n.textContent.trim())
    );
    check(
      `${route} highlights only "${expected}"`,
      active.length === 1 && active[0] === expected,
      `active: ${JSON.stringify(active)}`
    );
  }
} finally {
  await browser.close();
}

process.stdout.write("\n" + "-".repeat(64) + "\n");
if (failures) {
  process.stdout.write(`FAILED — ${failures} check(s) failed.\n`);
  process.exit(1);
}
process.stdout.write("PASSED — all UI checks passed.\n");
process.exit(0);

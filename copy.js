/* GlowUp — editorial copy layer.
   Every line here is written by GlowUp. It is kept out of data.js so the research
   facts stay exactly as extracted from the Markdown library: graded claims keep
   their grades, and this file only changes how we talk to the reader.
   Voice: plain, professional, second person. Short sentences. No hype. */
window.GLOWUP_COPY = {
  ui: {
    eyebrow: "Evidence-graded · no hype",
    heroTitle: "Lose fat. Keep muscle. Keep it off.",
    heroLede:
      "You have done this before and watched it come back. This time you get the working parts: " +
      "every claim graded, every price checked, every number traceable to PubMed or USDA. " +
      "Read it once and the plan stops depending on willpower.",
    heroPrimary: "Start with three articles",
    heroSecondary: "See products",
    standaloneBadge: "Single file · works offline",
    mergedNote: "Includes",
    safetyRefNote: "Safety and contraindications are shared with",
    sheetCited: "Cited sources",

    startHere: ["Start here", "Three reads that do the most work"],
    categories: ["Pick one topic", "Twelve areas · tap to filter"],
    numbers: ["Numbers worth remembering", "Taken directly from the graded evidence"],
    disclaimerTitle: "What this is, and what it is not",
    disclaimer:
      "This is a research library, not a doctor. The grades tell you how much weight a claim carries, " +
      "and the citations let you check the work. If you have a medical condition, take medication, " +
      "or you are over 40 and have not had blood tests in years, talk to someone who can examine you.",

    articlesTitle: "Articles",
    articlesIntro: "Ordered by how much you can trust each one. The grade is the useful part.",
    articlesEmpty: "Nothing matches. Try a broader filter, or clear the ones you set.",
    filterPlaceholder: "Filter these 38…",
    sortLabel: "Sort",

    foodTitle: "Food",
    foodIntro:
      "Values per 100 g from USDA. Protein and fibre drive fullness; water and volume add it for free.",
    foodEmpty: "No food matches. Clear the filter or use a shorter word.",


    /* --- products: buy list + supplement ledger --- */
    quick_guides: "Fasting & ageing guides",
    quick_food_table: "Food table",
    quick_supplement_ledger: "Supplement ledger",
    quick_shopping: "Shopping list",
    modeList: "Buy list",
    modeLedger: "Supplement ledger",
    modeCards: "Cards",
    modeTable: "Table",
    doseLabel: "How to use",
    verdictLabel: "Verdict",
    bestValue: "Best value",
    watchOut: "Watch out",
    notFor: "Not for",
    ledgerTitle: "Supplement ledger",
    ledgerIntro:
      "Four things earn a place: creatine, enough protein, fibre, and vitamin D if your blood work says so. " +
      "Everything else on a supplement shelf is optional. Rows are ranked by cost per serving, so the cheapest " +
      "honest option is at the top of each group.",
    ledgerFoot:
      "Cost per serving is pack price divided by servings, calculated from the pack size and dose printed on the label. " +
      "It excludes shipping, customs and local markup. Doses and cautions are the ones in the research library, not a prescription.",
    ledgerReadOn: "Read the supplements review",
    cat_fibre: "Fibre",
    cat_creatine: "Creatine",
    "cat_vitamin-d": "Vitamin D",
    cat_protein: "Protein",
    cat_device: "Tools",
    cat_protein_group: "Protein foods",

    productsTitle: "Products",
    productsIntro:
      "Twelve prices checked on iHerb. The other six are marked as unchecked, and no number is invented.",
    productsEmpty: "Nothing in this filter. Choose All, or switch off verified only.",
    productsFootnote:
      "Links go to iHerb, where prices were checked, and to Amazon, which is search only. No Amazon prices are quoted.",
    productsFootnote2:
      "Prices were checked on iHerb on {date}. They exclude shipping, customs and local markup. " +
      "No affiliate links: nothing here earns a commission.",

    mealsTitle: "Meals",
    mealsIntro:
      "Five templates you can repeat without thinking, a seven-day rotation, and one shopping page to screenshot.",
    mealsEmpty: "No meals yet.",
    shoppingTitle: "Weekly shopping list",
    shoppingHint: "Tap an item to cross it off. It stays crossed off next time.",

    searchPlaceholder: "Search everything: creatine, fibre, sleep…",
    searchEmptyTitle: "No match",
    searchEmpty: "Nothing by that name. Use fewer words, or a broader term such as protein.",
    searchHint: "Searches all 38 articles, 26 foods, 18 products and 5 meals.",

    sheetInPlainWords: "In plain words",
    sheetWhatEvidence: "What the evidence establishes",
    sheetKeyPoints: "Key points",
    sheetEvidenceQuality: "How strong is this?",
    sheetSafety: "Before you try this",
    sheetSources: "Sources you can check",

    readerNoVoiceStatus: "No device voices available",
    readerHintVoice:
      "Choose a voice, then press listen. Tap any sentence to skip to it; select text to highlight it.",
    readerHintNoVoice:
      "This browser offers no speech voices, which is common inside embedded previews. " +
      "Highlighting still works. Open the file in a normal browser tab to hear it.",

    toastHighlighted: "Highlighted",
    toastRemoved: "Highlight removed",
    toastCopied: "Copied",

    photoCredit:
      "Photography: shot for GlowUp, with free-licence frames from Pexels and Unsplash.",
    offlineTitle: "You are offline, and everything still works",
    offlineBody: "The whole library is stored on this device: articles, prices and all."
  },

  /* One plain line per article: what you get from reading it. */
  hooks: {
    "evidence-method": "How each claim earned its grade, before you trust a single number here.",
    "myths": "Ten shortcuts you hear every week, each one taken apart in turn.",
    "fast-fat-loss": "Fast enough to see in the mirror, slow enough to keep your muscle.",
    "rate-and-plateaus": "The scale stops moving. Here is the ordinary reason, and what to change.",
    "aggressive-safe": "Sixteen weeks at full effort without the crash that ends most diets.",
    "low-maintenance": "The version that still works on a day with no time and no patience.",
    "recomposition": "Losing fat while keeping muscle: when that is realistic, and when it is not.",
    "exercise-neat": "The least training that still protects muscle while you eat less.",
    "protein": "How much you need, when to eat it, and the cheapest way to reach it.",
    "fasting": "Skipping breakfast will not outwork a bad dinner. It can still help. Here is the balance.",
    "fasting-claims": "The fasting claims that sound convincing until you check them.",
    "appetite": "Hunger is the real problem. These are the levers that actually move it.",
    "appetite-aids": "What appetite products promise, what they deliver, and the cheaper options.",
    "fibre": "Cheap, filling and unglamorous. Possibly the best return on any food change.",
    "meal-templates": "Five meals you can repeat, swap, and still eat out on Friday.",
    "shopping": "One page: what to buy, what it costs, and what to cook when you cannot be bothered.",
    "sleep": "The free lever. Sleeping more reduces intake by about 270 kcal a day without trying.",
    "insomnia": "Caffeine, naps and screens: what shifts your nights, and what only feels as if it should.",
    "mens-health": "The screening and mortality numbers that matter most for men, in order of value.",
    "anti-aging": "Every popular longevity strategy, graded, including the expensive ones that do nothing.",
    "longevity-table": "One table: what each intervention changes, and how confident we can be.",
    "bloodwork": "Five numbers worth tracking. Most of the rest of the panel is not.",
    "skincare": "Sunscreen and retinoids do the work. Devices mostly take your money.",
    "grooming": "Teeth, posture and clothes. Unglamorous, and they change how you are read in a room.",
    "hair": "What actually holds ground in male-pattern hair loss, and how long you have to act.",
    "supplements": "Most of the shelf is optional. Three items earn their place, and the rest is packaging.",
    "drugs": "The expensive route, and the cheaper versions that do the same job.",
    "products": "The shortlist, with checked prices and cost per serving worked out.",
    "free-alternatives": "Before you buy anything, here is the free version of it.",
    "maintenance": "Losing it was the easy part. This is why it returns, and the protocol that survives it.",
    "regain": "The 2 kg rule that stops one bad week becoming a bad year.",
    "post-diet": "The twelve weeks where most people quietly undo everything they just paid for.",
    "early-warning": "Four signals that predict regain before the scale admits it.",
    "big-d-sexual-function": "What the research supports for erections, and which herbs it does not.",
    "big-d-pe": "Breathing, technique and sleep first. Topical anaesthetics are the clinician step.",
    "big-d-fertility": "Every percentage in this section comes from one small study. Start with the semen analysis.",
    "big-d-attraction": "Hormones explain a little of it. Body fat, sleep and grooming explain more.",
    "big-d-testosterone": "Sleep, body fat and heavy training, in that order. Test before you treat."
  },

  /* What each supplement category is actually for (group header in the ledger). */
  ledgerPurposes: {
    "creatine": "Strength, lean mass and training performance. Monohydrate is the only form worth buying.",
    "protein": "Total daily protein is what matters. Powder is one convenient way to reach it.",
    "fibre": "Fullness, glycaemic control, LDL cholesterol and regularity.",
    "vitamin-d": "Correcting a deficiency. It is not a cardiovascular or longevity drug in replete people."
  },

  /* One verdict line per supplement category, shown in the ledger. */
  ledgerVerdicts: {
    "creatine":
      "Worth buying: the strongest evidence in the list, with more strength and lean mass alongside resistance training. " +
      "Plain monohydrate is the version to buy.",
    "protein":
      "Food first. Powder is convenience, not a health product, and it is only worth it if it closes a real protein gap.",
    "fibre":
      "Worth buying if your diet is short on fibre. Food fibre comes first; psyllium is the cheapest supplement that works.",
    "vitamin-d":
      "Buy only if a blood test says you are low, or you get almost no sun. Extra vitamin D in a replete person has not " +
      "shown cardiovascular benefit in trials."
  },

  /* Section openers used at the top of each view. */
  intros: {
    articles: "Ordered by how much you can trust each one. The grade is the useful part.",
    food: "Values per 100 g from USDA. Protein and fibre buy fullness; water and volume come free.",
    products: "Twelve prices checked on iHerb. The other six are marked as unchecked.",
    meals: "Repeatable meals, a seven-day rotation, and one shopping page to screenshot."
  }
};

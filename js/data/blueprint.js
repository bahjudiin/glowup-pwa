// ─────────────────────────────────────────────────────────────
// BLUEPRINT DATA — Men's Body-Fat Loss Blueprint
// Single ordered source of truth. Sections render in array order.
// Block types: note | summary | table | list | steps | accordion
//              | checklist | chips | callout
// ─────────────────────────────────────────────────────────────

export const PLAN_META = {
  title: "Body-Fat Loss Blueprint",
  sub: "A practical, muscle-conscious plan for adult men",
  kicker: "Evidence-based · Sustainable · Muscle-preserving",
  principles: [
    "Steady calorie deficit",
    "Adequate protein",
    "Strength training",
    "Walking",
    "Sleep hygiene"
  ],
  disclaimer:
    "This blueprint requires input of age, height, weight, waist, activity level, medical conditions, and medications for personalized calorie and protein targets, best determined with clinical support. Core emphasis is sustainable habits, muscle preservation, and balanced nutrition — not extreme fasting or rapid weight loss."
};

export const PLAN_SECTIONS = [
  // ── 1 ────────────────────────────────────────────────────────
  {
    id: "overview",
    n: 1,
    icon: "\u{1F4D6}",
    title: "Overview",
    tag: "Start here",
    tone: "accent",
    keywords: "deficit calories protein fasting sleep tracking overview summary",
    blocks: [
      {
        type: "note",
        tone: "accent",
        title: "\u{1F4A1} WHAT THIS PLAN IS",
        text: "An evidence-based, sustainable approach to body-fat loss for adult men. It centres on gradual fat loss combined with muscle preservation through sensible nutrition and exercise habits."
      },
      {
        type: "summary",
        title: "Plan at a glance",
        cols: 3,
        items: [
          { val: "−500–750", unit: "kcal/day", lbl: "Calorie target", tone: "red", note: "Maintenance estimate minus deficit" },
          { val: "1–2", unit: "lb/week", lbl: "Expected pace", tone: "green", note: "0.45–0.9 kg per week" },
          { val: "1.2–1.6", unit: "g/kg", lbl: "Protein daily", tone: "accent", note: "Goal or adjusted body weight" },
          { val: "3 +1", unit: "meals", lbl: "Meal pattern", tone: "blue", note: "Optional snack" },
          { val: "12h", unit: "gap", lbl: "Overnight fast", tone: "gold", note: "Optional 14-hour" },
          { val: "2–3", unit: "x/week", lbl: "Strength", tone: "pink", note: "Full-body sessions" },
          { val: "150+", unit: "min/week", lbl: "Cardio / walking", tone: "orange", note: "Moderate activity" },
          { val: "7", unit: "hours", lbl: "Sleep minimum", tone: "accent", note: "Consistent schedule" },
          { val: "7-day", unit: "avg", lbl: "Track weight", tone: "green", note: "+ weekly waist" }
        ]
      },
      {
        type: "list",
        title: "Core directives",
        icon: "\u{1F3AF}",
        items: [
          { k: "Calorie deficit", v: "Reduce daily intake by about 500–750 kcal from estimated maintenance." },
          { k: "Protein intake", v: "Target 1.2–1.6 g/kg of goal or adjusted body weight daily." },
          { k: "Meal timing", v: "Begin with a 12-hour overnight fast, optionally extending to 14 hours; longer fasts are unnecessary." },
          { k: "Exercise", v: "Full-body strength training 2–3×/week plus walking or moderate aerobic activity totalling 150 minutes or more per week." },
          { k: "Sleep", v: "Aim for at least 7 hours nightly, with consistent sleep/wake times." },
          { k: "Tracking", v: "Use 7-day average weight and weekly waist circumference to monitor progress." }
        ]
      },
      {
        type: "callout",
        tone: "red",
        icon: "\u{1F6D1}",
        title: "Avoid drastic measures",
        text: "Frequent extended fasts (24–70 hours) and very-low-calorie diets are discouraged. Do not attempt them without medical supervision."
      }
    ]
  },

  // ── 2 ────────────────────────────────────────────────────────
  {
    id: "expectations",
    n: 2,
    icon: "\u{1F3AF}",
    title: "Expectations",
    tag: "Reality check",
    tone: "gold",
    keywords: "expectations realistic pace myth autophagy loose skin water weight targets",
    blocks: [
      {
        type: "callout",
        tone: "red",
        icon: "\u{26A0}\uFE0F",
        title: "Rapid large-scale fat loss is unrealistic and unsafe",
        text: "Losing 10 kg per month is not a realistic goal. Early weight changes often reflect water, glycogen, and gut content shifts rather than true fat loss."
      },
      {
        type: "list",
        title: "What is sustainable",
        icon: "\u{2705}",
        tone: "green",
        items: [
          { k: "Sustainable pace", v: "A steady weight loss of approximately 1–2 lb per week." },
          { k: "Real driver", v: "Weight loss is driven by consistent energy deficit — not by fasting windows." },
          { k: "Autophagy", v: "Assumptions that fasting “turns on” fat burning or extensive autophagy are not solidly supported. Research is preliminary." },
          { k: "Loose skin", v: "No fasting duration reliably prevents loose skin." }
        ]
      },
      {
        type: "accordion",
        title: "Myths vs. evidence",
        icon: "\u{1F9E0}",
        items: [
          {
            n: "M1",
            tone: "red",
            title: "“Fasting switches on fat burning”",
            items: [
              { i: "\u{274C}", t: "Fat loss is driven by a sustained calorie deficit, not by entering a fasted state." },
              { i: "\u{1F4C8}", t: "The deficit is what matters; meal timing only changes how the same calories are spaced." }
            ]
          },
          {
            n: "M2",
            tone: "red",
            title: "“Fasting triggers autophagy for skin”",
            items: [
              { i: "\u{274C}", t: "Autophagy research in humans is preliminary and does not support dramatic skin remodelling claims." },
              { i: "\u{1F9EC}", t: "Skin quality responds to protein, sleep, hydration, and resistance training." }
            ]
          },
          {
            n: "M3",
            tone: "red",
            title: "“10 kg a month will get me there faster”",
            items: [
              { i: "\u{274C}", t: "Aggressive loss raises gallstone risk and drives muscle loss." },
              { i: "\u{1F4CA}", t: "1–2 lb/week compounds to meaningful change without metabolic damage." }
            ]
          },
          {
            n: "F1",
            tone: "green",
            title: "What actually works",
            items: [
              { i: "\u{2705}", t: "500–750 kcal/day deficit, sustained." },
              { i: "\u{2705}", t: "1.2–1.6 g/kg protein to protect lean mass." },
              { i: "\u{2705}", t: "Full-body strength training 2–3×/week." },
              { i: "\u{2705}", t: "150+ minutes of moderate activity weekly." },
              { i: "\u{2705}", t: "7+ hours of consistent sleep." }
            ]
          }
        ]
      }
    ]
  },

  // ── 3 ────────────────────────────────────────────────────────
  {
    id: "preparation",
    n: 3,
    icon: "\u{1F6E0}\uFE0F",
    title: "Preparation",
    tag: "Steps 0–3",
    tone: "blue",
    keywords: "medical review baseline measurements calorie determination protein target setup start",
    blocks: [
      {
        type: "note",
        tone: "blue",
        title: "\u{1F6E0}\uFE0F BEFORE YOU START",
        text: "Work through Steps 0 to 3 in order. Steps 0 and 1 are safety and baseline gates — do not skip them."
      },
      {
        type: "accordion",
        title: "Step-by-step",
        icon: "\u{1F3AF}",
        items: [
          {
            n: "0",
            tone: "red",
            title: "Medical review",
            items: [
              { i: "\u{1F48A}", t: "Consult a healthcare provider if you have:", plain: true },
              { i: "\u{1F7E8}", t: "Diabetes, kidney or heart disease, high blood pressure, or gout" },
              { i: "\u{1F7E8}", t: "History of eating disorders" },
              { i: "\u{1F7E8}", t: "Take medications affecting blood sugar, blood pressure, or fluid balance" },
              { i: "\u{1F6AB}", t: "Do not stop or adjust medications without medical advice — especially SGLT2 inhibitors, due to ketoacidosis risk with prolonged fasting or low carbs.", strong: true }
            ]
          },
          {
            n: "1",
            tone: "blue",
            title: "Baseline measurements",
            items: [
              { i: "\u{1F4CF}", t: "4–7 days of morning weight to establish a weekly average" },
              { i: "\u{1F4CF}", t: "Weekly waist circumference" },
              { i: "\u{1F4CF}", t: "Blood pressure, steps, strength training level, sleep habits, medications" },
              { i: "\u{1F48A}", t: "Avoid obsessive calorie tracking if it triggers disordered eating.", strong: true }
            ]
          },
          {
            n: "2",
            tone: "gold",
            title: "Calorie determination",
            items: [
              { i: "\u{1F4CA}", t: "Estimate maintenance energy needs via validated tools or clinicians" },
              { i: "\u{1F4CB}", t: "Start with a 500–750 kcal/day deficit, individualised by size and activity" },
              { i: "\u{1F6AB}", t: "Avoid very-low-calorie diets (~800–1,000 kcal/day) unless medically supervised", strong: true }
            ]
          },
          {
            n: "3",
            tone: "green",
            title: "Protein target",
            items: [
              { i: "\u{1F95A}", t: "1.2–1.6 g/kg of goal or adjusted body weight per day" },
              { i: "\u{1F6AB}", t: "Do not simply multiply protein by actual body weight if obesity is significant" },
              { i: "\u{1F4CB}", t: "Spread protein over 3 meals — e.g. 30–45 g per meal" },
              { i: "\u{1F48A}", t: "Adjust for chronic kidney disease or other conditions with medical guidance", strong: true }
            ]
          }
        ]
      }
    ]
  },

  // ── 4 ────────────────────────────────────────────────────────
  {
    id: "nutrition",
    n: 4,
    icon: "\u{1F957}",
    title: "Nutrition",
    tag: "Food framework",
    tone: "green",
    keywords: "nutrition plate vegetables protein carbohydrate fats meals drinks example daily",
    blocks: [
      {
        type: "note",
        tone: "green",
        title: "\u{1F957} MEAL COMPOSITION",
        text: "Build each plate from the ratio below, then add measured healthy fats moderately."
      },
      {
        type: "summary",
        title: "The plate",
        cols: 3,
        items: [
          { val: "\u{00BD}", lbl: "Non-starchy vegetables", tone: "green" },
          { val: "\u{00BC}", lbl: "Protein", tone: "accent" },
          { val: "\u{00BC}", lbl: "High-fibre carbohydrates", tone: "gold", note: "Beans, potatoes, oats, whole grains" }
        ]
      },
      {
        type: "table",
        title: "Protein sources",
        icon: "\u{1F95A}",
        tone: "accent",
        cols: ["Category", "Examples"],
        rows: [
          ["Poultry", "Chicken, turkey"],
          ["Seafood", "Fish and seafood"],
          ["Eggs", "Eggs and egg whites"],
          ["Dairy", "Plain Greek yogurt, cottage cheese"],
          ["Plant", "Tofu, tempeh, edamame"],
          ["Legumes", "Beans, lentils, chickpeas"],
          ["Red meat", "Lean beef or pork, in moderation"]
        ]
      },
      {
        type: "table",
        title: "Carbohydrate sources",
        icon: "\u{1F35A}",
        tone: "gold",
        cols: ["Source", "Examples"],
        rows: [
          ["Whole grains", "Oats"],
          ["Legumes", "Beans, lentils"],
          ["Tubers", "Potatoes and sweet potatoes"],
          ["Grains & seeds", "Rice, quinoa, barley, other whole grains"],
          ["Fruit", "Whole fruits"]
        ]
      },
      {
        type: "list",
        title: "Vegetables, flavouring & drinks",
        icon: "\u{1F962}",
        items: [
          { k: "Vegetables", v: "Fresh, frozen, or canned." },
          { k: "Flavour", v: "Use herbs, spices, citrus, salsa, mustard, and lower-calorie sauces." },
          { k: "Measured fats", v: "Oil, nuts, avocado — added in moderation." },
          { k: "Variety", v: "Rotate protein choices: lean meats, seafood, eggs, dairy, legumes, soy." },
          { k: "Default drinks", v: "Water, sparkling water, unsweetened tea, plain coffee." },
          { k: "Count these", v: "Milk and sweeteners count toward calorie intake." }
        ]
      },
      {
        type: "table",
        title: "Example daily meal",
        icon: "\u{1F37D}\uFE0F",
        tone: "blue",
        caption: "Approximately 1800–2000 kcal · 145–160 g protein",
        cols: ["Meal", "Example"],
        rows: [
          ["Breakfast", "300 g plain Greek yogurt, 40 g oats, 150 g berries, 10 g chia seeds"],
          ["Lunch", "150 g cooked chicken, 1 cup cooked rice, 2 cups vegetables, 1 tsp olive oil"],
          ["Snack", "200 g cottage cheese, 1 apple"],
          ["Dinner", "150 g salmon, 200 g potato, 2 cups vegetables, 1 tsp olive oil"]
        ]
      }
    ]
  },

  // ── 5 ────────────────────────────────────────────────────────
  {
    id: "limit",
    n: 5,
    icon: "\u{1F6D1}",
    title: "Foods to Limit",
    tag: "Limit, not ban",
    tone: "orange",
    keywords: "limit avoid sugary drinks alcohol processed fried meat sugar soda",
    blocks: [
      {
        type: "chips",
        title: "Reduce frequency",
        icon: "\u{1F6AB}",
        tone: "orange",
        items: [
          "Sugary drinks — soda, sweet tea, energy drinks, fruit juices",
          "Frequent alcohol",
          "Processed snacks — chips, pastries, candies, desserts",
          "Fried fast food and large portion takeout",
          "Processed meats — bacon, sausage, hot dogs",
          "Excessive fats — mayonnaise, creamy sauces, oil, dressings"
        ]
      },
      {
        type: "callout",
        tone: "green",
        icon: "\u{2705}",
        title: "Limit is not ban",
        text: "There is no need to eliminate fruits, potatoes, rice, bread, or all carbohydrates. Sustainable habits are the key."
      }
    ]
  },

  // ── 6 ────────────────────────────────────────────────────────
  {
    id: "timing",
    n: 6,
    icon: "\u{23F0}",
    title: "Timing & Fasting",
    tag: "12h window",
    tone: "gold",
    keywords: "fasting intermittent window overnight 12 hour 14 hour meal timing eat",
    blocks: [
      {
        type: "summary",
        title: "Fasting window",
        cols: 4,
        items: [
          { val: "12h", lbl: "Start here", tone: "gold", note: "e.g. 7:30p → 7:30a" },
          { val: "14h", lbl: "Optional", tone: "accent", note: "If comfortable, no conflicts" },
          { val: "3", lbl: "Meals", tone: "green", note: "Or 2 meals + planned snack" },
          { val: "24h+", lbl: "Avoid", tone: "red", note: "Not a default strategy" }
        ]
      },
      {
        type: "list",
        title: "Rules",
        icon: "\u{1F4CC}",
        items: [
          { k: "Start", v: "12-hour overnight fasting window (e.g. 7:30 p.m. – 7:30 a.m.)." },
          { k: "Extend", v: "If comfortable and no conflicts exist, extend to 14 hours." },
          { k: "Consistency", v: "Eat consistently: three meals, or two meals + a planned snack." },
          { k: "Never default", v: "Avoid fasting durations of 24 hours or longer as default strategies." },
          { k: "No hacks", v: "Do not rely on supplements or remedies like apple cider vinegar or pink salt for metabolic benefits." }
        ]
      },
      {
        type: "callout",
        tone: "blue",
        icon: "\u{1F4A4}",
        title: "What intermittent fasting actually does",
        text: "It can help organise eating. It is not superior to calorie restriction if calories are matched."
      }
    ]
  },

  // ── 7 ────────────────────────────────────────────────────────
  {
    id: "training",
    n: 7,
    icon: "\u{1F3CB}\uFE0F",
    title: "Training",
    tag: "2–3× full-body",
    tone: "accent",
    keywords: "exercise training strength workout walking cardio schedule minutes zone 2 steps",
    blocks: [
      {
        type: "note",
        tone: "accent",
        title: "\u{1F3CB}\uFE0F EXERCISE BLUEPRINT",
        text: "Aim for 150–300 minutes of weekly moderate aerobic activity plus muscle-strengthening on 2+ days per week."
      },
      {
        type: "summary",
        title: "Weekly targets",
        cols: 3,
        items: [
          { val: "150–300", unit: "min/wk", lbl: "Moderate aerobic", tone: "orange" },
          { val: "2–3", unit: "x/wk", lbl: "Full-body strength", tone: "accent" },
          { val: "30", unit: "min", lbl: "Brisk walk per session", tone: "green" },
          { val: "2", unit: "sets", lbl: "Per exercise (start)", tone: "gold" },
          { val: "1–3", unit: "reps", lbl: "Left in reserve", tone: "blue" },
          { val: "10", unit: "min", lbl: "Post-meal walk", tone: "pink" }
        ]
      },
      {
        type: "table",
        title: "Weekly example schedule",
        icon: "\u{1F4C5}",
        tone: "blue",
        cols: ["Day", "Plan"],
        rows: [
          ["Monday", "Full-body strength workout A + 30-min brisk walk", "accent"],
          ["Tuesday", "30-min brisk walk", "green"],
          ["Wednesday", "Full-body strength workout B + 30-min brisk walk", "accent"],
          ["Thursday", "30-min brisk walk or similar", "green"],
          ["Friday", "Full-body strength workout C + 30-min brisk walk", "accent"],
          ["Saturday", "Optional light activity or recreation", "text3"],
          ["Sunday", "Rest, mobility, light walking", "text3"]
        ]
      },
      {
        type: "accordion",
        title: "How to train",
        icon: "\u{1F3CB}\uFE0F",
        items: [
          {
            n: "S1",
            tone: "accent",
            title: "Strength workouts",
            items: [
              { i: "\u{1F4C8}", t: "Start with 2 sets per exercise, progressing to 2–3 sets." },
              { i: "\u{1F3AF}", t: "Choose weights allowing 1–3 reps left in reserve per set." },
              { i: "\u{1F6E1}\uFE0F", t: "Exercise pool: squats, presses, rows, hip hinges, core work, carries." },
              { i: "\u{2B06}\uFE0F", t: "Increase weight when easily completing top reps with good form." }
            ]
          },
          {
            n: "S2",
            tone: "green",
            title: "Movement habits",
            items: [
              { i: "\u{1F6B6}", t: "Add short post-meal walks (10 minutes)." },
              { i: "\u{23F1}\uFE0F", t: "Stand or walk briefly each hour if sedentary." },
              { i: "\u{1F6F0}\uFE0F", t: "Gradually increase daily steps — 10,000 steps is not mandatory." },
              { i: "\u{1F6AB}", t: "Avoid hard training when dizzy, dehydrated, or unwell.", strong: true }
            ]
          }
        ]
      },
      {
        type: "callout",
        tone: "red",
        icon: "\u{1F6D1}",
        title: "Do not compensate",
        text: "Avoid using extra high-intensity workouts to make up for missed diet days."
      }
    ]
  },

  // ── 8 ────────────────────────────────────────────────────────
  {
    id: "sleep",
    n: 8,
    icon: "\u{1F634}",
    title: "Sleep",
    tag: "7–9 hours",
    tone: "blue",
    keywords: "sleep rest bedtime wake caffeine apnea light wind down recovery",
    blocks: [
      {
        type: "note",
        tone: "blue",
        title: "\u{1F634} SLEEP IMPROVEMENT PLAN",
        text: "Prioritise 7–9 hours of quality sleep with consistent timing."
      },
      {
        type: "list",
        title: "Key practices",
        icon: "\u{1F319}",
        items: [
          { k: "Wake time", v: "Choose a consistent wake time." },
          { k: "Bedtime", v: "Set an early enough bedtime." },
          { k: "Morning light", v: "Get morning outdoor light exposure." },
          { k: "Caffeine", v: "Avoid caffeine 8+ hours before bedtime." },
          { k: "Wind down", v: "Use screen-free wind-down routines 30–60 minutes before sleep." },
          { k: "Environment", v: "Maintain a cool, dark, quiet bedroom." },
          { k: "Before bed", v: "Avoid large meals and alcohol near bedtime." }
        ]
      },
      {
        type: "callout",
        tone: "red",
        icon: "\u{1F6A8}",
        title: "Screen for sleep apnoea",
        text: "Seek medical evaluation for signs of sleep apnoea: loud snoring, gasping, pauses in breathing, and daytime sleepiness."
      }
    ]
  },

  // ── 9 ────────────────────────────────────────────────────────
  {
    id: "automation",
    n: 9,
    icon: "\u{2699}\uFE0F",
    title: "Automation",
    tag: "Make it automatic",
    tone: "pink",
    keywords: "habit automation routine standardise prep grocery batch calendar tracking",
    blocks: [
      {
        type: "note",
        tone: "pink",
        title: "\u{2699}\uFE0F MAKING THE PLAN AUTOMATIC",
        text: "Enhance adherence by removing decisions. Standardise, pre-prep, and schedule."
      },
      {
        type: "accordion",
        title: "System checklist",
        icon: "\u{1F5C2}\uFE0F",
        items: [
          {
            n: "A1",
            tone: "accent",
            title: "Standardise",
            items: [
              { i: "\u{1F4C6}", t: "Standardise 2 breakfasts, 3 lunches, 3 dinners for repetition." }
            ]
          },
          {
            n: "A2",
            tone: "green",
            title: "Pre-prep",
            items: [
              { i: "\u{1F6D2}", t: "Use planned grocery lists." },
              { i: "\u{1F957}", t: "Batch-prep proteins and vegetables." },
              { i: "\u{1F9CA}", t: "Keep healthy, convenient foods ready: yogurt, fruit, eggs, canned fish, frozen vegetables." }
            ]
          },
          {
            n: "A3",
            tone: "orange",
            title: "Environment",
            items: [
              { i: "\u{1F6CF}", t: "Portion snacks — avoid eating directly from large packages." }
            ]
          },
          {
            n: "A4",
            tone: "blue",
            title: "Schedule",
            items: [
              { i: "\u{1F4C5}", t: "Schedule workouts and walks in calendars." }
            ]
          },
          {
            n: "A5",
            tone: "gold",
            title: "Tracking",
            items: [
              { i: "\u{1F4CB}", t: "Track food intake 7–14 days to identify portion sizes." },
              { i: "\u{2696}\uFE0F", t: "Weigh consistently under similar conditions; use a 7-day average." },
              { i: "\u{1F4CF}", t: "Measure waist weekly." }
            ]
          }
        ]
      }
    ]
  },

  // ── 10 ───────────────────────────────────────────────────────
  {
    id: "risks",
    n: 10,
    icon: "\u{26A0}\uFE0F",
    title: "Risks & Stop Signs",
    tag: "Read before starting",
    tone: "red",
    keywords: "risks warning stop fainting chest pain ketoacidosis sglt2 gallstones medication",
    priority: 100,
    blocks: [
      {
        type: "callout",
        tone: "red",
        icon: "\u{26A0}\uFE0F",
        title: "Read this section before you start",
        text: "This plan is general guidance, not medical advice. Any condition or medication listed below changes what you should do."
      },
      {
        type: "table",
        title: "Risk register",
        icon: "\u{1F6D1}",
        tone: "red",
        scroll: true,
        cols: ["Risk", "Recommended action", "Avoid"],
        rows: [
          ["Too-aggressive weight loss", "Moderate deficit, progress review every 1–2 weeks", "Rapid loss beyond recommended rate (raises gallstones)", "red"],
          ["Muscle loss or poor performance", "Adequate protein, strength training", "Excessive cardio and zero-protein fasts", "orange"],
          ["Medication issues", "Consult clinician before changes", "Self-adjusting medication", "red"],
          ["SGLT2 inhibitors", "Consult prescriber before fasting or carb restriction", "Prolonged fasting, dehydration, no medical plan", "red"],
          ["Electrolyte imbalances", "Replace as medically guided", "Unsupervised potassium or electrolyte loading", "orange"],
          ["Sleep apnoea", "Seek clinical screening for symptoms", "Treating exhaustion as motivation failure", "blue"],
          ["Diet burnout or disordered eating", "Use less restrictive plans; get professional support", "Severe restriction with binge cycles", "red"]
        ]
      },
      {
        type: "callout",
        tone: "red",
        icon: "\u{1F6D1}",
        title: "Stop exercise or fasting and seek medical advice if you experience",
        list: [
          "Fainting, chest pain, confusion, severe weakness, palpitations",
          "Persistent vomiting or inability to maintain hydration",
          "Severe dizziness or worsening symptoms",
          "New right upper quadrant abdominal pain or jaundice",
          "Diabetic ketoacidosis symptoms, especially while on SGLT2 inhibitors"
        ]
      }
    ]
  },

  // ── 11 ───────────────────────────────────────────────────────
  {
    id: "review",
    n: 11,
    icon: "\u{1F504}",
    title: "Review & Adjust",
    tag: "Weekly",
    tone: "orange",
    keywords: "review adjust plateau two weeks portion tracking calories walking variables",
    blocks: [
      {
        type: "note",
        tone: "orange",
        title: "\u{1F504} REVIEW CADENCE",
        text: "Evaluate after two weeks, then weekly. Use the review checklist below each time."
      },
      {
        type: "checklist",
        key: "review",
        title: "Weekly review",
        icon: "\u{1F4CB}",
        tone: "orange",
        persistent: true,
        items: [
          { label: "Is the 7-day average weight decreasing?" },
          { label: "Is waist circumference shrinking?" },
          { label: "Is strength maintained or improving?" },
          { label: "Are sleep, mood, and energy adequate?" },
          { label: "Can meal patterns be followed without overeating rebounds?" }
        ]
      },
      {
        type: "accordion",
        title: "Troubleshooting",
        icon: "\u{1F9EA}",
        items: [
          {
            n: "T1",
            tone: "gold",
            title: "No weight change after two weeks",
            items: [
              { i: "\u{1F50D}", t: "Verify portion accuracy." },
              { i: "\u{1F964}", t: "Check beverage intake." },
              { i: "\u{1F4C5}", t: "Audit weekend habits." },
              { i: "\u{270D}\uFE0F", t: "Check tracking fidelity." }
            ]
          },
          {
            n: "T2",
            tone: "accent",
            title: "Adjusting the plan",
            items: [
              { i: "\u{1F5C2}\uFE0F", t: "Adjust one variable at a time — calories, walking volume." }
            ]
          },
          {
            n: "T3",
            tone: "red",
            title: "Escalate to a clinician",
            items: [
              { i: "\u{1F6A8}", t: "If weight loss is very rapid…" },
              { i: "\u{1F6A8}", t: "…or strength declines, consult a clinician to reassess.", strong: true }
            ]
          }
        ]
      }
    ]
  }
];

// ── Daily checklist (resets daily, persisted per date) ─────────
export const DAILY_CHECKLIST = {
  key: "daily",
  title: "Daily Checklist",
  icon: "\u{2705}",
  tone: "green",
  items: [
    { label: "Protein included at each main meal", icon: "\u{1F95A}" },
    { label: "Vegetables at lunch and dinner", icon: "\u{1F962}" },
    { label: "Planned starch and fats in appropriate portions", icon: "\u{1F35A}" },
    { label: "No sugary drinks consumed", icon: "\u{1F964}" },
    { label: "Walk or planned physical activity completed", icon: "\u{1F6B6}" },
    { label: "Strength training completed as scheduled", icon: "\u{1F3CB}\uFE0F" },
    { label: "Sleep window protected", icon: "\u{1F634}" },
    { label: "Medication regimen followed as prescribed", icon: "\u{1F48A}" }
  ]
};

// ── Definitive reference values (replaces all old conflicting data) ──
export const PLAN_REFERENCE = {
  proteinGPerKg: [1.2, 1.6],
  deficitKcal: [500, 750],
  weeklyLossLb: [1, 2],
  weeklyLossKg: [0.45, 0.9],
  aerobicMinWeek: [150, 300],
  strengthPerWeek: [2, 3],
  sleepHours: [7, 9],
  fastHours: [12, 14],
  avoidFastHours: 24,
  meals: 3,
  maxProteinPerMeal: 45,
  minProteinPerMeal: 30,
  deprecated: {
    protein: "1.6–2.2 g/kg",
    bodysplit: "Mon/Tue/Wed body-part split",
    zone2: "Zone 2 cardio 4–5×/week",
    extendedFast: "36-hour rolling fast",
    autophagySkin: "Autophagy prevents loose skin",
    deficit: "500 kcal flat deficit",
    weightGoal: "120kg → 75kg, 45kg loss"
  }
};

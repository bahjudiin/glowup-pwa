/* GlowUp — deep-dive guides.
   Six plain-English pages, written to be read by a person rather than cited at.
   Every important claim carries a numbered link to PubMed; the numbers are the
   ones listed in `refs` at the end of each page. Nothing here invents a fact the
   research library does not support, and mechanistic findings are never dressed
   up as proven outcomes. Keep the tone simple: short sentences, everyday words.

   Block types rendered by renderGuides():
     p        paragraph            h     sub-heading
     list     bullets              steps numbered list
     table    {head, rows, note}   do    {good, bad} two-column eat/skip
     facts    [[value, label]]     img   {id, caption}
     callout  {kind, title, text}  kind: key | tip | warn
   Token syntax inside any text:  **bold**   [[n]] -> footnote link to refs[n]
*/

window.GLOWUP_GUIDES = {
  tabs: [
    /* ============================================================ 1. FASTING */
    {
      id: "fasting",
      label: "Fasting",
      kicker: "Fasting",
      title: "Fasting, without the fairy tales",
      lede:
        "Skipping meals is a schedule, not a cure. Used well it makes eating less feel easy. " +
        "Used badly it costs you muscle, sleep and patience. Here is the honest version.",
      hero: "guide-fasting-morning",
      heroAlt: "Black coffee and a glass of water on a wooden table in the morning light",
      facts: [
        ["12–14 h", "the fasting window most men should start with"],
        ["0", "extra fat lost versus just eating less"],
        ["8 h", "shortest eating window most people should use"]
      ],
      blocks: [
        { t: "p", text:
          "Fasting is the oldest diet trick there is: you leave a gap between meals, so you " +
          "eat less without counting anything. That is the whole mechanism. Everything people " +
          "say about hormones, cell repair and metabolism is either a small detail or a sales pitch." },

        { t: "h", text: "What happens while you don't eat" },
        { t: "p", text:
          "For the first few hours your body runs on the sugar it stored after your last meal. " +
          "Somewhere between 12 and 16 hours those stores run low and your body draws more energy " +
          "from fat. That part is real. But **burning fat during a fast is not the same as losing fat** — " +
          "what decides fat loss is how much you eat across the whole day and week." },

        { t: "table",
          head: ["Schedule", "Eating window", "How hard", "Who it suits"],
          rows: [
            ["12:12", "12 hours", "Easy", "Almost everyone. Start here."],
            ["14:10", "10 hours", "Easy", "Most men who want one clear rule."],
            ["16:8", "8 hours", "Medium", "If you already skip breakfast and eat enough protein."],
            ["18:6", "6 hours", "Hard", "Rarely worth the effort."],
            ["20:4 or one meal", "4 hours", "Very hard", "Almost nobody. Protein gets missed."],
            ["24 hours, once a week", "—", "Hard", "Optional. Not needed for fat loss."],
            ["36–48 hours", "—", "Very hard", "Not a fat-loss tool. See the refeed page."]
          ],
          note: "Left side of the table is easier. The easy end does almost all of the work." },

        { t: "callout", kind: "key", title: "The rule that decides everything",
          text: "The schedule you can keep beats every clever schedule you cannot. Start at 12:12 for " +
                "two weeks, then move to 14:10 if it feels easy." },

        { t: "p", text:
          "This is not a compromise, it is what the trials show. People doing time-restricted eating " +
          "lost no more weight than people simply eating less [[1]], and in a 12-month trial the " +
          "difference was small and not statistically significant [[2]]. In the TREAT trial the " +
          "fasting group lost weight but also lost some muscle [[3]], which is the part nobody " +
          "warns you about." },

        { t: "img", id: "guide-vegfirst",
          caption: "Protein and vegetables at the first meal. This one habit protects the muscle." },

        { t: "h", text: "The four rules that protect your muscle" },
        { t: "list", items: [
          "**Protein at every meal.** Aim for 1.2–1.6 g per kg of body weight a day. For an 80 kg man that is about 100–130 g.",
          "**Two or three strength sessions a week.** Bands, pull-ups or a bag of sand are enough.",
          "**Keep the eating window at 8 hours or more.** Very short windows make protein hard to hit.",
          "**Never stack a long fast with hard training.** That is how people lose strength."
        ]},

        { t: "h", text: "What breaks a fast, and what doesn't" },
        { t: "list", items: [
          "**Fine:** water, plain tea, black coffee. None of these has calories.",
          "**Breaks it:** milk, sugar, honey, juice, sweet tea, sweetened gum, a spoon of oil, most \"zero\" creamers.",
          "**Coffee has a limit:** caffeine six hours before bed measurably wrecked sleep in a controlled study [[4]], so keep it early."
        ]},

        { t: "h", text: "What not to believe" },
        { t: "table",
          head: ["Claim", "What is actually true"],
          rows: [
            ["\"You burn fat all day after a fast\"", "Fat burning rises during the fast. Fat loss still comes from eating less overall."],
            ["\"16 hours switches on cell repair\"", "Cell clean-up is real, but no study has shown a clean hour-by-hour switch in people. A 2026 trial found changes in blood markers [[5]], not proof of renewal."],
            ["\"Fasting speeds up your metabolism\"", "It does not raise daily energy use enough to matter. Long fasts can lower it."],
            ["\"Fasting cures insulin resistance\"", "It improves while you lose weight [[6]]. The weight loss is doing the work."],
            ["\"Longer is better\"", "Past about 16 hours the effort rises faster than the benefit, and muscle suffers first."]
          ]},

        { t: "h", text: "Who should not fast" },
        { t: "list", items: [
          "Type 1 diabetes, or type 2 diabetes treated with insulin or sulfonylureas (low blood sugar risk).",
          "Pregnant or breastfeeding.",
          "Anyone with a past or present eating disorder.",
          "Underweight, or losing weight without trying.",
          "Gout, recent surgery, fever or acute illness.",
          "Medication that must be taken with food.",
          "Heavy manual work in heat — dehydration beats any benefit."
        ]},
        { t: "callout", kind: "warn", title: "Talk to a doctor first if…",
          text: "You take diabetes tablets, blood pressure tablets or blood thinners, or you have any " +
                "long-term condition. Skipping meals changes how those drugs behave." },

        { t: "h", text: "Stop if you feel any of this" },
        { t: "list", items: [
          "Dizziness, palpitations, fainting or a severe headache.",
          "Vomiting, confusion, or swelling in the legs.",
          "Sleep falling apart, mood dropping, or food taking over your thoughts.",
          "Eating uncontrollably at the end of every fast — that fast is too long for you."
        ]}
      ],
      refs: [
        { n: 1, label: "Enríquez Guerrero 2021 — intermittent fasting vs continuous energy restriction, meta-analysis", url: "https://pubmed.ncbi.nlm.nih.gov/33293678/" },
        { n: 2, label: "Liu 2022, NEJM — calorie restriction with or without time-restricted eating", url: "https://pubmed.ncbi.nlm.nih.gov/35443107/" },
        { n: 3, label: "TREAT 2020, JAMA Internal Medicine — time-restricted eating, weight and lean mass", url: "https://pubmed.ncbi.nlm.nih.gov/32986097/" },
        { n: 4, label: "Drake 2013 — caffeine six hours before bed and sleep", url: "https://pubmed.ncbi.nlm.nih.gov/24235903/" },
        { n: 5, label: "Espinoza 2026 — fasting-mimicking diet and autophagy markers in humans", url: "https://pubmed.ncbi.nlm.nih.gov/41372565/" },
        { n: 6, label: "Sutton 2018, Cell Metabolism — early time-restricted feeding in prediabetes", url: "https://pubmed.ncbi.nlm.nih.gov/29754952/" }
      ],
      related: ["fasting", "fasting-claims", "appetite"]
    },

    /* ============================================================= 2. REFEED */
    {
      id: "refeed",
      label: "Refeed",
      kicker: "Breaking the fast",
      title: "What to eat when the fast ends",
      lede:
        "Most \"how to break a fast\" advice is either harmless ritual or borrowed from hospital care " +
        "for starving patients. Both are wrong for you. Here is what actually matters, and what to skip.",
      hero: "guide-refeed-plate",
      heroAlt: "A plate of boiled eggs, cooked greens and a bowl of lentil soup with a glass of water",
      facts: [
        ["Water first", "then soup, then protein and vegetables, then starch"],
        ["20 min", "the slowest you should eat your first meal"],
        ["0", "special products you need to buy"]
      ],
      blocks: [
        { t: "h", text: "First, work out which situation you are in" },
        { t: "table",
          head: ["Situation", "What it means", "What to do"],
          rows: [
            ["Normal fast, 12–24 h, healthy", "A normal day with a late first meal", "No special rules. Eat a normal meal, slowly."],
            ["Long fast, 36 h or more", "Real but modest stress on the body", "Small gentle meals, salt if you sweated, no hard training after."],
            ["Medical risk", "Very low weight, more than 5 days of almost no food, eating disorder, heavy alcohol use, cancer, recent surgery", "This is medical care, not a diet decision. Get help."]
          ]},

        { t: "callout", kind: "warn", title: "The hospital story, briefly",
          text: "Refeeding syndrome is real and it can be fatal [[1]]. It happens when a badly " +
                "malnourished person is fed carbohydrate too quickly: insulin pushes phosphate, potassium " +
                "and magnesium into cells and the heart can fail. It has never been reported from a " +
                "16-hour fast in a well-fed adult. If you skipped breakfast, you are not that patient." },

        { t: "h", text: "The order that works for almost everyone" },
        { t: "steps", items: [
          "**Water**, 300–500 ml, before any food.",
          "**Soup or broth**, one mug, sipped. Warm, salty and low in calories.",
          "**Protein and cooked vegetables** — eggs, chicken, fish, lentils.",
          "**Starch last** — potato, rice, bread.",
          "**Fruit** at the end, not as the whole meal."
        ]},

        { t: "h", text: "How much on the first plate" },
        { t: "table",
          head: ["Fast length", "First plate", "Wait before more"],
          rows: [
            ["12–16 h", "A normal meal, 400–700 kcal", "No wait"],
            ["18–20 h", "400–600 kcal", "10–15 minutes"],
            ["24 h", "300–450 kcal", "30–60 minutes, then a normal meal"],
            ["36–48 h", "300–400 kcal", "1–2 hours, then a second small meal"],
            ["72 h or more", "Medical supervision", "Do not do this alone"]
          ]},

        { t: "h", text: "Eat this, skip this" },
        { t: "do",
          good: ["Eggs", "Chicken, fish, lean meat", "Broth or soup", "Plain yoghurt", "Lentils and beans", "Potato", "Cooked vegetables", "Oats without sweet toppings"],
          bad: ["Fried food and pastries", "Sweet tea or soft drinks", "Dates and nuts as the whole meal", "Large plates of rice", "Very spicy food after a long fast", "Coffee on an empty stomach if you get reflux"] },

        { t: "img", id: "guide-refeed-avoid",
          caption: "Fried pastry and sweet tea. Calories arrive long before fullness does." },

        { t: "p", text:
          "The order is not superstition. Soup before a meal lowers how much you eat at that meal [[2]]. " +
          "Eating vegetables before starch blunts the blood-sugar spike [[3]]. And eating fast makes you " +
          "eat more — the post-fast meal is exactly when people eat fastest [[4]]." },

        { t: "h", text: "The real failure is not salt or electrolytes" },
        { t: "p", text:
          "It is the binge. The pattern is: restrict, get very hungry, eat fast and a lot, feel guilty, " +
          "restrict harder. Each round makes the next one worse. If that sounds familiar, the answer " +
          "is a shorter fast, not more discipline." },
        { t: "list", items: [
          "Eating until uncomfortable after every fast.",
          "Eating in secret, or feeling unable to stop once you start.",
          "Guilt, or \"making up for it\" with another fast.",
          "Weight swinging while your food rules get stricter."
        ]},
        { t: "callout", kind: "tip", title: "Five habits that prevent it",
          text: "1) Decide the meal before you fast. 2) Cook it before you break the fast. 3) Sit at a " +
                "table, no phone, 20 minutes, use a spoon. 4) If you are still hungry, wait 20 minutes, " +
                "then eat protein — not sweets. 5) Never earn food with a fast or punish eating with one." },

        { t: "h", text: "Cheap breaks, local ingredients" },
        { t: "table",
          head: ["Meal", "What's in it", "Rough kcal", "Protein"],
          rows: [
            ["Broth, eggs and tomato", "300 ml broth, 2 eggs, 200 g cooked tomato and onion", "~300", "15 g"],
            ["Chicken, cabbage, potato", "120 g chicken, 300 g cabbage, 150 g potato", "~420", "40 g"],
            ["Lentil soup and bread", "250 g cooked lentils, 1 small bread, 1 tsp oil", "~450", "24 g"],
            ["Fish, okra and a little rice", "150 g fish, 200 g okra, 120 g cooked rice", "~400", "35 g"],
            ["Yoghurt, banana, oats", "150 g yoghurt, 1 banana, 30 g oats", "~330", "14 g"]
          ],
          note: "Egg prices are estimated. Dry lentil prices vary too much locally to quote." },

        { t: "h", text: "What you do not need to buy" },
        { t: "list", items: [
          "\"Fast-breaking\" powders and amino acid blends.",
          "Digestive enzymes and probiotics for breaking a fast.",
          "Bottled bone broth — a pot of bones and an onion does the same job.",
          "\"Post-fast collagen\" and staged multi-hour rituals.",
          "Electrolyte packets on top of a normal diet. A pinch of salt in water is enough if you sweated."
        ]}
      ],
      refs: [
        { n: 1, label: "Mehanna 2008, BMJ — refeeding syndrome: what it is and how to prevent it", url: "https://pubmed.ncbi.nlm.nih.gov/18583681/" },
        { n: 2, label: "Flood & Rolls 2007 — soup preloads reduce meal energy intake", url: "https://pubmed.ncbi.nlm.nih.gov/17574705/" },
        { n: 3, label: "Choi 2026 — vegetable-first meal order and post-meal glucose", url: "https://pubmed.ncbi.nlm.nih.gov/42608327/" },
        { n: 4, label: "Forde 2026 — eating rate and how much people eat", url: "https://pubmed.ncbi.nlm.nih.gov/41314613/" }
      ],
      related: ["fasting", "meal-templates", "shopping"]
    },

    /* ============================================== 3. INSULIN & DIABETES */
    {
      id: "insulin",
      label: "Insulin & diabetes",
      kicker: "Blood sugar",
      title: "Insulin resistance and type 2 diabetes",
      lede:
        "This is the part that changes lives. Insulin resistance builds quietly for years, and for many " +
        "men it can be pushed back — not with a miracle, but with weight loss, muscle and time.",
      hero: "guide-glucose",
      heroAlt: "A blood glucose meter, lancet pen and a handwritten log book on a wooden table",
      facts: [
        ["58%", "lower diabetes risk with diet and activity (DPP trial)"],
        ["46%", "in remission after one year (DiRECT trial)"],
        ["15 kg", "the loss that gave 86 in 100 a remission"]
      ],
      blocks: [
        { t: "h", text: "What insulin does, in one paragraph" },
        { t: "p", text:
          "Insulin is the key that lets sugar out of your blood and into your cells. **Insulin resistance** " +
          "means the locks have gone stiff, so the key turns badly. Your body makes more and more insulin " +
          "to force the same job through. That works for years. Then the pancreas tires, blood sugar " +
          "starts to creep up, and eventually the doctor writes **prediabetes** or **type 2 diabetes** " +
          "on the paper. Fat around the waist and inside the liver is what stiffens the locks." },

        { t: "h", text: "The numbers worth knowing" },
        { t: "table",
          head: ["Test", "Normal", "Prediabetes", "Diabetes"],
          rows: [
            ["HbA1c (3-month average sugar)", "under 5.7%", "5.7–6.4%", "6.5% or more"],
            ["Fasting blood sugar", "under 5.6 mmol/L", "5.6–6.9 mmol/L", "7.0 mmol/L or more"],
            ["Waist, men", "under 94 cm", "94–102 cm", "over 102 cm (risk keeps rising)"]
          ],
          note: "Cut-offs differ slightly between countries; your lab prints its own range. HbA1c is a " +
                "blood test showing your average blood sugar over about three months." },

        { t: "img", id: "guide-walk",
          caption: "A ten-minute walk after eating is the cheapest blood-sugar tool there is." },

        { t: "h", text: "What actually improves it" },
        { t: "table",
          head: ["Action", "What it does", "How strong"],
          rows: [
            ["Lose weight, especially around the waist", "The biggest effect. Liver and muscle fat fall first, and the locks loosen.", "High"],
            ["Strength training 2–3× a week", "Muscle is a sugar store. In men, exercise-led weight loss beat diet-led weight loss for visceral fat and insulin sensitivity [[1]].", "Moderate"],
            ["Walk 10 minutes after meals", "Lowers the after-meal sugar spike [[2]].", "Moderate"],
            ["More fibre — lentils, oats, vegetables", "Slows how fast sugar gets in.", "Moderate"],
            ["Vegetables and protein before starch", "Smaller spike from the same meal [[3]].", "Moderate"],
            ["Sleep 7–8 hours", "Short sleep measurably worsens insulin sensitivity.", "Moderate"],
            ["Fewer sweet drinks", "Liquid sugar arrives fast and does not fill you.", "High"]
          ]},

        { t: "h", text: "Preventing type 2 diabetes" },
        { t: "p", text:
          "In the Diabetes Prevention Program, a diet-and-activity programme cut new cases of type 2 " +
          "diabetes by **58%**, and the tablet metformin cut them by 31% [[4]]. The people in that " +
          "programme did not become athletes. They lost a modest amount of weight, moved more, and kept " +
          "some of it off. Partial success was worth an enormous amount." },

        { t: "h", text: "Can type 2 diabetes be reversed?" },
        { t: "p", text:
          "**Sometimes, yes** — for people with type 2 diabetes, a body mass index in the 27–45 range and " +
          "not too many years since diagnosis. In the DiRECT trial, 46 out of 100 people were in " +
          "**remission** after one year on a supervised low-calorie programme, against 4 out of 100 in " +
          "usual care [[5]]. After two years, 36 out of 100 were still in remission [[6]]. Remission " +
          "means an HbA1c under 6.5% with no diabetes tablets for at least two months." },
        { t: "p", text:
          "The chance of remission rose steadily with the amount of weight lost, which is the single " +
          "most useful fact on this page [[5]]:" },
        { t: "table",
          head: ["Weight lost", "Who went into remission"],
          rows: [
            ["Gained weight", "0 out of 76"],
            ["Kept off 0–5 kg", "7 out of 100"],
            ["Kept off 5–10 kg", "34 out of 100"],
            ["Kept off 10–15 kg", "57 out of 100"],
            ["Kept off 15 kg or more", "86 out of 100"]
          ],
          note: "Same trial, same year, grouped by how much weight each person lost. Remission was " +
                "defined as HbA1c under 6.5% with no diabetes medication for at least two months." },
        { t: "p", text:
          "So \"reverse diabetes\" is not one decision — it is a slope. Losing 5 kg already helps a " +
          "little; losing 15 kg changes the odds completely. And the people who kept the weight off " +
          "were the ones still in remission two years later [[6]]." },
        { t: "callout", kind: "warn", title: "Do not copy a trial at home",
          text: "In DiRECT, diabetes and blood pressure drugs were stopped only under medical supervision, " +
                "and participants were monitored. Stopping diabetes medication on your own, or combining " +
                "it with fasting, can drop your blood sugar to a dangerous level. Do this with a doctor." },

        { t: "h", text: "If you have diabetes and want to fast" },
        { t: "list", items: [
          "Speak to your doctor before the first skipped meal.",
          "Insulin and sulfonylureas (for example gliclazide) can cause low blood sugar when you skip food. This is the main danger.",
          "Check your blood sugar more often than usual, and keep fast-acting glucose — not chocolate — with you.",
          "Stop and eat if you feel shaky, sweaty, confused or unusually hungry.",
          "Do not do long fasts, and never alone.",
          "Your eyes, kidneys and feet need checking too; good sugar control protects them."
        ]},

        { t: "h", text: "What does not help" },
        { t: "list", items: [
          "Cinnamon, bitter melon, apple cider vinegar or \"insulin detox\" claims as treatment.",
          "Wearing a continuous glucose monitor without changing anything in response.",
          "Waiting for symptoms. High blood sugar is silent for years — that is the whole problem.",
          "Cutting carbohydrates to zero instead of cutting the sweet drinks and the waist."
        ]}
      ],
      refs: [
        { n: 1, label: "Ross 2000, Annals of Internal Medicine — diet- vs exercise-induced weight loss in men", url: "https://pubmed.ncbi.nlm.nih.gov/10896648/" },
        { n: 2, label: "Buffey 2022, Sports Med — breaking up sitting with light walking and post-meal glucose", url: "https://pubmed.ncbi.nlm.nih.gov/35147898/" },
        { n: 3, label: "Choi 2026 — vegetable-first meal order and post-meal glucose", url: "https://pubmed.ncbi.nlm.nih.gov/42608327/" },
        { n: 4, label: "Knowler 2002, NEJM — Diabetes Prevention Program", url: "https://pubmed.ncbi.nlm.nih.gov/11832527/" },
        { n: 5, label: "Lean 2018, Lancet — DiRECT, remission of type 2 diabetes at 12 months", url: "https://pubmed.ncbi.nlm.nih.gov/29221645/" },
        { n: 6, label: "Lean 2019, Lancet Diabetes & Endocrinology — DiRECT 2-year results", url: "https://pubmed.ncbi.nlm.nih.gov/30852132/" }
      ],
      related: ["bloodwork", "appetite", "maintenance"]
    },

    /* =========================================================== 4. BASELINE */
    {
      id: "baseline",
      label: "Make it stick",
      kicker: "Your default week",
      title: "Making it your baseline",
      lede:
        "Anyone can fast for a week. The men who change shape are the ones who turn it into an ordinary " +
        "Tuesday. This page is the smallest set of rules that keeps fat coming off without drama.",
      hero: "guide-strength",
      heroAlt: "Resistance bands, a dumbbell and a rolled exercise mat on a wooden floor",
      facts: [
        ["10 h", "eating window, nothing after 8pm"],
        ["1.4 g", "protein per kg of body weight, per day"],
        ["2–3", "strength sessions a week"],
        ["7–8 h", "sleep a night"]
      ],
      blocks: [
        { t: "h", text: "Pick the smallest rule you can keep" },
        { t: "p", text:
          "One rule is enough to start: **eat your meals inside a 10-hour window and eat nothing after " +
          "8pm.** No counting, no app. Two protein-anchored meals and one snack, water in between. " +
          "That is a 14:10 fast that doubles as a sleep rule, and it is the version most people can " +
          "still be doing a year from now." },

        { t: "h", text: "The default day" },
        { t: "table",
          head: ["Time", "What happens"],
          rows: [
            ["07:00", "Wake. 300–500 ml of water. Coffee or tea if you like it."],
            ["08:00", "10-minute walk, before or after breakfast."],
            ["10:00", "First meal: protein, vegetables, then starch. Not a pastry."],
            ["13:00", "Lunch. Then another 10-minute walk."],
            ["17:00–18:00", "Last meal. Protein again — this is the meal people under-eat."],
            ["18:30", "10–15 minutes of walking. This is when the day's steps get finished."],
            ["21:00", "Water or plain tea only."],
            ["22:30", "Lights out. Sleep is the cheapest fat-loss tool you own."]
          ]},

        { t: "h", text: "The plate rule" },
        { t: "img", id: "meal-lunch-chicken-rice",
          caption: "Protein, vegetables, starch, water. This is the plate rule in one photo." },
        { t: "list", items: [
          "**Half the plate: vegetables.** Cooked is gentler on the stomach than a mountain of raw.",
          "**A palm-sized piece of protein.** Eggs, chicken, fish, lentils, yoghurt.",
          "**A fist of starch.** Potato, rice, bread, oats.",
          "**A thumb of fat.** Oil, nuts, avocado.",
          "**Water to drink.** Sweet drinks are the easiest calories to remove from your life."
        ]},

        { t: "h", text: "Protein, in plain numbers" },
        { t: "table",
          head: ["Body weight", "Protein a day", "What that looks like"],
          rows: [
            ["70 kg", "100 g", "3 eggs, 200 g yoghurt, 150 g chicken, 150 g lentils"],
            ["80 kg", "112 g", "3 eggs, 250 g yoghurt, 180 g chicken, 200 g lentils"],
            ["90 kg", "126 g", "4 eggs, 250 g yoghurt, 200 g chicken, 200 g lentils"],
            ["100 kg", "140 g", "4 eggs, 300 g yoghurt, 220 g chicken, 250 g lentils"]
          ],
          note: "Protein is what keeps you full and keeps muscle while you eat less. It is the one " +
                "number worth learning." },

        { t: "h", text: "The part everyone skips: muscle" },
        { t: "p", text:
          "Two or three 30-minute sessions a week. Push-ups, pull-ups, bands, a heavy bag, some " +
          "dumbbells — whatever you will actually do. Muscle is where sugar goes, it keeps your daily " +
          "energy use up, and it is what makes a leaner body look strong instead of thin [[1]]." },

        { t: "h", text: "Sleep is part of the plan, not a luxury" },
        { t: "p", text:
          "With the same food and the same activity, sleeping 5.5 hours instead of 8.5 hours shifted " +
          "weight loss away from fat and towards muscle [[2]]. In a separate trial, simply extending " +
          "sleep cut how much people ate by about 270 kcal a day without any diet instruction [[3]]." },

        { t: "h", text: "The weekly rhythm" },
        { t: "list", items: [
          "Five normal days on the default day above.",
          "Two days with a slightly longer fast (16:8) if you like the rhythm — optional.",
          "At most one 24-hour fast a week, and only after a month of consistency.",
          "Never two long fasts back to back. Never a long fast before a hard training day."
        ]},

        { t: "h", text: "When the scale stops moving" },
        { t: "steps", items: [
          "Compare two-week averages, not two single days. Water and salt move weight by 1–2 kg.",
          "Measure your waist and take a photo in the same light.",
          "Check protein first. Under-eating protein is the most common silent mistake.",
          "Check steps and sleep before you touch calories.",
          "Only then tighten one thing — not everything at once."
        ]},

        { t: "callout", kind: "key", title: "The 2 kg rule",
          text: "Weigh yourself daily and use the weekly average. If you are 2 kg above your usual range " +
                "for two weeks, go back to the default day for two weeks. That single written rule is " +
                "what separates people who keep the weight off from people who regain it [[4]]." },

        { t: "table",
          head: ["Track this", "Ignore this"],
          rows: [
            ["Weekly average weight", "Day-to-day weight swings"],
            ["Waist measurement", "Body-fat scales"],
            ["Blood pressure and HbA1c once a year", "\"Biological age\" tests"],
            ["How much you can lift or how many reps", "Ketone strips"],
            ["Sleep hours and steps", "Calories burned on a watch"]
          ]}
      ],
      refs: [
        { n: 1, label: "Momma 2022, Br J Sports Med — muscle-strengthening activity and mortality", url: "https://pubmed.ncbi.nlm.nih.gov/35228201/" },
        { n: 2, label: "Nedeltcheva 2010 — short sleep shifts weight loss from fat to lean mass", url: "https://pubmed.ncbi.nlm.nih.gov/20921542/" },
        { n: 3, label: "Tasali 2022, JAMA Internal Medicine — sleep extension reduced energy intake", url: "https://pubmed.ncbi.nlm.nih.gov/35129580/" },
        { n: 4, label: "Look AHEAD 2014 — eight-year weight losses with continued support", url: "https://pubmed.ncbi.nlm.nih.gov/24307184/" }
      ],
      related: ["maintenance", "regain", "exercise-neat"]
    },

    /* ========================================================= 5. ANTI-AGING */
    {
      id: "antiaging",
      label: "Anti-ageing",
      kicker: "Longevity",
      title: "Slowing ageing: what actually works",
      lede:
        "No pill has been shown to make healthy people live longer. A handful of free habits clearly do, " +
        "and most of the expensive shelf does nothing except lighten your wallet.",
      hero: "guide-aging-active",
      heroAlt: "A fit man in his sixties jogging on a park path in early morning light",
      facts: [
        ["13%", "lower death risk for each point of fitness gained"],
        ["10–17%", "lower death risk from regular strength training"],
        ["0", "supplements proven to extend human life"]
      ],
      blocks: [
        { t: "h", text: "What ageing actually is" },
        { t: "p", text:
          "Forget the word \"longevity\" for a minute. In your body, ageing is four slow, boring losses " +
          "that all start in your thirties and all get faster if you sit still." },
        { t: "list", items: [
          "**Muscle.** You lose about 3–8% of your muscle every decade after 30, and faster after 50. " +
          "This is why old age looks like frailty — it is mostly unused muscle going away.",
          "**Fitness.** Your top aerobic capacity falls roughly 1% a year if you do nothing. It is the " +
          "strongest single predictor of dying early that you can change.",
          "**Collagen.** The scaffolding under your skin thins and gets damaged by sun, so skin sags and " +
          "wrinkles. Sunscreen is the only thing proven to slow it.",
          "**Repair.** Cells clear damaged proteins less well. No pill has been shown to fix this in " +
          "healthy people, which is why every honest longevity answer ends up back at exercise, food and sleep."
        ]},
        { t: "p", text:
          "The good news is that all four are trainable. A 60-year-old who lifts and walks can be fitter " +
          "than a 40-year-old who does neither. \"Anti-ageing\" mostly means refusing the decline, not " +
          "reversing the clock." },

        { t: "h", text: "The five that matter" },
        { t: "table",
          head: ["Habit", "What it buys you", "Evidence"],
          rows: [
            ["Don't smoke", "The single largest drop in early death there is", "High"],
            ["Stay fit — walk, cycle, play sport", "Each 1-point rise in fitness is about 13% lower risk of dying early [[1]]", "High"],
            ["Keep blood pressure normal", "Fewer strokes, heart attacks and kidney damage", "High"],
            ["Keep your waist down", "Less diabetes, heart disease and joint pain", "High"],
            ["Strength train twice a week", "10–17% lower death risk, plus muscle that keeps you independent [[2]]", "Moderate–High"]
          ]},
        { t: "p", text:
          "Add sleep, careful alcohol, fibre and vegetables, sun protection, and the screening your " +
          "doctor recommends. That list is unglamorous and it is the entire evidence base for living " +
          "longer." },

        { t: "img", id: "guide-walk",
          caption: "Fitness is the most under-rated longevity habit — and it is free." },

        { t: "h", text: "The shelf, graded honestly" },
        { t: "table",
          head: ["What it is", "Verdict", "Why"],
          rows: [
            ["Creatine", "Worth it", "More strength and muscle with training. Not a longevity drug."],
            ["Vitamin D", "Only if you are low", "Corrects a deficiency. No mortality benefit in people who are not deficient [[3]]."],
            ["Omega-3 (fish oil)", "Only if you don't eat fish", "No heart benefit in generally healthy adults in VITAL [[4]]. Eat fish twice a week instead."],
            ["Fibre / psyllium", "Cheap and useful", "Fullness, cholesterol, blood sugar."],
            ["Sunscreen and a retinoid", "Worth it", "The only skincare with randomised evidence against visible ageing [[5]]."],
            ["NMN, NR (\"NAD boosters\")", "Skip", "Raise a blood marker. No trial shows a health outcome."],
            ["Resveratrol", "Skip", "No benefit in older adults; possible harm at high doses."],
            ["Spermidine", "Skip", "Barely moves blood levels in people."],
            ["Taurine", "Skip", "Lifespan data from mice and monkeys only."],
            ["Metformin", "Only with a doctor, if prediabetic", "31% less progression to diabetes [[6]]. Not a longevity drug for healthy people."],
            ["Rapamycin, growth hormone, \"peptides\"", "Avoid", "Real harms, no human outcome data."],
            ["Hyperbaric oxygen, young plasma, exosomes", "Avoid", "Very expensive, unproven, sometimes dangerous."],
            ["Telomere or \"biological age\" tests", "Skip", "A number that does not tell you what to do."]
          ]},

        { t: "callout", kind: "key", title: "The four questions to ask any product",
          text: "1) Does it change a marker? 2) Does it work in mice? 3) Does it improve a real human " +
                "outcome? 4) Does it help people live longer? Almost everything on the shelf passes the " +
                "first two and fails the last two." },

        { t: "h", text: "A week you can copy" },
        { t: "table",
          head: ["When", "What to do", "Time"],
          rows: [
            ["Every day", "Walk 7,000+ steps, sun protection, protein at every meal", "Free"],
            ["2–3 times a week", "Strength training — 6 to 8 hard sets per body part", "30–40 min"],
            ["1–2 times a week", "Something that leaves you out of breath: hills, sprints, sport", "20–30 min"],
            ["Every night", "7–8 hours in a dark room, last coffee before 2 pm", "Free"],
            ["Every year", "Blood pressure, waist, HbA1c, cholesterol — know your own numbers", "One visit"]
          ],
          note: "Nothing on this list costs money. Everything on it has human trial evidence behind it." },

        { t: "h", text: "What ageing well actually looks like" },
        { t: "list", items: [
          "Strong at sixty, not just slim at forty.",
          "A waist under 94 cm and blood pressure under 130/80.",
          "Sleeping seven or eight hours without tablets.",
          "Teeth in good repair — chewing and smiling are quality of life.",
          "Skin protected from the sun rather than repaired afterwards.",
          "Something you do three times a week that makes you breathe hard."
        ]},

        { t: "h", text: "If you want to spend money, spend it in this order" },
        { t: "steps", items: [
          "A yearly check: blood pressure, HbA1c, lipids, and a conversation with a doctor.",
          "Shoes you can walk in.",
          "Resistance bands or a gym session you will actually attend.",
          "Creatine monohydrate, about $0.16–0.22 a day.",
          "Sunscreen and a retinoid.",
          "Vitamin D only if a blood test shows you are low.",
          "Fish twice a week, or fish oil if you never eat it."
        ]}
      ],
      refs: [
        { n: 1, label: "Kodama 2009, JAMA — cardiorespiratory fitness and mortality", url: "https://pubmed.ncbi.nlm.nih.gov/19454641/" },
        { n: 2, label: "Momma 2022, Br J Sports Med — muscle-strengthening activity and mortality", url: "https://pubmed.ncbi.nlm.nih.gov/35228201/" },
        { n: 3, label: "Manson 2019, NEJM — VITAL vitamin D", url: "https://pubmed.ncbi.nlm.nih.gov/30415629/" },
        { n: 4, label: "Manson 2019, NEJM — VITAL omega-3", url: "https://pubmed.ncbi.nlm.nih.gov/30415637/" },
        { n: 5, label: "Hughes 2013, Annals of Internal Medicine — daily sunscreen and skin ageing", url: "https://pubmed.ncbi.nlm.nih.gov/23732711/" },
        { n: 6, label: "Knowler 2002, NEJM — Diabetes Prevention Program", url: "https://pubmed.ncbi.nlm.nih.gov/11832527/" }
      ],
      related: ["anti-aging", "longevity-table", "mens-health"]
    },

    /* ======================================================= 6. LOOK YOUNGER */
    {
      id: "younger",
      label: "Look younger",
      kicker: "Face and hair",
      title: "Looking younger, honestly",
      lede:
        "Your face reads \"older\" for a few boring reasons: sun, smoke, sleep, body fat, teeth, posture " +
        "and hair. Each one has a cheap fix and an expensive useless one.",
      hero: "guide-grooming",
      heroAlt: "A beard trimmer, comb and folded towel on a bathroom counter",
      facts: [
        ["Daily", "sunscreen: the one product with randomised evidence"],
        ["6–12 m", "before a retinoid shows a visible difference"],
        ["Early", "hair treatment works best in the first years of thinning"]
      ],
      blocks: [
        { t: "h", text: "Skin: two products and one habit" },
        { t: "list", items: [
          "**Sunscreen every day**, even when it is cloudy. In a randomised trial, daily use slowed skin ageing over four years [[1]]. This is the strongest evidence in skincare, and it costs almost nothing.",
          "**A retinoid at night.** Tretinoin or retinol reduces fine lines and uneven tone over months [[2]]. Start twice a week, use a pea-sized amount, expect some dryness.",
          "**Don't smoke.** It ages skin faster than the sun does.",
          "**Sleep and water.** Puffiness and dullness are mostly sleep and salt."
        ]},
        { t: "img", id: "guide-sunscreen",
          caption: "The cheapest anti-ageing product ever tested is on a shelf, not in an advert." },
        { t: "p", text:
          "Skip: LED masks, microcurrent gadgets, collagen drinks, \"stem cell\" creams and anything sold " +
          "with a before-and-after photo of one person. The evidence is thin, short, or paid for by the " +
          "company selling the product." },

        { t: "h", text: "Hair: act early, expect modest" },
        { t: "p", text:
          "Male pattern hair loss is common and mostly inherited. Two treatments actually hold ground: " +
          "**minoxidil 5% foam or solution** [[3]] and **finasteride 1 mg, by prescription** [[4]]. Both " +
          "work best in the early years of thinning, both take six months to judge, and both must be " +
          "continued — stop and you lose what you gained." },
        { t: "callout", kind: "warn", title: "Before you start",
          text: "Finasteride causes sexual and mood side effects in a minority of men and must not be " +
                "handled by anyone pregnant. Minoxidil is highly toxic to cats. Talk to a pharmacist or " +
                "doctor, and do not buy these from unknown sellers." },

        { t: "h", text: "Teeth, beard and nails: the cheapest upgrade" },
        { t: "list", items: [
          "Brush twice a day, floss, and get a professional clean once a year. Yellow teeth age a face instantly.",
          "Trim your beard and neckline once a week. A neat edge is most of the difference.",
          "Clean nails, deodorant, a haircut that suits your hairline rather than fighting it.",
          "Fresh breath matters more than any of it in a conversation."
        ]},

        { t: "h", text: "Posture and clothes" },
        { t: "list", items: [
          "Stand tall: shoulders back, chin level. It changes how you are read in a room.",
          "Clothes that fit at the shoulder and end at the right place on the wrist and ankle.",
          "Fewer, better, cleaner. One good pair of shoes beats five worn ones.",
          "Dark, plain colours photograph well and hide creases."
        ]},

        { t: "h", text: "The whole routine, in one table" },
        { t: "table",
          head: ["When", "What", "Why"],
          rows: [
            ["Morning", "Sunscreen SPF 30+ on face, neck and hands", "The only proven anti-wrinkle step [[1]]"],
            ["Night", "Retinoid, thin layer, every other night at first", "Smooths fine lines over 6–12 months [[2]]"],
            ["Night", "Moisturiser if skin feels tight", "Comfort and flaking control, not anti-ageing"],
            ["Daily", "Minoxidil 5% on thinning areas, forever", "Keeps what you have; stops when you stop [[3]]"],
            ["Daily", "Brush, floss, whiten once", "Teeth age a face faster than skin does"],
            ["Weekly", "Weigh yourself, check waist, sleep 7–8 h", "The body you carry is the biggest visual lever"]
          ],
          note: "Talk to a doctor before finasteride, and never start it hoping for a quick fix — it takes 6–12 months to judge." },

        { t: "h", text: "The biggest lever is body composition" },
        { t: "p", text:
          "A leaner face, a smaller waist and some muscle on the shoulders change how old you look more " +
          "than any cream. That is what the fasting, refeed, food and baseline pages in this app are for." },

        { t: "table",
          head: ["When", "What actually changes"],
          rows: [
            ["2 weeks", "Less bloating, better sleep, a less puffy face"],
            ["8 weeks", "Waist smaller, clothes fit properly, skin looks brighter"],
            ["6 months", "Visible fat loss, muscle shape, first honest hair result"],
            ["1 year", "Skin ageing measurably slower (sunscreen), hair stable if treated early"]
          ]}
      ],
      refs: [
        { n: 1, label: "Hughes 2013, Annals of Internal Medicine — sunscreen and prevention of skin ageing", url: "https://pubmed.ncbi.nlm.nih.gov/23732711/" },
        { n: 2, label: "McDaniel 2017 — retinoid cream versus retinol and tretinoin", url: "https://pubmed.ncbi.nlm.nih.gov/28762645/" },
        { n: 3, label: "Olsen 2002 — 5% topical minoxidil in male pattern hair loss", url: "https://pubmed.ncbi.nlm.nih.gov/12196747/" },
        { n: 4, label: "Kaufman 1998 — finasteride in male pattern hair loss", url: "https://pubmed.ncbi.nlm.nih.gov/9777765/" }
      ],
      related: ["skincare", "hair", "grooming"]
    }
  ]
};

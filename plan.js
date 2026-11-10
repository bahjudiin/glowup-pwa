/* GlowUp blueprint — the step-by-step plan behind the app.
   Hand-written, plain English, grounded in the same research as guides.js.
   Everything here is *structure*: phases, steps, the daily check, weekly tasks
   and the product kit (which points at real ids in data.js, never new prices).
   ------------------------------------------------------------------------- */
window.GLOWUP_PLAN = {
  version: 1,

  intro:
    "Four phases, sixteen weeks, six things to tick each day. Nothing here is a trick: " +
    "it is the smallest set of habits that actually moves weight, muscle and blood sugar.",

  /* Shown on the Today screen. Six is the limit — longer checklists get abandoned. */
  dailyCheck: [
    { id: "protein", label: "Protein at every meal", hint: "1.6 g per kg of body weight across the day", link: { type: "guide", id: "baseline" } },
    { id: "window", label: "Stayed inside the eating window", hint: "No grazing outside it — water, black coffee and plain tea are fine", link: { type: "guide", id: "fasting" } },
    { id: "steps", label: "7,000 steps", hint: "Two short walks count. Walking after meals blunts the sugar spike", link: { type: "guide", id: "insulin" } },
    { id: "strength", label: "Strength or hard effort", hint: "2–3 sessions a week; on other days this counts as rest", link: { type: "guide", id: "baseline" } },
    { id: "sleep", label: "7–8 hours in bed", hint: "Last coffee before 2 pm, dark room, same wake-up time", link: { type: "guide", id: "antiaging" } },
    { id: "fibre", label: "Fibre and water", hint: "25–29 g fibre; 3–5 g psyllium in 300 ml water once a day", link: { type: "article", id: "fibre" } }
  ],

  /* One-time setup, ticked once and never again */
  setup: [
    { id: "weigh", title: "Weigh yourself and write it down", detail: "Same time, same clothes, after the toilet. You will use the weekly average, not one reading." },
    { id: "waist", title: "Measure your waist", detail: "At the navel, relaxed, after breathing out. This is the number that tracks fat loss better than the scale." },
    { id: "photo", title: "Take two photos", detail: "Front and side, same light, same spot. Monthly, not weekly." },
    { id: "bp", title: "Know your blood pressure", detail: "A pharmacy or a home cuff. High blood pressure changes what you are allowed to do." },
    { id: "bloods", title: "Ask for HbA1c and a lipid panel", detail: "Especially if your waist is over 100 cm or you have a family history of diabetes. One test sets your baseline." }
  ],

  phases: [
    {
      id: "baseline",
      n: 1,
      weeks: "Weeks 1–2",
      title: "Set the baseline",
      tagline: "Measure first, then change one thing.",
      goal:
        "Change nothing except the eating window: 12 hours off, 12 hours on. " +
        "Everything else is measurement, so that in eight weeks you can tell what actually worked.",
      steps: [
        { id: "p1-s1", title: "Pick a 12-hour eating window", detail: "For example 8 am to 8 pm, or 9 am to 9 pm. It has to fit your life, not the other way round." },
        { id: "p1-s2", title: "Write your starting numbers", detail: "Weight, waist, blood pressure if you have a cuff, and how many steps you take on a normal day." },
        { id: "p1-s3", title: "Set the protein target", detail: "Multiply your body weight in kg by 1.6 — that is your daily protein in grams. A 90 kg man: about 145 g." },
        { id: "p1-s4", title: "Walk 7,000 steps on four days", detail: "Not a workout. Two 20-minute walks, ideally one after your biggest meal." },
        { id: "p1-s5", title: "Fix the sleep window", detail: "Same wake-up time every day, including weekends. That single habit makes the rest easier." }
      ],
      daily: ["window", "steps", "sleep"],
      weekly: [
        { id: "p1-w1", title: "Weigh yourself 3 mornings and average them", detail: "One reading is noise. The average is the signal." },
        { id: "p1-w2", title: "Check the eating window held 5 days out of 7", detail: "If it did not, shorten it to 11:13 rather than abandoning it." }
      ],
      reading: [{ type: "guide", id: "fasting" }, { type: "article", id: "fast-fat-loss" }],
      kit: [
        { id: "bathroom-scale-or-none-use-weekly-average-at-a-pharmacy", why: "Weekly average, not daily obsession" },
        { id: "walking-shoes", why: "The cheapest mortality drug there is" }
      ],
      doneWhen: "You have two weeks of morning weights and you stayed inside a 12-hour window most days.",
      warn: "If you take insulin or a sulfonylurea, do not extend a fast without your doctor. Blood sugar can drop too far."
    },
    {
      id: "fatloss",
      n: 2,
      weeks: "Weeks 3–8",
      title: "Lose fat, keep muscle",
      tagline: "0.5–1% of body weight per week and no faster.",
      goal:
        "Now the work starts: a slightly shorter window, protein high, fibre high, and two or three " +
        "strength sessions a week so the weight you lose is fat and not muscle.",
      steps: [
        { id: "p2-s1", title: "Move to a 14:10 window", detail: "14 hours off, 10 hours eating. If that is easy after two weeks, try 16:8 — but only if you sleep well on it." },
        { id: "p2-s2", title: "Hit protein before anything else", detail: "Build every meal around eggs, chicken, fish, yoghurt, lentils or beans. Protein first, starch last." },
        { id: "p2-s3", title: "Add fibre at your hungriest meal", detail: "3–5 g psyllium in 300 ml water, 20 minutes before the meal you tend to overeat." },
        { id: "p2-s4", title: "Start strength training — properly", detail: "Two sessions a week, 6–8 hard sets per body part. Squat, hinge, push, pull, carry. Bands and a doorway bar are enough." },
        { id: "p2-s5", title: "Keep the loss between 0.5% and 1% of body weight a week", detail: "Faster than that costs muscle, sleep and hair. Slower is fine — you are not in a race." }
      ],
      daily: ["protein", "window", "steps", "strength", "sleep", "fibre"],
      weekly: [
        { id: "p2-w1", title: "Two strength sessions, written down", detail: "Same movements each week so you can add a little weight or a rep." },
        { id: "p2-w2", title: "Weekly average weight down 0.5–1%", detail: "If it has not moved in three weeks, tighten the window before cutting food further." },
        { id: "p2-w3", title: "One refeed day at maintenance", detail: "Not a binge: normal portions, more starch, eaten slowly." }
      ],
      reading: [{ type: "guide", id: "refeed" }, { type: "article", id: "protein" }, { type: "article", id: "fibre" }],
      kit: [
        { id: "now-foods-psyllium-husk-powder-24-oz-680-g", why: "$0.16 a serving — cheapest per gram of the psyllium options" },
        { id: "california-gold-nutrition-sport-pure-creatine-monohydrate-1-454-g", why: "5 g a day, with training. High evidence, cheap" },
        { id: "resistance-bands-set-doorframe-pull-up-bar", why: "Enough equipment for a full session at home" }
      ],
      doneWhen: "You are 3–6 kg lighter, stronger on the same movements, and still sleeping through the night.",
      warn: "Dizziness, a resting pulse that stays high, hair shedding or no libido for two weeks means the deficit is too big. Eat more."
    },
    {
      id: "insulin",
      n: 3,
      weeks: "Weeks 9–16",
      title: "Fix the blood sugar",
      tagline: "The part that changes your long-term risk.",
      goal:
        "Keep losing slowly while making the body more sensitive to insulin: walk after meals, " +
        "keep muscle, keep the waist coming down. This is where prediabetes and early type 2 reverse.",
      steps: [
        { id: "p3-s1", title: "Walk 10–15 minutes after your biggest meal", detail: "Muscle takes sugar out of the blood without insulin. It is the cheapest glucose control there is." },
        { id: "p3-s2", title: "Eat vegetables and protein before starch", detail: "Same meal, different order, smaller blood-sugar spike." },
        { id: "p3-s3", title: "Three strength sessions a week", detail: "Muscle is your sugar sink. More muscle means more places to put glucose." },
        { id: "p3-s4", title: "Re-check HbA1c at three months", detail: "Prediabetes is 5.7–6.4%. A drop into the normal range is the result that matters most." },
        { id: "p3-s5", title: "Protect sleep on the deficit", detail: "Short sleep raises hunger and lowers insulin sensitivity. If you cannot sleep, eat more and lose slower." }
      ],
      daily: ["protein", "window", "steps", "strength", "sleep", "fibre"],
      weekly: [
        { id: "p3-w1", title: "Check the waist, not just the scale", detail: "Waist down is proof the fat leaving is visceral fat." },
        { id: "p3-w2", title: "One longer walk at the weekend", detail: "60–90 minutes. Fitness is the strongest single predictor you can change." }
      ],
      reading: [{ type: "guide", id: "insulin" }, { type: "article", id: "bloodwork" }, { type: "article", id: "exercise-neat" }],
      kit: [
        { id: "validated-upper-arm-blood-pressure-monitor", why: "Blood pressure tracks with the waist; measure it monthly" },
        { id: "now-foods-sports-micronized-creatine-monohydrate-500-g", why: "Keep strength up while the deficit continues" }
      ],
      doneWhen: "Waist down 5 cm or more, HbA1c moving down, and you can walk up stairs without getting out of breath.",
      warn: "Diabetes medication doses often need to come down as weight falls. Never adjust them yourself — book the review."
    },
    {
      id: "maintain",
      n: 4,
      weeks: "Week 17 onwards",
      title: "Make it your baseline",
      tagline: "The phase that decides whether it lasts.",
      goal:
        "Stop losing and hold. Eat at maintenance, keep protein and strength, and use a weekly " +
        "check so a 2 kg regain never becomes 12.",
      steps: [
        { id: "p4-s1", title: "Find maintenance by adding food back slowly", detail: "Add about 200 kcal a week until weight is stable for three weeks. That is your maintenance." },
        { id: "p4-s2", title: "Keep protein and strength exactly as they were", detail: "This is what keeps the muscle you fought for — and muscle is what keeps the weight off." },
        { id: "p4-s3", title: "Use a 2 kg rule", detail: "If the weekly average rises more than 2 kg above your baseline, go back to the phase-2 window for two weeks." },
        { id: "p4-s4", title: "Add the cheap anti-ageing basics", detail: "Sunscreen daily, vitamin D only if you are low, and the screenings your doctor recommends." },
        { id: "p4-s5", title: "Review every three months", detail: "Weight, waist, blood pressure, and once a year HbA1c and lipids. Numbers, not feelings." }
      ],
      daily: ["protein", "steps", "sleep", "fibre"],
      weekly: [
        { id: "p4-w1", title: "One weigh-in average and one waist measurement", detail: "Ten seconds a week is all maintenance needs." },
        { id: "p4-w2", title: "Two strength sessions", detail: "Non-negotiable. This is the habit that protects everything else." }
      ],
      reading: [{ type: "guide", id: "antiaging" }, { type: "guide", id: "younger" }, { type: "article", id: "maintenance" }],
      kit: [
        { id: "broad-spectrum-sunscreen-spf-50-moisturiser", why: "The only skincare product with randomised evidence" },
        { id: "now-foods-vitamin-d-3-high-potency-2-000-iu-240-softgels", why: "Only if a blood test shows you are low" }
      ],
      doneWhen: "Your weight has been stable for three months and you still train twice a week.",
      warn: "Maintenance is not a finish line. The people who keep it off are the ones still weighing weekly a year later."
    }
  ],

  /* Product kit summary used by the Shop tab and the plan page */
  kitNotes: {
    core: "Two things earn a permanent place: psyllium for fullness and creatine for strength. Everything else is optional.",
    skip: "No fat burners, no testosterone boosters, no NMN or resveratrol. None of them have human outcome data."
  }
};

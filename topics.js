/* GlowUp library — the merged, de-duplicated content index.
   Four top-level sections (Health, Fitness, Lifestyle, Mind), each with
   sub-topics. Every topic is a short, plain-English page that links to the
   deep material we already ship (guides.js / data.js articles) and to the
   real products in data.js. Nothing here invents prices or citations.

   Merged from: this app's guides + articles, and the glowup-pwa repo's
   Health / Grooming decks (rewritten, claims that had no evidence dropped).
   ------------------------------------------------------------------------- */
window.GLOWUP_TOPICS = {
  sections: [
    /* ============================== HEALTH ============================== */
    {
      id: "health",
      label: "Health",
      icon: "<path d=\"M12 21c4-3.2 7-6.4 7-10a7 7 0 1 0-14 0c0 3.6 3 6.8 7 10Z\"/>",
      blurb: "Sleep, eyes, teeth, skin, hair and sexual health — the body parts you actually see and feel.",
      topics: [
        {
          id: "sleep",
          label: "Sleep",
          kicker: "Recovery",
          title: "Sleep is the multiplier",
          lede: "Everything in this app works better when you sleep. Short sleep raises hunger, lowers insulin sensitivity and makes you look older than any other habit on this list.",
          blocks: [
          { t: "p", text: "Start with the wake time, not the bedtime. A fixed wake-up time anchors the whole clock, and bedtime follows within a week or two." },
          {
            t: "list",
            items: [
              "Same wake time every day, weekends included.",
              "10–20 minutes of daylight within an hour of waking.",
              "Last coffee 8–10 hours before bed — caffeine is still half-active after 5–6 hours.",
              "Alcohol helps you fall asleep and ruins the second half of the night.",
              "Dark, cool, quiet room. Phone out of reach, not on the pillow.",
            ],
          },
          { t: "h", text: "If you cannot sleep" },
          { t: "p", text: "Do not lie in bed frustrated. Get up after about 20 minutes, sit in dim light and do something boring until you feel sleepy. Naps after 3 pm and weekend lie-ins make the next night worse, not better." },
          { t: "h", text: "Snoring is not just annoying" },
          { t: "p", text: "Loud snoring, waking with a dry mouth or a headache, and never feeling refreshed are the classic signs of sleep apnoea. It is common, it is treatable, and it quietly raises blood pressure and lowers testosterone. Ask for a sleep study." },
          {
            t: "callout",
            kind: "key",
            title: "The honest summary",
            text: "A week of five-hour nights is not repaid at the weekend. Add 20–30 minutes a night until you are at seven or eight.",
          },
          ],
          reading: [
            { type: "article", id: "sleep" },
            { type: "article", id: "insomnia" },
            { type: "guide", id: "baseline" },
          ],
          kit: [

          ],
        },
        {
          id: "eyes",
          label: "Eyes",
          kicker: "Screens",
          title: "Eyes that stop burning by 4 pm",
          lede: "Most screen-related eye trouble is dryness and tired focusing muscles — not permanent damage. A few cheap habits fix most of it.",
          blocks: [
          { t: "p", text: "Staring at a screen halves your blink rate, so the eye surface dries out. The result is burning, blurring and headaches by the afternoon." },
          {
            t: "list",
            items: [
              "**20-20-20:** every 20 minutes, look at something 20 feet away for 20 seconds.",
              "Take a 15-minute walk in morning daylight — it sets your clock and gives your eyes a rest.",
              "Blink deliberately while reading; a drop or two of lubricating drops helps if you are dry.",
              "Book an eye test every two years — a lot of \"screen fatigue\" is an uncorrected prescription.",
            ],
          },
          { t: "h", text: "What is not proven" },
          { t: "p", text: "Blue-light glasses are sold as protection for your retina. The evidence for a health benefit is weak; the honest reason to use them is comfort in the evening. Dimming the screen and stopping an hour before bed is free and does the same job." },
          { t: "h", text: "Food that matters" },
          { t: "p", text: "Dark leafy greens, eggs, oily fish and orange vegetables carry the pigments the retina uses. Supplements are only worth it if your diet does not." },
          ],
          reading: [
            { type: "article", id: "anti-aging" },
            { type: "article", id: "sleep" },
          ],
          kit: [

          ],
        },
        {
          id: "teeth",
          label: "Teeth",
          kicker: "Face",
          title: "Teeth age a face faster than skin",
          lede: "Nobody notices your moisturiser. Everyone notices your teeth — and the fix is ten minutes a day.",
          blocks: [
          { t: "p", text: "Two minutes of brushing, twice a day, with fluoride toothpaste. Spit, do not rinse — rinsing washes away the fluoride you just paid for." },
          {
            t: "list",
            items: [
              "Floss or use interdental brushes once a day; the gaps between teeth are where the rot starts.",
              "A soft or electric brush at a 45° angle to the gum, small circular motions.",
              "Scrape or brush your tongue once a day — it is the main source of bad breath.",
              "Rinse with water after coffee or cola instead of sipping all afternoon.",
              "Whiten once, professionally or with a dentist-made tray. Do not overuse whitening strips.",
            ],
          },
          { t: "h", text: "Cheap wins" },
          { t: "p", text: "A dental check and clean once a year costs far less than the repairs it prevents. If you grind your teeth at night, ask about a night guard — it changes your jawline and protects the enamel." },
          ],
          reading: [
            { type: "article", id: "grooming" },
            { type: "guide", id: "younger" },
          ],
          kit: [

          ],
        },
        {
          id: "skin",
          label: "Skin",
          kicker: "Face",
          title: "Skin: two products and one habit",
          lede: "Sunscreen, a retinoid at night, and enough protein and sleep. That is the whole evidence-backed routine.",
          blocks: [
          { t: "p", text: "Skin ageing is mostly sun damage. Someone who has used daily sunscreen for four years shows measurably less ageing than someone who has not — that is a real trial, not marketing." },
          {
            t: "list",
            items: [
              "**Morning:** sunscreen SPF 30 or more on face, neck and the backs of your hands.",
              "**Night:** retinoid, a thin layer, every other night until your skin tolerates it.",
              "**Moisturiser:** if skin feels tight. It is comfort, not anti-ageing.",
              "**Do not smoke.** Nothing creams can do outruns smoking.",
              "**Protein and water:** skin is built from what you eat.",
            ],
          },
          { t: "h", text: "Loose skin after weight loss" },
          { t: "p", text: "Skin tightens best when fat is lost slowly and muscle is trained hard. Full-body resistance training two or three times a week is the strongest lever there is. Claims that fasting \"recycles\" skin are not supported by human data." },
          {
            t: "callout",
            kind: "tip",
            title: "Do not buy",
            text: "Collagen drinks, \"detox\" masks and anything promising a facelift in a jar. Your sunscreen is doing the work.",
          },
          ],
          reading: [
            { type: "article", id: "skincare" },
            { type: "guide", id: "younger" },
            { type: "guide", id: "antiaging" },
          ],
          kit: [
            { id: "broad-spectrum-sunscreen-spf-50-moisturiser", why: "The one product with randomised evidence" },
          ],
        },
        {
          id: "hair",
          label: "Hair & beard",
          kicker: "Grooming",
          title: "Hair and beard: act early, expect modest",
          lede: "Hair loss is the one thing on this list where waiting costs you follicles. The two treatments that work are old, cheap and boring.",
          blocks: [
          {
            t: "list",
            items: [
              "**Minoxidil 5%** foam or liquid, twice a day, forever — it keeps what you have and works best in the first years of thinning.",
              "**Finasteride 1 mg** daily, with a doctor. It lowers the hormone that shrinks follicles; a small number of men get sexual side effects.",
              "**Derma-rolling 0.5–1 mm** once a week may improve results when combined with minoxidil.",
              "**Beard:** keep it lined, use oil on damp hair, and trim rather than chase length if it grows patchy.",
              "**Shampoo less, condition more.** Wash 2–3 times a week unless you are genuinely greasy.",
            ],
          },
          { t: "h", text: "What does not work" },
          { t: "p", text: "Biotin (unless you are deficient), rosemary oil as a finasteride replacement, and every \"hair growth\" laser comb with no trial behind it. A cheap haircut that suits your hairline beats an expensive one that fights it." },
          ],
          reading: [
            { type: "article", id: "hair" },
            { type: "guide", id: "younger" },
            { type: "article", id: "grooming" },
          ],
          kit: [

          ],
        },
        {
          id: "sexual",
          label: "Sexual health",
          kicker: "Men's health",
          title: "Sexual health, honestly",
          lede: "Erections are a blood-flow and sleep test, not a personality test. Most problems in men under 50 are fixable with boring things.",
          blocks: [
          { t: "p", text: "The four things that move the needle are sleep, fitness, body fat and stress — in that order. A man who sleeps five hours, sits all day and carries 20 kg too much fat will have trouble no matter what he buys." },
          {
            t: "list",
            items: [
              "**Sleep 7–8 hours.** Testosterone is produced mostly during deep sleep.",
              "**Train and walk.** Blood vessels that work in the gym work everywhere.",
              "**Lose the belly.** Visceral fat converts testosterone to oestrogen.",
              "**Stop smoking and cut back on alcohol.** Both damage the vessels first.",
              "**See a doctor** if it started suddenly, if you also have chest pain, or if you have no morning erections at all — that last one can be an early warning for heart disease.",
            ],
          },
          { t: "h", text: "On supplements" },
          { t: "p", text: "Ashwagandha, tribulus, tongkat ali and \"testosterone boosters\" have small, inconsistent studies at best. If you suspect low testosterone, get it measured in the morning, twice, before buying anything." },
          {
            t: "callout",
            kind: "warn",
            title: "Get checked",
            text: "Erection problems can be the first sign of diabetes, high blood pressure or heart disease. A check-up is not an overreaction.",
          },
          ],
          reading: [
            { type: "article", id: "mens-health" },
            { type: "article", id: "bloodwork" },
            { type: "article", id: "drugs" },
            { type: "article", id: "big-d-sexual-function" },
            { type: "article", id: "big-d-pe" },
            { type: "article", id: "big-d-fertility" },
            { type: "article", id: "big-d-attraction" },
            { type: "article", id: "big-d-testosterone" },
          ],
          kit: [

          ],
        }
      ],
    },
    /* ============================== FITNESS ============================== */
    {
      id: "fitness",
      label: "Fitness",
      icon: "<path d=\"M6 7v10M18 7v10M3 12h18\"/><rect x=\"4\" y=\"9\" width=\"4\" height=\"6\" rx=\"1\"/><rect x=\"16\" y=\"9\" width=\"4\" height=\"6\" rx=\"1\"/>",
      blurb: "Lifting, walking, fat loss and recovery — how to keep the muscle you have while the fat goes.",
      topics: [
        {
          id: "training",
          label: "Strength",
          kicker: "Training",
          title: "Strength training, stripped down",
          lede: "Two or three sessions a week, six hard sets per body part, and a little more than last time. That is the entire method.",
          blocks: [
          { t: "p", text: "You do not need a gym or a programme with a name. You need to make your muscles work hard against resistance, often enough that they have a reason to stay." },
          {
            t: "list",
            items: [
              "**Squat or leg press** — 3 sets",
              "**Hinge: Romanian deadlift or hip thrust** — 3 sets",
              "**Push: press-up, bench or overhead press** — 3 sets",
              "**Pull: row or pull-up** — 3 sets",
              "**Carry: farmer's walk or a hard walk uphill** — 2 sets",
            ],
          },
          { t: "h", text: "How hard" },
          { t: "p", text: "Stop each set with about two good reps left. If you could do ten more, the set did not count. Write down what you lifted and add a rep or a little weight next week." },
          { t: "h", text: "Why it matters more than cardio" },
          { t: "p", text: "Muscle is what keeps you independent at 70 and what keeps your metabolism honest at 40. Strength training is associated with 10–17% lower risk of dying early, and it is the habit that protects your results when the diet ends." },
          ],
          reading: [
            { type: "article", id: "recomposition" },
            { type: "guide", id: "baseline" },
            { type: "article", id: "maintenance" },
          ],
          kit: [
            { id: "resistance-bands-set-doorframe-pull-up-bar", why: "Enough for a full session at home" },
            { id: "california-gold-nutrition-sport-pure-creatine-monohydrate-1-454-g", why: "5 g a day with training" },
          ],
        },
        {
          id: "steps",
          label: "Steps & cardio",
          kicker: "Movement",
          title: "Walking is the cheapest drug",
          lede: "Fitness is the strongest single predictor of a long life that you can actually change — and most of it comes from walking.",
          blocks: [
          { t: "p", text: "Aim for 7,000 steps a day and one or two sessions a week that leave you out of breath. That is enough to move you from the bottom third of fitness to the middle, which is where most of the benefit sits." },
          {
            t: "list",
            items: [
              "Two 20-minute walks beat one 40-minute walk — you get two post-meal glucose dips.",
              "Walk 10–15 minutes after your biggest meal; muscle takes sugar out of the blood without insulin.",
              "Take the stairs, park further away, take calls standing. It all counts.",
              "One longer walk at the weekend: 60–90 minutes, easy pace.",
            ],
          },
          {
            t: "callout",
            kind: "key",
            title: "Numbers worth knowing",
            text: "Each point of fitness is worth roughly 13% lower risk of dying early. Moving from unfit to moderately fit is the biggest single jump you will ever make.",
          },
          ],
          reading: [
            { type: "article", id: "exercise-neat" },
            { type: "guide", id: "insulin" },
            { type: "article", id: "longevity-table" },
          ],
          kit: [
            { id: "walking-shoes", why: "The cheapest mortality drug there is" },
          ],
        },
        {
          id: "fatloss",
          label: "Fat loss",
          kicker: "Body",
          title: "Fat loss without losing muscle",
          lede: "Lose 0.5–1% of your body weight a week, keep protein high, keep lifting, sleep. Faster than that and the weight you lose starts including muscle.",
          blocks: [
          {
            t: "list",
            items: [
              "**Rate:** 0.5–1% of body weight per week. For a 90 kg man that is 0.45–0.9 kg.",
              "**Protein:** 1.6 g per kg of body weight, spread across meals.",
              "**Deficit:** about 500 kcal a day below maintenance. Bigger is not better, it is just faster to fail.",
              "**Fibre:** 25–29 g a day. It is the cheapest fullness there is.",
              "**Weigh weekly and average.** One reading is noise; the weekly average is the signal.",
            ],
          },
          { t: "h", text: "Plateaus" },
          { t: "p", text: "If the average has not moved in three weeks, tighten the eating window or drop 200 kcal — not both. Then hold for two weeks before changing anything else." },
          { t: "h", text: "What happens when you stop" },
          { t: "p", text: "The weight comes back when the habits stop, not because your metabolism broke. Go back to the maintenance phase rather than starting another crash." },
          ],
          reading: [
            { type: "article", id: "fast-fat-loss" },
            { type: "article", id: "rate-and-plateaus" },
            { type: "article", id: "regain" },
          ],
          kit: [
            { id: "bathroom-scale-or-none-use-weekly-average-at-a-pharmacy", why: "For the weekly average" },
            { id: "now-foods-psyllium-husk-powder-24-oz-680-g", why: "Fullness, $0.16 a serving" },
          ],
        },
        {
          id: "recovery",
          label: "Recovery",
          kicker: "Safety",
          title: "Recovery and stop signs",
          lede: "Being tired after training is normal. Being wrecked for a week is a signal that the plan is too aggressive.",
          blocks: [
          {
            t: "list",
            items: [
              "Resting pulse up 10 beats for several days? Take a lighter week.",
              "Sleep getting worse, irritability rising, libido gone: eat more and train less.",
              "Hair shedding in handfuls, feeling cold all the time: the deficit is too big.",
              "A joint that hurts for more than two weeks needs a doctor, not more sets.",
            ],
          },
          {
            t: "callout",
            kind: "warn",
            title: "Stop and get help if",
            text: "You faint, have chest pain, or your resting heart rate stays high with dizziness. None of that is a training problem.",
          },
          { t: "h", text: "Deload weeks" },
          { t: "p", text: "Every six to eight weeks, take a week at half the sets. You will come back stronger, and it costs you nothing." },
          { t: "h", text: "Rest is when the work lands" },
          { t: "p", text: "Training breaks you down; the repair happens afterwards, while you sleep and eat. More sessions on a body that has not recovered is how men stall for months and then call it a plateau." },
          {
            t: "list",
            items: [
              "**Two hard sessions per muscle group a week** is enough for most men. The third rarely adds anything except fatigue.",
              "**Walk on the days between.** Light movement helps soreness more than sitting still does.",
              "**Take a lighter week** every six to eight weeks: same movements, less weight. You come back stronger, not weaker.",
            ],
          },
          {
            t: "callout",
            kind: "warn",
            title: "Pain is not soreness",
            text: "Soreness is dull, spread out, and gone in a day or two. Sharp joint pain that shows up on one specific movement is a reason to change the movement and get it looked at.",
          },
          ],
          reading: [
            { type: "article", id: "aggressive-safe" },
            { type: "article", id: "early-warning" },
            { type: "guide", id: "baseline" },
          ],
          kit: [

          ],
        }
      ],
    },
    /* ============================== LIFESTYLE ============================== */
    {
      id: "lifestyle",
      label: "Lifestyle",
      icon: "<path d=\"M4 7h16M4 12h16M4 17h10\"/>",
      blurb: "Food, fasting, grooming, supplements and money — the everyday decisions.",
      topics: [
        {
          id: "nutrition",
          label: "Nutrition",
          kicker: "Food",
          title: "Eating rules that survive real life",
          lede: "Protein first, vegetables second, starch last. Volume and fibre before calories. That is 90% of nutrition.",
          blocks: [
          {
            t: "list",
            items: [
              "**Protein at every meal:** eggs, chicken, fish, yoghurt, lentils, beans.",
              "**Fill half the plate with vegetables** — they cost you calories and buy you fullness.",
              "**Eat starch last.** Same meal, different order, smaller blood-sugar spike.",
              "**Soup or salad before the main** — you eat less without trying.",
              "**Drink water first.** Thirst is routinely mistaken for hunger.",
            ],
          },
          { t: "h", text: "Foods to limit, not ban" },
          {
            t: "table",
            head: ["Food", "Why it is easy to overeat", "What to do instead"],
            rows: [
              ["Fried food and pastries", "Calories arrive long before fullness does", "Eat them sitting down, with protein"],
              ["Sweet drinks", "No fullness at all", "Water, tea, coffee, sparkling water"],
              ["Large plates of rice or bread", "Very easy to eat 700 kcal fast", "Serve once, add vegetables"],
              ["Alcohol", "Adds calories and wrecks sleep", "Two drinks, two nights a week, maximum"],
            ],
          },
          {
            t: "callout",
            kind: "tip",
            title: "The one rule",
            text: "If you would not eat it without a screen in front of you, do not eat it standing up either.",
          },
          ],
          reading: [
            { type: "article", id: "protein" },
            { type: "article", id: "fibre" },
            { type: "article", id: "meal-templates" },
          ],
          kit: [
            { id: "now-foods-psyllium-husk-powder-12-oz-340-g", why: "Fibre before the hungriest meal" },
            { id: "digital-food-scale", why: "Two weeks of weighing teaches portions for life" },
          ],
        },
        {
          id: "fasting",
          label: "Fasting",
          kicker: "Timing",
          title: "Fasting, without the fairy tales",
          lede: "Fasting is a schedule, not a cure. Used well it makes eating less feel easy. Used badly it costs you muscle, sleep and patience.",
          blocks: [
          { t: "p", text: "Start with a 12-hour overnight gap — 8 pm to 8 am. When that feels normal, move to 14:10. Go to 16:8 only if you sleep well on it." },
          {
            t: "list",
            items: [
              "Water, black coffee and plain tea do not break the fast.",
              "Break the fast with protein and vegetables, then starch — not with pastry.",
              "Stop if you get dizzy, shaky or cannot sleep; a shorter fast you keep beats a longer one you abandon.",
              "Do not fast if you are pregnant, underweight, or take insulin without medical supervision.",
            ],
          },
          {
            t: "callout",
            kind: "key",
            title: "What the trials show",
            text: "When calories and protein are matched, time-restricted eating loses about the same weight as normal eating. It helps because it is easier to stick to — not because of a metabolic switch.",
          },
          ],
          reading: [
            { type: "guide", id: "fasting" },
            { type: "guide", id: "refeed" },
            { type: "article", id: "fasting-claims" },
          ],
          kit: [

          ],
        },
        {
          id: "grooming",
          label: "Grooming & style",
          kicker: "Presentation",
          title: "Grooming and style, in order",
          lede: "Fit of the clothes, then the haircut, then the smell, then the skin. Most men buy them in the reverse order.",
          blocks: [
          {
            t: "list",
            items: [
              "**Haircut every 4–6 weeks.** A sharp cut is the cheapest upgrade you can buy.",
              "**Fit beats brand.** Trousers that sit at your waist and a shirt that fits your shoulders.",
              "**Fewer, better colours:** navy, black, white, grey, one earth tone. They all work together.",
              "**Body care:** moisturising body wash, exfoliate twice a week, moisturiser on damp skin within three minutes of the shower.",
              "**Deodorant at night**, antiperspirant if you sweat heavily. Reapply in the morning.",
              "**One fragrance.** Two sprays on skin, not on the shirt.",
            ],
          },
          { t: "h", text: "Barber instructions that always work" },
          { t: "p", text: "Short back and sides, a low taper fade, two to three inches on top, beard blended into the fade, sharp cheek line. Bring a photo, not a description." },
          { t: "h", text: "Consistency beats products" },
          { t: "p", text: "Skin and hair respond to what you do every day, not to what you buy once. A cheap cleanser, a moisturiser and sunscreen used daily will beat an expensive routine used when you remember." },
          {
            t: "callout",
            kind: "tip",
            title: "Sunscreen is the anti-age step",
            text: "Most of the visible ageing on a face comes from the sun. Daily sunscreen does more for how you look in ten years than any serum in this app.",
          },
          ],
          reading: [
            { type: "article", id: "grooming" },
            { type: "guide", id: "younger" },
            { type: "article", id: "skincare" },
          ],
          kit: [
            { id: "broad-spectrum-sunscreen-spf-50-moisturiser", why: "Doubles as your morning moisturiser" },
          ],
        },
        {
          id: "supplements",
          label: "Supplements",
          kicker: "Shopping",
          title: "Supplements, graded honestly",
          lede: "Two are worth buying. Three are worth buying only if a blood test says so. Everything else is a donation.",
          blocks: [
          {
            t: "table",
            head: ["What", "Verdict", "Why"],
            rows: [
              ["Creatine 5 g", "Worth it", "More strength and muscle with training. Cheap, well studied."],
              ["Psyllium husk", "Worth it", "Fullness, cholesterol, blood sugar. About $0.16 a serving."],
              ["Vitamin D", "Only if low", "Fixes a deficiency. No benefit if your level is normal."],
              ["Omega-3", "Only if no fish", "Eat oily fish twice a week instead."],
              ["Whey protein", "Only if short", "Food first. Powder is a convenience, not a superior protein."],
              ["Fat burners, testosterone boosters, NMN, resveratrol", "No", "No human outcome data. Save the money."],
            ],
          },
          {
            t: "callout",
            kind: "tip",
            title: "How to buy",
            text: "Cost per serving, not price per tub. Our product list calculates it for you — the cheapest gram of psyllium is a quarter of the most expensive one.",
          },
          { t: "h", text: "What is worth the money" },
          { t: "p", text: "Three things earn their place for most men: creatine, vitamin D if you get little sun, and a plain protein powder if you struggle to reach your protein from food. Everything else on the shop page is optional, or an answer to a problem you may not have." },
          {
            t: "list",
            items: [
              "**Creatine** — cheapest proven help for strength. Any brand, no loading needed.",
              "**Vitamin D** — only if your days are mostly indoors or covered. Test if you can.",
              "**Protein powder** — food that is easy to count, not a magic ingredient.",
            ],
          },
          {
            t: "callout",
            kind: "warn",
            title: "Skip the stack",
            text: "Test boosters, fat burners and detox teas do nothing you can measure. Spend that money on eggs, fish or a decent pair of shoes to walk in.",
          },
          ],
          reading: [
            { type: "article", id: "supplements" },
            { type: "article", id: "products" },
            { type: "article", id: "free-alternatives" },
          ],
          kit: [
            { id: "now-foods-vitamin-d-3-high-potency-2-000-iu-240-softgels", why: "Only after a low blood test" },
          ],
        },
        {
          id: "money",
          label: "Money",
          kicker: "Practical",
          title: "Getting lean for less",
          lede: "The cheapest diet is the one built from eggs, lentils, oats, frozen vegetables and whatever fish is affordable where you live.",
          blocks: [
          {
            t: "list",
            items: [
              "Eggs, lentils, beans, oats, potatoes, frozen vegetables, tinned fish — protein and fibre per dollar, these win.",
              "A kitchen scale and a bathroom scale together cost less than one month of supplements.",
              "Resistance bands and a doorway bar replace a gym membership for a year.",
              "Buy the big bag once you know you like it. Cost per serving falls sharply.",
              "Skip: detox teas, fat burners, \"testosterone\" stacks, collagen drinks.",
            ],
          },
          { t: "p", text: "In Mogadishu, substitute freely: cassava or sweet potato for potato, local fish for canned fish, camel milk for cow milk. The rules do not change with the ingredients." },
          { t: "h", text: "Food is the biggest lever you control" },
          { t: "p", text: "Most of the cost of getting in shape is not supplements. It is the small purchases you do not think about — a coffee and a pastry, a takeaway because nothing was planned. Those add up faster than anything sold on the shop page." },
          {
            t: "list",
            items: [
              "**Cook two big meals a week** and eat them for four days. Batch cooking is the cheapest habit in this app.",
              "**Buy protein on price per gram**, not per pack. Eggs, milk, tinned fish, lentils and chicken thighs usually win.",
              "**Keep a frozen option** you actually like. The takeaway app wins whenever the cupboard is empty.",
            ],
          },
          {
            t: "callout",
            kind: "warn",
            title: "Protein before gadgets",
            text: "If the basket is mostly eggs, milk, fish, lentils and vegetables, the rest of the budget sorts itself out. A new blender will not.",
          },
          ],
          reading: [
            { type: "article", id: "shopping" },
            { type: "article", id: "free-alternatives" },
            { type: "article", id: "products" },
          ],
          kit: [

          ],
        }
      ],
    },
    /* ============================== MIND ============================== */
    {
      id: "mind",
      label: "Mind",
      icon: "<path d=\"M12 20a7 7 0 0 0 7-7V9a5 5 0 0 0-9-3 5 5 0 0 0-9 3v4a7 7 0 0 0 7 7Z\"/><path d=\"M12 8v6\"/>",
      blurb: "Stress, habits, motivation and attention — the part that decides whether any of this lasts.",
      topics: [
        {
          id: "stress",
          label: "Stress",
          kicker: "Mind",
          title: "Stress you can actually lower",
          lede: "You cannot delete stress. You can lower the load, raise your capacity, and stop using food and screens as the pressure valve.",
          blocks: [
          {
            t: "list",
            items: [
              "**Walk it off:** 20–30 minutes outside lowers arousal more reliably than any app.",
              "**Breathe slowly:** in for four, out for six, for two minutes. Long exhales switch on the calming side.",
              "**Write it down:** three lines — what happened, what I felt, what I will do. It stops the loop.",
              "**Protect sleep first.** Under-sleeping turns small problems into big ones.",
              "**Lift weights.** Hard training metabolises stress hormones better than resting does.",
            ],
          },
          { t: "p", text: "If stress is constant, if you cannot feel pleasure, or if you are using alcohol or food to get through the evening, that is a reason to see a professional — not a reason to try harder alone." },
          { t: "h", text: "The body treats stress like a bill" },
          { t: "p", text: "Short bursts of stress are useful — they sharpen you for a hard set or a difficult conversation. The damage comes from stress that never switches off and hums in the background for weeks. That is the kind that reaches sleep, appetite and blood pressure." },
          { t: "p", text: "Three things move it, and none of them cost money: daylight early in the day, moving your body, and one real conversation with someone who is not on a screen." },
          {
            t: "callout",
            kind: "tip",
            title: "Breathe out longer than you breathe in",
            text: "In for four seconds, out for six, for a minute. A long exhale is the fastest physical signal that the emergency is over.",
          },
          ],
          reading: [
            { type: "article", id: "sleep" },
            { type: "article", id: "insomnia" },
            { type: "guide", id: "antiaging" },
          ],
          kit: [

          ],
        },
        {
          id: "habits",
          label: "Habits",
          kicker: "Behaviour",
          title: "Make the habit smaller than your motivation",
          lede: "The plan you can keep on a bad day is the only plan that works. Shrink the habit until it is almost embarrassing, then let it grow.",
          blocks: [
          {
            t: "list",
            items: [
              "**One rule at a time.** Two weeks per habit, then add the next.",
              "**Anchor it:** after breakfast, after the shower, before the first email.",
              "**Make it visible:** shoes by the door, water bottle on the desk, psyllium next to the kettle.",
              "**Track it — tick a box.** The Today screen exists for exactly this.",
              "**Never miss twice.** One missed day is life; two is a new pattern.",
            ],
          },
          {
            t: "callout",
            kind: "key",
            title: "The two-week rule",
            text: "Do not judge a habit before two weeks. Most of what feels like failure in week one is just novelty.",
          },
          { t: "h", text: "Make the right thing the easy thing" },
          { t: "p", text: "A habit is not a decision you keep making. It is a shortcut your brain builds after enough repeats. That is why the room beats motivation: whatever is closest and easiest wins, every time." },
          {
            t: "list",
            items: [
              "**Put the good option in front.** Water on the desk, shoes by the door, fruit on the counter.",
              "**Attach it to something you already do.** After I brush my teeth, I take my vitamin D. After dinner, I walk.",
              "**Cut one step, not ten.** A gym bag packed the night before removes the reason you skip at 6 am.",
            ],
          },
          {
            t: "callout",
            kind: "tip",
            title: "The two-minute start",
            text: "Shrink a new habit until it takes two minutes: shoes on, one page read, one glass of water. You can always do more once you have started.",
          },
          ],
          reading: [
            { type: "article", id: "maintenance" },
            { type: "article", id: "myths" },
            { type: "guide", id: "baseline" },
          ],
          kit: [

          ],
        },
        {
          id: "motivation",
          label: "Motivation",
          kicker: "Identity",
          title: "Motivation is a result, not a starting point",
          lede: "Action comes first and motivation follows. The men who keep the weight off do not feel more disciplined — they built a smaller set of rules.",
          blocks: [
          { t: "p", text: "Stop asking \"do I feel like it?\" and start asking \"what is the smallest version I can do today?\" A ten-minute walk counts. One set counts. Half a plate of vegetables counts." },
          {
            t: "list",
            items: [
              "Change the story: not \"I am on a diet\" but \"I am someone who lifts twice a week\".",
              "Use numbers, not feelings: weekly average weight, waist, sessions completed.",
              "Expect the middle to be boring. Weeks four to eight are where most men quit, and nothing is wrong.",
              "Keep a before photo. On a bad day it is the only evidence that works.",
            ],
          },
          { t: "h", text: "Stop waiting to feel ready" },
          { t: "p", text: "Motivation follows action more often than it comes before it. Waiting for a good day is how a week becomes a month. The men who last are not more driven than you; they have made the first step small enough to do while tired." },
          {
            t: "list",
            items: [
              "**Pick the smallest version.** Ten minutes of the plan you actually do beats the hour you keep postponing.",
              "**Judge the week, not the day.** One bad day is noise. Three bad days is a signal to make the plan easier, not to give up.",
              "**Tell one person.** Being asked about it is cheaper than finding willpower every morning.",
            ],
          },
          {
            t: "callout",
            kind: "tip",
            title: "Never miss twice",
            text: "One missed session is life. Two in a row is the start of a new habit, and it is the wrong one.",
          },
          ],
          reading: [
            { type: "article", id: "regain" },
            { type: "article", id: "post-diet" },
            { type: "article", id: "maintenance" },
          ],
          kit: [

          ],
        },
        {
          id: "attention",
          label: "Attention",
          kicker: "Focus",
          title: "Take your attention back",
          lede: "Constant phone use fragments sleep, appetite and training. None of those problems can be fixed while you are scrolling in bed.",
          blocks: [
          {
            t: "list",
            items: [
              "**Phone out of the bedroom.** Buy a cheap alarm clock; it is the highest-return purchase in this app.",
              "**No screens for the first 30 minutes** — daylight and water instead.",
              "**One screen at a time** while eating. You eat less and enjoy it more.",
              "**Turn off every non-human notification.** Messages, calls, alarms only.",
              "**Boredom is fine.** Your brain resets in about ten minutes if you let it.",
            ],
          },
          { t: "p", text: "If you want a number to aim at: under three hours of recreational screen time a day, and none in the last hour before bed." },
          { t: "h", text: "Why the phone wins" },
          { t: "p", text: "Every app you open was designed by people paid to keep you there. You are not losing a fair fight with willpower; you are losing a fight with a product that gets better every month. Treat the phone like a tool with a start and a finish, not something you reach for every time you wait." },
          { t: "p", text: "The fix is distance, not discipline. A phone in another room is not a test you can fail." },
          {
            t: "callout",
            kind: "key",
            title: "Put it out of reach, not out of mind",
            text: "If a job needs your eyes, the phone goes face down in another room. That works on your worst days, and it does not depend on feeling strong.",
          },
          ],
          reading: [
            { type: "article", id: "sleep" },
            { type: "article", id: "appetite" },
            { type: "guide", id: "antiaging" },
          ],
          kit: [

          ],
        }
      ],
    }
  ],
};

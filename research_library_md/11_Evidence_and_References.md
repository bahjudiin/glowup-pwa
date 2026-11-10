# 11 — Evidence and References (Phase 2)

*Phase 2 module, file 11 of 12. Phase-1 references are in `22_RESEARCH_REFERENCES.md`; this file covers only sources used in Phase 2 (files `01`–`10`, `12`).*

---

## 1. What this file is for

1. **Audit trail.** Every important claim in this module traces to a source listed below, with a direct PubMed link. Nothing is cited from memory or reconstructed.
2. **Evidence grading.** Each source is labelled by design, so a mechanistic review is visibly *not* the same as an RCT.
3. **Record of what was rejected.** Claims that were searched for and found unsupported are listed in §6, so they are not quietly re-introduced later.

---

## 2. Method

### 2.1 Evidence hierarchy applied
Systematic reviews / meta-analyses > clinical guidelines & consensus statements > RCTs > controlled feeding studies > strong observational data > mechanistic/preclinical > expert opinion > anecdote.

**A mechanistic explanation was never treated as proof of a real-world clinical outcome.** Where only mechanistic data exist, this project says so (e.g. human autophagy markers, `03` §4.5).

### 2.2 How sources were found and verified
- **PubMed E-utilities** (esearch → esummary → efetch) were used programmatically. Citation metadata below (first author, journal, year, exact title) was **retrieved from PubMed**, not typed from memory.
- Query strategy: author surname + distinctive title word with `[ti]` restriction, plus MeSH-style phrasing where free-text search returned wrong papers. Loose free-text queries were found to return unrelated papers and were abandoned.
- Verification step: every PMID in files `01`–`10` was resolved once more in a batch and its **journal, year and title checked against the text** of the file that cites it. One error was found and corrected during this process (a mistyped PMID resolving to an unrelated radionuclide-therapy paper, replaced with the correct record).
- Numeric claims were spot-checked against abstracts; where an abstract did not support a precise number, the claim was softened to a qualitative statement.

### 2.3 Nutrition data
All calorie/protein/fibre/water/potassium values are from **USDA FoodData Central, SR Legacy** (the final SR release, 2018). The complete dataset was downloaded as CSV (`FoodData_Central_sr_legacy_food_csv_2018-04.zip`, ~6 MB, 7,794 foods, 644,126 nutrient rows) and queried offline, which avoids the rate-limited FDC web API and makes every value reproducible.

- Dataset: <https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip>
- Each food in file `01` carries its FDC ID and links to a FoodData Central **search** for that ID (the site's per-record deep-link path could not be verified and returned 404, so a labelled search link is used instead), e.g. cabbage = FDC ID 169975: <https://fdc.nal.usda.gov/food-search?query=169975>
- Nutrient IDs used: 1008 (energy, kcal), 1003 (protein), 1079 (fibre), 1051 (water), 1092 (potassium), 1093 (sodium).

**Limitation:** SR Legacy is a US reference database of average composition. Local Somali produce and meat will differ (soil, feed, breed, cut, water content). Values should be read as ±10–15%, and never as precise.

### 2.4 Price data
No price in this module is a **Verified local price** — nothing was checked in a Mogadishu shop during this research. Local prices are labelled **Estimated** (third-party) or **Unknown**:

| Source | What it was used for | Link |
|---|---|---|
| Somali Researchers Association market dashboard (Mogadishu column) | Cabbage, tomato, onion, carrot, potato, banana, papaya, mango, rice, sorghum, maize | <https://www.sra.so/market-price/> |
| Numbeo — Mogadishu | Eggs, chicken fillet, beef, milk, apples, lettuce | <https://www.numbeo.com/food-prices/in/Mogadishu-Somalia> |
| Livingcost.org — Mogadishu | Rice, chicken breast, eggs, bread, banana, apples | <https://livingcost.org/cost/somalia/mogadishu> |

These three sources disagree by up to ~2× on the same item, which is precisely why they are labelled Estimated rather than Verified.

### 2.5 Product data
iHerb product pages and prices marked **✅ verified** were checked live on **1 Nov 2026** during Phase-1 research and are reused unchanged in file `09`. Prices exclude international shipping, customs and local markup, which for Somalia can be substantial. Products without a verifiable page are given as clearly-labelled **marketplace search links**, never as invented product URLs. iHerb blocks scripted HTTP clients (403), so links should be opened in a browser.

---

## 3. Full reference list (67 sources)

Every entry below is cited somewhere in files `01`–`10`. The "design" column is the basis for how much weight the claim carries.

| # | Citation | Source, year | Design / evidence type | Link |
|---|---|---|---|---|
| | **Satiety, food form, energy density, eating rate** | | | |
| 1 | Holt SH et al. — A satiety index of common foods | *Eur J Clin Nutr*, 1995 | RCT (38 foods, equal-calorie portions) | [PMID 7498104](https://pubmed.ncbi.nlm.nih.gov/7498104/) |
| 2 | Flood JE et al. — Soup preloads in a variety of forms reduce meal energy intake | *Appetite*, 2007 | RCT, preload design | [PMID 17574705](https://pubmed.ncbi.nlm.nih.gov/17574705/) |
| 3 | Cassady BA et al. — Beverage consumption, appetite, and energy intake: what did you expect? | *Am J Clin Nutr*, 2012 | RCT, crossover | [PMID 22258267](https://pubmed.ncbi.nlm.nih.gov/22258267/) |
| 4 | Brennan IM et al. — Effects of fat, protein, and carbohydrate and protein load on appetite, plasma cholecystokinin, peptide YY, and ghrelin, and energy intake in lean and obese men | *Am J Physiol Gastrointest Liver Physiol*, 2012 | RCT, crossover | [PMID 22556143](https://pubmed.ncbi.nlm.nih.gov/22556143/) |
| 5 | Desai AJ et al. — Cholecystokinin-induced satiety, a key gut servomechanism that is affected by the membrane microenvironment of this receptor | *Int J Obes Suppl*, 2016 | Narrative review (mechanism) | [PMID 28685026](https://pubmed.ncbi.nlm.nih.gov/28685026/) |
| 6 | Yeomans MR et al. — Satiety-relevant sensory qualities enhance the satiating effects of mixed carbohydrate-protein preloads | *Am J Clin Nutr*, 2011 | RCT, preload design | [PMID 22030223](https://pubmed.ncbi.nlm.nih.gov/22030223/) |
| 7 | Sharafi M et al. — Effect of a High-Protein, High-Fiber Beverage Preload on Subjective Appetite Ratings and Subsequent Ad Libitum Energy Intake in Overweight Men and Women: A Randomized, Double-Blind Placebo-Controlled, Crossover Study | *Curr Dev Nutr*, 2018 | RCT, preload design | [PMID 29955731](https://pubmed.ncbi.nlm.nih.gov/29955731/) |
| 8 | Yang D et al. — Acute effects of high-protein versus normal-protein isocaloric meals on satiety and ghrelin | *Eur J Nutr*, 2014 | RCT, isocaloric crossover | [PMID 23824257](https://pubmed.ncbi.nlm.nih.gov/23824257/) |
| 9 | Halton TL et al. — The effects of high protein diets on thermogenesis, satiety and weight loss: a critical review | *J Am Coll Nutr*, 2004 | Critical/narrative review | [PMID 15466943](https://pubmed.ncbi.nlm.nih.gov/15466943/) |
| 10 | Weigle DS et al. — A high-protein diet induces sustained reductions in appetite, ad libitum caloric intake, and body weight despite compensatory changes in diurnal plasma leptin and ghrelin concentrations | *Am J Clin Nutr*, 2005 | Controlled feeding study | [PMID 16002798](https://pubmed.ncbi.nlm.nih.gov/16002798/) |
| 11 | Eriksen R et al. — Evidence for a protein leverage effect on food intake in a Norwegian population | *Appetite*, 2026 | Observational (population) | [PMID 42102975](https://pubmed.ncbi.nlm.nih.gov/42102975/) |
| 12 | Hall KD et al. — Ultra-Processed Diets Cause Excess Calorie Intake and Weight Gain: An Inpatient Randomized Controlled Trial of Ad Libitum Food Intake | *Cell Metab*, 2019 | Inpatient RCT | [PMID 31105044](https://pubmed.ncbi.nlm.nih.gov/31105044/) |
| 13 | Fazzino TL et al. — Hyper-Palatable Foods: Development of a Quantitative Definition and Application to the US Food System Database | *Obesity (Silver Spring)*, 2019 | Definition/validation study | [PMID 31689013](https://pubmed.ncbi.nlm.nih.gov/31689013/) |
| 14 | Karimi G et al. — Low energy density diet, weight loss maintenance, and risk of cardiovascular disease following a recent weight reduction program: A randomized control trial | *J Res Med Sci*, 2016 | RCT (secondary analysis) | [PMID 27904578](https://pubmed.ncbi.nlm.nih.gov/27904578/) |
| 15 | Forde CG et al. — Eating rate has sustained effects on energy intake from ultraprocessed diets: a 2-week ad libitum dietary randomized controlled crossover trial | *Am J Clin Nutr*, 2026 | 2-week randomised dietary trial | [PMID 41314613](https://pubmed.ncbi.nlm.nih.gov/41314613/) |
| 16 | van Bruinessen M et al. — The sustained effect of texture-based eating rate on food intake in an 11-d randomised controlled trial | *Br J Nutr*, 2026 | 11-day RCT | [PMID 41492689](https://pubmed.ncbi.nlm.nih.gov/41492689/) |
| 17 | John HS et al. — Dietary pulses as a means to improve the gut microbiome, inflammation, and appetite control in obesity | *Obes Rev*, 2023 | Narrative/systematic review of trials | [PMID 37395146](https://pubmed.ncbi.nlm.nih.gov/37395146/) |
| 18 | Choi M et al. — Vegetable-First Meal Sequence Suppresses Postprandial Glycaemic Excursions and Variability in Young Women With High-Risk Phenotype for Early-Onset Type 2 Diabetes: A 4-Arm Randomized Crossover Trial With Continuous Glucose Monitoring | *Diabetes Obes Metab*, 2026 | RCT | [PMID 42608327](https://pubmed.ncbi.nlm.nih.gov/42608327/) |
| 19 | Melissas J et al. — Sleeve gastrectomy: a restrictive procedure? | *Obes Surg*, 2007 | Prospective/mechanistic human study | [PMID 17355769](https://pubmed.ncbi.nlm.nih.gov/17355769/) |
| | **Water, hydration, hyponatraemia** | | | |
| 20 | Daniels MC et al. — Impact of water intake on energy intake and weight status: a systematic review | *Nutr Rev*, 2010 | Systematic review | [PMID 20796216](https://pubmed.ncbi.nlm.nih.gov/20796216/) |
| 21 | Dennis EA et al. — Water consumption increases weight loss during a hypocaloric diet intervention in middle-aged and older adults | *Obesity (Silver Spring)*, 2010 | RCT | [PMID 19661958](https://pubmed.ncbi.nlm.nih.gov/19661958/) |
| 22 | Hew-Butler T et al. — Statement of the 3rd International Exercise-Associated Hyponatremia Consensus Development Conference, Carlsbad, California, 2015 | *Br J Sports Med*, 2015 | International consensus statement | [PMID 26227507](https://pubmed.ncbi.nlm.nih.gov/26227507/) |
| | **Fibre, constipation, psyllium** | | | |
| 23 | Reynolds A et al. — Carbohydrate quality and human health: a series of systematic reviews and meta-analyses | *Lancet*, 2019 | Systematic reviews + meta-analyses (GRADE) | [PMID 30638909](https://pubmed.ncbi.nlm.nih.gov/30638909/) |
| 24 | Suares NC et al. — Systematic review: the effects of fibre in the management of chronic idiopathic constipation | *Aliment Pharmacol Ther*, 2011 | Systematic review | [PMID 21332763](https://pubmed.ncbi.nlm.nih.gov/21332763/) |
| 25 | Christodoulides S et al. — Systematic review with meta-analysis: effect of fibre supplementation on chronic idiopathic constipation in adults | *Aliment Pharmacol Ther*, 2016 | Systematic review + meta-analysis | [PMID 27170558](https://pubmed.ncbi.nlm.nih.gov/27170558/) |
| 26 | Jovanovski E et al. — Effect of psyllium (Plantago ovata) fiber on LDL cholesterol and alternative lipid targets, non-HDL cholesterol and apolipoprotein B: a systematic review and meta-analysis of randomized controlled trials | *Am J Clin Nutr*, 2018 | Meta-analysis of RCTs | [PMID 30239559](https://pubmed.ncbi.nlm.nih.gov/30239559/) |
| 27 | Xiao Z et al. — The effect of psyllium consumption on weight, body mass index, lipid profile, and glucose metabolism in diabetic patients: A systematic review and dose-response meta-analysis of randomized controlled trials | *Phytother Res*, 2020 | Meta-analysis of RCTs | [PMID 31919936](https://pubmed.ncbi.nlm.nih.gov/31919936/) |
| 28 | Sood N et al. — Effect of glucomannan on plasma lipid and glucose concentrations, body weight, and blood pressure: systematic review and meta-analysis | *Am J Clin Nutr*, 2008 | Meta-analysis of RCTs | [PMID 18842808](https://pubmed.ncbi.nlm.nih.gov/18842808/) |
| | **Fasting, time-restricted eating, refeeding** | | | |
| 29 | Aragon AA et al. — International Society of Sports Nutrition position stand: diets for body weight reduction | *J Int Soc Sports Nutr*, 2026 | Position stand (expert synthesis of trials) | [PMID 42867412](https://pubmed.ncbi.nlm.nih.gov/42867412/) |
| 30 | Enríquez Guerrero A et al. — Effectiveness of an intermittent fasting diet versus continuous energy restriction on anthropometric measurements, body composition and lipid profile in overweight and obese adults: a meta-analysis | *Eur J Clin Nutr*, 2021 | Meta-analysis of RCTs | [PMID 33293678](https://pubmed.ncbi.nlm.nih.gov/33293678/) |
| 31 | Liu D et al. — Calorie Restriction with or without Time-Restricted Eating in Weight Loss | *N Engl J Med*, 2022 | 12-month RCT | [PMID 35443107](https://pubmed.ncbi.nlm.nih.gov/35443107/) |
| 32 | Lowe DA et al. — Effects of Time-Restricted Eating on Weight Loss and Other Metabolic Parameters in Women and Men With Overweight and Obesity: The TREAT Randomized Clinical Trial | *JAMA Intern Med*, 2020 | 12-week RCT | [PMID 32986097](https://pubmed.ncbi.nlm.nih.gov/32986097/) |
| 33 | Potter C et al. — Breaking the fast: Meal patterns and beliefs about healthy eating style are associated with adherence to intermittent fasting diets | *Appetite*, 2019 | Observational (adherence) | [PMID 30339785](https://pubmed.ncbi.nlm.nih.gov/30339785/) |
| 34 | Byrne NM et al. — Intermittent energy restriction improves weight loss efficiency in obese men: the MATADOR study | *Int J Obes (Lond)*, 2018 | RCT (MATADOR) | [PMID 28925405](https://pubmed.ncbi.nlm.nih.gov/28925405/) |
| 35 | Sainsbury A et al. — Rationale for novel intermittent dieting strategies to attenuate adaptive responses to energy restriction | *Obes Rev*, 2018 | Narrative review (rationale) | [PMID 30511512](https://pubmed.ncbi.nlm.nih.gov/30511512/) |
| 36 | Gray KL et al. — The effect of intermittent energy restriction on weight loss and diabetes risk markers in women with a history of gestational diabetes: a 12-month randomized control trial | *Am J Clin Nutr*, 2021 | RCT | [PMID 33831950](https://pubmed.ncbi.nlm.nih.gov/33831950/) |
| 37 | Espinoza SE et al. — Effect of fasting-mimicking diet on markers of autophagy and metabolic health in human subjects | *Geroscience*, 2026 | Clinical trial (biomarker endpoints) | [PMID 41372565](https://pubmed.ncbi.nlm.nih.gov/41372565/) |
| 38 | Poursalehian M et al. — Impact of Ramadan fasting on serum levels of major endocrinology hormonal and biochemical parameters in healthy non-athlete adults: A systematic review and meta-analyses | *PLoS One*, 2024 | Systematic review/meta-analysis (observational) | [PMID 38781203](https://pubmed.ncbi.nlm.nih.gov/38781203/) |
| 39 | La Vignera S et al. — Dietary Interventions and Testosterone Levels in Obese Men: A Systematic Review Comparing the Mediterranean Diet, Ketogenic Diet, and Intermittent Fasting | *Nutrients*, 2026 | Systematic review | [PMID 42588040](https://pubmed.ncbi.nlm.nih.gov/42588040/) |
| 40 | Mehanna HM et al. — Refeeding syndrome: what it is, and how to prevent and treat it | *BMJ*, 2008 | Clinical review (guideline-style) | [PMID 18583681](https://pubmed.ncbi.nlm.nih.gov/18583681/) |
| 41 | Aissaoui Y et al. — Refeeding syndrome: a forgotten and potentially lethal entity | *Med Sante Trop*, 2016 | Case series/report | [PMID 27412982](https://pubmed.ncbi.nlm.nih.gov/27412982/) |
| 42 | Xie H et al. — Incidence and risk factors of refeeding syndrome in critically ill patients: A systematic review and meta-analysis | *Clin Nutr*, 2026 | Systematic review + meta-analysis | [PMID 42624024](https://pubmed.ncbi.nlm.nih.gov/42624024/) |
| 43 | Matthews-Rensch K et al. — Risk, management and future directions for refeeding syndrome and enteral nutrition, an adult and paediatric perspective | *Curr Opin Clin Nutr Metab Care*, 2026 | Narrative review | [PMID 42559926](https://pubmed.ncbi.nlm.nih.gov/42559926/) |
| 44 | Look AHEAD Research Group et al. — Eight-year weight losses with an intensive lifestyle intervention: the look AHEAD study | *Obesity (Silver Spring)*, 2014 | 8-year RCT (Look AHEAD) | [PMID 24307184](https://pubmed.ncbi.nlm.nih.gov/24307184/) |
| | **Sleep, caffeine, melatonin, OSA** | | | |
| 45 | Nedeltcheva AV et al. — Insufficient sleep undermines dietary efforts to reduce adiposity | *Ann Intern Med*, 2010 | Inpatient controlled trial | [PMID 20921542](https://pubmed.ncbi.nlm.nih.gov/20921542/) |
| 46 | Tasali E et al. — Effect of Sleep Extension on Objectively Assessed Energy Intake Among Adults With Overweight in Real-life Settings: A Randomized Clinical Trial | *JAMA Intern Med*, 2022 | RCT | [PMID 35129580](https://pubmed.ncbi.nlm.nih.gov/35129580/) |
| 47 | Drake C et al. — Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed | *J Clin Sleep Med*, 2013 | Experimental crossover | [PMID 24235903](https://pubmed.ncbi.nlm.nih.gov/24235903/) |
| 48 | Ferracioli-Oda E et al. — Meta-analysis: melatonin for the treatment of primary sleep disorders | *PLoS One*, 2013 | Meta-analysis of RCTs | [PMID 23691095](https://pubmed.ncbi.nlm.nih.gov/23691095/) |
| 49 | Hu X et al. — Time-of-day effects of acute and regular exercise on sleep quality and mood: a three-level meta-analysis | *Front Psychol*, 2026 | Three-level meta-analysis | [PMID 42857179](https://pubmed.ncbi.nlm.nih.gov/42857179/) |
| 50 | Carvalhal G et al. — GLP-1 receptor agonists for obstructive sleep apnea: a meta-analysis of randomized controlled trials | *Sleep Breath*, 2026 | Meta-analysis of RCTs | [PMID 42837024](https://pubmed.ncbi.nlm.nih.gov/42837024/) |
| | **Protein, muscle, training, lean mass** | | | |
| 51 | Morton RW et al. — A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults | *Br J Sports Med*, 2018 | Meta-analysis + meta-regression | [PMID 28698222](https://pubmed.ncbi.nlm.nih.gov/28698222/) |
| 52 | Schoenfeld BJ et al. — How much protein can the body use in a single meal for muscle-building? Implications for daily protein distribution | *J Int Soc Sports Nutr*, 2018 | Narrative review of dose-response trials | [PMID 29497353](https://pubmed.ncbi.nlm.nih.gov/29497353/) |
| 53 | Moore DR et al. — Protein ingestion to stimulate myofibrillar protein synthesis requires greater relative protein intakes in healthy older versus younger men | *J Gerontol A Biol Sci Med Sci*, 2015 | Controlled trial (age comparison) | [PMID 25056502](https://pubmed.ncbi.nlm.nih.gov/25056502/) |
| 54 | Areta JL et al. — Timing and distribution of protein ingestion during prolonged recovery from resistance exercise alters myofibrillar protein synthesis | *J Physiol*, 2013 | RCT (protein distribution) | [PMID 23459753](https://pubmed.ncbi.nlm.nih.gov/23459753/) |
| 55 | Helms ER et al. — A systematic review of dietary protein during caloric restriction in resistance trained lean athletes: a case for higher intakes | *Int J Sport Nutr Exerc Metab*, 2014 | Systematic review | [PMID 24092765](https://pubmed.ncbi.nlm.nih.gov/24092765/) |
| 56 | Garthe I et al. — Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes | *Int J Sport Nutr Exerc Metab*, 2011 | RCT (weight-loss rate) | [PMID 21558571](https://pubmed.ncbi.nlm.nih.gov/21558571/) |
| 57 | Yang B et al. — Comparative effectiveness of protein or protein-related supplementation combined with resistance or functional exercise for sarcopenia in older adults: a systematic review and network meta-analysis | *Front Nutr*, 2026 | Systematic review/meta-analysis | [PMID 42712362](https://pubmed.ncbi.nlm.nih.gov/42712362/) |
| 58 | Hernandez-Martinez J et al. — Combined effects of strength training, whey protein, and HMB on sarcopenia in older people: A systematic review and meta-analysis | *Medicine (Baltimore)*, 2026 | Systematic review | [PMID 42700006](https://pubmed.ncbi.nlm.nih.gov/42700006/) |
| 59 | Sukurica E et al. — Weight Loss or Muscle Loss? Cellular Mechanisms and Clinical Strategies for Preserving Lean Mass During GLP-1-Based Therapy | *Diabetes Obes Metab*, 2026 | Narrative review | [PMID 42839755](https://pubmed.ncbi.nlm.nih.gov/42839755/) |
| 60 | Wilkinson T et al. — Beyond weight loss: a narrative review of tirzepatide's impact on muscle and lean mass in people with overweight and obesity | *Curr Med Res Opin*, 2026 | Narrative review | [PMID 42806732](https://pubmed.ncbi.nlm.nih.gov/42806732/) |
| | **Plateaus, adaptation, regain** | | | |
| 61 | Nunes CL et al. — Does adaptive thermogenesis occur after weight loss in adults? A systematic review | *Br J Nutr*, 2022 | Systematic review | [PMID 33762040](https://pubmed.ncbi.nlm.nih.gov/33762040/) |
| 62 | Fothergill E et al. — Persistent metabolic adaptation 6 years after "The Biggest Loser" competition | *Obesity (Silver Spring)*, 2016 | Longitudinal cohort (extreme case series) | [PMID 27136388](https://pubmed.ncbi.nlm.nih.gov/27136388/) |
| 63 | Sumithran P et al. — Long-term persistence of hormonal adaptations to weight loss | *N Engl J Med*, 2011 | Prospective cohort | [PMID 22029981](https://pubmed.ncbi.nlm.nih.gov/22029981/) |
| 64 | Tejera C et al. — Weight regain after obesity treatment: mechanisms, predictors, and real-world evidence from the IGOBE program | *Rev Endocr Metab Disord*, 2026 | Narrative review | [PMID 42547731](https://pubmed.ncbi.nlm.nih.gov/42547731/) |
| 65 | Aronne LJ et al. — Continued Treatment With Tirzepatide for Maintenance of Weight Reduction in Adults With Obesity: The SURMOUNT-4 Randomized Clinical Trial | *JAMA*, 2024 | RCT (SURMOUNT-4) | [PMID 38078870](https://pubmed.ncbi.nlm.nih.gov/38078870/) |
| | **Activity / steps** | | | |
| 66 | Macena ML et al. — Association between sitting/lying down, standing, walking time and number of steps per day with the hormonal profile and resting energy expenditure of women with obesity living in a low-income region | *Br J Nutr*, 2022 | Cross-sectional/observational | [PMID 34526156](https://pubmed.ncbi.nlm.nih.gov/34526156/) |
| 67 | Yoshimura E et al. — Long-term Effects of the Use of a Step Count-Specific Smartphone App on Physical Activity and Weight Loss: Randomized Controlled Clinical Trial | *JMIR Mhealth Uhealth*, 2022 | RCT | [PMID 36279159](https://pubmed.ncbi.nlm.nih.gov/36279159/) |
---

## 4. Non-journal sources used

| Source | Used for | Link |
|---|---|---|
| USDA FoodData Central — SR Legacy dataset (CSV) | All nutrition values in `01` | <https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip> |
| USDA FoodData Central — food search (by FDC ID) | Labelled search links per food in `01` (e.g. cabbage 169975, potato 170093, chicken breast 171477) | <https://fdc.nal.usda.gov/food-search> |
| Somali Researchers Association market price dashboard | Estimated local food prices | <https://www.sra.so/market-price/> |
| Numbeo (Mogadishu) | Estimated local food prices | <https://www.numbeo.com/food-prices/in/Mogadishu-Somalia> |
| Livingcost.org (Mogadishu) | Estimated local food prices | <https://livingcost.org/cost/somalia/mogadishu> |
| iHerb product pages (verified 1 Nov 2026) | Verified product prices/links in `09` | see `09` §5 |

Phase-1 sources (including NICE guidance NG246 and the obesity pharmacotherapy trials) remain in `22_RESEARCH_REFERENCES.md` and are not duplicated here.

---

## 5. Evidence quality by topic — honest summary

| Topic | Best available evidence | Confidence in the practical recommendation |
|---|---|---|
| Protein for satiety and lean mass | Multiple RCTs + meta-analyses | **High** |
| Energy density / volume eating | Inpatient RCT + controlled feeding | **High** |
| Sleep duration and body composition | Controlled inpatient trial + RCT | **High** (for intake/composition), **moderate** as a standalone weight-loss treatment |
| IF vs continuous restriction | Meta-analyses of RCTs + 12-month RCTs | **High** that they are equivalent; **low** for any unique benefit |
| Refeeding syndrome | Clinical review + case literature + ICU meta-analysis | **High** for the syndrome and at-risk groups; **high** confidence that ordinary IF does not require it |
| Human autophagy from fasting | Biomarker-level trial only | **Low** — no outcome evidence, no hour thresholds |
| Adaptive thermogenesis | Systematic review + one extreme cohort | **Moderate** — real but variable and often overstated |
| Psyllium for constipation/LDL | Meta-analyses | **High** for constipation and LDL; **low** for weight |
| Electrolytes in routine fasting | Consensus statement (mostly exercise setting) | **Moderate** — clear risk ceiling, no routine benefit |
| Stress/emotional eating | Mostly observational, heterogeneous | **Low–moderate** — behavioural advice only |
| Local Somali food prices | Third-party dashboards only | **Low** — Estimated, unverified |

---

## 6. Claims searched for and rejected (do not reintroduce)

| Claim | Status in this module | Reason |
|---|---|---|
| "Fasting triggers autophagy at hour X in humans" | **Not made** | No human outcome data; only biomarker-level findings ([Espinoza 2026](https://pubmed.ncbi.nlm.nih.gov/41372565/)) |
| "Fasting boosts metabolism / burns more fat" | **Rejected** | Small or absent expenditure effects; adaptation offsets them |
| "Foods raise GLP-1 like Ozempic" | **Rejected as equivalence** | Physiological post-meal rise is not comparable to pharmacological agonism; no clinical weight-loss evidence |
| "Insulin must be lowered to lose fat" | **Rejected** | Not supported by controlled isocaloric comparisons |
| "You can prevent muscle loss with a supplement alone" | **Rejected** | Resistance training + protein are the levers ([Morton 2018](https://pubmed.ncbi.nlm.nih.gov/28698222/)) |
| "1.6 g/kg of total bodyweight for everyone" | **Rejected** | Wrong denominator in obesity; see `06` §3.3 |
| "Reverse dieting fixes metabolism" | **Rejected** | No RCT support as a distinct method |
| "Diet breaks accelerate fat loss" | **Downgraded** | Adherence tool; MATADOR is suggestive, not definitive ([Byrne 2018](https://pubmed.ncbi.nlm.nih.gov/28925405/)) |
| "You need 4 L water/day to lose fat" | **Rejected** | No evidence; over-drinking has a documented risk ([Hew-Butler 2015](https://pubmed.ncbi.nlm.nih.gov/26227507/)) |
| "Salt water flush / detox" | **Rejected as dangerous** | Laxative/electrolyte risk |
| "Psyllium absorbs fat" | **Rejected** | Mechanism claim; small LDL effect is real ([Jovanovski 2018](https://pubmed.ncbi.nlm.nih.gov/30239559/)) |
| "Potassium/magnesium supplements for everyone" | **Rejected** | Food sources suffice; supplements carry real risk in kidney disease |
| "You must break a fast in a specific way even after 16 h" | **Rejected** | Ordinary IF needs no refeeding protocol ([Mehanna 2008](https://pubmed.ncbi.nlm.nih.gov/18583681/) applies to malnutrition) |
| "Natural appetite suppressants work" | **Rejected** | Absent/weak evidence (glucomannan's small effect noted, [Sood 2008](https://pubmed.ncbi.nlm.nih.gov/18842808/)) |
| "Fat burners / thermogenics" | **Rejected** | Unproven, stimulant risk |
| "Metabolic damage is permanent" | **Rejected** | Adaptation is real but modest and partly reversible ([Nunes 2022](https://pubmed.ncbi.nlm.nih.gov/33762040/)) |

---

## 7. Limitations of this module

1. **No primary data.** This is a synthesis; every conclusion depends on the quality of the cited literature.
2. **Sample sizes and durations.** Many satiety studies are small, single-meal, crossover designs in young, lean adults. Effects on 12-month fat loss are inferred, not always directly demonstrated.
3. **Population transfer.** Most trial populations are North American/European. Somali diets, body composition baselines, physical activity in heat, and fasting practices (Ramadan) differ; the *principles* transfer better than the *numbers*.
4. **Publication date skew.** PubMed ranking favours recent papers; several 2025–2026 sources are included because they are genuinely newer syntheses, but older landmark work was deliberately retrieved by title/author.
5. **Price unreliability.** No verified local prices. Budget decisions should be based on your own shopping, recorded and labelled.
6. **Under-represented topics in the literature:** stress eating; adherence to fasting beyond 12 weeks; long-term outcomes of extended fasting; effect of heat on appetite and hydration in tropical climates; Somali-specific food intake data. These are stated as gaps rather than filled with speculation.

---

## 8. Summary

### 8.1 Strongest verified findings (about the evidence base itself)
1. The five highest-value interventions in this module rest on **multiple RCTs and meta-analyses**, not on single trials: protein ([Weigle 2005](https://pubmed.ncbi.nlm.nih.gov/16002798/); [Morton 2018](https://pubmed.ncbi.nlm.nih.gov/28698222/)), energy density ([Hall 2019](https://pubmed.ncbi.nlm.nih.gov/31105044/)), sleep ([Nedeltcheva 2010](https://pubmed.ncbi.nlm.nih.gov/20921542/); [Tasali 2022](https://pubmed.ncbi.nlm.nih.gov/35129580/)), eating rate ([Forde 2026](https://pubmed.ncbi.nlm.nih.gov/41314613/)) and fibre ([Reynolds 2019](https://pubmed.ncbi.nlm.nih.gov/30638909/)).
2. The most-marketed claims (autophagy timing, "metabolic damage", natural GLP-1 effects, extended fasting superiority) have the **weakest** human evidence in the entire module.
3. **No human trial shows a food pattern producing pharmacotherapy-scale weight loss.** Nothing here claims otherwise.
4. Nutrition values are reproducible from a public dataset; **local prices are not** — every Somali price is Estimated or Unknown.

### 8.2 Most practical actions
Cite-check before believing: if a claim has no design label, it has no weight. Use §5 to calibrate confidence, and §6 to check whether a claim was already examined and rejected.

### 8.3 Cheapest effective options
The public sources used here are free: PubMed, USDA FoodData Central, and the three price dashboards. No paid database or subscription was required for any conclusion in this module.

### 8.4 What is unnecessary
Paid literature aggregators, "expert" course material, and any secondary summary (including this one) taken without checking the underlying record.

### 8.5 What is unsupported or misleading
Citing a mechanistic review as if it were outcome evidence; quoting effect sizes from abstracts without reading whether the endpoint was statistically significant; presenting crowdsourced prices as verified; presenting 2025–2026 preprints/press releases as established findings.

### 8.6 Important risks
Acting on a single small study; generalising US/EU trial populations to Somali diets and body composition; using Estimated prices for real budgeting; treating a corrected error (see §2.2) as if the process were error-free — verification reduces but does not eliminate mistakes, which is why every link is provided.

### 8.7 Concise action plan
1. Read §5 (evidence quality by topic) before acting on any single file.
2. Follow every link for any claim you intend to act on.
3. Re-check any local price yourself and label it **Verified local price** with a date.
4. Re-run the verification method in §2 if a source is ever in doubt.

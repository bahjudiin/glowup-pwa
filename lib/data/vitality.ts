import type { Article, Category, SubTab } from '@/lib/types';

/**
 * Big D — Men's Vitality Guide.
 *
 * Ported from the GlowUp PWA "Big D" ebook (index.html#h-bigd on the `master`
 * branch) into the research-library data model, so the guide is reachable by
 * category tab, sub-tab, search and filters like every other section.
 */

export const VITALITY_CATEGORY: Category = {
  id: 'mens-vitality',
  title: "Big D — Men's Vitality",
  subtitle: 'Sexual health, fertility, testosterone & attraction',
  icon: 'BookOpen',
  color: 'bg-red-500/20 text-red-400 border-red-500/30',
  fileIds: ['27'],
  articleCount: 5,
};

export const VITALITY_SUBTABS: SubTab[] = [
  {
    id: 'sexual-function',
    title: 'Sexual Function',
    icon: 'HeartPulse',
    description: 'Erectile function, blood flow, stress and the hormone axis',
    articleIds: ['big-d-sexual-function'],
  },
  {
    id: 'premature-ejaculation',
    title: 'Premature Ejaculation',
    icon: 'Timer',
    description: 'Dopamine, serotonin and the control loop',
    articleIds: ['big-d-pe'],
  },
  {
    id: 'fertility',
    title: 'Fertility',
    icon: 'Droplet',
    description: 'Sperm health, LH/FSH signalling and key enhancers',
    articleIds: ['big-d-fertility'],
  },
  {
    id: 'attraction',
    title: 'Attraction',
    icon: 'Sparkles',
    description: 'Androgen signs, pheromones and presentation',
    articleIds: ['big-d-attraction'],
  },
  {
    id: 'testosterone',
    title: 'Low Testosterone',
    icon: 'Zap',
    description: 'Boost LH & dopamine, fix deficiencies, manage serotonin',
    articleIds: ['big-d-testosterone'],
  },
];

export const VITALITY_ARTICLES: Article[] = [
  {
    id: 'big-d-sexual-function',
    title: 'Sexual Function & Erectile Function',
    summary:
      'Stress is the single biggest driver of erectile dysfunction — and the hormone axis that recovers it runs through sleep, nutrition and stimulus control.',
    categoryId: 'mens-vitality',
    subTabId: 'sexual-function',
    fileId: '27',
    evidenceGrade: 'Moderate',
    costTier: 'Low',
    difficulty: 'Medium',
    readTime: '9 min',
    tags: ['big-d', 'ed', 'erectile', 'blood-flow', 'nitric-oxide', 'stress'],
    icon: 'HeartPulse',
    content: `## Stress: the root cause

Stress is the number one reported cause of erectile dysfunction and premature ejaculation.
Chronic stress drives catabolic processes that deplete nutrients, blunt testosterone and
narrow the focus that sexual function depends on.

**Hormones that support sexual function**

- Testosterone
- DHT
- Thyroid hormone
- Progesterone
- DHEA
- Dopamine
- Acetylcholine
- Nitric oxide

**Hormones that work against it**

- Cortisol
- Prolactin
- Estrogen (excess)
- Serotonin (excess)
- Oxidative stress

## Erectile function: the facts

- Around 30% of men under 30 and 25% of men under 40 report erectile dysfunction. This is not
  only an older-man issue.
- **Avoid:** beer, cigarettes, fast food (PUFAs), prolonged sitting, tight underwear.
- Sleep is the first line of defence — melatonin is a powerful antioxidant that protects nerves.
- Hydrogen sulfide (H2S) from sulfur-rich foods such as garlic and onion acts as an alternative
  vasodilator to nitric oxide.

## Herbal and food support

- **Ashwagandha** — reduces stress around 20%, supports blood flow and testosterone.
- **Tribulus terrestris** — lowers prolactin and estrogen, raises dopamine. Minimum 120 mg
  protodioscin per day.
- **Mucuna pruriens** — L-DOPA precursor; raises dopamine and testosterone, lowers serotonin.
- **Butea superba** — raises DHT, which matters for libido drive.
- **Tongkat ali** — aromatase inhibitor and PDE-5 inhibitor; improves blood flow.
- **Horny goat weed (epimedium)** — natural PDE-5 inhibitor.
- **Maca** — improves oxygenation and endurance; 2–4 g daily over 12 weeks.
- **Ginkgo biloba** — antioxidant, improves circulation, helps counter excess serotonin.

## Vasodilatory foods

- Cacao, beets, pomegranate and watermelon boost nitric oxide.
- Garlic combined with vitamin C increases nitric oxide production substantially.
- Ginger reduces serotonin via the 5-HT3 receptor.

## What to do first

1. Sleep 7–9 hours, consistently.
2. Train three to five times a week and add a weekly zone-2 session.
3. Fix the diet: protein, vegetables, and cut alcohol to near zero for two weeks.
4. Only then evaluate supplements.

> Medical note: persistent erectile dysfunction is a cardiovascular risk marker. Get blood
> pressure, fasting glucose and lipids checked before treating it as a purely sexual problem.`,
  },
  {
    id: 'big-d-pe',
    title: 'Premature Ejaculation',
    summary:
      'Premature ejaculation is usually low dopamine plus elevated serotonin or adrenaline — a nervous-system control problem before it is a supplement problem.',
    categoryId: 'mens-vitality',
    subTabId: 'premature-ejaculation',
    fileId: '27',
    evidenceGrade: 'Moderate',
    costTier: 'Free',
    difficulty: 'Medium',
    readTime: '6 min',
    tags: ['big-d', 'pe', 'premature-ejaculation', 'dopamine', 'serotonin'],
    icon: 'Timer',
    content: `## The mechanism

Premature ejaculation is caused by low dopamine combined with elevated serotonin or adrenaline.
That combination narrows the window between arousal and climax.

**How to shift it**

- **Raise acetylcholine** — egg yolks, liver and royal jelly all feed acetylcholine synthesis,
  which supports dopamine.
- **Support dopamine and calm** — taurine supports dopamine and GABA together, which is the
  balance you want: present, not flat.
- **Lower excess serotonin** — magnesium regulates serotonin and calms the nervous system;
  ginkgo helps counter excess serotonin.
- **Cut adrenaline spikes** — caffeine, alcohol and sleep debt all raise sympathetic tone.

## Practical protocol

1. **Sleep first.** Under-sleeping raises serotonin and lowers dopamine; it alone reproduces
   the pattern.
2. **Train the exhale.** Slow, nasal breathing with a long exhale before and during sex lowers
   sympathetic activation.
3. **Start-stop and squeeze technique**, 3 sets of 10, three times a week for four weeks.
4. **Reduce alcohol.** It worsens early ejaculation and erections simultaneously.
5. **Consider a topical anaesthetic** (lidocaine/prilocaine) if behavioural work is not enough.
   It is the highest-evidence intervention for PE.

> See a clinician if PE is new, sudden, or comes with pain, blood in the semen, or testicular
> changes.`,
  },
  {
    id: 'big-d-fertility',
    title: 'Fertility & Sperm Health',
    summary:
      'Sperm production runs on LH and FSH and is highly sensitive to endocrine disruptors, heat and oxidative stress.',
    categoryId: 'mens-vitality',
    subTabId: 'fertility',
    fileId: '27',
    evidenceGrade: 'Moderate',
    costTier: 'Low',
    difficulty: 'Medium',
    readTime: '8 min',
    tags: ['big-d', 'fertility', 'sperm', 'lh', 'fsh', 'shilajit', 'cistanche'],
    icon: 'Droplet',
    content: `## What controls sperm production

- **LH** (luteinising hormone) signals the testes to produce testosterone.
- **FSH** (follicle-stimulating hormone) signals Sertoli cells to drive sperm production.
- **Xenoestrogens** — plastics, phthalates and other endocrine disruptors — reduce sperm counts.
  This is one of the highest-leverage changes and it is free.

## Key enhancers

- **Ginger** — associated with roughly +16% sperm count and improved LH/FSH/testosterone.
- **Vitamin E** — the fertility vitamin; protects sperm membranes from PUFA damage.
- **Vitamin K2** — supports testosterone and Leydig cell function.
- **Shilajit** — associated with roughly +37.6% sperm quality, +61.4% sperm count and +23.5%
  testosterone in trial data.
- **Cistanche** — restores kisspeptin signalling, which is essential for reproduction.
- **Royal jelly** — associated with roughly +20% testosterone over three months.
- **Maca** — increases sperm count and semen quality.
- **Raw onion and garlic** — improve sperm number and motility.

## Baseline for both partners

1. Both partners get a semen analysis and hormone panel before anything else.
2. Check for a varicocele — it is common, correctable and frequently missed.
3. Two to three months of targeted lifestyle work, then re-test. Sperm cycles run about 74 days,
  so anything you change today shows up in a quarter, not tomorrow.
4. Keep the testes cool: avoid prolonged hot baths, laptop on the lap, and tight synthetic
   underwear.

> Sperm quality falls sharply after 35 and more steeply after 40. If you want children, do not
> leave this to later.`,
  },
  {
    id: 'big-d-attraction',
    title: 'Attraction & Androgen Signs',
    summary:
      'Androsterone in sweat, a broad jaw, lower vocal pitch and vascularity are the observable correlates of higher testosterone and DHT.',
    categoryId: 'mens-vitality',
    subTabId: 'attraction',
    fileId: '27',
    evidenceGrade: 'Low',
    costTier: 'Free',
    difficulty: 'Easy',
    readTime: '6 min',
    tags: ['big-d', 'attraction', 'pheromones', 'androgens', 'dht'],
    icon: 'Sparkles',
    content: `## Androgen signs

- **Hair** — healthy hair is a virility signal driven by testosterone and DHT.
- **Face** — a broad jawline and high cheekbones read as higher testosterone.
- **Voice** — a lower pitch reflects greater DHT exposure during puberty.
- **Body** — broad shoulders, a lean waist and visible vascularity.
- **Grip** — forearm strength correlates with testosterone.

## Pheromones

- Androsterones in sweat increase attraction via a musky odour.
- Exercise-induced sweating raises pheromone levels.
- An animal-based diet raises musky body odour.
- Avoid over-washing with harsh chemicals — it destroys the skin microbiome that produces the
  scent signal.

## Practical levers

1. **Lose body fat.** Visceral fat is the strongest single driver of low testosterone. At 15%
   body fat and below, testosterone typically normalises for most men.
2. **Train heavy and compound.** Squat, hinge, press, pull. Heavy compound work is the strongest
   non-supplement testosterone lever there is.
3. **Fix sleep.** Seven to nine hours. Single night of five-hour sleep measurably suppresses
   testosterone the next day.
4. **Cut the obvious.** Alcohol, cigarettes and chronic stress suppress testosterone and DHT
   simultaneously.
5. **Presentation compounds the biology.** Good grooming, posture, a fitted haircut and clean
   skin change how the same testosterone is read.

> These signals are real but modest. Behaviour, status and hygiene move perceived attraction
> further than any single hormone.`,
  },
  {
    id: 'big-d-testosterone',
    title: 'Fixing Low Testosterone',
    summary:
      'Low testosterone is usually a supply-chain problem: sleep, training, body fat, nutrients and endocrine disruptors, checked in that order.',
    categoryId: 'mens-vitality',
    subTabId: 'testosterone',
    fileId: '27',
    evidenceGrade: 'Moderate',
    costTier: 'Low',
    difficulty: 'Medium',
    readTime: '8 min',
    tags: ['big-d', 'testosterone', 'lh', 'dopamine', 'deficiencies', 'emf'],
    icon: 'Zap',
    content: `## Boost LH and dopamine

Ginger, taurine, cistanche, mucuna and manganese support the GnRH to LH to FSH to testosterone
cascade. Adequate sleep is the largest single input to that cascade.

## Fix the deficiencies

Testosterone is a nutrient-dependent hormone. Correct these first and the hormone usually
responds without drugs.

- **Vitamins A, K2, E, D and the B complex** — required for hormone synthesis.
- **Zinc, selenium and iodine** — support thyroid function and testosterone.
- **Shilajit** — mitochondrial and hormonal support.
- **Boron and magnesium** — improve free testosterone and reduce estrogen.

## Manage serotonin

Excess serotonin suppresses libido and drive.

- Magnesium regulates serotonin and calms the nervous system.
- Ginkgo counters serotonin excess and enhances blood flow.
- Ginger reduces gut serotonin via the 5-HT3 receptor.
- L-theanine reduces anxiety and boosts antioxidant status.

## Avoid the disruptors

- **Xenoestrogens** — avoid plastics, phthalates and endocrine disruptors.
- **EMFs** — increase calcium influx and impair gonadal function. Mitigation: magnesium,
  grounding, and blue-light glasses in the evening.
- Alcohol, cigarettes and chronic sleep debt all suppress the axis.

## The order that works

1. **Sleep** 7–9 hours, consistent.
2. **Body fat** down to 12–15%.
3. **Heavy compound training**, 3–4 times a week.
4. **Diet**: enough protein, enough fat, vegetables, minimal alcohol.
5. **Test** total and free testosterone, SHBG, LH, FSH and thyroid before touching anything
   else.

> Medical note: if total testosterone is low twice, morning-tested, with symptoms, see a
> clinician. Do not self-prescribe testosterone: exogenous T suppresses your own axis, shrinks
> testes and can permanently affect fertility.`,
  },
];

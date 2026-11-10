import type { Article, SubTab } from '@/lib/types';

/**
 * Sleep & Recovery — tier-3 sub-tabs and article bodies.
 *
 * The category already existed but carried only two card-sized summaries with no
 * sub-tab structure and no body content, so "Sleep" was a dead end in the UI.
 */

export const SLEEP_SUBTABS: SubTab[] = [
  {
    id: 'sleep-protocol',
    title: 'Sleep Protocol',
    icon: 'Moon',
    description: 'Duration, timing, CBT-I and apnea screening',
    articleIds: ['sleep-recovery'],
  },
  {
    id: 'recovery',
    title: 'Sleep Debt & Recovery',
    icon: 'RotateCcw',
    description: 'Paying off a deficit, naps, alcohol and training load',
    articleIds: ['sleep-debt-recovery'],
  },
  {
    id: 'appetite',
    title: 'Appetite & Satiety',
    icon: 'Utensils',
    description: 'How sleep loss drives hunger and what reverses it',
    articleIds: ['appetite-satiety'],
  },
];

export const SLEEP_ARTICLES: Article[] = [
  {
    id: 'sleep-recovery',
    title: 'Sleep & Recovery',
    summary:
      'Sleep is the highest-leverage intervention in the whole protocol — it gates appetite, testosterone, training adaptation and stress.',
    categoryId: 'sleep-recovery',
    subTabId: 'sleep-protocol',
    fileId: '11',
    evidenceGrade: 'Moderate-High',
    costTier: 'Free',
    difficulty: 'Medium',
    readTime: '9 min',
    tags: ['sleep', 'apnea', 'cbt-i', 'circadian', 'recovery'],
    icon: 'Moon',
    content: `## Why sleep comes first

Sleep is upstream of almost everything else in this protocol. Short sleep raises hunger,
lowers testosterone, blunts training adaptation and increases stress reactivity. Fixing sleep
first makes every other intervention cheaper and more effective.

## The baseline

- **7–9 hours**, every night, for eight weeks before you judge anything.
- **Same wake time** every day, including weekends. Wake time anchors the circadian clock.
- **Morning daylight**: 10–20 minutes of outdoor light within an hour of waking.
- **Cool room**, roughly 18–19 C, and blackout if you can manage it.

## Caffeine and timing

- Caffeine has a half-life of about 5–6 hours. A 14:00 coffee is still half-active at 20:00.
- **Cut off 8–10 hours before bed.** If you must, the caffeine is the thing to move first.
- Alcohol fragments the second half of the night even when it helps you fall asleep.

## Screen for sleep apnoea

Snoring, witnessed apnoeas, morning headaches, dry mouth and unrefreshing sleep are the
classic signs. Apnoea causes intermittent hypoxia, which suppresses testosterone and
contributes to hypertension and weight gain.

A home sleep-apnoea test or a proper polysomnogram is worth it if any of those apply.
Treating moderate-to-severe apnoea is one of the highest-return interventions available.

## CBT-I for insomnia

If you cannot sleep, cognitive behavioural therapy for insomnia (CBT-I) outperforms
sleeping pills over the long term and has no dependence risk.

The core rules:

- Get out of bed if you are awake more than 20 minutes. Do not lie there frustrated.
- No naps after 15:00.
- Fixed wake time, even after a bad night. Never "sleep in" to compensate — it makes the next
  night worse.
- If you cannot sleep, get up, do something dull in dim light, and return when sleepy.

## If you are sleep-deprived right now

Do not try to catch up in one weekend. Sleep debt is repaid in the following week, and the
cost of an all-nighter is larger than the benefit of an extra two hours on Sunday.

Fix one night at a time, starting tonight, and hold the wake time steady while you climb
back.`,
  },
  {
    id: 'sleep-debt-recovery',
    title: 'Sleep Debt & Recovery',
    summary:
      'How to pay back a sleep deficit without wrecking your training week, and how training load, alcohol and naps interact with sleep.',
    categoryId: 'sleep-recovery',
    subTabId: 'recovery',
    fileId: '11',
    evidenceGrade: 'Moderate',
    costTier: 'Free',
    difficulty: 'Medium',
    readTime: '7 min',
    tags: ['sleep', 'sleep-debt', 'recovery', 'naps', 'training-load'],
    icon: 'RotateCcw',
    content: `## What sleep debt actually does

A week of 5-hour nights does not feel like a debt you repay on the weekend. It carries
forward for days: reaction time, insulin sensitivity, testosterone, mood and training
adaptation all stay impaired for several nights after you start sleeping enough again.

## Paying it back

- **Climb, do not crash.** Add 20–30 minutes per night rather than doubling the total on one
  night. Longer single nights distort the circadian rhythm and often feel worse.
- **Anchor the wake time.** This matters more than the bedtime. Keep it fixed and the sleep
  pressure will do the rest.
- **Expect 5–7 nights** of consistent adequate sleep to feel meaningfully different, and
  2–3 weeks to fully recover metabolic markers.
- **Resume hard training last.** Rebuild intensity before volume.

## Naps

- **20 minutes, before 15:00.** Long enough to clear sleep pressure, short enough not to
  impair night sleep.
- **Never replace** a night of sleep with a nap.
- A 10-minute nap is a legitimate performance tool before a hard session or a long drive.

## Alcohol

- Alcohol shortens sleep onset but fragments the night and suppresses REM.
- It also suppresses testosterone for hours afterwards.
- Two or more drinks in the evening can meaningfully cut deep sleep even when total time in
  bed looks fine.
- If you drink, move it earlier and stop at least four hours before bed.

## Training load

- If sleep drops below six hours for two nights in a row, cut volume by half, not intensity.
- More training on top of a sleep deficit is how injuries happen.
- The most common cause of a stalled fat-loss plateau is under-recovery, not insufficient
  effort.

## A simple rule

If your resting heart rate is up, you are unusually tired, your motivation is gone, and your
sleep is poor, you are not lazy. You are under-recovered. Deload, sleep, and come back.`,
  },
  {
    id: 'appetite-satiety',
    title: 'Appetite & Satiety',
    summary:
      'Protein, fibre, food volume and sleep are the four levers that reliably reduce intake by 300–700 kcal a day without counting calories.',
    categoryId: 'sleep-recovery',
    subTabId: 'appetite',
    fileId: '05',
    evidenceGrade: 'Moderate-High',
    costTier: 'Free',
    difficulty: 'Easy',
    readTime: '8 min',
    tags: ['appetite', 'satiety', 'protein', 'fibre', 'volume-eating'],
    icon: 'Utensils',
    content: `## The four levers

1. **Protein** — the single strongest appetite signal. Keep total daily protein at
   1.6–2.4 g/kg of body weight.
2. **Fibre** — 25–38 g a day. Psyllium, legumes and whole vegetables deliver this cheaply.
3. **Volume** — low-energy-density foods. Cabbage at 25 kcal/100 g versus almonds at 580
   kcal/100 g means you can eat an enormous amount of the first for almost nothing.
4. **Sleep** — one or two short nights measurably increase ghrelin (hunger hormone) and
   decrease leptin (satiety hormone). Under-sleeping makes you hungrier the next day.

## What a 300–700 kcal reduction looks like

You do not have to count calories. Typical combinations:

- Add one 30 g protein serving and one extra serving of vegetables at lunch and dinner.
- Swap refined grains for legumes in two meals.
- Replace liquid calories with water or unsweetened drinks.
- Cut alcohol to weekends only.
- Eat the same food but add a large low-calorie salad first.

Together these usually take 300–700 kcal a day out of your intake without a single weighing
of food.

## The ordering trick

Protein, fibre and volume work because they change the signals your gut sends your brain.
Volume eating works because it takes 15–20 minutes to eat 500 kcal of vegetables and a
similar volume of nuts.

## Watch the weekend

Weekly averages hide the damage. A week at 2200 kcal followed by a weekend at 4000 kcal does
not average out in your favour — appetite regulation, insulin sensitivity and training
adherence all suffer for the days after.

Keep the weekend within roughly 15% of the weekday average. That is the single most
predictable behaviour for people who stall in the last two weeks of a cut.

## If hunger is extreme

Extreme hunger is a signal that something is wrong — usually too little protein, too little
sleep, too little food volume, or too aggressive a deficit. Do not white-knuckle it.
Fix the input before you fight the output.`,
  },
];

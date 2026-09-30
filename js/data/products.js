// ─────────────────────────────────────────────────────────────
// PRODUCTS — one catalogue for everything the app recommends.
//
// This is the single source for the Products screen. The scattered
// per-topic tables that used to live inside the Health and Grooming
// panes are gone; inline shop buttons inside routines stay, because
// those are the actionable step, not a reference list.
//
// cat      -> filter group (rendered as sub-tabs)
// tier     -> budget | mid | premium  (used by the sort + "tier" chips)
// from     -> the pane that recommends it, shown for context
// ─────────────────────────────────────────────────────────────

const A = q => ({ label: 'Amazon', url: 'https://www.amazon.com/s?k=' + q });
const I = q => ({ label: 'iHerb', url: 'https://www.iherb.com/search?kw=' + q });

export const PRODUCT_CATS = [
  { id: 'eyes', label: 'Eyes', icon: '\u{1F441}\uFE0F', tone: 'accent' },
  { id: 'lips', label: 'Lips', icon: '\u{1F444}', tone: 'pink' },
  { id: 'teeth', label: 'Teeth', icon: '\u{1F9B7}', tone: 'blue' },
  { id: 'face', label: 'Face & Skin', icon: '\u{1F9F4}', tone: 'gold' },
  { id: 'hair', label: 'Hair & Beard', icon: '\u{1F487}', tone: 'green' },
  { id: 'body', label: 'Body Care', icon: '\u{1F6CB}\uFE0F', tone: 'orange' },
  { id: 'style', label: 'Style & Fragrance', icon: '\u{1F457}', tone: 'accent' },
  { id: 'nutrition', label: 'Nutrition', icon: '\u{1F957}', tone: 'red' }
];

export const PRODUCTS = [
  // ── EYES ────────────────────────────────────────────────────
  { cat: 'eyes', tier: 'mid', name: 'Lutein & Zeaxanthin', benefit: 'Internal sunglasses — filters blue light', from: 'Eyes', shop: [A('lutein+zeaxanthin+supplement'), I('lutein+zeaxanthin')] },
  { cat: 'eyes', tier: 'mid', name: 'Omega-3 (EPA/DHA)', benefit: 'Improves tear film, stops dry eye', from: 'Eyes', shop: [A('omega+3+fish+oil+EPA+DHA'), I('omega+3+fish+oil')] },
  { cat: 'eyes', tier: 'budget', name: 'Blue Light Glasses', benefit: 'Blocks digital blue light at night', from: 'Eyes', shop: [A('blue+light+blocking+glasses'), I('blue+light+glasses')] },
  { cat: 'eyes', tier: 'budget', name: 'Vitamin A (Retinol)', benefit: 'Prevents night blindness', from: 'Eyes', shop: [A('vitamin+A+retinol+supplement'), I('vitamin+A+retinol')] },

  // ── LIPS ────────────────────────────────────────────────────
  { cat: 'lips', tier: 'budget', name: "Aquaphor Lip Repair", benefit: 'Deep healing, overnight mask', from: 'Lips', shop: [A('aquaphor+lip+repair')] },
  { cat: 'lips', tier: 'budget', name: 'Vaseline Lip Therapy', benefit: 'Locks in moisture, cheap', from: 'Lips', shop: [A('vaseline+lip+therapy')] },
  { cat: 'lips', tier: 'budget', name: "Burt's Bees Lip Balm", benefit: 'Natural ingredients, SPF option', from: 'Lips', shop: [A('burt+bees+lip+balm')] },

  // ── TEETH ───────────────────────────────────────────────────
  { cat: 'teeth', tier: 'mid', name: 'Crest 3D White Toothpaste', benefit: 'Whitening + enamel protection', from: 'Teeth', shop: [A('crest+3d+white+toothpaste')] },
  { cat: 'teeth', tier: 'premium', name: 'Oral-B Electric Toothbrush', benefit: '2× more plaque removal vs manual', from: 'Teeth', shop: [A('oral+b+electric+toothbrush')] },
  { cat: 'teeth', tier: 'mid', name: 'TheraBreath Mouthwash', benefit: 'Dentist recommended, no burn', from: 'Teeth', shop: [A('therabreath+mouthwash')] },

  // ── FACE & SKIN ─────────────────────────────────────────────
  { cat: 'face', tier: 'mid', name: 'Gentle Face Cleanser', benefit: 'Step 1 of the morning routine', from: 'Face', shop: [A('gentle+face+cleanser'), I('gentle+face+cleanser')] },
  { cat: 'face', tier: 'mid', name: 'Niacinamide Serum', benefit: '3 drops, press into skin', from: 'Face', shop: [A('niacinamide+serum'), I('niacinamide+serum')] },
  { cat: 'face', tier: 'mid', name: 'Light Gel Moisturizer', benefit: 'Pea-sized, non-negotiable step', from: 'Face', shop: [A('light+gel+moisturizer+face'), I('light+gel+moisturizer')] },
  { cat: 'face', tier: 'mid', name: 'SPF 50 Sunscreen', benefit: 'Non-negotiable — wear daily', from: 'Face', shop: [A('SPF+50+sunscreen+face'), I('SPF+50+sunscreen')] },
  { cat: 'face', tier: 'mid', name: 'Matcha', benefit: 'EGCG, cellular DNA repair', from: 'Products', shop: [A('japanese+matcha+green+tea'), I('japanese+matcha')] },
  { cat: 'face', tier: 'budget', name: 'Nori Seaweed', benefit: 'Thyroid + hair support', from: 'Products', shop: [A('nori+seaweed+sheets'), I('nori+seaweed')] },
  { cat: 'face', tier: 'mid', name: 'Vitamin C', benefit: 'Collagen + elasticity', from: 'Products', shop: [A('vitamin+C+supplement'), I('vitamin+C')] },
  { cat: 'face', tier: 'budget', name: 'Jojoba / Cocoa Butter', benefit: 'Soft skin, beard + scalp carrier', from: 'Products', shop: [A('cocoa+butter+jojoba+oil+skin'), I('cocoa+butter')] },

  // ── HAIR & BEARD ────────────────────────────────────────────
  { cat: 'hair', tier: 'mid', name: 'Biotin 5000mcg', benefit: 'Hair + nail growth', from: 'Hair', shop: [A('biotin+5000mcg'), I('biotin+5000mcg')] },
  { cat: 'hair', tier: 'budget', name: 'Rosemary Oil', benefit: 'Natural growth stimulant', from: 'Hair', shop: [A('rosemary+oil+for+hair'), I('rosemary+oil+hair')] },
  { cat: 'hair', tier: 'premium', name: 'Collagen Peptides', benefit: '10 g daily', from: 'Hair', shop: [A('collagen+peptides+powder'), I('collagen+peptides')] },
  { cat: 'hair', tier: 'premium', name: 'Minoxidil 5%', benefit: 'FDA-approved hair loss, 2× daily', from: 'Hair', shop: [A('minoxidil+5%25'), I('minoxidil+5')] },
  { cat: 'hair', tier: 'budget', name: 'Jojoba Oil', benefit: 'Beard + scalp carrier', from: 'Hair', shop: [A('jojoba+oil+hair'), I('jojoba+oil+hair')] },
  { cat: 'hair', tier: 'premium', name: 'Microneedling Dermaroller', benefit: '0.5–1 mm, 1×/week, 4× absorption', from: 'Hair', shop: [A('dermaroller+1mm+scalp')] },
  { cat: 'hair', tier: 'budget', name: 'Beard Oil', benefit: '3–5 drops jojoba/argan on a damp beard', from: 'Beard', shop: [A('beard+oil+jojoba+argan'), I('beard+oil+jojoba')] },
  { cat: 'hair', tier: 'budget', name: 'Beard Brush', benefit: 'Daily grooming and shaping', from: 'Shopping List', shop: [A('beard+brush')] },
  { cat: 'hair', tier: 'mid', name: 'Philips Trimmer', benefit: 'Beard and fade upkeep', from: 'Shopping List', shop: [A('philips+beard+trimmer')] },
  { cat: 'hair', tier: 'mid', name: 'Curling Sponge', benefit: 'Defined sponge curls, texture', from: 'Style', shop: [A('curl+sponge')] },
  { cat: 'hair', tier: 'premium', name: 'Cantu Leave-In Conditioner', benefit: 'Repair + hold for curls', from: 'Daily Routine', shop: [A('cantu+leave+in+conditioner')] },
  { cat: 'hair', tier: 'premium', name: 'Mielle Rosemary Mint Hair & Scalp Oil', benefit: 'Scalp stimulation', from: 'Daily Routine', shop: [A('mielle+rosemary+mint+hair+oil')] },
  { cat: 'hair', tier: 'budget', name: 'Castor Oil', benefit: 'Eyebrows, nightly with spoolie', from: 'Hair', shop: [A('castor+oil+eyebrows'), I('castor+oil+eyebrows')] },
  { cat: 'hair', tier: 'budget', name: 'Satin Bonnet / Silk Pillowcase', benefit: 'Protects curls overnight', from: 'Daily Routine', shop: [A('satin+bonnet')] },

  // ── BODY CARE ───────────────────────────────────────────────
  { cat: 'body', tier: 'budget', name: 'Dove Men+Care Body Wash', benefit: 'Moisturising, gentle', from: 'Body Care', shop: [A('dove+men+body+wash')] },
  { cat: 'body', tier: 'mid', name: 'Native Body Wash', benefit: 'Natural, no parabens', from: 'Body Care', shop: [A('native+body+wash')] },
  { cat: 'body', tier: 'budget', name: 'Nivea Men Body Wash', benefit: 'Deep clean, long-lasting', from: 'Body Care', shop: [A('nivea+men+body+wash')] },
  { cat: 'body', tier: 'budget', name: 'Vaseline Cocoa Glow Lotion', benefit: 'Deep moisture, glow', from: 'Body Care', shop: [A('vaseline+cocoa+glow')] },
  { cat: 'body', tier: 'budget', name: 'Nivea Nourishing Lotion', benefit: '48 hr hydration', from: 'Body Care', shop: [A('nivea+nourishing+lotion')] },
  { cat: 'body', tier: 'mid', name: 'CeraVe Moisturizing Cream', benefit: 'Ceramides, sensitive skin', from: 'Body Care', shop: [A('cerave+moisturizing+cream')] },
  { cat: 'body', tier: 'mid', name: 'CeraVe Foaming Cleanser', benefit: 'Face step 1', from: 'Shopping List', shop: [A('cerave+foaming+cleanser')] },
  { cat: 'body', tier: 'premium', name: 'Beauty of Joseon Relief Sun SPF50+', benefit: 'No white cast, layers well', from: 'Shopping List', shop: [A('beauty+of+joseon+relief+sun+spf50')] },
  { cat: 'body', tier: 'mid', name: 'The Ordinary Niacinamide 10%', benefit: 'Cheap, high strength', from: 'Shopping List', shop: [A('the+ordinary+niacinamide+10')] },
  { cat: 'body', tier: 'budget', name: 'Loofah / Scrub Mitt', benefit: '2×/week, prevents ingrown hairs', from: 'Body Care', shop: [A('loofah+exfoliating+mitt')] },
  { cat: 'body', tier: 'budget', name: 'Antiperspirant + Deodorant', benefit: 'Apply at night for best effect', from: 'Body Care', shop: [A('mens+antiperspirant+deodorant')] },

  // ── STYLE & FRAGRANCE ───────────────────────────────────────
  { cat: 'style', tier: 'budget', name: 'Lattafa Asad', benefit: 'Smoky, bold, club scent', from: 'Fragrance · Budget', shop: [A('lattafa+asad')] },
  { cat: 'style', tier: 'budget', name: 'Lattafa Khamrah', benefit: 'Warm, spicy, evening', from: 'Fragrance · Budget', shop: [A('lattafa+khamrah')] },
  { cat: 'style', tier: 'budget', name: 'Afnan 9PM', benefit: 'Sweet, youthful, versatile', from: 'Fragrance · Budget', shop: [A('afnan+9pm')] },
  { cat: 'style', tier: 'budget', name: 'Nautica Voyage', benefit: 'Aquatic, daily casual', from: 'Fragrance · Fresh', shop: [A('nautica+voyage')] },
  { cat: 'style', tier: 'budget', name: 'Davidoff Cool Water', benefit: 'Classic fresh, office safe', from: 'Fragrance · Fresh', shop: [A('davidoff+cool+water')] },
  { cat: 'style', tier: 'premium', name: 'Dior Sauvage', benefit: 'Universal compliment getter', from: 'Fragrance · Premium', shop: [A('dior+sauvage')] },
  { cat: 'style', tier: 'premium', name: 'Bleu de Chanel', benefit: 'Refined, mature, elegant', from: 'Fragrance · Premium', shop: [A('bleu+de+chanel')] },
  { cat: 'style', tier: 'budget', name: 'White Sneakers', benefit: 'Clean, minimal, works with everything', from: 'Style', shop: [A('white+minimal+sneakers+men')] },
  { cat: 'style', tier: 'budget', name: 'Black Sneakers', benefit: 'Second pair for contrast', from: 'Style', shop: [A('black+minimal+sneakers+men')] },
  { cat: 'style', tier: 'premium', name: 'Minimal Watch', benefit: 'The one accessory that finishes a fit', from: 'Style', shop: [A('minimalist+watch+men')] },
  { cat: 'style', tier: 'budget', name: 'White + Black Tees', benefit: 'Base layer for every fit', from: 'Style', shop: [A('plain+white+tshirt+men'), A('plain+black+tshirt+men')] },

  // ── NUTRITION (from the blueprint's plate + proteins) ───────
  { cat: 'nutrition', tier: 'budget', name: 'Plain Greek Yogurt', benefit: 'Base of the example 1800–2000 kcal day', from: 'Nutrition', shop: [A('plain+greek+yogurt')] },
  { cat: 'nutrition', tier: 'budget', name: 'Cottage Cheese', benefit: 'Snack protein, ~25 g per serving', from: 'Nutrition', shop: [A('cottage+cheese')] },
  { cat: 'nutrition', tier: 'budget', name: 'Chicken Breast', benefit: 'Lean, high protein, versatile', from: 'Nutrition', shop: [A('chicken+breast')] },
  { cat: 'nutrition', tier: 'premium', name: 'Salmon', benefit: 'Omega-3 + lean protein', from: 'Nutrition', shop: [A('salmon+fillet')] },
  { cat: 'nutrition', tier: 'budget', name: 'Eggs', benefit: 'Complete protein, cheap', from: 'Nutrition', shop: [A('eggs')] },
  { cat: 'nutrition', tier: 'budget', name: 'Oats', benefit: 'Slow-release high-fibre carb', from: 'Nutrition', shop: [A('rolled+oats')] },
  { cat: 'nutrition', tier: 'budget', name: 'Chia Seeds', benefit: 'Fibre + omega-3, 10 g a day', from: 'Nutrition', shop: [A('chia+seeds')] },
  { cat: 'nutrition', tier: 'budget', name: 'Lentils', benefit: 'Fibre base — the plate quarter', from: 'Nutrition', shop: [A('green+lentils+dry')] },
  { cat: 'nutrition', tier: 'budget', name: 'Canned Tuna', benefit: 'Zero-carb protein anchor', from: 'Nutrition', shop: [A('canned+tuna')] },
  { cat: 'nutrition', tier: 'budget', name: 'Liquid Egg Whites', benefit: 'High thermic effect, zero fat', from: 'Nutrition', shop: [A('liquid+egg+whites')] },
  { cat: 'nutrition', tier: 'mid', name: 'Avocado', benefit: 'Measured monounsaturated fat', from: 'Nutrition', shop: [A('avocado')] },
  { cat: 'nutrition', tier: 'budget', name: 'Extra Virgin Olive Oil', benefit: 'Measured fat, 1 tsp per meal', from: 'Nutrition', shop: [A('extra+virgin+olive+oil')] },
  { cat: 'nutrition', tier: 'budget', name: 'Tofu / Tempeh / Edamame', benefit: 'Plant protein, variety', from: 'Nutrition', shop: [A('tofu'), A('tempeh'), A('edamame')] },
  { cat: 'nutrition', tier: 'budget', name: 'Frozen Mixed Vegetables', benefit: 'Fast, cheap, zero prep', from: 'Automation', shop: [A('frozen+mixed+vegetables')] },
  { cat: 'nutrition', tier: 'budget', name: 'Walking Shoes', benefit: 'Comfortable, supportive', from: 'Walk', shop: [A('comfortable+walking+shoes+men')] },
  { cat: 'nutrition', tier: 'mid', name: 'Heart Rate Monitor', benefit: 'Keep walks in the moderate zone', from: 'Walk', shop: [A('heart+rate+monitor+watch')] },
  { cat: 'nutrition', tier: 'budget', name: 'Wireless Earbuds', benefit: 'Makes the walk enjoyable', from: 'Walk', shop: [A('wireless+earbuds')] }
];

export const PRODUCT_TIERS = [
  { id: 'all', label: 'All' },
  { id: 'budget', label: 'Budget' },
  { id: 'mid', label: 'Mid' },
  { id: 'premium', label: 'Premium' }
];

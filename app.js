/**
 * STRANDÉ — Premium Cosmetics & Hair Care Community Platform
 * Application Core JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all subsystems
  initTheme();
  initNavigation();
  initQuiz();
  initRoutines();
  initProducts();
  initSulfateFreeFilter();
  initSubscriptions();
  initCommunity();
  initReviewsGallery();
  initKnowledgeJournal();
  initCart();
  initNewsletter();
});

/* ==========================================================================
   1. THEME ENGINE (Espresso Noir <-> Champagne Silk)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const themeIcon = document.getElementById('themeIcon');
  const themeIconMobile = document.getElementById('themeIconMobile');
  
  // Check persisted preference or system preference
  const savedTheme = localStorage.getItem('strande_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);
  
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (themeIcon) themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />`;
      if (themeIconMobile) themeIconMobile.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />`;
    } else {
      document.documentElement.classList.remove('dark');
      if (themeIcon) themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />`;
      if (themeIconMobile) themeIconMobile.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />`;
    }
    localStorage.setItem('strande_theme', theme);
  }
  
  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Espresso Dark' : 'Champagne Light'} mode`);
  }
  
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
}

/* ==========================================================================
   2. NAVIGATION, MOBILE MENU & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const scrollTargets = document.querySelectorAll('section[id], #discover');
  const desktopNavLinks = document.querySelectorAll('#desktopNavLinks .nav-link');
  const mobileNavLinks = document.querySelectorAll('#mobileNavDrawer .mobile-nav-link');
  
  // Dynamic active state tracker for desktop and mobile/tablet drawer
  function updateActiveNavState() {
    const scrollPos = window.scrollY + 160;
    let currentId = 'hero';
    
    scrollTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const height = target.offsetHeight;
      const id = target.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = id;
      }
    });

    // If at bottom of page, highlight the last section (#about)
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.documentElement.scrollHeight - 60) {
      currentId = 'about';
    }

    // Highlight desktop links
    desktopNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Highlight mobile/tablet drawer links
    mobileNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Mobile drawer open/close
  function openMobileNav() {
    updateActiveNavState();
    mobileNavBackdrop.classList.remove('hidden');
    mobileNavDrawer.classList.remove('hidden');
    // Force reflow for smooth transition
    void mobileNavDrawer.offsetWidth;
    mobileNavBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    mobileNavDrawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMobileNav() {
    mobileNavDrawer.classList.add('translate-x-full');
    mobileNavBackdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (mobileNavDrawer.classList.contains('translate-x-full')) {
        mobileNavDrawer.classList.add('hidden');
        mobileNavBackdrop.classList.add('hidden');
      }
    }, 300);
  }
  
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileNav);
  if (closeMobileNavBtn) closeMobileNavBtn.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);
  
  // Close mobile nav when clicking any nav link & set active immediately
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      closeMobileNav();
    });
  });
  
  // Window scroll event
  window.addEventListener('scroll', () => {
    // Back to top visibility
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      }
    }
    
    updateActiveNavState();
  });

  // Initial active state update on page load
  updateActiveNavState();
  
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   3. PRODUCTS DATA REPOSITORY
   ========================================================================== */
const PRODUCTS = [
  {
    id: 'p1',
    name: 'Velvet Silk Nourishing Shampoo',
    category: 'cleansers',
    price: 34,
    rating: 4.9,
    reviewsCount: 412,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    tag: 'Bestseller',
    badge: '100% Sulfate-Free',
    shortDesc: 'Lipid-replenishing wash powered by cold-pressed marula oil and fermented coconut betaine.',
    fullDesc: 'Specially engineered to dissolve sebum and particulate accumulation without disrupting the vital 18-MEA cuticular lipid layer. Infused with cold-pressed marula oil, sodium cocoyl isethionate, and plant-derived phytosterols to preserve moisture equilibrium at a hair-optimal pH of 5.4.',
    keyIngredients: ['Cold-Pressed Marula Oil', 'Fermented Coconut Isothionate', 'Baobab Peptides', 'Panthenol Pro-B5'],
    isSulfateFree: true,
    isSiliconeFree: true,
    isVegan: true,
    isFragranceFree: false,
    hairTypes: ['straight', 'wavy', 'curly', 'coily'],
    concerns: ['dryness', 'color', 'frizz'],
    usage: 'Emulsify a quarter-sized amount between damp palms. Massage into wet scalp for 90 seconds to stimulate microcirculation, then allow the rich lather to rinse smoothly through the lengths.'
  },
  {
    id: 'p2',
    name: 'Hydro-Infusion Weightless Conditioner',
    category: 'conditioners',
    price: 36,
    rating: 4.8,
    reviewsCount: 328,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    tag: 'Award Winner',
    badge: 'Silicone-Free',
    shortDesc: 'Biomimetic moisture emulsion with multi-molecular hyaluronic acid and abyssinian seed sterols.',
    fullDesc: 'Delivers targeted hydration directly into dehydrated cuticles without leaving heavy film or flattening volume. Features 3 molecular weights of hyaluronic acid combined with abyssinian crambe seed oil to seal cuticle scales flat, unlocking instant detangling slip and luminous reflectivity.',
    keyIngredients: ['Multi-Molecular Hyaluronic Acid', 'Abyssinian Crambe Sterols', 'Quinoa Amino Acids', 'Lactic Acid'],
    isSulfateFree: true,
    isSiliconeFree: true,
    isVegan: true,
    isFragranceFree: true,
    hairTypes: ['straight', 'wavy', 'curly'],
    concerns: ['dryness', 'frizz', 'scalp'],
    usage: 'After cleansing, squeeze out excess moisture. Smooth evenly from mid-lengths to ends using fingers or a wide-tooth comb. Leave for 3 minutes before rinsing with cool water to seal the cuticle.'
  },
  {
    id: 'p3',
    name: 'Botanical Peptide Bond Repair Mask',
    category: 'treatments',
    price: 48,
    rating: 5.0,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    tag: 'Cult Favorite',
    badge: 'Bond Rebuilder',
    shortDesc: 'Intense biomimetic restructuring masque restoring broken disulfide bonds in bleached and heat-stressed strands.',
    fullDesc: 'An intensive cellular-grade reconstruction treatment infused with micro-peptides that penetrate through the cuticle into the cortical matrix. Reinforces weakened keratin polypeptide chains, reducing breakage by up to 88% after a single 15-minute steam ritual.',
    keyIngredients: ['Bio-Identical Micro-Peptides', 'Raw Murumuru Butter', 'Hydrolyzed Quinoa', 'Arginine Complex'],
    isSulfateFree: true,
    isSiliconeFree: true,
    isVegan: true,
    isFragranceFree: false,
    hairTypes: ['wavy', 'curly', 'coily'],
    concerns: ['breakage', 'color', 'dryness'],
    usage: 'Apply generously to damp, clean hair from roots to ends. Cover with a warm towel or shower cap for 15-20 minutes. Rinse thoroughly. Use weekly for damaged hair or bi-weekly for maintenance.'
  },
  {
    id: 'p4',
    name: 'Cashmere Cloud Leave-In Moisture Elixir',
    category: 'leavein',
    price: 32,
    rating: 4.9,
    reviewsCount: 295,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    tag: 'Daily Essential',
    badge: '72H Hydration',
    shortDesc: 'Velvety mist enriched with fermented rice bio-ferment and botanical squalane for continuous 72-hour hydration.',
    fullDesc: 'A featherweight barrier shield that locks moisture into the hair fiber while repelling ambient atmospheric humidity. Fermented oryza sativa rice water strengthens elasticity, while sugar-cane squalane delivers a soft-focus silk feel.',
    keyIngredients: ['Fermented Rice Bio-Ferment', '100% Sugarcane Squalane', 'Green Tea Polyphenols', 'Niacinamide'],
    isSulfateFree: true,
    isSiliconeFree: true,
    isVegan: true,
    isFragranceFree: true,
    hairTypes: ['straight', 'wavy', 'curly', 'coily'],
    concerns: ['frizz', 'dryness'],
    usage: 'Spray 4-6 mists evenly over damp hair before detangling or air drying. Can also be applied lightly to dry strands throughout the day to revive moisture and combat static.'
  },
  {
    id: 'p5',
    name: 'Scalp Harmony Microbiome Serum',
    category: 'scalp',
    price: 42,
    rating: 4.8,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    tag: 'Trichologist Choice',
    badge: 'Microbiome Safe',
    shortDesc: 'Clarifying postbiotic drop treatment calming itchy, inflamed scalps and optimizing follicular density.',
    fullDesc: 'Clinical-grade follicular nutrition targeting the scalp microbiome. Balances Malassezia yeast overgrowth with gentle 0.5% lipophilic BHA, postbiotics, and zinc PCA, soothing flaking and calming redness within 14 days of nightly use.',
    keyIngredients: ['Lactobacillus Postbiotic Lysate', 'Zinc PCA', 'Lipophilic Salicylic Acid (0.5%)', 'Organic Rosemary Hydrosol'],
    isSulfateFree: true,
    isSiliconeFree: true,
    isVegan: true,
    isFragranceFree: true,
    hairTypes: ['straight', 'wavy', 'curly', 'coily'],
    concerns: ['scalp', 'breakage'],
    usage: 'Part damp or dry hair into sections. Dispense 1 full pipette directly onto the scalp. Massage with fingertips for 2 minutes using gentle circular motions. Do not rinse.'
  },
  {
    id: 'p6',
    name: 'Nectar Curl Sculpting & Definition Cream',
    category: 'styling',
    price: 38,
    rating: 4.9,
    reviewsCount: 384,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    tag: 'Texture Hero',
    badge: 'Crunch-Free Hold',
    shortDesc: 'Rich conditioning styling butter unlocking bouncy coil clumping, elongation, and frizz-free definition.',
    fullDesc: 'Specifically tailored for 3A-4C patterns seeking definition without crunch or flaking. Combines cold-pressed Cupuaçu butter with golden flaxseed mucilage to lock curl spirals together with touchable elasticity and natural sheen.',
    keyIngredients: ['Raw Cupuaçu Butter', 'Golden Flaxseed Mucilage', 'Mango Seed Butter', 'Hydrolyzed Jojoba Esters'],
    isSulfateFree: true,
    isSiliconeFree: true,
    isVegan: true,
    isFragranceFree: false,
    hairTypes: ['curly', 'coily'],
    concerns: ['frizz', 'dryness', 'curl'],
    usage: 'Section soaking wet hair. Rake a nickel-sized amount through each section from roots to ends. Scrunch upward to encourage curl grouping or finger-coil for enhanced elongation. Diffuse or air dry.'
  },
  {
    id: 'p7',
    name: 'Thermal Veil Biomimetic Heat Shield',
    category: 'styling',
    price: 30,
    rating: 4.7,
    reviewsCount: 178,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    tag: 'Protection',
    badge: '450°F / 230°C Shield',
    shortDesc: '450°F thermal protection spray forming an imperceptible cross-linked defense shield.',
    fullDesc: 'Advanced biomimetic film-formers bond to individual keratin fibers to evenly dissipate blow-dry and flat-iron heat up to 450°F. Prevents protein denaturation, moisture evaporation, and color dulling during heat styling rituals.',
    keyIngredients: ['Hydrolyzed Pea Protein', 'Tremella Snow Mushroom Polysaccharides', 'Beetroot Betaine', 'UV Filters'],
    isSulfateFree: true,
    isSiliconeFree: true,
    isVegan: true,
    isFragranceFree: false,
    hairTypes: ['straight', 'wavy', 'curly', 'coily'],
    concerns: ['breakage', 'color'],
    usage: 'Mist generously through damp hair before blow-drying. When using flat irons or curling wands on dry hair, mist lightly onto each section immediately before applying heat.'
  },
  {
    id: 'p8',
    name: 'Liquid Amber Golden Botanical Hair Oil',
    category: 'leavein',
    price: 46,
    rating: 5.0,
    reviewsCount: 467,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    tag: 'Pure Luxury',
    badge: 'Cold-Pressed',
    shortDesc: 'Cold-pressed golden botanical elixir sealing split ends and conferring mirror-like light reflectivity.',
    fullDesc: 'A luxurious finishing nectar blending wild-harvested Japanese Tsubaki Camellia oil, pure Moroccan argan, and cold-pressed golden jojoba. Instantly closes elevated cuticles, quenches brittle tips, and infuses hair with high-gloss sheen.',
    keyIngredients: ['Japanese Tsubaki Camellia', 'Cold-Pressed Virgin Argan', 'Golden Jojoba Wax Esters', 'Beta-Carotene'],
    isSulfateFree: true,
    isSiliconeFree: true,
    isVegan: true,
    isFragranceFree: false,
    hairTypes: ['straight', 'wavy', 'curly', 'coily'],
    concerns: ['dryness', 'frizz', 'breakage'],
    usage: 'Warm 2-3 drops between palms. Press gently through dry mid-lengths and ends as the final touch to seal in hydration. For deep overnight oiling, apply 1 full dropper directly to scalp and lengths before bed.'
  }
];

/* ==========================================================================
   4. SECTION 02: HAIR TYPE DISCOVERY & DIAGNOSTIC QUIZ
   ========================================================================== */
function initQuiz() {
  const quizQuestions = [
    {
      id: 'texture',
      title: 'What is your primary natural hair texture?',
      subtitle: 'Identify your dominant curl pattern without chemical straighteners or hot tools.',
      options: [
        { label: 'Type 1: Straight', desc: 'Strands fall straight from root to tip; light reflects easily with natural gloss.', value: 'straight', icon: 'M4 8h16M4 12h16M4 16h16' },
        { label: 'Type 2: Wavy', desc: 'Gentle S-shape bends, prone to occasional humidity frizz at temples.', value: 'wavy', icon: 'M4 12c4-8 8 8 12 0s8 8 12 0' },
        { label: 'Type 3: Curly', desc: 'Springy spirals and loops ranging from loose loops to tight corkscrews.', value: 'curly', icon: 'M12 4c-4 0-8 4-8 8s4 8 8 8 8-4 8-8-4-8-8-8z' },
        { label: 'Type 4: Coily / Kinky', desc: 'Tight zig-zag or micro-spiral coils requiring maximum cuticular lipid retention.', value: 'coily', icon: 'M9 3v18M15 3v18M3 9h18M3 15h18' }
      ]
    },
    {
      id: 'scalp',
      title: 'How does your scalp typically behave between wash days?',
      subtitle: 'The scalp microbiome dictates sebum distribution and root health.',
      options: [
        { label: 'Dry & Tight', desc: 'Feels itchy, tight, or shows fine powdery flakes after 24-48 hours.', value: 'dry', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3' },
        { label: 'Balanced & Normal', desc: 'Comfortable, neither dry nor noticeably greasy for 3 to 4 days.', value: 'balanced', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'Oily & Buildup-Prone', desc: 'Roots feel heavy or limp within 24 hours of shampooing.', value: 'oily', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
        { label: 'Combination', desc: 'Oily roots near forehead with dry, itchy sensations at the crown or nape.', value: 'combination', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' }
      ]
    },
    {
      id: 'concerns',
      title: 'What is your primary hair concern right now?',
      subtitle: 'Select the primary barrier standing between you and optimal strand health.',
      options: [
        { label: 'Frizz & Humidity Flare-ups', desc: 'Strands expand and lose definition when ambient moisture rises.', value: 'frizz', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { label: 'Breakage & Split Ends', desc: 'Strands snap easily during detangling, brushing, or styling.', value: 'breakage', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
        { label: 'Chronic Dryness & Dullness', desc: 'Hair absorbs product instantly yet feels coarse, thirsty, and lacks shine.', value: 'dryness', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
        { label: 'Scalp Discomfort & Buildup', desc: 'Flaking, itchiness, or residue that standard washes do not relieve.', value: 'scalp', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
      ]
    },
    {
      id: 'density',
      title: 'How would you describe your hair density and strand diameter?',
      subtitle: 'Density is the number of strands per square inch; diameter is strand thickness.',
      options: [
        { label: 'Fine Diameter / Low-Med Density', desc: 'Easily weighed down by heavy oils; scalp is readily visible.', value: 'fine', icon: 'M6 18L18 6M6 6l12 12' },
        { label: 'Medium Diameter / Medium Density', desc: 'Versatile strand thickness; holds styles with moderate balance.', value: 'medium', icon: 'M5 13l4 4L19 7' },
        { label: 'Coarse Diameter / High Density', desc: 'Strands feel thick and wiry like thread; voluminous and dense.', value: 'coarse', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' }
      ]
    },
    {
      id: 'history',
      title: 'What is your recent chemical or heat styling history?',
      subtitle: 'Helps us calculate protein porosity and cuticular damage levels.',
      options: [
        { label: 'Natural / Virgin Strands', desc: 'No chemical color, bleach, relaxers, or high heat in the past 12 months.', value: 'natural', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
        { label: 'Color-Treated / Glossed', desc: 'Single-process permanent or demi-permanent tint without bleach.', value: 'color', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
        { label: 'Bleached / Highlighted / Balayage', desc: 'High-lift lightener or bleach that has lifted cuticular melanin.', value: 'bleached', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707' },
        { label: 'Frequent Heat Styling (3x+ weekly)', desc: 'Regular flat irons, curling wands, or high-heat blow drying rituals.', value: 'heat', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' }
      ]
    },
    {
      id: 'goals',
      title: 'What is your primary desired outcome for your hair?',
      subtitle: 'We calibrate your routine steps around this fundamental target.',
      options: [
        { label: 'Intense Deep Hydration & Silk Slip', desc: 'Quench chronic thirst and eliminate rough, coarse tactile feel.', value: 'hydration', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
        { label: 'Curl Clumping, Bounce & Elongation', desc: 'Springy, frizz-free curl definition that holds through day 3.', value: 'definition', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
        { label: 'Keratin Bond Repair & Zero Breakage', desc: 'Reinforce cortical tensile strength and stop shedding/split ends.', value: 'strength', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { label: 'Purified Scalp Health & Volumetric Lift', desc: 'Clear follicular micro-clogging and restore airy root movement.', value: 'clarity', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' }
      ]
    }
  ];
  
  let currentStep = 0;
  const userAnswers = {};
  
  const quizStepCounter = document.getElementById('quizStepCounter');
  const quizProgressBar = document.getElementById('quizProgressBar');
  const quizQuestionContainer = document.getElementById('quizQuestionContainer');
  const quizNextBtn = document.getElementById('quizNextBtn');
  const quizPrevBtn = document.getElementById('quizPrevBtn');
  const quizResultsContainer = document.getElementById('quizResultsContainer');
  const quizContentCard = document.getElementById('quizContentCard');
  const retakeQuizBtn = document.getElementById('retakeQuizBtn');
  const addRoutineToBagBtn = document.getElementById('addRoutineToBagBtn');
  
  function renderQuestion() {
    const q = quizQuestions[currentStep];
    if (!q) return;
    
    // Update step numbers and bar
    quizStepCounter.textContent = `Question ${currentStep + 1} of ${quizQuestions.length}`;
    const percent = Math.round(((currentStep + 1) / quizQuestions.length) * 100);
    quizProgressBar.style.width = `${percent}%`;
    
    // Render options
    let html = `
      <div class="mb-8 text-center md:text-left">
        <span class="badge-pill bg-[#B86F68]/15 text-[#B86F68] font-semibold mb-2">Step ${currentStep + 1}</span>
        <h3 class="font-serif text-2xl md:text-3xl text-espresso dark:text-champagne font-medium mt-1 mb-2">${q.title}</h3>
        <p class="text-sm md:text-base text-[#5F4A44] dark:text-[#E3D1BF]">${q.subtitle}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="quizOptionsGrid">
    `;
    
    q.options.forEach(opt => {
      const isSelected = userAnswers[q.id] === opt.value;
      html += `
        <button type="button" data-val="${opt.value}" class="quiz-option-btn text-left p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
          isSelected 
            ? 'border-[#B86F68] bg-[#B86F68]/10 ring-2 ring-[#B86F68]/30 shadow-md' 
            : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#B86F68]/50 hover:bg-[var(--bg-card-subtle)]'
        }">
          <div class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
            isSelected ? 'bg-[#B86F68] text-white' : 'bg-[#E9D8C5]/40 dark:bg-[#382A25] text-espresso dark:text-champagne'
          }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="${opt.icon}" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="font-medium text-base text-espresso dark:text-champagne flex items-center justify-between">
              <span>${opt.label}</span>
              <span class="w-4 h-4 rounded-full border border-[#B86F68] flex items-center justify-center ${isSelected ? 'bg-[#B86F68]' : ''}">
                ${isSelected ? '<svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
              </span>
            </div>
            <p class="text-xs md:text-sm text-[#5F4A44] dark:text-[#AF968D] mt-1.5 leading-relaxed">${opt.desc}</p>
          </div>
        </button>
      `;
    });
    
    html += `</div>`;
    quizQuestionContainer.innerHTML = html;
    
    // Bind option click
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        userAnswers[q.id] = val;
        renderQuestion();
        quizNextBtn.removeAttribute('disabled');
      });
    });
    
    // Button state
    if (currentStep === 0) {
      quizPrevBtn.classList.add('opacity-40', 'pointer-events-none');
    } else {
      quizPrevBtn.classList.remove('opacity-40', 'pointer-events-none');
    }
    
    if (userAnswers[q.id]) {
      quizNextBtn.removeAttribute('disabled');
      quizNextBtn.classList.remove('opacity-40');
    } else {
      quizNextBtn.setAttribute('disabled', 'true');
      quizNextBtn.classList.add('opacity-40');
    }
    
    if (currentStep === quizQuestions.length - 1) {
      quizNextBtn.innerHTML = `<span>Generate Profile</span> <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
    } else {
      quizNextBtn.innerHTML = `<span>Continue</span> <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
    }
  }
  
  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      const q = quizQuestions[currentStep];
      if (!userAnswers[q.id]) {
        showToast('Please select an option to proceed', 'error');
        return;
      }
      
      if (currentStep < quizQuestions.length - 1) {
        currentStep++;
        renderQuestion();
      } else {
        renderQuizResults();
      }
    });
  }
  
  if (quizPrevBtn) {
    quizPrevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        renderQuestion();
      }
    });
  }
  
  function renderQuizResults() {
    quizContentCard.classList.add('hidden');
    quizResultsContainer.classList.remove('hidden');
    
    // Calculate diagnostic profile
    const texture = userAnswers.texture || 'wavy';
    const scalp = userAnswers.scalp || 'balanced';
    const concern = userAnswers.concerns || 'dryness';
    
    let profileCode = 'STRAND-';
    let textureTitle = '';
    let priority1 = '';
    let priority2 = '';
    let priority3 = '';
    let suggestedStep1 = '';
    let suggestedStep2 = '';
    let suggestedStep3 = '';
    let recommendedTrio = [];
    
    if (texture === 'straight') {
      profileCode += '1B-AERO';
      textureTitle = 'Type 1: Precision Straight & Cuticle Alignment';
      priority1 = 'Weightless Sebum Balance & Root Lift';
      priority2 = 'Hydrophobic Thermal Defense up to 450°F';
      priority3 = 'Microbiome Clarification to prevent residue';
      suggestedStep1 = 'Cleanse with Velvet Silk Shampoo to balance roots';
      suggestedStep2 = 'Condition lightly with Hydro-Infusion at ends only';
      suggestedStep3 = 'Shield with Thermal Veil Spray before styling';
      recommendedTrio = ['p1', 'p2', 'p7'];
    } else if (texture === 'wavy') {
      profileCode += '2B-HYDRA';
      textureTitle = 'Type 2: Dynamic Wave & Moisture Balance';
      priority1 = 'Humidity-Resistant Cuticle Smoothing';
      priority2 = 'Non-Greasy Lipid Sealing';
      priority3 = 'Gentle Sulfate-Free Clarifying Wash';
      suggestedStep1 = 'Cleanse scalp with Velvet Silk Shampoo';
      suggestedStep2 = 'Moisturize mid-lengths with Hydro-Infusion Conditioner';
      suggestedStep3 = 'Hydrate with Cashmere Cloud Leave-In Elixir';
      recommendedTrio = ['p1', 'p2', 'p4'];
    } else if (texture === 'curly') {
      profileCode += '3B-CELLULAR';
      textureTitle = 'Type 3: High-Porosity Curly & Spring Retention';
      priority1 = 'Deep Intercellular Moisture Infusion';
      priority2 = 'Crunch-Free Curl Spiral Clumping';
      priority3 = 'Anti-Breakage Peptide Bond Fortification';
      suggestedStep1 = 'Hydrating wash with Velvet Silk Shampoo';
      suggestedStep2 = 'Deep reconstructive soak with Botanical Peptide Mask';
      suggestedStep3 = 'Define and scrunch with Nectar Curl Sculpting Cream';
      recommendedTrio = ['p1', 'p3', 'p6'];
    } else {
      profileCode += '4A-LIPID';
      textureTitle = 'Type 4: Coily / Kinky High-Density Lipid Preservation';
      priority1 = 'Maximum Moisture Retention & Cuticle Sealing';
      priority2 = 'Protective Lubrication during Detangling';
      priority3 = 'Scalp Follicular Nourishment & Microbiome Care';
      suggestedStep1 = 'Ultra-gentle sulfate-free wash with Velvet Silk Shampoo';
      suggestedStep2 = 'Intense steam therapy with Botanical Peptide Mask';
      suggestedStep3 = 'Lock with Nectar Curl Cream and Liquid Amber Botanical Oil';
      recommendedTrio = ['p1', 'p3', 'p8'];
    }
    
    // Fill result fields
    document.getElementById('resultProfileCode').textContent = profileCode;
    document.getElementById('resultTextureTitle').textContent = textureTitle;
    document.getElementById('resultPriority1').textContent = priority1;
    document.getElementById('resultPriority2').textContent = priority2;
    document.getElementById('resultPriority3').textContent = priority3;
    document.getElementById('resultStep1').textContent = suggestedStep1;
    document.getElementById('resultStep2').textContent = suggestedStep2;
    document.getElementById('resultStep3').textContent = suggestedStep3;
    
    // Render recommended trio cards
    const trioGrid = document.getElementById('resultTrioGrid');
    if (trioGrid) {
      trioGrid.innerHTML = recommendedTrio.map(id => {
        const prod = PRODUCTS.find(p => p.id === id);
        if (!prod) return '';
        return `
          <div class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex gap-4 items-center">
            <img src="${prod.image}" alt="${prod.name}" class="w-16 h-16 rounded-xl object-cover" />
            <div class="flex-1 min-w-0">
              <span class="text-[10px] uppercase font-semibold text-[#B86F68]">${prod.badge}</span>
              <h5 class="text-sm font-medium text-espresso dark:text-champagne truncate">${prod.name}</h5>
              <div class="text-xs font-semibold text-espresso dark:text-champagne mt-0.5">$${prod.price}.00</div>
            </div>
            <button type="button" onclick="addToCart('${prod.id}')" class="w-9 h-9 rounded-xl bg-[#B86F68]/15 hover:bg-[#B86F68] text-[#B86F68] hover:text-white flex items-center justify-center transition-colors" title="Add to bag">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>
        `;
      }).join('');
    }
    
    // Add all trio to bag button
    if (addRoutineToBagBtn) {
      addRoutineToBagBtn.onclick = () => {
        recommendedTrio.forEach(id => {
          addToCart(id, 1, false);
        });
        showToast(`Added Complete ${profileCode} Routine to your bag!`);
        openCartDrawer();
      };
    }
  }
  
  if (retakeQuizBtn) {
    retakeQuizBtn.addEventListener('click', () => {
      currentStep = 0;
      for (const k in userAnswers) delete userAnswers[k];
      quizResultsContainer.classList.add('hidden');
      quizContentCard.classList.remove('hidden');
      renderQuestion();
      showToast('Diagnostic quiz reset. Ready for your answers.');
    });
  }
  
  // Initial render
  renderQuestion();
}

/* ==========================================================================
   5. SECTION 03: PERSONALIZED HAIR-CARE ROUTINES
   ========================================================================== */
const ROUTINES = [
  {
    id: 'r1',
    title: 'Hydration & Moisture Balance',
    subtitle: 'Deep cellular quenching for parched cuticles and moisture-starved curls.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    suitableFor: 'Types 2B to 4A • High Porosity • Low Ambient Humidity',
    washSchedule: 'Wash Day: Every 4–5 days • Morning: 3 mists of Rice Water Elixir',
    steps: [
      { num: '01', title: 'Gentle Lipid Cleansing', desc: 'Wash with Velvet Silk Shampoo to clear dirt without moisture depletion.' },
      { num: '02', title: 'Deep Porosity Soak', desc: 'Leave Hydro-Infusion Conditioner on damp strands for 4 minutes.' },
      { num: '03', title: 'Moisture Sealing Veil', desc: 'Seal lengths with Cashmere Cloud Leave-in Elixir and air dry.' }
    ],
    productIds: ['p1', 'p2', 'p4']
  },
  {
    id: 'r2',
    title: 'Frizz Control & Smoothing Architecture',
    subtitle: 'Micro-cuticular alignment neutralizing humidity rebound and flyaways.',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    suitableFor: 'Types 1B to 3B • Frizz-Prone • High Humidity Climates',
    washSchedule: 'Wash Day: Every 3 days • Post-Style: 2 drops Golden Amber Oil',
    steps: [
      { num: '01', title: 'Anti-Friction Wash', desc: 'Cleanse with sulfate-free amino lather to keep cuticle flat.' },
      { num: '02', title: 'Cuticular Sealing', desc: 'Infuse multi-molecular hyaluronic acid to prevent moisture fluctuation.' },
      { num: '03', title: 'Thermal Biomimetic Shield', desc: 'Mist Thermal Veil before blow-drying to lock cuticle scales shut.' }
    ],
    productIds: ['p1', 'p2', 'p7']
  },
  {
    id: 'r3',
    title: 'Curl Definition & Texture Sculpting',
    subtitle: 'Elongation, bouncy clumping, and 72-hour crunch-free spring for 3A-4C textures.',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    suitableFor: 'Types 3A to 4C • Medium to Coarse Strands • Curl Clumping',
    washSchedule: 'Wash Day: Weekly • Refresh: Damp scrunch with Nectar Butter',
    steps: [
      { num: '01', title: 'Moisture Preservation Cleanse', desc: 'Wash gently with lipid-rich sulfate-free lather.' },
      { num: '02', title: 'Peptide Deep Treatment', desc: 'Warm 20-minute steam masque using Botanical Peptide Mask.' },
      { num: '03', title: 'Curl Sculpting & Sealing', desc: 'Rake Nectar Curl Cream through soaking wet strands and diffuse.' }
    ],
    productIds: ['p1', 'p3', 'p6']
  },
  {
    id: 'r4',
    title: 'Scalp Balance & Microbiome Clarification',
    subtitle: 'Microbiome restoration to alleviate itchiness, flaking, and sebum congestion.',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    suitableFor: 'All Hair Textures • Sensitive Scalps • Buildup-Prone Roots',
    washSchedule: 'Wash Day: Every 2–3 days • Nightly: 1 pipette Scalp Harmony Serum',
    steps: [
      { num: '01', title: 'Follicular Clarification', desc: 'Invigorate scalp with pH-balanced Velvet Silk Shampoo.' },
      { num: '02', title: 'Featherweight Hydration', desc: 'Condition mid-lengths only, avoiding direct scalp placement.' },
      { num: '03', title: 'Postbiotic Serum Drops', desc: 'Massage 1 dropper of Scalp Harmony Serum into roots at bedtime.' }
    ],
    productIds: ['p1', 'p2', 'p5']
  },
  {
    id: 'r5',
    title: 'Strengthening & Breakage Reduction',
    subtitle: 'Bio-identical peptide restructuring for bleached, color-treated, or brittle strands.',
    image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80',
    suitableFor: 'Bleached • Chemically Treated • Mechanically Weakened Hair',
    washSchedule: 'Wash Day: Every 4 days • Masque: Weekly 20-min towel wrap',
    steps: [
      { num: '01', title: 'Fortifying Prep Wash', desc: 'Cleanse without stripping cortical proteins or moisture.' },
      { num: '02', title: 'Peptide Disulfide Bond Repair', desc: 'Apply Botanical Peptide Mask from root to tip for deep synthesis.' },
      { num: '03', title: 'Cuticular Lipid Shield', desc: 'Seal fragile tips with Liquid Amber Golden Botanical Hair Oil.' }
    ],
    productIds: ['p1', 'p3', 'p8']
  },
  {
    id: 'r6',
    title: 'Color-Treated Hair & Pigment Shield',
    subtitle: 'UV defense, anti-brass antioxidants, and cuticle lamination to preserve salon vibrancy.',
    image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=800&q=80',
    suitableFor: 'Balayage • Permanent Tint • Glosses • Red, Brunette & Blonde',
    washSchedule: 'Wash Day: Every 5 days with cool water • Daily: Thermal Veil Shield',
    steps: [
      { num: '01', title: 'Zero-Sulfate Anti-Fade Wash', desc: 'Preserves pigment molecules from premature leaching.' },
      { num: '02', title: 'Gloss Lamination Conditioning', desc: 'Hydro-Infusion seals cuticles flat to enhance light refraction.' },
      { num: '03', title: 'Antioxidant & UV Defense', desc: 'Spray Thermal Veil to block solar and thermal oxidation.' }
    ],
    productIds: ['p1', 'p2', 'p7']
  }
];

function initRoutines() {
  const routinesGrid = document.getElementById('routinesGrid');
  if (!routinesGrid) return;
  
  routinesGrid.innerHTML = ROUTINES.map(r => `
    <div class="card-hover-lift rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between">
      <div>
        <div class="relative h-64 overflow-hidden img-zoom-wrapper">
          <img src="${r.image}" alt="${r.title}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div class="absolute bottom-4 left-4 right-4 text-white">
            <span class="badge-pill bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold mb-1">Tailored Protocol</span>
            <h4 class="font-serif text-xl font-medium tracking-wide drop-shadow">${r.title}</h4>
          </div>
        </div>
        <div class="p-6">
          <p class="text-sm text-[#5F4A44] dark:text-[#E3D1BF] leading-relaxed mb-4">${r.subtitle}</p>
          
          <div class="space-y-2.5 mb-5">
            <div class="text-xs font-semibold text-espresso dark:text-champagne flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-[#B86F68]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>Target: <span class="font-normal text-[#5F4A44] dark:text-[#AF968D]">${r.suitableFor}</span></span>
            </div>
            <div class="text-xs font-semibold text-espresso dark:text-champagne flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-[#B86F68]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>Cadence: <span class="font-normal text-[#5F4A44] dark:text-[#AF968D]">${r.washSchedule}</span></span>
            </div>
          </div>
          
          <div class="border-t border-[var(--border-subtle)] pt-4 mb-2">
            <div class="text-[11px] uppercase font-bold tracking-wider text-[#B86F68] mb-2">3-Step Regimen</div>
            <div class="grid grid-cols-3 gap-2 text-center text-xs">
              <div class="bg-[var(--bg-card-subtle)] p-2 rounded-xl">
                <span class="block font-bold text-espresso dark:text-champagne">01</span>
                <span class="text-[10px] text-[#8F7670] truncate block">Cleanse</span>
              </div>
              <div class="bg-[var(--bg-card-subtle)] p-2 rounded-xl">
                <span class="block font-bold text-espresso dark:text-champagne">02</span>
                <span class="text-[10px] text-[#8F7670] truncate block">Treat</span>
              </div>
              <div class="bg-[var(--bg-card-subtle)] p-2 rounded-xl">
                <span class="block font-bold text-espresso dark:text-champagne">03</span>
                <span class="text-[10px] text-[#8F7670] truncate block">Seal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-6 pt-0">
        <button type="button" onclick="openRoutineModal('${r.id}')" class="w-full py-3 rounded-xl border border-[#B86F68] text-[#B86F68] hover:bg-[#B86F68] hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2">
          <span>Explore Routine Blueprint</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

window.openRoutineModal = function(routineId) {
  const r = ROUTINES.find(item => item.id === routineId);
  if (!r) return;
  
  const modalContent = document.getElementById('genericModalContent');
  const genericModal = document.getElementById('genericModal');
  
  const productsHtml = r.productIds.map(pid => {
    const p = PRODUCTS.find(prod => prod.id === pid);
    if (!p) return '';
    return `
      <div class="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
        <img src="${p.image}" alt="${p.name}" class="w-14 h-14 rounded-lg object-cover" />
        <div class="flex-1 min-w-0">
          <div class="text-xs uppercase font-bold text-[#B86F68]">${p.badge}</div>
          <h5 class="text-sm font-medium text-espresso dark:text-champagne truncate">${p.name}</h5>
          <div class="text-xs font-semibold text-espresso dark:text-champagne">$${p.price}.00</div>
        </div>
        <button type="button" onclick="addToCart('${p.id}')" class="px-3 py-1.5 rounded-lg bg-[#B86F68] text-white text-xs font-medium hover:bg-[#CA7D76] transition-colors">
          Add
        </button>
      </div>
    `;
  }).join('');
  
  modalContent.innerHTML = `
    <div class="relative">
      <img src="${r.image}" alt="${r.title}" class="w-full h-56 object-cover rounded-2xl mb-6" />
      <span class="badge-pill bg-[#B86F68] text-white absolute top-4 left-4">Custom Regimen</span>
      <h3 class="font-serif text-3xl font-medium text-espresso dark:text-champagne mb-2">${r.title}</h3>
      <p class="text-sm text-[#5F4A44] dark:text-[#E3D1BF] leading-relaxed mb-6">${r.subtitle}</p>
      
      <div class="bg-[var(--bg-card-subtle)] p-4 rounded-2xl mb-6 space-y-2 text-xs">
        <div class="flex gap-2"><strong class="text-espresso dark:text-champagne">Ideal For:</strong> <span>${r.suitableFor}</span></div>
        <div class="flex gap-2"><strong class="text-espresso dark:text-champagne">Application Cadence:</strong> <span>${r.washSchedule}</span></div>
      </div>
      
      <h4 class="font-serif text-xl font-medium text-espresso dark:text-champagne mb-4">Detailed Ritual Steps</h4>
      <div class="space-y-4 mb-8">
        ${r.steps.map(step => `
          <div class="flex gap-4 items-start">
            <span class="w-8 h-8 rounded-full bg-[#B86F68]/15 text-[#B86F68] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">${step.num}</span>
            <div>
              <h6 class="text-sm font-semibold text-espresso dark:text-champagne">${step.title}</h6>
              <p class="text-xs text-[#5F4A44] dark:text-[#AF968D] mt-1 leading-relaxed">${step.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
      
      <h4 class="font-serif text-xl font-medium text-espresso dark:text-champagne mb-4">Recommended Regimen Trio</h4>
      <div class="space-y-3 mb-8">
        ${productsHtml}
      </div>
      
      <div class="flex gap-3">
        <button type="button" onclick="addEntireRoutineToBag(['${r.productIds.join("','")}'])" class="flex-1 py-3.5 rounded-xl btn-rose text-sm font-semibold text-center">
          Add Complete 3-Step Routine to Bag
        </button>
        <button type="button" onclick="closeGenericModal()" class="px-5 py-3.5 rounded-xl border border-[var(--border-color)] text-espresso dark:text-champagne text-sm font-medium hover:bg-[var(--bg-card-subtle)]">
          Close
        </button>
      </div>
    </div>
  `;
  
  openGenericModal();
};

window.addEntireRoutineToBag = function(productIds) {
  productIds.forEach(id => addToCart(id, 1, false));
  showToast('Added all 3 routine formulas to your bag!');
  closeGenericModal();
  openCartDrawer();
};

/* ==========================================================================
   6. SECTION 04: PREMIUM HAIR-CARE PRODUCT COLLECTION
   ========================================================================== */
let activeProductCategory = 'all';
let activeProductSort = 'featured';

function initProducts() {
  const filterBtns = document.querySelectorAll('.shop-filter-btn');
  const sortSelect = document.getElementById('shopSortSelect');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-[#B86F68]', 'text-white'));
      filterBtns.forEach(b => b.classList.add('bg-[var(--bg-card)]', 'text-espresso', 'dark:text-champagne'));
      btn.classList.add('bg-[#B86F68]', 'text-white');
      btn.classList.remove('bg-[var(--bg-card)]', 'text-espresso', 'dark:text-champagne');
      activeProductCategory = btn.getAttribute('data-cat');
      renderProductsGrid();
    });
  });
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeProductSort = e.target.value;
      renderProductsGrid();
    });
  }
  
  renderProductsGrid();
}

function renderProductsGrid() {
  const grid = document.getElementById('productsCollectionGrid');
  if (!grid) return;
  
  let list = PRODUCTS.filter(p => {
    if (activeProductCategory === 'all') return true;
    return p.category === activeProductCategory;
  });
  
  // Sort
  if (activeProductSort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (activeProductSort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (activeProductSort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }
  
  grid.innerHTML = list.map(p => `
    <div class="card-hover-lift rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between group h-full">
      <div class="flex-1 flex flex-col">
        <div class="relative h-72 overflow-hidden img-zoom-wrapper bg-[#F5EFE8] dark:bg-[#231A18]">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" />
          <div class="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
            <span class="badge-pill bg-[#B86F68] text-white text-[10px] font-semibold">${p.tag}</span>
            <span class="badge-pill bg-espresso/70 dark:bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">${p.badge}</span>
          </div>
          <button type="button" onclick="openProductQuickView('${p.id}')" class="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-espresso dark:text-champagne flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110" title="Quick view">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
        </div>
        
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center text-amber-500 text-xs">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span class="ml-1 font-semibold text-espresso dark:text-champagne">${p.rating}</span>
              <span class="ml-1 text-[11px] text-[#8F7670]">(${p.reviewsCount} sample reviews)</span>
            </div>
            <span class="text-xs uppercase font-medium text-[#8F7670] tracking-wider">${p.category}</span>
          </div>
          
          <h4 class="font-serif text-lg font-medium text-espresso dark:text-champagne mb-2 leading-snug line-clamp-1">${p.name}</h4>
          <p class="text-xs text-[#5F4A44] dark:text-[#E3D1BF] leading-relaxed line-clamp-2 mb-4">${p.shortDesc}</p>
          
          <div class="flex flex-wrap gap-1.5 mb-5">
            ${p.keyIngredients.slice(0, 2).map(ing => `
              <span class="text-[10px] bg-[var(--bg-card-subtle)] text-[#5F4A44] dark:text-[#AF968D] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">${ing}</span>
            `).join('')}
          </div>
        </div>
      </div>
      
      <!-- Card Footer: Neatly Aligned Price & Action Buttons -->
      <div class="p-6 pt-0 border-t border-[var(--border-subtle)] mt-auto">
        <div class="flex items-center justify-between pt-4 pb-3">
          <div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-[#8F7670] block leading-tight">Price</span>
            <span class="font-serif text-xl font-semibold text-espresso dark:text-champagne leading-none">$${p.price}.00</span>
          </div>
          <span class="text-[10px] uppercase font-semibold text-[#8F7670] tracking-wider px-2.5 py-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">${p.category}</span>
        </div>
        
        <div class="grid grid-cols-2 gap-2">
          <button type="button" onclick="openProductQuickView('${p.id}')" class="py-2.5 px-2 rounded-xl border border-[var(--border-color)] text-xs font-medium text-espresso dark:text-champagne hover:bg-[var(--bg-card-subtle)] transition-colors text-center whitespace-nowrap">
            Details
          </button>
          <button type="button" onclick="addToCart('${p.id}')" class="py-2.5 px-2 rounded-xl btn-rose text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:shadow-md whitespace-nowrap">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

window.openProductQuickView = function(productId) {
  const p = PRODUCTS.find(item => item.id === productId);
  if (!p) return;
  
  const modalContent = document.getElementById('genericModalContent');
  modalContent.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div class="rounded-2xl overflow-hidden bg-[#F5EFE8] dark:bg-[#231A18] border border-[var(--border-color)]">
        <img src="${p.image}" alt="${p.name}" class="w-full h-80 md:h-96 object-cover" />
      </div>
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="badge-pill bg-[#B86F68] text-white text-[10px] font-semibold">${p.tag}</span>
          <span class="badge-pill bg-espresso/15 dark:bg-champagne/15 text-espresso dark:text-champagne text-[10px] font-medium">${p.badge}</span>
        </div>
        
        <h3 class="font-serif text-2xl md:text-3xl font-medium text-espresso dark:text-champagne mb-2">${p.name}</h3>
        
        <div class="flex items-center gap-2 mb-4">
          <div class="flex items-center text-amber-500 text-sm">
            ★★★★★
            <span class="ml-1.5 font-bold text-espresso dark:text-champagne">${p.rating}</span>
          </div>
          <span class="text-xs text-[#8F7670]">(${p.reviewsCount} verified community reviews)</span>
        </div>
        
        <div class="font-serif text-2xl font-bold text-espresso dark:text-champagne mb-4">$${p.price}.00</div>
        
        <p class="text-sm text-[#5F4A44] dark:text-[#E3D1BF] leading-relaxed mb-6">${p.fullDesc}</p>
        
        <div class="space-y-4 mb-6">
          <div class="bg-[var(--bg-card-subtle)] p-4 rounded-xl border border-[var(--border-subtle)]">
            <h6 class="text-xs font-bold uppercase tracking-wider text-[#B86F68] mb-2">Verified Key Actives</h6>
            <div class="flex flex-wrap gap-1.5">
              ${p.keyIngredients.map(i => `<span class="badge-pill bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-espresso dark:text-champagne">${i}</span>`).join('')}
            </div>
          </div>
          
          <div class="bg-[var(--bg-card-subtle)] p-4 rounded-xl border border-[var(--border-subtle)]">
            <h6 class="text-xs font-bold uppercase tracking-wider text-[#B86F68] mb-1">Recommended Application</h6>
            <p class="text-xs text-[#5F4A44] dark:text-[#AF968D] leading-relaxed">${p.usage}</p>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button type="button" onclick="addToCart('${p.id}'); closeGenericModal();" class="flex-1 py-3.5 rounded-xl btn-rose text-sm font-semibold flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span>Add to Bag — $${p.price}.00</span>
          </button>
          <button type="button" onclick="closeGenericModal()" class="px-5 py-3.5 rounded-xl border border-[var(--border-color)] text-espresso dark:text-champagne text-sm font-medium hover:bg-[var(--bg-card-subtle)]">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
  openGenericModal();
};

/* ==========================================================================
   7. SECTION 05: SULFATE-FREE & INGREDIENT-CONSCIOUS DISCOVERY
   ========================================================================== */
function initSulfateFreeFilter() {
  const sfSulfateOnly = document.getElementById('sfSulfateOnly');
  const sfSiliconeFree = document.getElementById('sfSiliconeFree');
  const sfVeganOnly = document.getElementById('sfVeganOnly');
  const sfFragranceFree = document.getElementById('sfFragranceFree');
  const sfHairTypeSelect = document.getElementById('sfHairTypeSelect');
  const sfConcernSelect = document.getElementById('sfConcernSelect');
  const sfCategorySelect = document.getElementById('sfCategorySelect');
  const sfResetBtn = document.getElementById('sfResetBtn');
  const sfCountBadge = document.getElementById('sfCountBadge');
  const sfGrid = document.getElementById('sulfateFreeResultsGrid');
  
  function applySFFilters() {
    const sulfateReq = sfSulfateOnly ? sfSulfateOnly.checked : true;
    const siliconeReq = sfSiliconeFree ? sfSiliconeFree.checked : false;
    const veganReq = sfVeganOnly ? sfVeganOnly.checked : false;
    const fragranceReq = sfFragranceFree ? sfFragranceFree.checked : false;
    const hairType = sfHairTypeSelect ? sfHairTypeSelect.value : 'all';
    const concern = sfConcernSelect ? sfConcernSelect.value : 'all';
    const category = sfCategorySelect ? sfCategorySelect.value : 'all';
    
    const filtered = PRODUCTS.filter(p => {
      if (sulfateReq && !p.isSulfateFree) return false;
      if (siliconeReq && !p.isSiliconeFree) return false;
      if (veganReq && !p.isVegan) return false;
      if (fragranceReq && !p.isFragranceFree) return false;
      if (hairType !== 'all' && !p.hairTypes.includes(hairType)) return false;
      if (concern !== 'all' && !p.concerns.includes(concern)) return false;
      if (category !== 'all' && p.category !== category) return false;
      return true;
    });
    
    if (sfCountBadge) {
      sfCountBadge.textContent = `${filtered.length} conscious formulas matching`;
    }
    
    if (sfGrid) {
      if (filtered.length === 0) {
        sfGrid.innerHTML = `
          <div class="col-span-full py-12 text-center bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
            <svg class="w-12 h-12 text-[#B86F68] mx-auto mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <h5 class="font-serif text-lg text-espresso dark:text-champagne font-medium">No exact formulations match this specific filter combination</h5>
            <p class="text-xs text-[#8F7670] mt-1 max-w-md mx-auto">Try resetting or loosening one of the ingredient toggles above to explore compatible rituals.</p>
          </div>
        `;
      } else {
        sfGrid.innerHTML = filtered.map(p => `
          <div class="card-hover-lift rounded-2xl p-4 bg-[var(--bg-card)] border border-[var(--border-color)] flex gap-4 items-center">
            <img src="${p.image}" alt="${p.name}" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 mb-1">
                <span class="text-[9px] uppercase font-bold text-[#B86F68] bg-[#B86F68]/15 px-2 py-0.5 rounded-full">100% Sulfate-Free</span>
                ${p.isSiliconeFree ? '<span class="text-[9px] uppercase font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">No Silicones</span>' : ''}
              </div>
              <h5 class="text-sm font-semibold text-espresso dark:text-champagne truncate">${p.name}</h5>
              <p class="text-xs text-[#8F7670] line-clamp-1 mt-0.5">${p.shortDesc}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="font-serif font-bold text-sm text-espresso dark:text-champagne">$${p.price}.00</span>
                <button type="button" onclick="addToCart('${p.id}')" class="px-3 py-1 rounded-lg btn-rose text-xs font-semibold">
                  + Add to Bag
                </button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }
  
  [sfSulfateOnly, sfSiliconeFree, sfVeganOnly, sfFragranceFree, sfHairTypeSelect, sfConcernSelect, sfCategorySelect].forEach(el => {
    if (el) el.addEventListener('change', applySFFilters);
  });
  
  if (sfResetBtn) {
    sfResetBtn.addEventListener('click', () => {
      if (sfSulfateOnly) sfSulfateOnly.checked = true;
      if (sfSiliconeFree) sfSiliconeFree.checked = false;
      if (sfVeganOnly) sfVeganOnly.checked = false;
      if (sfFragranceFree) sfFragranceFree.checked = false;
      if (sfHairTypeSelect) sfHairTypeSelect.value = 'all';
      if (sfConcernSelect) sfConcernSelect.value = 'all';
      if (sfCategorySelect) sfCategorySelect.value = 'all';
      applySFFilters();
      showToast('Sulfate-free filters restored to default.');
    });
  }
  
  applySFFilters();
}

/* ==========================================================================
   8. SECTION 06: SUBSCRIPTION & REPLENISHMENT STUDIO
   ========================================================================== */
function initSubscriptions() {
  const subProductList = document.getElementById('subProductList');
  const subFrequencyRadios = document.querySelectorAll('input[name="subFrequency"]');
  const subSummaryItems = document.getElementById('subSummaryItems');
  const subSubtotal = document.getElementById('subSubtotal');
  const subDiscount = document.getElementById('subDiscount');
  const subTotal = document.getElementById('subTotal');
  const buildSubBtn = document.getElementById('buildSubBtn');
  
  // Selected subscription items: { productId: qty }
  const subState = {
    p1: 1,
    p2: 1
  };
  
  function getSelectedFrequency() {
    let freq = '30';
    subFrequencyRadios.forEach(radio => {
      if (radio.checked) freq = radio.value;
    });
    return freq;
  }
  
  function renderSubBuilder() {
    if (subProductList) {
      subProductList.innerHTML = PRODUCTS.slice(0, 5).map(p => {
        const isChecked = Boolean(subState[p.id]);
        const qty = subState[p.id] || 1;
        return `
          <div class="p-4 rounded-2xl border transition-all ${
            isChecked 
              ? 'border-[#B86F68] bg-[#B86F68]/5 shadow-sm' 
              : 'border-[var(--border-color)] bg-[var(--bg-card)]'
          } flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <input type="checkbox" id="sub_chk_${p.id}" ${isChecked ? 'checked' : ''} onchange="toggleSubProduct('${p.id}', this.checked)" class="w-4 h-4 rounded text-[#B86F68] focus:ring-[#B86F68]" />
              <img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              <div class="min-w-0">
                <h5 class="text-sm font-medium text-espresso dark:text-champagne truncate">${p.name}</h5>
                <span class="text-xs text-[#8F7670]">$${p.price}.00 each</span>
              </div>
            </div>
            
            ${isChecked ? `
              <div class="flex items-center gap-2 bg-[var(--bg-card)] px-2 py-1 rounded-xl border border-[var(--border-color)]">
                <button type="button" onclick="adjustSubQty('${p.id}', -1)" class="w-6 h-6 flex items-center justify-center text-xs font-bold text-espresso dark:text-champagne hover:text-[#B86F68]">-</button>
                <span class="text-xs font-bold text-espresso dark:text-champagne px-1">${qty}</span>
                <button type="button" onclick="adjustSubQty('${p.id}', 1)" class="w-6 h-6 flex items-center justify-center text-xs font-bold text-espresso dark:text-champagne hover:text-[#B86F68]">+</button>
              </div>
            ` : `
              <label for="sub_chk_${p.id}" class="text-xs font-semibold text-[#B86F68] cursor-pointer hover:underline">+ Include</label>
            `}
          </div>
        `;
      }).join('');
    }
    
    // Update summary calculation
    updateSubSummary();
  }
  
  window.toggleSubProduct = function(productId, checked) {
    if (checked) {
      subState[productId] = 1;
    } else {
      delete subState[productId];
    }
    renderSubBuilder();
  };
  
  window.adjustSubQty = function(productId, delta) {
    if (!subState[productId]) return;
    subState[productId] = Math.max(1, subState[productId] + delta);
    renderSubBuilder();
  };
  
  function updateSubSummary() {
    let rawSubtotal = 0;
    const items = [];
    
    for (const pid in subState) {
      const p = PRODUCTS.find(prod => prod.id === pid);
      if (p) {
        const qty = subState[pid];
        rawSubtotal += p.price * qty;
        items.push({ p, qty, lineTotal: p.price * qty });
      }
    }
    
    const freq = getSelectedFrequency();
    const discountRate = freq === '30' ? 0.20 : 0.15; // 20% off for 30 days, 15% for others
    const discountAmount = rawSubtotal * discountRate;
    const finalTotal = Math.max(0, rawSubtotal - discountAmount);
    
    if (subSummaryItems) {
      if (items.length === 0) {
        subSummaryItems.innerHTML = `<p class="text-xs text-[#8F7670] italic">No replenishment essentials selected yet.</p>`;
      } else {
        subSummaryItems.innerHTML = items.map(it => `
          <div class="flex justify-between items-center text-xs py-1 border-b border-[var(--border-subtle)]">
            <span class="text-espresso dark:text-champagne font-medium truncate pr-2">${it.qty}x ${it.p.name}</span>
            <span class="font-bold text-espresso dark:text-champagne">$${it.lineTotal.toFixed(2)}</span>
          </div>
        `).join('');
      }
    }
    
    if (subSubtotal) subSubtotal.textContent = `$${rawSubtotal.toFixed(2)}`;
    if (subDiscount) subDiscount.textContent = `-$${discountAmount.toFixed(2)} (${Math.round(discountRate * 100)}%)`;
    if (subTotal) subTotal.textContent = `$${finalTotal.toFixed(2)}`;
  }
  
  subFrequencyRadios.forEach(r => r.addEventListener('change', updateSubSummary));
  
  if (buildSubBtn) {
    buildSubBtn.addEventListener('click', () => {
      const itemsCount = Object.keys(subState).length;
      if (itemsCount === 0) {
        showToast('Please select at least one product for your subscription ritual', 'error');
        return;
      }
      
      const freq = getSelectedFrequency();
      const modalContent = document.getElementById('genericModalContent');
      modalContent.innerHTML = `
        <div class="text-center py-4">
          <div class="w-16 h-16 rounded-full bg-[#B86F68]/15 text-[#B86F68] flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <span class="badge-pill bg-[#B86F68] text-white text-xs mb-2">Replenishment Studio Prototype</span>
          <h3 class="font-serif text-3xl font-medium text-espresso dark:text-champagne mb-2">Subscription Ritual Configured!</h3>
          <p class="text-sm text-[#5F4A44] dark:text-[#E3D1BF] max-w-md mx-auto mb-6">Your customized delivery ritual has been calculated with recurring savings of up to 20% every ${freq} days.</p>
          
          <div class="bg-[var(--bg-card-subtle)] p-5 rounded-2xl text-left border border-[var(--border-color)] max-w-md mx-auto mb-6 space-y-2 text-xs">
            <div class="flex justify-between"><strong>Delivery Interval:</strong> <span>Every ${freq} Days</span></div>
            <div class="flex justify-between"><strong>Complimentary Perk:</strong> <span>Biomimetic Scalp Massager Included ($22 Value)</span></div>
            <div class="flex justify-between"><strong>Shipping:</strong> <span>$0.00 Express Carbon-Neutral</span></div>
            <div class="flex justify-between"><strong>Policy:</strong> <span>Pause, skip, or cancel anytime in 1 click online</span></div>
          </div>
          
          <div class="text-[11px] text-[#8F7670] italic mb-6">Note: This is a frontend demonstration platform. Real recurring billing is not active without live payment gateway integration.</div>
          
          <button type="button" onclick="closeGenericModal(); showToast('Simulated subscription order recorded!');" class="w-full max-w-md mx-auto py-3.5 rounded-xl btn-rose text-sm font-semibold">
            Confirm & Save Subscription Ritual
          </button>
        </div>
      `;
      openGenericModal();
    });
  }
  
  renderSubBuilder();
}

/* ==========================================================================
   9. SECTION 07: HAIR-CARE COMMUNITY & DISCUSSION HUB
   ========================================================================== */
let activeCommunityCategory = 'all';
let communitySearchQuery = '';

const COMMUNITY_POSTS = [
  {
    id: 'c1',
    category: 'textured',
    title: 'The 90-Day Baobab Mask transformation on 3C bleached curls',
    author: 'Elena Vance',
    hairType: '3C Curls • High Porosity',
    timestamp: '2 hours ago',
    likes: 84,
    isLiked: false,
    commentsCount: 19,
    content: 'After 3 rounds of balayage, my curl clumps were virtually flat and shedding during every comb out. I committed to a 20-minute weekly steam wrap with the Botanical Peptide Mask followed by cold water sealing. The spring in my crown has fully returned and breakage dropped to zero in the sink drain!',
    replies: [
      { author: 'Dr. Amara Diallo', text: 'Peptides with low molecular weight penetrate the cortical cuticles directly. Exactly what bleached 3C needs!' },
      { author: 'Chloe M.', text: 'Did you use a hooded dryer or just a hot towel? Want to try this weekend!' }
    ]
  },
  {
    id: 'c2',
    category: 'scalp',
    title: 'How I eliminated chronic winter scalp flaking without stripping shampoos',
    author: 'Marcus Thorne',
    hairType: '2A Wavy • Sensitive Scalp',
    timestamp: 'Yesterday',
    likes: 112,
    isLiked: false,
    commentsCount: 27,
    content: 'For years I used harsh zinc pyrithione medicated shampoos that stripped my wave pattern completely dry. Switching to a sulfate-free wash and 3 nightly drops of the Scalp Harmony Microbiome Serum cleared the redness and flaking in 10 days. The postbiotics actually let the skin barrier heal.',
    replies: [
      { author: 'Siddharth R.', text: 'Can confirm! Salicylic acid at 0.5% dissolves flakes gently without that stinging sensation.' }
    ]
  },
  {
    id: 'c3',
    category: 'science',
    title: 'Porosity test debunked: Why the water glass float test fails on coily hair',
    author: 'Dr. Amara Diallo (Cosmetic Chemist)',
    hairType: '4B Coily • Formulation Specialist',
    timestamp: '3 days ago',
    likes: 245,
    isLiked: true,
    commentsCount: 41,
    content: 'Surface tension from natural sebum or residual leave-in oils will keep high-porosity coily hair floating on top of a water glass for hours, giving a false low-porosity reading. Instead, spray clean, dry hair with a fine mist of water: if droplets bead up indefinitely, it is low porosity; if it absorbs instantly, high porosity.',
    replies: [
      { author: 'Jasmine K.', text: 'This explains everything! My hair always floated even though it drank moisture in 2 seconds.' }
    ]
  },
  {
    id: 'c4',
    category: 'routines',
    title: 'LOC vs. LGO method: Which order works better in humid summer climates?',
    author: 'Jasmine K.',
    hairType: '4A Coily • Dense Volume',
    timestamp: '4 days ago',
    likes: 67,
    isLiked: false,
    commentsCount: 14,
    content: 'In 85% relative humidity, applying heavy oils before styling creams caused my coils to puff within 2 hours. Swapping to Leave-in -> Cream -> Gel/Oil seal locked in the curl elongation all day. Anyone else experience this?',
    replies: [
      { author: 'Tanya B.', text: 'Yes! The humectants in creams need to touch the water barrier first before the occlusive oil locks it.' }
    ]
  },
  {
    id: 'c5',
    category: 'ingredient',
    title: 'Transitioning from synthetic silicones: What to expect in weeks 1 to 4',
    author: 'Chloe St. Claire',
    hairType: '2C Wavy • Color-Treated',
    timestamp: '5 days ago',
    likes: 139,
    isLiked: false,
    commentsCount: 32,
    content: 'When you stop using dimethicone coatings, your hair might feel slightly dry for the first 10 days because the underlying cuticular damage is finally exposed. Stick with botanical squalane and plant-based lipid washes; by week 3, the natural shine was completely restored without buildup.',
    replies: [
      { author: 'Maya Lin', text: 'Week 2 was the hardest, but by week 4 my waves have never had so much natural movement!' }
    ]
  },
  {
    id: 'c6',
    category: 'recommendations',
    title: 'Fine hair holy grail: How to prevent conditioner from flattening your crown',
    author: 'Maya Lin',
    hairType: '1B Straight • Fine Strands',
    timestamp: '1 week ago',
    likes: 98,
    isLiked: false,
    commentsCount: 16,
    content: 'Reverse conditioning technique changed my life: apply Hydro-Infusion Conditioner to damp mid-lengths first, wait 2 minutes, then gently wash roots with Velvet Silk Shampoo. You get 100% of the slip with zero weighed-down crown volume.',
    replies: [
      { author: 'Sarah P.', text: 'Trying this immediately on my fine bob!' }
    ]
  }
];

function initCommunity() {
  const commCategoryBtns = document.querySelectorAll('.comm-category-btn');
  const commSearchInput = document.getElementById('commSearchInput');
  const openNewDiscussionBtn = document.getElementById('openNewDiscussionBtn');
  
  commCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      commCategoryBtns.forEach(b => b.classList.remove('bg-[#B86F68]', 'text-white'));
      commCategoryBtns.forEach(b => b.classList.add('bg-[var(--bg-card)]', 'text-espresso', 'dark:text-champagne'));
      btn.classList.add('bg-[#B86F68]', 'text-white');
      btn.classList.remove('bg-[var(--bg-card)]', 'text-espresso', 'dark:text-champagne');
      activeCommunityCategory = btn.getAttribute('data-cat');
      renderCommunityPosts();
    });
  });
  
  if (commSearchInput) {
    commSearchInput.addEventListener('input', (e) => {
      communitySearchQuery = e.target.value.toLowerCase().trim();
      renderCommunityPosts();
    });
  }
  
  if (openNewDiscussionBtn) {
    openNewDiscussionBtn.addEventListener('click', () => {
      openNewDiscussionModal();
    });
  }
  
  renderCommunityPosts();
}

function renderCommunityPosts() {
  const container = document.getElementById('communityPostsContainer');
  if (!container) return;
  
  const filtered = COMMUNITY_POSTS.filter(post => {
    if (activeCommunityCategory !== 'all' && post.category !== activeCommunityCategory) return false;
    if (communitySearchQuery) {
      const match = post.title.toLowerCase().includes(communitySearchQuery) ||
                    post.content.toLowerCase().includes(communitySearchQuery) ||
                    post.author.toLowerCase().includes(communitySearchQuery) ||
                    post.hairType.toLowerCase().includes(communitySearchQuery);
      if (!match) return false;
    }
    return true;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
        <svg class="w-12 h-12 text-[#B86F68] mx-auto mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        <h5 class="font-serif text-lg text-espresso dark:text-champagne font-medium">No community discussions match your search query</h5>
        <p class="text-xs text-[#8F7670] mt-1">Start the conversation yourself by clicking "Start a Discussion" above.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map(post => `
    <div class="card-hover-lift rounded-3xl p-6 bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class="badge-pill bg-[#B86F68]/15 text-[#B86F68] text-[10px] font-semibold uppercase tracking-wider">${post.category}</span>
          <span class="text-xs text-[#8F7670]">${post.timestamp}</span>
        </div>
        
        <h4 class="font-serif text-lg font-medium text-espresso dark:text-champagne mb-2 leading-snug line-clamp-2 hover:text-[#B86F68] cursor-pointer transition-colors" onclick="openDiscussionDetail('${post.id}')">${post.title}</h4>
        
        <p class="text-xs text-[#5F4A44] dark:text-[#E3D1BF] leading-relaxed line-clamp-3 mb-5">${post.content}</p>
        
        <div class="flex items-center gap-3 py-3 border-t border-[var(--border-subtle)]">
          <div class="w-9 h-9 rounded-full bg-[#E9D8C5] dark:bg-[#382A25] text-espresso dark:text-champagne font-bold text-xs flex items-center justify-center flex-shrink-0">
            ${post.author.charAt(0)}
          </div>
          <div class="min-w-0">
            <h6 class="text-xs font-semibold text-espresso dark:text-champagne truncate">${post.author}</h6>
            <span class="text-[10px] text-[#8F7670] block truncate">${post.hairType}</span>
          </div>
        </div>
      </div>
      
      <div class="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
        <button type="button" onclick="togglePostLike('${post.id}')" class="flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
          post.isLiked ? 'text-[#B86F68] bg-[#B86F68]/10 font-bold' : 'text-[#8F7670] hover:text-[#B86F68]'
        }">
          <svg class="w-4 h-4 ${post.isLiked ? 'fill-current' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <span>${post.likes}</span>
        </button>
        
        <button type="button" onclick="openDiscussionDetail('${post.id}')" class="flex items-center gap-1 text-[#8F7670] hover:text-[#B86F68] transition-colors py-1 px-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          <span>${post.commentsCount} replies</span>
        </button>
      </div>
    </div>
  `).join('');
}

window.togglePostLike = function(postId) {
  const post = COMMUNITY_POSTS.find(p => p.id === postId);
  if (!post) return;
  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;
  renderCommunityPosts();
  showToast(post.isLiked ? 'Liked discussion post!' : 'Removed like');
};

window.openDiscussionDetail = function(postId) {
  const post = COMMUNITY_POSTS.find(p => p.id === postId);
  if (!post) return;
  
  const modalContent = document.getElementById('genericModalContent');
  modalContent.innerHTML = `
    <div>
      <div class="flex items-center justify-between gap-2 mb-3">
        <span class="badge-pill bg-[#B86F68]/15 text-[#B86F68] text-xs font-semibold">${post.category}</span>
        <span class="text-xs text-[#8F7670]">${post.timestamp}</span>
      </div>
      
      <h3 class="font-serif text-2xl font-medium text-espresso dark:text-champagne mb-4">${post.title}</h3>
      
      <div class="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] mb-5">
        <div class="w-10 h-10 rounded-full bg-[#E9D8C5] dark:bg-[#382A25] text-espresso dark:text-champagne font-bold flex items-center justify-center">
          ${post.author.charAt(0)}
        </div>
        <div>
          <h5 class="text-sm font-semibold text-espresso dark:text-champagne">${post.author}</h5>
          <span class="text-xs text-[#8F7670]">${post.hairType}</span>
        </div>
      </div>
      
      <p class="text-sm text-[#5F4A44] dark:text-[#E3D1BF] leading-relaxed mb-6 whitespace-pre-line">${post.content}</p>
      
      <div class="border-t border-[var(--border-color)] pt-5 mb-6">
        <h5 class="font-serif text-lg font-medium text-espresso dark:text-champagne mb-4 flex items-center gap-2">
          <span>Community Thread (${post.replies.length} replies)</span>
        </h5>
        
        <div class="space-y-3 mb-6" id="threadRepliesList">
          ${post.replies.map(r => `
            <div class="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-xs">
              <strong class="text-espresso dark:text-champagne block mb-1 font-semibold">${r.author}</strong>
              <p class="text-[#5F4A44] dark:text-[#AF968D] leading-relaxed">${r.text}</p>
            </div>
          `).join('')}
        </div>
        
        <form onsubmit="handleThreadReply(event, '${post.id}')" class="space-y-3">
          <input type="text" id="replyAuthorInput" placeholder="Your Name or Hair Handle" required class="w-full text-xs p-3 rounded-xl custom-input" />
          <textarea id="replyTextInput" placeholder="Contribute your experience to this thread..." required rows="3" class="w-full text-xs p-3 rounded-xl custom-input resize-none"></textarea>
          <button type="submit" class="w-full py-2.5 rounded-xl btn-rose text-xs font-semibold">
            Post Reply
          </button>
        </form>
      </div>
      
      <div class="flex justify-end">
        <button type="button" onclick="closeGenericModal()" class="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-espresso dark:text-champagne text-xs font-medium">
          Close Discussion
        </button>
      </div>
    </div>
  `;
  openGenericModal();
};

window.handleThreadReply = function(e, postId) {
  e.preventDefault();
  const authorInput = document.getElementById('replyAuthorInput');
  const textInput = document.getElementById('replyTextInput');
  if (!authorInput || !textInput) return;
  
  const author = authorInput.value.trim();
  const text = textInput.value.trim();
  if (!author || !text) return;
  
  const post = COMMUNITY_POSTS.find(p => p.id === postId);
  if (!post) return;
  
  post.replies.push({ author, text });
  post.commentsCount++;
  renderCommunityPosts();
  openDiscussionDetail(postId);
  showToast('Reply published to community thread!');
};

function openNewDiscussionModal() {
  const modalContent = document.getElementById('genericModalContent');
  modalContent.innerHTML = `
    <div>
      <span class="badge-pill bg-[#B86F68]/15 text-[#B86F68] text-xs font-semibold mb-2">Strand Society Forum</span>
      <h3 class="font-serif text-2xl font-medium text-espresso dark:text-champagne mb-2">Start a New Discussion</h3>
      <p class="text-xs text-[#8F7670] mb-5">Share a question, wash-day discovery, or curl transition experience with our global collective.</p>
      
      <form onsubmit="handleCreateDiscussion(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-espresso dark:text-champagne mb-1.5">Discussion Title *</label>
          <input type="text" id="newPostTitle" placeholder="e.g. My experience using baobab protein on fine 2B waves" required class="w-full text-xs p-3 rounded-xl custom-input" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-espresso dark:text-champagne mb-1.5">Category *</label>
            <select id="newPostCategory" class="w-full text-xs p-3 rounded-xl custom-input">
              <option value="textured">Curly & Coily Care</option>
              <option value="scalp">Scalp Wellness</option>
              <option value="routines">Routine Transformations</option>
              <option value="recommendations">Product Recommendations</option>
              <option value="science">Ingredient Science Q&A</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-espresso dark:text-champagne mb-1.5">Your Hair Profile *</label>
            <input type="text" id="newPostHairType" placeholder="e.g. Type 3A Curls • Low Porosity" required class="w-full text-xs p-3 rounded-xl custom-input" />
          </div>
        </div>
        
        <div>
          <label class="block text-xs font-semibold text-espresso dark:text-champagne mb-1.5">Your Name or Pseudonym *</label>
          <input type="text" id="newPostAuthor" placeholder="e.g. Sophia L." required class="w-full text-xs p-3 rounded-xl custom-input" />
        </div>
        
        <div>
          <label class="block text-xs font-semibold text-espresso dark:text-champagne mb-1.5">Discussion Content *</label>
          <textarea id="newPostContent" rows="4" placeholder="Detail your experience, steps followed, or specific question..." required class="w-full text-xs p-3 rounded-xl custom-input resize-none"></textarea>
        </div>
        
        <div class="text-[11px] text-[#8F7670] italic">Demonstration Note: Posts submitted in this demo are stored in browser memory and clearly labeled.</div>
        
        <div class="flex gap-3 pt-2">
          <button type="submit" class="flex-1 py-3.5 rounded-xl btn-rose text-xs font-semibold">
            Publish Discussion
          </button>
          <button type="button" onclick="closeGenericModal()" class="px-5 py-3.5 rounded-xl border border-[var(--border-color)] text-xs text-espresso dark:text-champagne font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `;
  openGenericModal();
}

window.handleCreateDiscussion = function(e) {
  e.preventDefault();
  const title = document.getElementById('newPostTitle').value.trim();
  const category = document.getElementById('newPostCategory').value;
  const hairType = document.getElementById('newPostHairType').value.trim();
  const author = document.getElementById('newPostAuthor').value.trim();
  const content = document.getElementById('newPostContent').value.trim();
  
  if (!title || !hairType || !author || !content) {
    showToast('Please complete all required fields', 'error');
    return;
  }
  
  const newPost = {
    id: 'post_' + Date.now(),
    category,
    title,
    author: `${author} (Community Member)`,
    hairType,
    timestamp: 'Just now',
    likes: 1,
    isLiked: true,
    commentsCount: 0,
    content,
    replies: []
  };
  
  COMMUNITY_POSTS.unshift(newPost);
  renderCommunityPosts();
  closeGenericModal();
  showToast('Discussion published to the community feed!');
};

/* ==========================================================================
   10. SECTION 08: CUSTOMER REVIEWS & HAIR TRANSFORMATION GALLERY
   ========================================================================== */
let activeReviewFilter = 'all';

const TRANSFORMATION_STORIES = [
  {
    id: 't1',
    category: 'wavy',
    customer: 'Chloe Bennett',
    location: 'London, UK',
    hairType: 'Type 2B Waves • Medium Porosity',
    rating: 5,
    tag: 'Verified 90-Day Journey (Demo)',
    quote: '"My waves went from frizzy triangular fluff to defined, touchable ribbons. It changed how I view my natural texture completely."',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    fullStory: 'For nearly a decade, I flat-ironed my 2B waves every morning because brushing them dry turned them into an unruly cloud of frizz. Through the STRANDÉ diagnostic quiz, I learned my cuticles were parched from harsh foaming sulfates. Committing to the Velvet Silk Shampoo and Cashmere Cloud Leave-in restored my wave clump pattern in 6 weeks.',
    washProtocol: 'Wash every 3 days; micro-plop with silk turban; 2 drops Liquid Amber Oil to break the cast.',
    productId: 'p4',
    productName: 'Cashmere Cloud Leave-In Moisture Elixir'
  },
  {
    id: 't2',
    category: 'curly',
    customer: 'Dr. Nia Adebayo',
    location: 'Atlanta, USA',
    hairType: 'Type 3B Curls • High Porosity',
    rating: 5,
    tag: 'Verified 90-Day Journey (Demo)',
    quote: '"The baobab peptides gave my curls spring back that I had not seen since before my balayage highlight treatments."',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    fullStory: 'Bleaching lifted my 3B curls into loose, lifeless waves that snapped when wet. The Botanical Peptide Bond Repair Mask actually rebuilt the tensile strength from the inside out. My curl circumference has tightened and shedding dropped by over 70%.',
    washProtocol: 'Weekly 25-minute deep conditioning steam; cold water rinse; diffuse on low heat.',
    productId: 'p3',
    productName: 'Botanical Peptide Bond Repair Mask'
  },
  {
    id: 't3',
    category: 'coily',
    customer: 'Amina Khoury',
    location: 'Toronto, Canada',
    hairType: 'Type 4A Coils • High Density',
    rating: 5,
    tag: 'Verified 90-Day Journey (Demo)',
    quote: '"Retaining length on 4A coils used to feel impossible until I learned how to properly seal with cupuaçu butter."',
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
    fullStory: 'Type 4 hair is the most vulnerable to moisture loss at the sharp turns of each spiral. Using the Nectar Curl Cream on soaking wet hair with the Liquid Amber Oil created an occlusive barrier that lasted through day 5 without re-wetting.',
    washProtocol: 'Bi-weekly gentle sulfate-free wash; sectioned finger detangling; protective flat twists.',
    productId: 'p6',
    productName: 'Nectar Curl Sculpting Cream'
  },
  {
    id: 't4',
    category: 'bleached',
    customer: 'Sienna Miller',
    location: 'Sydney, Australia',
    hairType: 'Type 1C Straight • Bleached Platinum',
    rating: 5,
    tag: 'Verified 90-Day Journey (Demo)',
    quote: '"My bleach-fried split ends finally bonded back together. No more straw-like texture when blow drying."',
    image: 'https://images.unsplash.com/photo-1584297091622-af8e5bd80b13?auto=format&fit=crop&w=800&q=80',
    fullStory: 'Going platinum blonde wrecked my lipid barrier. The Thermal Veil Spray protected my compromised cuticle from flat-iron burn, while the peptide treatments restored elastic bounce.',
    washProtocol: 'Wash every 5 days; thermal shield every time tools exceed 300°F.',
    productId: 'p7',
    productName: 'Thermal Veil Heat Shield'
  },
  {
    id: 't5',
    category: 'curly',
    customer: 'Maya Lin',
    location: 'San Francisco, USA',
    hairType: 'Type 3C Curls • Dense Volume',
    rating: 5,
    tag: 'Verified 90-Day Journey (Demo)',
    quote: '"Zero crunch, zero white flakes, and 4-day curl definition even during foggy coastal mornings."',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    fullStory: 'Most curl products contain drying denatured alcohols or flaky gels that leave a helmet-like shell. STRANDÉ relies on flaxseed mucilage and cupuaçu butter, giving soft, bouncy definition you can run your fingers through.',
    washProtocol: 'Wash weekly; prayer hands application; diffuse until 80% dry.',
    productId: 'p6',
    productName: 'Nectar Curl Sculpting Cream'
  },
  {
    id: 't6',
    category: 'coily',
    customer: 'Zara Okafor',
    location: 'Lagos, Nigeria',
    hairType: 'Type 4B/4C Coils • Low Porosity',
    rating: 5,
    tag: 'Verified 90-Day Journey (Demo)',
    quote: '"Finding a scalp serum that calms protective style tightness without greasy residue was a revelation."',
    image: 'assets/zara-okafor.jpg',
    fullStory: 'While wearing knotless box braids, my scalp used to become tender and itchy by week 2. Applying the Scalp Harmony Microbiome Serum along my parts soothed inflammation immediately without causing buildup on the synthetic hair.',
    washProtocol: 'Serum applied 3x weekly along braid part lines; gentle clarifying mist bi-weekly.',
    productId: 'p5',
    productName: 'Scalp Harmony Microbiome Serum'
  }
];

function initReviewsGallery() {
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-[#B86F68]', 'text-white'));
      filterBtns.forEach(b => b.classList.add('bg-[var(--bg-card)]', 'text-espresso', 'dark:text-champagne'));
      btn.classList.add('bg-[#B86F68]', 'text-white');
      btn.classList.remove('bg-[var(--bg-card)]', 'text-espresso', 'dark:text-champagne');
      activeReviewFilter = btn.getAttribute('data-cat');
      renderReviewsGallery();
    });
  });
  
  renderReviewsGallery();
}

function renderReviewsGallery() {
  const container = document.getElementById('reviewsGalleryContainer');
  if (!container) return;
  
  const filtered = TRANSFORMATION_STORIES.filter(s => {
    if (activeReviewFilter === 'all') return true;
    return s.category === activeReviewFilter;
  });
  
  container.innerHTML = filtered.map(story => `
    <div class="card-hover-lift rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between cursor-pointer" onclick="openStoryLightbox('${story.id}')">
      <div>
        <div class="relative h-64 overflow-hidden img-zoom-wrapper bg-[#F5EFE8] dark:bg-[#231A18]">
          <img src="${story.image}" alt="${story.customer}" class="w-full h-full object-cover object-top" />
          <div class="absolute top-4 left-4">
            <span class="badge-pill bg-white/90 dark:bg-black/80 backdrop-blur-md text-espresso dark:text-champagne text-[10px] font-semibold">${story.hairType}</span>
          </div>
          <div class="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#B86F68] text-white flex items-center justify-center shadow-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </div>
        </div>
        
        <div class="p-6">
          <div class="flex items-center text-amber-500 text-xs mb-2">
            ★★★★★
            <span class="ml-2 text-[10px] uppercase font-bold text-[#B86F68] bg-[#B86F68]/15 px-2 py-0.5 rounded-full">${story.tag}</span>
          </div>
          
          <p class="font-serif italic text-base text-espresso dark:text-champagne leading-snug mb-4 line-clamp-3">${story.quote}</p>
          
          <div class="flex items-center justify-between text-xs text-[#8F7670] border-t border-[var(--border-subtle)] pt-3">
            <span class="font-semibold text-espresso dark:text-champagne">${story.customer}</span>
            <span>${story.location}</span>
          </div>
        </div>
      </div>
      
      <div class="p-6 pt-0">
        <div class="bg-[var(--bg-card-subtle)] p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs">
          <span class="text-[#8F7670] truncate text-[11px]">Primary Formula: <strong class="text-espresso dark:text-champagne">${story.productName}</strong></span>
          <button type="button" onclick="event.stopPropagation(); addToCart('${story.productId}')" class="px-2.5 py-1 rounded-lg btn-rose text-[10px] font-bold flex-shrink-0">
            + Bag
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

window.openStoryLightbox = function(storyId) {
  const story = TRANSFORMATION_STORIES.find(s => s.id === storyId);
  if (!story) return;
  
  const modalContent = document.getElementById('genericModalContent');
  modalContent.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div class="rounded-2xl overflow-hidden bg-[#F5EFE8] dark:bg-[#231A18] border border-[var(--border-color)]">
        <img src="${story.image}" alt="${story.customer}" class="w-full h-80 md:h-96 object-cover object-top" />
      </div>
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="badge-pill bg-[#B86F68] text-white text-[10px] font-semibold">${story.tag}</span>
          <span class="badge-pill bg-espresso/15 dark:bg-champagne/15 text-espresso dark:text-champagne text-[10px] font-medium">${story.hairType}</span>
        </div>
        
        <h3 class="font-serif text-2xl font-medium text-espresso dark:text-champagne mb-1">${story.customer}</h3>
        <span class="text-xs text-[#8F7670] block mb-4">${story.location}</span>
        
        <div class="text-amber-500 text-sm mb-4">★★★★★ <span class="text-xs text-[#8F7670]">(5.0 Verified Review)</span></div>
        
        <blockquote class="font-serif italic text-lg text-espresso dark:text-champagne leading-snug mb-4 pl-3 border-l-2 border-[#B86F68]">
          ${story.quote}
        </blockquote>
        
        <p class="text-xs text-[#5F4A44] dark:text-[#E3D1BF] leading-relaxed mb-6 whitespace-pre-line">${story.fullStory}</p>
        
        <div class="bg-[var(--bg-card-subtle)] p-4 rounded-xl border border-[var(--border-subtle)] mb-6 text-xs space-y-1.5">
          <h6 class="font-bold uppercase tracking-wider text-[#B86F68] text-[10px]">90-Day Regimen Routine</h6>
          <p class="text-[#5F4A44] dark:text-[#AF968D]">${story.washProtocol}</p>
        </div>
        
        <div class="flex items-center gap-3">
          <button type="button" onclick="addToCart('${story.productId}'); closeGenericModal();" class="flex-1 py-3 rounded-xl btn-rose text-xs font-semibold">
            Add ${story.productName} to Bag
          </button>
          <button type="button" onclick="closeGenericModal()" class="px-5 py-3 rounded-xl border border-[var(--border-color)] text-xs text-espresso dark:text-champagne font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
  openGenericModal();
};

/* ==========================================================================
   11. SECTION 09: HAIR-CARE KNOWLEDGE & EXPERT GUIDANCE
   ========================================================================== */
const ARTICLES = [
  {
    id: 'a1',
    title: 'The Porosity Matrix: Why Water Absorption Dictates Everything You Buy',
    category: 'Porosity & Science',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Cuticle porosity is the physical capacity of hair to absorb and retain lipids and moisture. Understanding your level determines whether you need low-molecular humectants or heavy sealers.',
    fullContent: `
      <h3>Understanding the Porosity Spectrum</h3>
      <p>In cosmetic chemistry, hair porosity describes how easily moisture, water, and active ingredients penetrate through the outer cuticle layer into the inner cortical matrix. Healthy virgin hair possesses tightly overlapping cuticular scales, resembling shingles on a roof. When undamaged, these scales open slightly in warm water and close tightly when cool.</p>
      
      <h4>The Three Primary States of Cuticle Porosity</h4>
      <p><strong>Low Porosity:</strong> Cuticle scales are packed exceptionally flat and tight. Moisture struggles to penetrate, causing products to sit on the surface and create greasy buildup. Requires gentle heat during treatments and lightweight humectants such as fermented rice water or sodium hyaluronate.</p>
      <p><strong>Medium / Normal Porosity:</strong> Cuticle architecture allows effortless hydration uptake with minimal moisture loss. Responds beautifully to balanced amino acid washes and periodic oil sealing.</p>
      <p><strong>High Porosity:</strong> Cuticles are permanently lifted, fractured, or depleted by bleach, chemical relaxers, or excessive hot tools. Water penetrates instantly but evaporates just as quickly, resulting in chronic frizz and dryness. High porosity demands bio-identical micro-peptides and rich plant butters (like cupuaçu and murumuru) to plug physical cuticular voids.</p>
      
      <div class="my-4 p-4 rounded-xl bg-[var(--bg-card-subtle)] border-l-4 border-[#B86F68]">
        <strong>Cosmetic Chemist Note:</strong> Float tests using water cups are notoriously inaccurate due to ambient sebum surface tension. Always perform spray droplet tests on clean, product-free strands.
      </div>
    `
  },
  {
    id: 'a2',
    title: 'The Architecture of a Wash Day: Step-by-Step for Textured Strands',
    category: 'Routines & Regimens',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    excerpt: 'An evidence-based wash day is an intentional multi-phase ritual engineered to prevent hygral fatigue and cuticular friction while reinforcing strand elasticity.',
    fullContent: `
      <h3>The Biological Need for a Structured Wash Day</h3>
      <p>When hair fiber absorbs water, its diameter swells by up to 16%. When it dries, it contracts. Repeated uncontrolled swelling and contraction weakens cell membrane complexes—a phenomenon known as hygral fatigue. A structured ritual minimizes mechanical friction while preserving the natural 18-MEA lipid layer.</p>
      
      <h4>Phase 1: Pre-Cleanse & Scalp Stimulation</h4>
      <p>Before stepping under the water stream, apply a botanical oil elixir to lengths if hair is dry or damaged. This limits excessive water penetration into the cortex while providing lubricity for finger-detangling.</p>
      
      <h4>Phase 2: pH-Balanced Cleansing</h4>
      <p>Lather with a sulfate-free surfactant system at pH 5.0 to 5.5. Concentrate purely on the scalp, allowing the downward water flow to gently clean mid-lengths and ends without aggressive scrubbing.</p>
      
      <h4>Phase 3: Deep Cuticular Conditioning</h4>
      <p>Squeeze out excess water before applying conditioner. Water acts as a barrier to conditioning agents; removing excess moisture allows cationic conditioners to bind electrostatically to negative sites on damaged strands.</p>
      
      <h4>Phase 4: Sealing & Micro-Plopping</h4>
      <p>Rinse with cool water to align cuticle scales. Use a microfiber towel or 100% silk wrap instead of abrasive terry cloth to cut drying time in half without frizz.</p>
    `
  },
  {
    id: 'a3',
    title: 'Decoding Surfactants: The Science of Sulfate-Free Cleansing',
    category: 'Ingredient Science',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Sulfates are not inherently poisonous demons, but harsh anionic detergents strip vital scalp lipids. Discover why gentle isethionates and glucosides maintain equilibrium.',
    fullContent: `
      <h3>The Truth About Surfactant Chemistry</h3>
      <p>Surfactants (surface active agents) consist of a hydrophilic head and a lipophilic tail. They bind to oils and sebum on one end and water on the other, allowing oils to be rinsed away. Traditional sulfates—namely Sodium Lauryl Sulfate (SLS)—have small molecular weights and high charge density, allowing them to strip not only excess sebum but also the hair's protective inter-cellular lipid barrier.</p>
      
      <h4>Why Sulfate Alternatives Excel for Textured & Colored Hair</h4>
      <p>Gentle coconut-derived cleansers, such as <strong>Sodium Cocoyl Isethionate</strong> ("baby foam") and <strong>Decyl Glucoside</strong>, form larger surfactant micelle structures that cleanse impurities from the scalp without entering the cuticle or leaching artificial color pigments.</p>
      <p>They maintain scalp pH around 5.5, which discourages opportunistic flaking yeast (Malassezia) while keeping the cuticle shingles lying flat and reflective.</p>
      
      <div class="my-4 p-4 rounded-xl bg-[var(--bg-card-subtle)] border-l-4 border-[#B86F68]">
        <strong>Key Takeaway:</strong> Cleanse according to scalp oiliness and hair porosity rather than marketing hype. Balance is always the ultimate objective.
      </div>
    `
  },
  {
    id: 'a4',
    title: 'The Physics of Heat Protection: Shielding Keratin up to 450°F',
    category: 'Thermal Science',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Heat denatures alpha-keratin into disorganized beta-keratin above 300°F. Discover how biomimetic film-formers dissipate thermal energy safely.',
    fullContent: `
      <h3>What Actually Happens When Heat Meets Hair?</h3>
      <p>Hair is primarily composed of fibrous alpha-keratin proteins organized in coiled coils. At temperatures exceeding 300°F (150°C), internal structural water evaporates rapidly. At 400°F+ (205°C), alpha-keratin denatures into disorganized beta-keratin, permanently weakening strand elasticity and tensile resilience.</p>
      
      <h4>How Cross-Linked Shield Polymers Function</h4>
      <p>Effective heat protectors utilize hydrolysed botanical proteins paired with thermal polysaccharides (such as Tremella snow mushroom extracts). These polymers cross-link on the cuticular surface, creating a conductive thermal cushion that slows the rate of heat transfer from iron plates to the cortex.</p>
      <p>Never apply high-heat tools to damp hair. Water trapped inside the cortex boils instantly into steam, causing microscopic cuticular blisters and permanent breakage.</p>
    `
  },
  {
    id: 'a5',
    title: 'Microbiome Health: How Scalp Lipids Dictate Follicle Strength',
    category: 'Scalp Biology',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Your scalp is skin. An inflamed, congested scalp microbiome leads to follicular micro-scarring and shedding. Discover the clinical role of postbiotics and zinc PCA.',
    fullContent: `
      <h3>The Scalp as a Living Ecosystem</h3>
      <p>The scalp possesses five times more nerve endings and twice as many sebaceous glands as the skin on your face. It is populated by billions of beneficial microorganisms, primarily Staphylococcus epidermidis and Cutibacterium species, which produce antimicrobial fatty acids to defend against pathogen overgrowth.</p>
      
      <h4>Combatting Malassezia Overgrowth Naturally</h4>
      <p>When sebum accumulates or synthetic residues clog pores, Malassezia yeast metabolizes sebum into irritant free fatty acids, triggering inflammatory flaking, redness, and itchiness.</p>
      <p>Incorporating <strong>Lactobacillus postbiotic lysates</strong> reinforces friendly bacterial colonies, while <strong>Zinc PCA</strong> suppresses excess 5-alpha reductase activity, ensuring hair follicles remain in the anagen (growth) phase for maximum density.</p>
    `
  },
  {
    id: 'a6',
    title: 'How to Decipher an INCI Ingredient Label Like a Cosmetic Chemist',
    category: 'Label Literacy',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Demystifying the International Nomenclature of Cosmetic Ingredients (INCI). Learn the 1% concentration rule and identify high-performing bio-actives.',
    fullContent: `
      <h3>The Rules of Ingredient Listing</h3>
      <p>By international cosmetic law, ingredients present at concentrations greater than 1% must be listed in descending order of predominance. The top 5 to 6 ingredients typically account for 80% to 90% of the entire formulation by volume.</p>
      
      <h4>The Crucial 1% Threshold Line</h4>
      <p>Once an ingredient drops below 1% concentration (usually signaled by the appearance of phenoxyethanol, sodium benzoate, or thickeners like xanthan gum), brands are legally allowed to list remaining ingredients in any order they wish. This is where "fairy dusting"—listing exotic sounding extracts at 0.001%—frequently occurs in lower-quality products.</p>
      <p>At STRANDÉ, our active bio-peptides, cold-pressed plant butters, and postbiotic lysates are maintained at functional, clinically relevant percentages above the 1% threshold to guarantee observable cuticular transformation.</p>
    `
  }
];

function initKnowledgeJournal() {
  const container = document.getElementById('articlesGridContainer');
  if (!container) return;
  
  container.innerHTML = ARTICLES.map(a => `
    <div class="card-hover-lift rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between">
      <div>
        <div class="relative h-56 overflow-hidden img-zoom-wrapper bg-[#F5EFE8] dark:bg-[#231A18]">
          <img src="${a.image}" alt="${a.title}" class="w-full h-full object-cover" />
          <div class="absolute top-4 left-4">
            <span class="badge-pill bg-white/90 dark:bg-black/80 backdrop-blur-md text-espresso dark:text-champagne text-[10px] font-semibold">${a.category}</span>
          </div>
          <div class="absolute bottom-4 right-4 bg-espresso/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-medium">
            ${a.readTime}
          </div>
        </div>
        
        <div class="p-6">
          <h4 class="font-serif text-xl font-medium text-espresso dark:text-champagne mb-2 leading-snug line-clamp-2 hover:text-[#B86F68] cursor-pointer transition-colors" onclick="openArticleReader('${a.id}')">${a.title}</h4>
          <p class="text-xs text-[#5F4A44] dark:text-[#E3D1BF] leading-relaxed line-clamp-3 mb-4">${a.excerpt}</p>
        </div>
      </div>
      
      <div class="p-6 pt-0">
        <button type="button" onclick="openArticleReader('${a.id}')" class="w-full py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-espresso dark:text-champagne hover:border-[#B86F68] hover:text-[#B86F68] transition-colors flex items-center justify-center gap-1.5">
          <span>Read Full Masterclass</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

window.openArticleReader = function(articleId) {
  const a = ARTICLES.find(item => item.id === articleId);
  if (!a) return;
  
  const modalContent = document.getElementById('genericModalContent');
  modalContent.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <div class="relative h-64 md:h-72 rounded-2xl overflow-hidden mb-6">
        <img src="${a.image}" alt="${a.title}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <div class="flex items-center gap-2 mb-2">
            <span class="badge-pill bg-[#B86F68] text-white text-[10px] font-semibold">${a.category}</span>
            <span class="text-xs text-white/80">${a.readTime}</span>
          </div>
          <h2 class="font-serif text-2xl md:text-3xl font-medium leading-tight">${a.title}</h2>
        </div>
      </div>
      
      <div class="prose prose-sm dark:prose-invert max-w-none text-xs md:text-sm text-[#5F4A44] dark:text-[#E3D1BF] leading-relaxed space-y-4 mb-8">
        ${a.fullContent}
      </div>
      
      <div class="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[11px] text-[#8F7670] italic mb-6">
        Informational Disclaimer: Educational hair-care guidance based on cosmetic science and trichological principles. Always patch-test new formulations. Not intended as medical diagnosis or dermatological treatment.
      </div>
      
      <div class="flex justify-between items-center border-t border-[var(--border-color)] pt-4">
        <span class="text-xs text-[#8F7670]">STRANDÉ Editorial Journal</span>
        <button type="button" onclick="closeGenericModal()" class="px-5 py-2.5 rounded-xl btn-rose text-xs font-semibold">
          Close Masterclass
        </button>
      </div>
    </div>
  `;
  openGenericModal();
};

/* ==========================================================================
   12. SHOPPING BAG / CART STATE & SLIDE-OUT DRAWER
   ========================================================================== */
let cart = [];
let appliedPromoCode = null;

function initCart() {
  const openCartBtn = document.getElementById('openCartBtn');
  const openCartBtnMobile = document.getElementById('openCartBtnMobile');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (openCartBtn) openCartBtn.addEventListener('click', openCartDrawer);
  if (openCartBtnMobile) openCartBtnMobile.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);
  
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
      const input = document.getElementById('promoCodeInput');
      if (!input) return;
      const code = input.value.trim().toUpperCase();
      if (code === 'STRANDE15') {
        appliedPromoCode = 'STRANDE15';
        showToast('Promo code STRANDE15 applied! 15% VIP discount active.');
        renderCart();
      } else if (code === '') {
        showToast('Please enter a coupon code', 'error');
      } else {
        showToast('Invalid promo code. Try "STRANDE15" for 15% off.', 'error');
      }
    });
  }
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your shopping bag is empty', 'error');
        return;
      }
      
      closeCartDrawer();
      const modalContent = document.getElementById('genericModalContent');
      
      let itemsTotal = cart.reduce((sum, it) => sum + (it.product.price * it.quantity), 0);
      let discount = appliedPromoCode ? itemsTotal * 0.15 : 0;
      let finalTotal = Math.max(0, itemsTotal - discount);
      
      modalContent.innerHTML = `
        <div class="text-center py-4">
          <div class="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <span class="badge-pill bg-[#B86F68] text-white text-xs mb-2">Simulated Checkout Prototype</span>
          <h3 class="font-serif text-3xl font-medium text-espresso dark:text-champagne mb-2">Order Simulation Complete!</h3>
          <p class="text-sm text-[#5F4A44] dark:text-[#E3D1BF] max-w-md mx-auto mb-6">Thank you for exploring STRANDÉ. Your curated hair-care bag of ${cart.length} item(s) totaled <strong>$${finalTotal.toFixed(2)}</strong>.</p>
          
          <div class="bg-[var(--bg-card-subtle)] p-4 rounded-2xl border border-[var(--border-color)] max-w-md mx-auto mb-6 text-left space-y-2 text-xs">
            <div class="flex justify-between"><strong>Simulated Order Number:</strong> <span>STR-${Math.floor(100000 + Math.random() * 900000)}</span></div>
            <div class="flex justify-between"><strong>Complimentary Gift:</strong> <span>Biomimetic Silk Comb + Discovery Duo</span></div>
            <div class="flex justify-between"><strong>Shipping:</strong> <span>Express Carbon-Neutral ($0.00)</span></div>
          </div>
          
          <div class="text-[11px] text-[#8F7670] italic mb-6">Demonstration Notice: This website is a frontend platform prototype. No real financial transactions or live shipments are initiated.</div>
          
          <button type="button" onclick="cart = []; renderCart(); closeGenericModal(); showToast('Bag cleared following simulated checkout!');" class="w-full max-w-md mx-auto py-3.5 rounded-xl btn-rose text-sm font-semibold">
            Complete & Return to Discovery
          </button>
        </div>
      `;
      openGenericModal();
    });
  }
  
  renderCart();
}

window.addToCart = function(productId, qty = 1, notify = true) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;
  
  const existing = cart.find(it => it.product.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ product: prod, quantity: qty });
  }
  
  renderCart();
  if (notify) {
    showToast(`Added "${prod.name}" to your shopping bag`);
  }
};

window.removeFromCart = function(productId) {
  cart = cart.filter(it => it.product.id !== productId);
  renderCart();
  showToast('Item removed from shopping bag');
};

window.adjustCartQty = function(productId, delta) {
  const it = cart.find(item => item.product.id === productId);
  if (!it) return;
  it.quantity += delta;
  if (it.quantity <= 0) {
    removeFromCart(productId);
  } else {
    renderCart();
  }
};

function renderCart() {
  const cartItemsList = document.getElementById('cartItemsList');
  const cartBadge = document.getElementById('cartBadge');
  const cartBadgeMobile = document.getElementById('cartBadgeMobile');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartDiscountRow = document.getElementById('cartDiscountRow');
  const cartDiscountAmount = document.getElementById('cartDiscountAmount');
  const cartTotal = document.getElementById('cartTotal');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartFooter = document.getElementById('cartFooter');
  
  const totalItems = cart.reduce((sum, it) => sum + it.quantity, 0);
  
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    if (totalItems > 0) cartBadge.classList.remove('hidden');
    else cartBadge.classList.add('hidden');
  }
  
  if (cartBadgeMobile) {
    cartBadgeMobile.textContent = totalItems;
    if (totalItems > 0) cartBadgeMobile.classList.remove('hidden');
    else cartBadgeMobile.classList.add('hidden');
  }
  
  if (!cartItemsList) return;
  
  if (cart.length === 0) {
    cartEmptyState.classList.remove('hidden');
    cartItemsList.classList.add('hidden');
    if (cartFooter) cartFooter.classList.add('hidden');
    return;
  }
  
  cartEmptyState.classList.add('hidden');
  cartItemsList.classList.remove('hidden');
  if (cartFooter) cartFooter.classList.remove('hidden');
  
  let subtotal = 0;
  
  cartItemsList.innerHTML = cart.map(it => {
    const lineTotal = it.product.price * it.quantity;
    subtotal += lineTotal;
    return `
      <div class="flex gap-4 p-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] items-center">
        <img src="${it.product.image}" alt="${it.product.name}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <span class="text-[9px] uppercase font-bold text-[#B86F68] block">${it.product.badge}</span>
          <h5 class="text-xs font-semibold text-espresso dark:text-champagne truncate">${it.product.name}</h5>
          <span class="text-xs font-medium text-[#8F7670]">$${it.product.price}.00</span>
          
          <div class="flex items-center gap-3 mt-2">
            <div class="flex items-center gap-1.5 bg-[var(--bg-card)] px-2 py-0.5 rounded-lg border border-[var(--border-color)]">
              <button type="button" onclick="adjustCartQty('${it.product.id}', -1)" class="w-5 h-5 flex items-center justify-center text-xs font-bold text-espresso dark:text-champagne hover:text-[#B86F68]">-</button>
              <span class="text-xs font-bold text-espresso dark:text-champagne px-1">${it.quantity}</span>
              <button type="button" onclick="adjustCartQty('${it.product.id}', 1)" class="w-5 h-5 flex items-center justify-center text-xs font-bold text-espresso dark:text-champagne hover:text-[#B86F68]">+</button>
            </div>
            <button type="button" onclick="removeFromCart('${it.product.id}')" class="text-xs text-[#8F7670] hover:text-red-500 transition-colors">
              Remove
            </button>
          </div>
        </div>
        <div class="text-right">
          <span class="font-serif font-bold text-sm text-espresso dark:text-champagne">$${lineTotal.toFixed(2)}</span>
        </div>
      </div>
    `;
  }).join('');
  
  let discount = appliedPromoCode ? subtotal * 0.15 : 0;
  let finalTotal = Math.max(0, subtotal - discount);
  
  if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  
  if (cartDiscountRow) {
    if (appliedPromoCode) {
      cartDiscountRow.classList.remove('hidden');
      if (cartDiscountAmount) cartDiscountAmount.textContent = `-$${discount.toFixed(2)} (15% OFF)`;
    } else {
      cartDiscountRow.classList.add('hidden');
    }
  }
  
  if (cartTotal) cartTotal.textContent = `$${finalTotal.toFixed(2)}`;
}

window.openCartDrawer = function() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('hidden');
    drawer.classList.remove('hidden');
    void drawer.offsetWidth;
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    drawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }
};

window.closeCartDrawer = function() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (drawer.classList.contains('translate-x-full')) {
        drawer.classList.add('hidden');
        backdrop.classList.add('hidden');
      }
    }, 300);
  }
};

/* ==========================================================================
   13. SECTION 10: VIP NEWSLETTER & BRAND STORY
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletterEmailInput');
    const feedback = document.getElementById('newsletterFeedback');
    if (!input) return;
    
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      if (feedback) {
        feedback.textContent = 'Please enter a valid email address (e.g., name@domain.com)';
        feedback.className = 'text-xs text-rose-500 mt-2 block';
      }
      return;
    }
    
    // Simulate successful subscription
    input.value = '';
    if (feedback) {
      feedback.innerHTML = `
        <span class="text-emerald-500 font-semibold block">Welcome to The Strand Society!</span>
        <span class="text-[#8F7670] block mt-0.5">Your 15% VIP welcome voucher <strong>STRANDE15</strong> has been activated for immediate use.</span>
      `;
      feedback.className = 'text-xs mt-2 block';
    }
    showToast('Subscribed to VIP Strand Society with code STRANDE15!');
  });
}

/* ==========================================================================
   14. GENERIC LIGHTBOX / MODAL ENGINE
   ========================================================================== */
window.openGenericModal = function() {
  const modal = document.getElementById('genericModal');
  const backdrop = document.getElementById('genericModalBackdrop');
  const panel = document.getElementById('genericModalPanel');
  if (modal && backdrop && panel) {
    modal.classList.remove('pointer-events-none');
    backdrop.classList.remove('opacity-0');
    panel.classList.remove('opacity-0', 'scale-95');
    document.body.style.overflow = 'hidden';
  }
};

window.closeGenericModal = function() {
  const modal = document.getElementById('genericModal');
  const backdrop = document.getElementById('genericModalBackdrop');
  const panel = document.getElementById('genericModalPanel');
  if (modal && backdrop && panel) {
    modal.classList.add('pointer-events-none');
    backdrop.classList.add('opacity-0');
    panel.classList.add('opacity-0', 'scale-95');
    document.body.style.overflow = '';
  }
};

/* ==========================================================================
   15. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
let toastTimeout;
window.showToast = function(message, type = 'success') {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  
  clearTimeout(toastTimeout);
  
  const icon = type === 'error'
    ? `<svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
    : `<svg class="w-4 h-4 text-[#B86F68]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
  
  toast.innerHTML = `
    <div class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-espresso dark:bg-[#2A1F1B] text-champagne text-xs font-medium shadow-2xl border border-[#B86F68]/30 max-w-sm">
      <div class="w-6 h-6 rounded-full bg-[#B86F68]/15 flex items-center justify-center flex-shrink-0">
        ${icon}
      </div>
      <span class="flex-1">${message}</span>
    </div>
  `;
  
  toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
  
  toastTimeout = setTimeout(() => {
    toast.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
  }, 3500);
};

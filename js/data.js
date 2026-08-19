/* ===================== DATA ===================== */
const MOODS = ["Calm","Energetic","Dark & Moody","Playful","Epic","Romantic","Dreamy","Mysterious","Nostalgic","Minimal"];
const COLOR_SWATCHES = [
  {id:"red",hex:"#c1272d"},{id:"orange",hex:"#e07a2b"},{id:"gold",hex:"#e0a458"},{id:"yellow",hex:"#e8d24a"},
  {id:"green",hex:"#4c9a6a"},{id:"teal",hex:"#2f9c95"},{id:"blue",hex:"#3b6fb0"},{id:"purple",hex:"#7b4fb5"},
  {id:"pink",hex:"#d76a9b"},{id:"black",hex:"#161616"},{id:"white",hex:"#f0ede4"},{id:"gray",hex:"#8a8a8a"},
  {id:"brown",hex:"#7a5237"},{id:"neon",hex:"#39ffcb"}
];
const DIMENSIONS = [
  {id:"phone",label:"Phone",w:1080,h:1920,ratio:"9/16"},
  {id:"desktop",label:"Desktop",w:1920,h:1080,ratio:"16/9"},
  {id:"square",label:"Square",w:1080,h:1080,ratio:"1/1"},
  {id:"ultrawide",label:"Ultrawide",w:3440,h:1440,ratio:"21/9"},
  {id:"tablet",label:"Tablet",w:1640,h:2360,ratio:"41/59"}
];

// Social Media Backgrounds section reuses every existing wallpaper image —
// same content, just exported/previewed at platform-specific dimensions
// instead of device dimensions. No new images required to launch this.
const SOCIAL_PLATFORMS = [
  {id:"igStory",label:"Instagram Story",w:1080,h:1920,ratio:"9/16"},
  {id:"igPost",label:"Instagram Post",w:1080,h:1080,ratio:"1/1"},
  {id:"twitterHeader",label:"X / Twitter Header",w:1500,h:500,ratio:"3/1"},
  {id:"twitterPost",label:"X / Twitter Post",w:1200,h:675,ratio:"16/9"},
  {id:"facebookCover",label:"Facebook Cover",w:820,h:312,ratio:"205/78"},
  {id:"linkedinBanner",label:"LinkedIn Banner",w:1584,h:396,ratio:"4/1"},
  {id:"youtubeThumb",label:"YouTube Thumbnail",w:1280,h:720,ratio:"16/9"},
  {id:"pinterestPin",label:"Pinterest Pin",w:1000,h:1500,ratio:"2/3"},
  {id:"zoomBg",label:"Zoom Background",w:1920,h:1080,ratio:"16/9"}
];

// palette per populated sub-niche: [c0,c1,c2,c3]
const PALETTES = {
  mountains:["#26415c","#3e5c76","#748cab","#f0ebe3"], ocean:["#003049","#0077b6","#00b4d8","#caf0f8"],
  forest:["#1b4332","#2d6a4f","#40916c","#95d5b2"], desert:["#7f4f24","#a9744f","#dda15e","#fefae0"],
  aurora:["#03071e","#7209b7","#4361ee","#4cc9f0"], sunset:["#03071e","#d00000","#faa307","#ffba08"],
  galaxy:["#0d0221","#0f4c81","#7b2cbf","#c77dff"], nebula:["#10002b","#3c096c","#7b2cbf","#e0aaff"],
  blackhole:["#000000","#0b0b0b","#3a0ca3","#f72585"], fluidart:["#ff006e","#fb5607","#ffbe0b","#8338ec"],
  geometric:["#264653","#2a9d8f","#e9c46a","#f4a261"], lowpoly:["#003f88","#00509d","#fdc500","#ffd500"],
  minimalsolid:["#ede0d4","#e6ccb2","#ddb892","#b08968"], monochrome:["#0a0a0a","#3d3d3d","#8a8a8a","#e5e5e5"],
  blackwallpaper:["#000000","#111111","#1a1a1a","#2b2b2b"], darkacademia:["#1b1b1b","#3e2723","#5d4037","#8d6e63"],
  cityskyline:["#020024","#090979","#00d4ff","#e0f7ff"], neonstreets:["#0f0026","#ff00c8","#00fff0","#1a0033"],
  brutalism:["#4a4a48","#7a7a78","#c9c9c7","#e5e0da"], animelandscape:["#ffafcc","#a2d2ff","#bde0fe","#ffc8dd"],
  cyberpunk:["#0d0221","#ff2079","#00fff9","#2b0f54"], vaporwave:["#ff71ce","#01cdfe","#05ffa1","#b967ff"],
  pixelart:["#08080f","#3a1d63","#7209b7","#f72585"], circuits:["#00110a","#00ff41","#004225","#0a2e1f"],
  supercars:["#8d0801","#780000","#c1121f","#fdf0d5"], classiccars:["#582f0e","#7f4f24","#936639","#a68a64"],
  woodgrain:["#3e2723","#5d4037","#795548","#a1887f"], concrete:["#5c5c5c","#7d7d7d","#9d9d9d","#c9c9c9"],
  christmas:["#0b3d0b","#b3001b","#f4d35e","#ffffff"], halloween:["#1a0f00","#ff7b00","#7209b7","#000000"],
  valentines:["#590d22","#c9184a","#ff4d6d","#ffccd5"], quotes:["#212529","#495057","#adb5bd","#f8f9fa"],
  bigcats:["#3a2618","#a05a2c","#d9a441","#f2d492"], underwater:["#03045e","#0077b6","#00b4d8","#90e0ef"],
  coffee:["#3e2723","#6f4e37","#a9746e","#d7ccc8"], basketball:["#7a0e0e","#c1121f","#fdf0d5","#003049"],
  y2k:["#ff9ecd","#c1f7ff","#fff685","#c8b6ff"], cottagecore:["#606c38","#dda15e","#bc6c25","#fefae0"],
  dragons:["#1a0000","#4a0404","#a01a1a","#ff5a00"], zen:["#eae7dc","#d8c3a5","#8e8d8a","#e98074"],
  rain:["#1c2b36","#354f5c","#5b7c8d","#c9dde5"], snow:["#0c1524","#3c5a76","#a9c9dd","#f5faff"],
  wildflowers:["#3a5a40","#588157","#a3b18a","#dad7cd"], fractal:["#03071e","#370617","#9d0208","#faa307"],
  hologram:["#00f5ff","#ff00e6","#3a0ca3","#0d0221"], birds:["#22577a","#38a3a5","#57cc99","#c7f9cc"]
};

// deep taxonomy — id: {label, group, palette(optional -> populated), moodHint, colorHint}
const CATEGORY_GROUPS = [
 {name:"Nature & Landscapes", cats:[
   {id:"mountains",label:"Mountains",palette:"mountains",mood:"Calm",colors:["blue","gray","white"]},
   {id:"ocean",label:"Beaches & Ocean",palette:"ocean",mood:"Calm",colors:["blue","teal"]},
   {id:"forest",label:"Forests",palette:"forest",mood:"Calm",colors:["green"]},
   {id:"desert",label:"Deserts",palette:"desert",mood:"Nostalgic",colors:["orange","brown"]},
   {id:"aurora",label:"Northern Lights",palette:"aurora",mood:"Dreamy",colors:["purple","blue","teal"]},
   {id:"sunset",label:"Sunrises & Sunsets",palette:"sunset",mood:"Romantic",colors:["orange","red","gold"]},
   {id:"rain",label:"Rain & Storms",palette:"rain",mood:"Mysterious",colors:["blue","gray"]},
   {id:"snow",label:"Snow & Winter",palette:"snow",mood:"Calm",colors:["blue","white"]},
   {id:"wildflowers",label:"Flowers & Botanical",palette:"wildflowers",mood:"Playful",colors:["green","gold"]},
   {id:"waterfalls",label:"Waterfalls"},{id:"autumn",label:"Autumn Foliage"},{id:"countryside",label:"Countryside"}
 ]},
 {name:"Space & Sci-Fi", cats:[
   {id:"galaxy",label:"Galaxies",palette:"galaxy",mood:"Epic",colors:["purple","blue"]},
   {id:"nebula",label:"Nebulae",palette:"nebula",mood:"Dreamy",colors:["purple","pink"]},
   {id:"blackhole",label:"Black Holes",palette:"blackhole",mood:"Dark & Moody",colors:["black","purple","pink"]},
   {id:"planets",label:"Planets"},{id:"astronauts",label:"Astronauts"},{id:"spaceships",label:"Spaceships"},
   {id:"moonphases",label:"Moon Phases"},{id:"scificities",label:"Sci-fi Cities"},{id:"aliens",label:"UFOs & Aliens"}
 ]},
 {name:"Abstract & Patterns", cats:[
   {id:"fluidart",label:"Fluid Art",palette:"fluidart",mood:"Energetic",colors:["pink","orange","purple"]},
   {id:"geometric",label:"Geometric Shapes",palette:"geometric",mood:"Playful",colors:["teal","gold"]},
   {id:"lowpoly",label:"Low Poly",palette:"lowpoly",mood:"Playful",colors:["blue","yellow"]},
   {id:"fractal",label:"Fractals",palette:"fractal",mood:"Mysterious",colors:["red","orange"]},
   {id:"hologram",label:"Holograms",palette:"hologram",mood:"Energetic",colors:["neon","purple"]},
   {id:"gradientwaves",label:"Gradient Waves"},{id:"marble",label:"Marble Textures"},
   {id:"liquidmetal",label:"Liquid Metal"},{id:"papercut",label:"Paper Cut Art"},{id:"generative",label:"Generative Art"}
 ]},
 {name:"Minimal & Aesthetic", cats:[
   {id:"minimalsolid",label:"Minimalist Solid",palette:"minimalsolid",mood:"Minimal",colors:["brown","white"]},
   {id:"monochrome",label:"Monochrome",palette:"monochrome",mood:"Minimal",colors:["black","gray","white"]},
   {id:"zen",label:"Zen & Calm",palette:"zen",mood:"Calm",colors:["brown","white"]},
   {id:"pastelminimal",label:"Pastel Minimal"},{id:"lineart",label:"Line Art"},
   {id:"negativespace",label:"Negative Space"},{id:"wabisabi",label:"Japanese Wabi-Sabi"}
 ]},
 {name:"Dark & Moody", cats:[
   {id:"blackwallpaper",label:"Black Wallpapers",palette:"blackwallpaper",mood:"Dark & Moody",colors:["black"]},
   {id:"darkacademia",label:"Dark Academia",palette:"darkacademia",mood:"Nostalgic",colors:["brown","black"]},
   {id:"gothic",label:"Gothic"},{id:"horror",label:"Horror"},{id:"noir",label:"Noir"},
   {id:"smokefog",label:"Smoke & Fog"},{id:"deepspaceblack",label:"Deep Space Black"}
 ]},
 {name:"Urban & Architecture", cats:[
   {id:"cityskyline",label:"Skylines at Night",palette:"cityskyline",mood:"Epic",colors:["blue","teal"]},
   {id:"neonstreets",label:"Neon Streets",palette:"neonstreets",mood:"Energetic",colors:["pink","teal","neon"]},
   {id:"brutalism",label:"Brutalism",palette:"brutalism",mood:"Minimal",colors:["gray"]},
   {id:"bridges",label:"Bridges"},{id:"streetphoto",label:"Street Photography"},{id:"skyscrapers",label:"Skyscrapers"}
 ]},
 {name:"Anime & Illustration", cats:[
   {id:"animelandscape",label:"Anime Landscapes",palette:"animelandscape",mood:"Dreamy",colors:["pink","blue"]},
   {id:"animecharacters",label:"Anime Characters"},{id:"mangapanels",label:"Manga Panels"},
   {id:"chibi",label:"Chibi Art"},{id:"ghibliinspired",label:"Studio-Ghibli-Inspired"},{id:"cyberpunkanime",label:"Cyberpunk Anime"}
 ]},
 {name:"Gaming", cats:[
   {id:"pixelart",label:"Pixel Art",palette:"pixelart",mood:"Playful",colors:["purple","pink"]},
   {id:"retroarcade",label:"Retro Arcade"},{id:"fantasyrpg",label:"Fantasy RPG"},{id:"fpsbattle",label:"FPS Battle Scenes"},
   {id:"gameconceptart",label:"Game Concept Art"},{id:"esports",label:"Esports Team Themes"}
 ]},
 {name:"Tech & Digital", cats:[
   {id:"circuits",label:"Circuit Boards",palette:"circuits",mood:"Mysterious",colors:["green","black"]},
   {id:"cyberpunk",label:"Cyberpunk",palette:"cyberpunk",mood:"Energetic",colors:["pink","teal"]},
   {id:"vaporwave",label:"Vaporwave",palette:"vaporwave",mood:"Nostalgic",colors:["pink","purple","teal"]},
   {id:"matrixcode",label:"Matrix Code"},{id:"aineural",label:"AI & Neural"},{id:"glitchart",label:"Glitch Art"}
 ]},
 {name:"Automotive", cats:[
   {id:"supercars",label:"Supercars",palette:"supercars",mood:"Epic",colors:["red","black"]},
   {id:"classiccars",label:"Classic Cars",palette:"classiccars",mood:"Nostalgic",colors:["brown","gold"]},
   {id:"motorcycles",label:"Motorcycles"},{id:"racing",label:"Racing"},{id:"concepts",label:"Concept Vehicles"}
 ]},
 {name:"Textures & Materials", cats:[
   {id:"woodgrain",label:"Wood Grain",palette:"woodgrain",mood:"Calm",colors:["brown"]},
   {id:"concrete",label:"Concrete",palette:"concrete",mood:"Minimal",colors:["gray"]},
   {id:"metal",label:"Metal"},{id:"fabric",label:"Fabric & Knit"},{id:"water",label:"Water Droplets"},{id:"stone",label:"Stone"}
 ]},
 {name:"Seasonal & Holiday", cats:[
   {id:"christmas",label:"Christmas",palette:"christmas",mood:"Playful",colors:["red","green","gold"]},
   {id:"halloween",label:"Halloween",palette:"halloween",mood:"Mysterious",colors:["orange","black","purple"]},
   {id:"valentines",label:"Valentine's Day",palette:"valentines",mood:"Romantic",colors:["pink","red"]},
   {id:"newyear",label:"New Year"},{id:"easter",label:"Easter"},{id:"summer",label:"Summer Vibes"},{id:"thanksgiving",label:"Thanksgiving"}
 ]},
 {name:"Typography & Quotes", cats:[
   {id:"quotes",label:"Motivational Quotes",palette:"quotes",mood:"Energetic",colors:["black","white"]},
   {id:"lyrics",label:"Song Lyrics"},{id:"typeminimal",label:"Minimal Typography"},{id:"calligraphy",label:"Calligraphy"}
 ]},
 {name:"Animals & Wildlife", cats:[
   {id:"bigcats",label:"Big Cats",palette:"bigcats",mood:"Epic",colors:["orange","brown"]},
   {id:"underwater",label:"Underwater Life",palette:"underwater",mood:"Calm",colors:["blue","teal"]},
   {id:"birds",label:"Birds",palette:"birds",mood:"Calm",colors:["teal","green"]},
   {id:"pets",label:"Pets: Cats & Dogs"},{id:"insectsmacro",label:"Insects & Macro"},{id:"mythical",label:"Mythical Creatures"}
 ]},
 {name:"Food & Drink", cats:[
   {id:"coffee",label:"Coffee & Cafe",palette:"coffee",mood:"Calm",colors:["brown"]},
   {id:"desserts",label:"Desserts"},{id:"fruits",label:"Fruits"},{id:"cocktails",label:"Cocktails & Bar"}
 ]},
 {name:"Sports & Fitness", cats:[
   {id:"basketball",label:"Basketball",palette:"basketball",mood:"Energetic",colors:["red","blue"]},
   {id:"football",label:"Football / Soccer"},{id:"extremesports",label:"Extreme Sports"},
   {id:"skateboarding",label:"Skateboarding"},{id:"gymfitness",label:"Gym & Fitness Motivation"}
 ]},
 {name:"Aesthetic Subcultures", cats:[
   {id:"y2k",label:"Y2K",palette:"y2k",mood:"Playful",colors:["pink","teal"]},
   {id:"cottagecore",label:"Cottagecore",palette:"cottagecore",mood:"Calm",colors:["green","gold"]},
   {id:"grunge",label:"Grunge"},{id:"kawaii",label:"Kawaii"},{id:"boho",label:"Boho"},{id:"indie",label:"Indie"}
 ]},
 {name:"Fantasy & Surreal", cats:[
   {id:"dragons",label:"Dragons",palette:"dragons",mood:"Epic",colors:["red","black"]},
   {id:"magicwizards",label:"Magic & Wizards"},{id:"surrealism",label:"Surrealism"},
   {id:"dreamscapes",label:"Dreamscapes"},{id:"fairytale",label:"Fairy Tale"}
 ]}
];

// flat lookup
const CAT_LOOKUP = {};
CATEGORY_GROUPS.forEach(g=>g.cats.forEach(c=>CAT_LOOKUP[c.id]={...c,group:g.name}));

/* ===================== BUILD WALLPAPERS ===================== */
let WID = 1;
const WALLPAPERS = [];
function seededRand(seed){ let x = Math.sin(seed)*10000; return x - Math.floor(x); }
Object.keys(PALETTES).forEach((catId, ci)=>{
  const cat = CAT_LOOKUP[catId]; if(!cat) return;
  const pal = PALETTES[catId];
  const variantMoods = [cat.mood, MOODS[(ci*3)%MOODS.length], MOODS[(ci*3+5)%MOODS.length]];
  for(let v=0; v<3; v++){
    const id = WID++;
    const angle = Math.round(seededRand(id*7.1)*360);
    const type = ["linear","radial","conic"][v%3];
    let bg;
    if(type==="linear") bg = `linear-gradient(${angle}deg, ${pal[0]}, ${pal[1]} 35%, ${pal[2]} 70%, ${pal[3]})`;
    else if(type==="radial") bg = `radial-gradient(circle at ${30+v*20}% ${30+v*15}%, ${pal[3]}, ${pal[2]} 40%, ${pal[1]} 70%, ${pal[0]})`;
    else bg = `conic-gradient(from ${angle}deg at 50% 50%, ${pal[0]}, ${pal[1]}, ${pal[2]}, ${pal[3]}, ${pal[0]})`;
    const dim = DIMENSIONS[(id+v)%DIMENSIONS.length];
    WALLPAPERS.push({
      id, slug:`${catId}-${v}`, name:`${cat.label} ${["I","II","III"][v]}`, catId, catLabel:cat.label, group:cat.group,
      mood: variantMoods[v], colors: cat.colors||["gray"], stops: pal, gradType: type, gradAngle: angle,
      nativeDim: dim.id, bg, photo:false,
      views: 0, downloads: 0
    });
  }
});

// Real AI-generated wallpapers, published via scripts/generate-wallpapers.mjs,
// layer on top of the gradient placeholders once the `wallpapers` table has
// rows in it. Niches without real wallpapers yet keep showing their gradient
// placeholder — nothing breaks either way.
async function mergeRealPhotos(){
  if(!window.sb) return false; // Supabase not configured yet — see js/config.js
  try{
    const { data, error } = await window.sb
      .from('wallpapers')
      .select('*')
      .eq('status', 'published');
    if(error || !data || !data.length) return false;
    data.forEach(p=>{
      const id = WID++;
      WALLPAPERS.push({
        id, slug: p.slug, name:p.title, catId:p.category_id, catLabel:p.category_label, group:p.category_group,
        mood:p.mood, colors:p.colors, nativeDim:p.aspect_ratio,
        bg:`url('${p.image_url}')`, photoUrl:p.image_url, photo:true,
        views: 0, downloads: 0
      });
      if(CAT_LOOKUP[p.category_id]) CAT_LOOKUP[p.category_id].hasRealPhotos = true;
    });
    return true;
  }catch(e){
    console.warn("Could not load real wallpapers from the database — showing gradient placeholders.", e);
    return false;
  }
}

// Pulls real counts from Supabase and merges them onto the matching wallpapers
// by slug. Wallpapers nobody has interacted with yet simply stay at 0 — that's
// the honest number, not a filled-in guess.
async function loadRealStats(){
  if(!window.sb) return false;
  try{
    const { data, error } = await window.sb.from('wallpaper_stats').select('*');
    if(error || !data) return false;
    const bySlug = {}; data.forEach(row=>{ bySlug[row.wallpaper_id] = row; });
    WALLPAPERS.forEach(w=>{
      const row = bySlug[w.slug];
      if(row){ w.views = row.views || 0; w.downloads = row.downloads || 0; }
    });
    return true;
  }catch(e){
    console.warn("Could not load live stats from the database — showing 0 until Supabase is configured.", e);
    return false;
  }
}
function hotScore(w){ return (w.views||0) + (w.downloads||0)*4; }

/* ===================== HAIRSTYLES (separate content type) ===================== */
// Deliberately not part of WALLPAPERS/CATEGORY_GROUPS — hairstyles filter on
// length/texture/color, not mood/color-of-image, so they get their own small
// taxonomy instead of being force-fit into the wallpaper system.
const HAIRSTYLE_LENGTHS = ["short","medium","long"];
const HAIRSTYLE_TEXTURES = ["straight","wavy","curly","coily"];
const HAIRSTYLE_COLORS = ["blonde","brunette","black","red","balayage","fantasy","gray"];
const HAIRSTYLE_FOR = [{id:"",label:"Any"},{id:"women",label:"Women's"},{id:"men",label:"Men's"},{id:"unisex",label:"Unisex"}];

let HAIRSTYLES = [];

async function loadHairstyles(){
  if(!window.sb) return false;
  try{
    const { data, error } = await window.sb.from('hairstyles').select('*').eq('status','published');
    if(error || !data) return false;
    HAIRSTYLES = data.map(h => ({
      id: h.id, slug: h.slug, title: h.title,
      styleId: h.style_id, styleLabel: h.style_label,
      length: h.length, texture: h.texture, hairColor: h.hair_color, forWhom: h.for_whom,
      imageUrl: h.image_url, views: h.views||0, downloads: h.downloads||0
    }));
    return true;
  }catch(e){
    console.warn("Could not load hairstyles from the database.", e);
    return false;
  }
}

/* ===================== STATE ===================== */
const state = {
  filters:{ moods:new Set(), colors:new Set(), dim:"", cat:"" },
  currentWallpaper: null,
  currentDeviceTab: "phone",
  currentDim: DIMENSIONS[0].id,
  ppShape: "circle",
  roomIndex: 0,
  roomList: WALLPAPERS.filter(w=>true),
  deviceSelected: null,
  deviceSelectedWallpaper: WALLPAPERS[0],
  puzzleWallpaper: WALLPAPERS[0],
  puzzleOrder: [],
  puzzleMoves: 0,
  feedback: {}
};

const DEVICES = [
  {id:"iphone15",label:"iPhone 15 Pro",kind:"phone",ratio:"9/19.5"},
  {id:"iphoneSE",label:"iPhone SE",kind:"phone",ratio:"9/16"},
  {id:"galaxyS24",label:"Galaxy S24",kind:"phone",ratio:"9/19.3"},
  {id:"pixel",label:"Pixel 9",kind:"phone",ratio:"9/19.5"},
  {id:"ipadPro",label:"iPad Pro 12.9",kind:"tablet",ratio:"3/4"},
  {id:"ipadMini",label:"iPad Mini",kind:"tablet",ratio:"3/4.3"},
  {id:"mbp16",label:"MacBook Pro 16",kind:"laptop",ratio:"16/10"},
  {id:"mba",label:"MacBook Air",kind:"laptop",ratio:"16/10"},
  {id:"monitor27",label:'Desktop Monitor 27"',kind:"desktop",ratio:"16/9"},
  {id:"ultrawide34",label:'Ultrawide 34"',kind:"desktop",ratio:"21/9"},
];


// Static fallback data for Landing page — used when API is unavailable.

export type LandingProduct = {
  name: string
  nanoparticles: string
  type: string
  description: string
}

export type LandingArea = {
  name: string
  specialty: string
  description: string
}

export type LandingCaseStudy = {
  specialty: string
  title: string
  description: string
  coverImage: string
  metrics: { label: string; value: string }[]
}

export type LandingPipelineItem = {
  product: string
  platform: string
  stage: string
}

export const STATIC_AMNIOTIC_PRODUCTS: LandingProduct[] = [
  {
    name: "ExoTher 1",
    nanoparticles: "1 Billion Nanoparticles",
    type: "MSC Amniotic Derived",
    description: "Optimal concentration for dermatology, aesthetic medicine, and hair restoration.",
  },
  {
    name: "ExoPro",
    nanoparticles: "300 Billion Nanoparticles",
    type: "MSC Amniotic Derived",
    description: "Professional-grade high-concentration formulation for advanced clinical cases.",
  },
  {
    name: "ExoMatrix",
    nanoparticles: "1.5 Trillion Nanoparticles",
    type: "MSC Amniotic Derived — Special Order",
    description: "Ultra-high concentration formulation. Available as special order under full medical supervision.",
  },
]

export const STATIC_PLACENTAL_PRODUCTS: LandingProduct[] = [
  {
    name: "ExoLite",
    nanoparticles: "750 Billion Nanoparticles",
    type: "Placental Cord MSC",
    description: "Standard Placental Cord formulation for aesthetic and dermatology applications.",
  },
  {
    name: "ExoGen",
    nanoparticles: "1.5 Trillion Nanoparticles",
    type: "Placental Cord MSC — Special Order",
    description: "Ultra-high concentration Placental Cord formulation. Available as special order under full medical supervision.",
  },
]

export const STATIC_AREAS: LandingArea[] = [
  { name: "Facial Rejuvenation",    specialty: "Aesthetic Medicine",                description: "Exosome-mediated signaling for skin renewal, collagen stimulation, and aesthetic restoration." },
  { name: "Psoriasis Treatment",    specialty: "Dermatology · Immunology",          description: "Immunomodulatory properties applied to autoimmune skin conditions, reducing inflammatory cascades." },
  { name: "Hair Growth Boost",      specialty: "Trichology",                        description: "Reactivating dormant follicles and stimulating natural hair regrowth and density restoration." },
  { name: "Facial Tics",            specialty: "Neurology",                         description: "Exploring neurophysiology pathways for motor control and involuntary movement reduction." },
  { name: "Osteoarthritis",         specialty: "Orthopedics · Degenerative Medicine", description: "Cartilage repair, joint inflammation reduction, and musculoskeletal healing." },
  { name: "Bone Regeneration",      specialty: "Orthopedics · Oncology",            description: "High-concentration platforms for accelerating bone healing and skeletal tissue engineering." },
  { name: "Hemorrhagic Stroke",     specialty: "Neurology · Neurorehabilitation",   description: "Neuroprotective protocols supporting motor recovery post-stroke." },
  { name: "Cerebral Palsy",         specialty: "Pediatric Neurology",               description: "Pediatric neurological applications exploring motor and neurodevelopmental support." },
]

export const STATIC_CASE_STUDIES: LandingCaseStudy[] = [
  {
    specialty: "Neurology",
    title: "Facial Tics & Involuntary Movement",
    description: "Patient with facial tics (involuntary movement) and pain.",
    coverImage: "https://picsum.photos/seed/exomed-neuro/480/560",
    metrics: [
      { label: "Initial response — immediate tic reduction", value: "20 seconds" },
      { label: "3rd visit — sustained resolution, no pain reported", value: "3 weeks" },
    ],
  },
  {
    specialty: "Dermatology",
    title: "Severe Psoriasis — Full Body Coverage",
    description: "37-year-old patient · >95% BSA affected · Treatment: ExoTher 1 Billion Nanoparticles.",
    coverImage: "https://picsum.photos/seed/exomed-skin/480/560",
    metrics: [
      { label: "Body surface area affected pre-treatment", value: ">95% BSA" },
      { label: "Near-complete skin clearance post ExoTher", value: "2 Weeks" },
    ],
  },
  {
    specialty: "Neurology · Neurorehabilitation",
    title: "Hemorrhagic Stroke Recovery",
    description: "Wheelchair-bound patient with lower limb paralysis — 2-month exosome treatment protocol.",
    coverImage: "https://picsum.photos/seed/exomed-stroke/480/560",
    metrics: [
      { label: "Treatment duration to ambulation", value: "2 Months" },
      { label: "Patient walking with cane support post-treatment", value: "Ambulatory" },
    ],
  },
  {
    specialty: "Orthopedics",
    title: "Knee Osteoarthritis (OA)",
    description: "Radiographic joint space increase at 1 month · VRS pain scale near-zero at 6 months.",
    coverImage: "https://picsum.photos/seed/exomed-ortho/480/560",
    metrics: [
      { label: "Visible joint space increase on X-ray", value: "1 Month" },
      { label: "Pain-free at rest & activity — sustained to 6 months", value: "VRS Score 0" },
    ],
  },
  {
    specialty: "Pediatric Neurology",
    title: "Cerebral Palsy — Pediatric Case",
    description: "Patient Syamil — Improvement in sitting endurance and core strength from Day 3.",
    coverImage: "https://picsum.photos/seed/exomed-pediatric/480/560",
    metrics: [
      { label: "Day 3", value: "Sitting endurance improved — from 5 min to sustained periods without fatigue" },
      { label: "Motor", value: "Visible core muscle activation improvement; physical therapy ongoing alongside treatment" },
      { label: "Neurological", value: "No severe headache episodes reported through observation period" },
      { label: "Adverse Events", value: "Mild transient facial rash noted — self-resolving, non-distressing" },
    ],
  },
]

export const STATIC_PIPELINE: LandingPipelineItem[] = [
  { product: "ExoMatrix", platform: "Neurological Platform",  stage: "pre-clinical"   },
  { product: "ExoTher 3", platform: "Orthopedic Platform",    stage: "research"        },
  { product: "ExoGen",    platform: "Dermatology Platform",   stage: "special-order"   },
  { product: "ExoPro",    platform: "Aesthetic Platform",     stage: "early-research"  },
]

export const STAGE_STYLE: Record<string, string> = {
  "pre-clinical":  "text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
  research:        "text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  "special-order": "text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  "early-research":"text-slate-500 dark:text-slate-400 bg-black/[0.04] dark:bg-slate-500/10 border-black/[0.08] dark:border-slate-500/20",
}

export const STAGE_LABELS: Record<string, string> = {
  "pre-clinical":  "Pre-Clinical",
  research:        "Research",
  "special-order": "Special Order",
  "early-research":"Early Research",
}

export const WA_NUMBER = "6281234567890"
export const WA_DEFAULT = "Halo Exomed, saya ingin berkonsultasi mengenai produk exosome untuk klinik saya."

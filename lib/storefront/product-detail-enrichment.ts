/** Galeri & spesifikasi lengkap detail produk — selaras mock IndustrialX */

const RETORT_GALLERY = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDmufaosQsP0kDLEZNRrL7DphMdw2vYP078GQsQK-mNmLRoDE9MK_8u7S5uqgGjBIaO9jTewuW1j1xaxvjkJbBh0FKMNTTUAukqRIAEIXBWrF2VKorYl5MjA_-IRFCDEUodZjG57BHYMmNnsX9tGbKSjVjh4mux0O0Njz3oFRsFSp3tTCqyMRhGV1Uu4shLwsYj3oU_jF-qcdJOUHyZrSePGDULafvBiC3lc9VgMmMtooQs4N4ZHQJrNQKkB-JcLrgLr-MWbzF1g2cB",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBPTL75Kk7OPWILwRRafFV6eDx7tYlnbodu0azMhLjY_zYfGH27HKPT80SoFbgGtNPdWfYBuNzvCrvF3RQkixyQBdzXvBKd9OY8kY3_oqhEgw1-vBRHWicQIxiteDga6LCzhzuPw5MXa03gbn9ITO0DpKqOmGFOOp_ZOhPxE3oZq3-tTGRx3EZW04W5z_b9FoZD5JnlRP0-0TmiOy56lC0Y44bkoOlhiGFCdaCy35KDACIaneSmDzxbDCxCJRBAP-l5MEOOBUfbQuOr",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAdSdRgMNZUR_k7EhRP-oZsfRqw3bmITi7dfdxgN_cVWWobpEiNd5AHydIhkICMFJMZlZtF8N54TlVDLA0pvY-220jYUyI-V1acASq_wc-rQ1y6C6iTEUm6qiQPhdLxUNEVCxLTCZtNf90lXTrm8uQlj-tQbQvpLkARZiWMqpF4_jStST0ekEKyJyAqaJVV33VaFkQtPpWoSgKAbGS1S3e5ylrwCSUo2a71lY18CiCGi5PLbRt9FIih3Y6Ef-_0tY3mOGgwenHNJ01V",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBkuB1bINP3P2hDToGXJPKgRGy-kXrZYEn6pE0pVzbfIFT-QcIJH8hO7Df-ab59vIBNerGsehatM-Ub334g2zggJVRw6tjNmHmCd3p03IJjfnETGSpVDUV_hqd0KMZPBGAUDl5Odr6_UOvWJEhQOlyU2ymoA6fe5J8ELQ90Kbd9XzVKqWdg2wvx_9yizhnBmxCLoTURFjZkJqM_jzurViRE7B_3UvUm58UibO8yYRX6h480CCB02tOWk5efK0mVuwJgJEa8-8hYIgwF",
];

const BENEFIT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAL7gusB9X50NsO1Qyj7xDEP3QczUR9T8qPWfO7gPS9xrqyyi5d5mASy6UG-CgbuOMDPSSxikHYVYL2cwkgeh5uIIYfG7UR-kyMLzliLve-aPa5kfCggUOK3ebSHYEbk1pPAY76-NDOgc9uK3tLqOQ5onZmLbGnaiuYqGZ8w4xS1gOcX89vICShQnbVUexbU97o_G5vsIw8JjVu4RDZdot1xOyeG07bdISjrm216vRxa8Mkxu7a6K8CVHSGiD6AsKYijjalYLpPAMif";

export type ProductDetailEnrichment = {
  gallery: string[];
  videoThumbIndex?: number;
  specs: { label: string; value: string }[];
  features: string[];
  downloads: { title: string; subtitle: string; icon: "picture_as_pdf" | "description" }[];
  benefitTitle: string;
  benefitBody: string;
  benefitImage: string;
  statA: { value: string; label: string };
  statB: { value: string; label: string };
  breadcrumbLeaf: string;
};

function galleryFromPrimary(primary: string, extras: string[] = []) {
  const unique = [primary, ...extras].filter(Boolean);
  while (unique.length < 4) unique.push(primary);
  return unique.slice(0, 4);
}

const BY_SKU: Record<string, ProductDetailEnrichment> = {
  "FDP-RTR-500": {
    gallery: galleryFromPrimary(
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATo9OiVElbXKff7x40hmph9vONdRV6AGfrMN3Mb3Ju3Cq3DvETTRvmYOzLpOhmLfEG9C_sqxjZH4dnVNbcnnxVOhN-guDUElL0HS6ycfeeRcRKGt0umRNiSf-712ViaLkwTS8L2tRjpWM1RCzEKCRrYkfrj3ea6aJjip3m9dNJ0yTkvDYdL4huGO-2JpuToXHUrWcF2qRHjs0mXBCU_C1YT4ZWLqQwQEj9wLEgMjGBXXRSubKUovCaZySiAHB3ilPNCpbAHE5QW2vz",
      RETORT_GALLERY
    ),
    videoThumbIndex: 1,
    features: [
      "Double-tank water immersion retort for energy efficiency.",
      "Automated PLC control for precise temperature ramping.",
      "High-efficiency heat distribution for canned & pouched food.",
      "Safety interlock system for high-pressure operations.",
    ],
    specs: [
      { label: "Model", value: "RTR-500 Food Grade" },
      { label: "Capacity", value: "500 Liters / Batch" },
      { label: "Max Temperature", value: "147°C" },
      { label: "Max Pressure", value: "0.35 MPa" },
      { label: "Material", value: "SUS304 Stainless Steel (Anti-Corrosion)" },
      { label: "Control System", value: "Siemens PLC Touch Screen Interface" },
      { label: "Dimensions", value: "2,200 x 1,400 x 1,800 mm" },
      { label: "Warranty", value: "2 Years Parts & Service" },
    ],
    downloads: [
      { title: "Retort-Sterilizer-Brochure.pdf", subtitle: "Download Brochure", icon: "picture_as_pdf" },
      { title: "Retort-Operating-Manual.pdf", subtitle: "Technical Manual", icon: "description" },
    ],
    benefitTitle: "Why Choose the MesinBagus Retort?",
    benefitBody:
      "Our retort system is engineered to meet the strict standards of Indonesia's food-processing industry. Water-immersion technology distributes heat more evenly than conventional steam systems, sterilizing products through to the center without compromising food texture.",
    benefitImage: BENEFIT_IMAGE,
    statA: { value: "99.9%", label: "Sterilization Efficiency" },
    statB: { value: "30%", label: "Energy Savings" },
    breadcrumbLeaf: "Sterilizers",
  },
  "IMS-STEAM-200": {
    gallery: galleryFromPrimary(
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQPmVVxQ_LrTuB2zoeD13D3VZ8EoGs5AGfimiuWfsLzQ0q0nTLVEN60ncAPL-pIfIzm6jqVoh71NRucvlY31zblNZlpJr_fcIOuvePPP6qhYj_BFR_1idG-vJZy8aMEJXw_SZyRr1bC6sZYU0S97hZjycFCQ4j6jQ70pBYD5i1tS-tamsBe_mKS6z3kk1THW0PJtJsys3M0mvViQxtUOK5NLcJ0qzunCFuq1t2052Ms-Xqpn9h4mc5g_Km_iIkNT5RK_x-wsPVm2Ae"
    ),
    features: [
      "Uniform jacket heating for stable batch processing.",
      "Automatic pressure and temperature interlocks.",
      "Batch data logging for HACCP audits.",
      "Medium-scale autoclave for UHT and pouch products.",
    ],
    specs: [
      { label: "Model", value: "STEAM-200 Batch" },
      { label: "Capacity", value: "200 Liter / Batch" },
      { label: "Max Temperature", value: "134°C" },
      { label: "Working Pressure", value: "0.35 MPa" },
      { label: "Material", value: "SUS316L Contact Parts" },
      { label: "Control System", value: "HMI Touch Panel + PLC" },
      { label: "Power Supply", value: "380V 3 Phase" },
      { label: "Warranty", value: "1 Year On-Site" },
    ],
    downloads: [
      { title: "Steam-Sterilizer-Brochure.pdf", subtitle: "Download Brochure", icon: "picture_as_pdf" },
      { title: "STEAM200-Operating-Manual.pdf", subtitle: "Technical Manual", icon: "description" },
    ],
    benefitTitle: "Why Choose This Batch Sterilizer?",
    benefitBody:
      "Ideal for small and medium-sized factories that need flexible batch processing without investing in a full-scale retort. The jacket-heating system maintains precise temperature ramping for cans, pouches, and bottles.",
    benefitImage: BENEFIT_IMAGE,
    statA: { value: "200L", label: "Batch Capacity" },
    statB: { value: "±21 days", label: "Indent Lead Time" },
    breadcrumbLeaf: "Sterilizers",
  },
  "IMS-CAN-80": {
    gallery: galleryFromPrimary(
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCtTKLH6D5sgnWoHc5DaIFwdx-E0KHMwu_MYMUf8nMkIKlE38ozC3w_z-3zFg4gPZWmFOi25TF6eLiyXrMnZjqH1so1lQfbtIrs-CrlJ7tQDDlAoZmAaf7Dh-4h2Q3vd0GJdvpsnDa4UWkhoaVgVv6pwGQSpWamaMq-Twn_8dlYqRmqvdk5DXM3SLL6RhbZcWS4vOJZY2Kr7smo2-AhNQO-qy7JrmwesrC12k_fi9TYx8b3tZI5MAQ3Xf6jWX9-hM54LGbBZQnq-mtA"
    ),
    features: [
      "Precision roll seaming for 52–99 mm can diameters.",
      "Quick-change tooling for different can sizes.",
      "Touchscreen HMI panel for operators.",
      "Ready stock available for showroom demonstrations.",
    ],
    specs: [
      { label: "Model", value: "CAN-80 Semi-Auto" },
      { label: "Speed", value: "40–80 cans/min" },
      { label: "Can Diameter", value: "52–99 mm" },
      { label: "Seam Type", value: "Double seam roll" },
      { label: "Material Frame", value: "Carbon Steel + SS304" },
      { label: "Control", value: "Touch HMI" },
      { label: "Air Pressure", value: "0.6–0.8 MPa" },
      { label: "Warranty", value: "12 Months" },
    ],
    downloads: [
      { title: "Can-Seamer-80-Brochure.pdf", subtitle: "Download Brochure", icon: "picture_as_pdf" },
      { title: "SOP-Seaming-CAN80.pdf", subtitle: "Technical Manual", icon: "description" },
    ],
    benefitTitle: "Why Choose This Semi-Automatic Seamer?",
    benefitBody:
      "This can seamer balances investment and throughput, making it ideal for food and beverage lines scaling from manual to semi-automatic production with flexible tooling.",
    benefitImage: BENEFIT_IMAGE,
    statA: { value: "80/min", label: "Max Throughput" },
    statB: { value: "Ready", label: "Stock Status" },
    breadcrumbLeaf: "Can Seamer",
  },
  "IMS-CAN-LINE": {
    gallery: galleryFromPrimary(
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQPmVVxQ_LrTuB2zoeD13D3VZ8EoGs5AGfimiuWfsLzQ0q0nTLVEN60ncAPL-pIfIzm6jqVoh71NRucvlY31zblNZlpJr_fcIOuvePPP6qhYj_BFR_1idG-vJZy8aMEJXw_SZyRr1bC6sZYU0S97hZjycFCQ4j6jQ70pBYD5i1tS-tamsBe_mKS6z3kk1THW0PJtJsys3M0mvViQxtUOK5NLcJ0qzunCFuq1t2052Ms-Xqpn9h4mc5g_Km_iIkNT5RK_x-wsPVm2Ae"
    ),
    features: [
      "High-precision six-head rotary seaming.",
      "Ready for conveyor-line integration.",
      "OEE monitoring and downtime tracking.",
      "Factory-scale production capacity.",
    ],
    specs: [
      { label: "Model", value: "CAN-LINE Rotary" },
      { label: "Capacity", value: "300–600 cans/min" },
      { label: "Heads", value: "6 Seaming Stations" },
      { label: "Power", value: "380V 3 Phase" },
      { label: "Integration", value: "Conveyor + Reject System" },
      { label: "Control", value: "Siemens PLC" },
      { label: "Footprint", value: "Custom layout" },
      { label: "Lead Time", value: "±45 days indent" },
    ],
    downloads: [
      { title: "Rotary-Can-Line-Brochure.pdf", subtitle: "Download Brochure", icon: "picture_as_pdf" },
      { title: "Layout-Integration-Guide.pdf", subtitle: "Technical Manual", icon: "description" },
    ],
    benefitTitle: "Rotary Line for High-Volume Production",
    benefitBody:
      "Designed for high-volume canning plants, with conveyor integration and OEE monitoring that help engineering teams maintain line uptime.",
    benefitImage: BENEFIT_IMAGE,
    statA: { value: "600/min", label: "Peak Capacity" },
    statB: { value: "6 Head", label: "Seaming" },
    breadcrumbLeaf: "Can Line",
  },
  "IMS-SEAL-450": {
    gallery: galleryFromPrimary(
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDN84ss-jG4xuT24rpQLoMxdlNuHtYa9jxj2oql5Jhgn2EOxnO5UenlFKSvYQw2BbsDKfb_auSweKFa5H88FSaWcpj5zh-MkpP2JJVfvmmhYlDzbXD8IrzsjYbzrXFiVxjZkgP3XdJnU8cDdGSso8lLcT-kCzv2XS44ZWGgrAQ8sFnsUxlXhOmpTGyY3Xd2rtnmHYpQqxyq6WBIsuHSZm7nMDRoN_rJHIdRZZX2NI4U5WXD6flzaS-nb26TB76ksGuQh3jGziXKHq80"
    ),
    features: [
      "Stable PID heating for consistent seals.",
      "Adjustable 10–15 mm sealing width.",
      "Production and operating-hour counters.",
      "Continuous band system for pouches and stand-up bags.",
    ],
    specs: [
      { label: "Model", value: "SEAL-450 Industrial" },
      { label: "Seal Width", value: "10–15 mm" },
      { label: "Speed", value: "5–12 m/min" },
      { label: "Bag Width", value: "Up to 450 mm" },
      { label: "Heater", value: "PID Constant Temp" },
      { label: "Voltage", value: "220V / 380V" },
      { label: "Weight", value: "≈ 85 kg" },
      { label: "Warranty", value: "12 Months" },
    ],
    downloads: [
      { title: "Band-Sealer-Brochure.pdf", subtitle: "Download Brochure", icon: "picture_as_pdf" },
      { title: "Maintenance-SEAL450.pdf", subtitle: "Technical Manual", icon: "description" },
    ],
    benefitTitle: "Reliable Continuous Package Sealing",
    benefitBody:
      "A competitively priced continuous band sealer for medium-scale snack, beverage-pouch, and stand-up-bag production.",
    benefitImage: BENEFIT_IMAGE,
    statA: { value: "12 m/min", label: "Max Speed" },
    statB: { value: "Ready", label: "Stock" },
    breadcrumbLeaf: "Band Sealer",
  },
  "IMS-PROD-1000": {
    gallery: galleryFromPrimary(
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrxWJ6RNAaT_9R8pNdOeuWQjjfedjtlMWw-XKYmkUp1QACERTYrYdO8bHN3Qag6Kg-6lifiSzMpL24w4Iv5lXWbubKlRKu5VqCi7IpMznmVHJO8z-NA-vK9COPOWb3SD7A0iNc40CN_XPXgXdRflHq8Oyz_pxOj2SuD2N6Z2tgaoYoL-GQPccH1MCL8jTLz9PyO5ZpIe0hWojBfZDLHm3OKh5_81fFsuMMZbUSeL_Mlq6hy8MNryucEeG63keUzE3kVPFL-gxmgv6n"
    ),
    features: [
      "CIP-ready SS316L stainless-steel pipeline.",
      "Precision servo volumetric filling.",
      "Optional MES integration.",
      "Integrated mixing, filling, and sealing line.",
    ],
    specs: [
      { label: "Model", value: "PROD-1000 Line" },
      { label: "Filling Rate", value: "1,000–3,000 L/hour" },
      { label: "Contact Material", value: "SS316L" },
      { label: "Mixing", value: "Jacketed tank + agitator" },
      { label: "Filling", value: "Servo volumetric" },
      { label: "Control", value: "PLC + SCADA ready" },
      { label: "Utilities", value: "Steam / CIP / Compressed Air" },
      { label: "Warranty", value: "2 Years" },
    ],
    downloads: [
      { title: "Production-Line-Brochure.pdf", subtitle: "Download Brochure", icon: "picture_as_pdf" },
      { title: "P&ID-Sample-PROD1000.pdf", subtitle: "Technical Manual", icon: "description" },
    ],
    benefitTitle: "Industrial-Scale Production Line",
    benefitBody:
      "One integrated line from mixing through filling reduces handoffs between machines and accelerates commissioning for new factories.",
    benefitImage: BENEFIT_IMAGE,
    statA: { value: "3,000 L/hour", label: "Peak Fill" },
    statB: { value: "CIP", label: "Ready" },
    breadcrumbLeaf: "Production Line",
  },
  "IMS-CONV-600": {
    gallery: galleryFromPrimary(
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBU7vgEjQaXmeGIHpMtBU_oHD9kIdG8kQjcfXg2FTkzAAB6SrfhpIaGAIgBhkVrG2L7EO71ut3Y8uuVUnm6OREbx7RqW2Zl0WBHmmnJviX3H4Zn8CEFNJ-NLlsGIYVa08er8M7w01_09UbfTYhdNIe06_T9ON-a0G_mBOljB8CJqDxMrsiQXXHFKdycZ2qsmh1CK7hz4CL1zfyrmmBSAtb4DHIw0IvwSy2b92i6iU0w9rWAy2FG7YzODT3xN5iV5SyRus7l5-U_RQ0l"
    ),
    features: [
      "Food-grade SS304 modular belt.",
      "Variable-speed drive (VFD).",
      "Jam detection sensor and safety interlock.",
      "Modular lengths from 6 to 24 meters.",
    ],
    specs: [
      { label: "Model", value: "CONV-600 Modular" },
      { label: "Length", value: "6–24 meter" },
      { label: "Capacity", value: "500–2,000 kg/hour" },
      { label: "Belt", value: "PVC / PU Food Grade" },
      { label: "Drive", value: "SEW / Nord VFD" },
      { label: "Frame", value: "SS304 / Powder Coated" },
      { label: "Voltage", value: "220V / 380V" },
      { label: "Warranty", value: "12 Months" },
    ],
    downloads: [
      { title: "Conveyor-System-Brochure.pdf", subtitle: "Download Brochure", icon: "picture_as_pdf" },
      { title: "Installation-CONV600.pdf", subtitle: "Technical Manual", icon: "description" },
    ],
    benefitTitle: "Optimize Material Flow Across the Production Line",
    benefitBody:
      "The modular conveyor simplifies integration between processing machines, while the VFD and safety sensors maintain stable operation in food and beverage production environments.",
    benefitImage: BENEFIT_IMAGE,
    statA: { value: "24m", label: "Max Length" },
    statB: { value: "VFD", label: "Speed Control" },
    breadcrumbLeaf: "Conveyor",
  },
};

const STANDARD_BENEFIT_STATS = {
  statA: { value: "99.9%", label: "Sterilization Efficiency" },
  statB: { value: "30%", label: "Energy Savings" },
} as const;

export function getProductDetailEnrichment(sku: string): ProductDetailEnrichment | undefined {
  const base = BY_SKU[sku];
  if (!base) return undefined;
  return { ...base, ...STANDARD_BENEFIT_STATS };
}

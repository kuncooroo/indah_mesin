export type ProductStatus = "ready" | "indent" | "contact";

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: string;
  categoryLabel: string;
  image: string;
  gallery?: string[];
  priceLabel: string;
  priceNote?: string;
  status: ProductStatus;
  statusLabel?: string;
  features?: string[];
  specs?: { label: string; value: string }[];
}

export const products: Product[] = [
  {
    id: "vmc-850",
    sku: "CNC850",
    name: "Vertical Machining Center VMC-850",
    subtitle:
      "High precision machining with automatic tool changer (ATC) and high-speed spindle system.",
    category: "cnc",
    categoryLabel: "Mesin CNC",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsjR1YVrUEM71BWz2hhLaid3gfD0In36YfKTAxOEerk1INgZ6_hzx6QOUCvhyaHEdV61Mis1Fuje37Dy2c6-i3MSUU_29i0NCEvSXjdHzU8h_LQ6psB2AqYTGwzH2ePpSeW6hajYurLAYkHljNhn9uIlO19pAyH5oc-5XLS08OGvZNIcyNmPvBZhoW4KfAkF-Mcojc2NHrmwiHAorhUdt7Y8Zor4hGftqNBH1FRKFYwGo7VknQpnbPZDuebKLQ6jZKs6OVYenfUieX",
    priceLabel: "Rp 450.000.000+",
    status: "ready",
    statusLabel: "Ready Stock",
  },
  {
    id: "alf-5000",
    sku: "PK-ALF5K",
    name: "Automatic Liquid Filler ALF-5000",
    subtitle:
      "Automated filling system for high-viscosity liquids with precise volumetric control.",
    category: "packaging",
    categoryLabel: "Packaging",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQPmVVxQ_LrTuB2zoeD13D3VZ8EoGs5AGfimiuWfsLzQ0q0nTLVEN60ncAPL-pIfIzm6jqVoh71NRucvlY31zblNZlpJr_fcIOuvePPP6qhYj_BFR_1idG-vJZy8aMEJXw_SZyRr1bC6sZYU0S97hZjycFCQ4j6jQ70pBYD5i1tS-tamsBe_mKS6z3kk1THW0PJtJsys3M0mvViQxtUOK5NLcJ0qzunCFuq1t2052Ms-Xqpn9h4mc5g_Km_iIkNT5RK_x-wsPVm2Ae",
    priceLabel: "Rp 125.000.000+",
    status: "indent",
    statusLabel: "Indent 4 Minggu",
  },
  {
    id: "genset-500",
    sku: "PW-G500S",
    name: "Industrial Genset 500kVA Silent",
    subtitle:
      "Reliable power backup for large facilities with advanced noise reduction and fuel efficiency.",
    category: "power",
    categoryLabel: "Power Generators",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrxWJ6RNAaT_9R8pNdOeuWQjjfedjtlMWw-XKYmkUp1QACERTYrYdO8bHN3Qag6Kg-6lifiSzMpL24w4Iv5lXWbubKlRKu5VqCi7IpMznmVHJO8z-NA-vK9COPOWb3SD7A0iNc40CN_XPXgXdRflHq8Oyz_pxOj2SuD2N6Z2tgaoYoL-GQPccH1MCL8jTLz9PyO5ZpIe0hWojBfZDLHm3OKh5_81fFsuMMZbUSeL_Mlq6hy8MNryucEeG63keUzE3kVPFL-gxmgv6n",
    priceLabel: "Rp 820.000.000+",
    status: "ready",
    statusLabel: "Ready Stock",
  },
  {
    id: "retort-sterilizer",
    sku: "FDP-RTR-500",
    name: "Industrial Retort Sterilizer - High Pressure Steam",
    subtitle:
      "Double-tank water immersion retort for energy efficient food grade sterilization.",
    category: "food",
    categoryLabel: "Food Processing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATo9OiVElbXKff7x40hmph9vONdRV6AGfrMN3Mb3Ju3Cq3DvETTRvmYOzLpOhmLfEG9C_sqxjZH4dnVNbcnnxVOhN-guDUElL0HS6ycfeeRcRKGt0umRNiSf-712ViaLkwTS8L2tRjpWM1RCzEKCRrYkfrj3ea6aJjip3m9dNJ0yTkvDYdL4huGO-2JpuToXHUrWcF2qRHjs0mXBCU_C1YT4ZWLqQwQEj9wLEgMjGBXXRSubKUovCaZySiAHB3ilPNCpbAHE5QW2vz",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmufaosQsP0kDLEZNRrL7DphMdw2vYP078GQsQK-mNmLRoDE9MK_8u7S5uqgGjBIaO9jTewuW1j1xaxvjkJbBh0FKMNTTUAukqRIAEIXBWrF2VKorYl5MjA_-IRFCDEUodZjG57BHYMmNnsX9tGbKSjVjh4mux0O0Njz3oFRsFSp3tTCqyMRhGV1Uu4shLwsYj3oU_jF-qcdJOUHyZrSePGDULafvBiC3lc9VgMmMtooQs4N4ZHQJrNQKkB-JcLrgLr-MWbzF1g2cB",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPTL75Kk7OPWILwRRafFV6eDx7tYlnbodu0azMhLjY_zYfGH27HKPT80SoFbgGtNPdWfYBuNzvCrvF3RQkixyQBdzXvBKd9OY8kY3_oqhEgw1-vBRHWicQIxiteDga6LCzhzuPw5MXa03gbn9ITO0DpKqOmGFOOp_ZOhPxE3oZq3-tTGRx3EZW04W5z_b9FoZD5JnlRP0-0TmiOy56lC0Y44bkoOlhiGFCdaCy35KDACIaneSmDzxbDCxCJRBAP-l5MEOOBUfbQuOr",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdSdRgMNZUR_k7EhRP-oZsfRqw3bmITi7dfdxgN_cVWWobpEiNd5AHydIhkICMFJMZlZtF8N54TlVDLA0pvY-220jYUyI-V1acASq_wc-rQ1y6C6iTEUm6qiQPhdLxUNEVCxLTCZtNf90lXTrm8uQlj-tQbQvpLkARZiWMqpF4_jStST0ekEKyJyAqaJVV33VaFkQtPpWoSgKAbGS1S3e5ylrwCSUo2a71lY18CiCGi5PLbRt9FIih3Y6Ef-_0tY3mOGgwenHNJ01V",
    ],
    priceLabel: "Mulai dari Rp 285.000.000+",
    priceNote: "*Harga belum termasuk instalasi & pengiriman luar kota.",
    status: "ready",
    statusLabel: "Ready Stock",
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
      { label: "Material", value: "SUS304 Stainless Steel" },
      { label: "Control System", value: "Siemens PLC Touch Screen" },
      { label: "Warranty", value: "2 Years Parts & Service" },
    ],
  },
  {
    id: "vmc-850-x4",
    sku: "VMC-850-X4",
    name: "VMC-850 Vertical Machining Center",
    subtitle: "High-precision vertical machining center",
    category: "cnc",
    categoryLabel: "Mesin CNC",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRYgvnXmsuFYAmnoKFUXXPHeCvMIoxubS0VqjCqKyjvUWYRwfkEKXdY3LAa3nCGRHtgLRPyI_8vHBM3Zde86fNiuKYzVApc2YjltlO7-Gjwrf7gURjbRGenG5kOt4EozRRU9W6-OfADGpqm3bIiaPWKzhztkNsnpP58zNdlrW8wTKKmhZYZdFBLl7KOrdK1ndK8bfzbRR2qg6X8yMMV1DnciHeHXB1fm_ULC0BgomNmAxh5E3H4zTpfaX9D3aqEXoviLw2hiKTi8SM",
    priceLabel: "USD 42,500",
    status: "ready",
    statusLabel: "Ready Stock",
  },
  {
    id: "vertical-retort",
    sku: "IND-RT-1200",
    name: "Vertical Retort Sterilizer",
    subtitle: "Large-scale industrial retort sterilizer vessel",
    category: "food",
    categoryLabel: "Food Processing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIfAdeED2TVIAr2cMdAdP_U4C0US2QlodtdvBv0Du_Ec256dS0Ck7vgiWMDlD19XtLIN0CUpQj1KZ9MmE0wkCOlTO59oNN66WdE9eSfL2DyRNcyNrDN6skWGlznWDUIyqrDBNAsCDZjXf1dBjTvb5melUFcIMdioXvF1K9oe0MvxD87md-X14g74Cl6BBPBtCIbqxRn1FEWqisSeVeMJ4-EAgtdrs7YlSceFN-6c-_t_2XKKYinkjpt9u8LgRQlhO6OiJBBsbyTzXf",
    priceLabel: "USD 18,900",
    status: "indent",
    statusLabel: "Indent (45 Days)",
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

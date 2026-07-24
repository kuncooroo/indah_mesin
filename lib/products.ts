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
  /** Daftar Simpanan — Stitch screen 8ae17002 */
  savedPriceNote?: string;
  savedSecondaryAction?: string;
}

import { stitchSavedSkus } from "@/lib/stitch-screens";

export function skuToProductId(sku: string) {
  return sku.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const products: Product[] = [
  {
    id: skuToProductId("FDP-RTR-500"),
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
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkuB1bINP3P2hDToGXJPKgRGy-kXrZYEn6pE0pVzbfIFT-QcIJH8hO7Df-ab59vIBNerGsehatM-Ub334g2zggJVRw6tjNmHmCd3p03IJjfnETGSpVDUV_hqd0KMZPBGAUDl5Odr6_UOvWJEhQOlyU2ymoA6fe5J8ELQ90Kbd9XzVKqWdg2wvx_9yizhnBmxCLoTURFjZkJqM_jzurViRE7B_3UvUm58UibO8yYRX6h480CCB02tOWk5efK0mVuwJgJEa8-8hYIgwF",
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
      {
        label: "Material",
        value: "SUS304 Stainless Steel (Anti-Corrosion)",
      },
      {
        label: "Control System",
        value: "Siemens PLC Touch Screen Interface",
      },
      { label: "Dimensions", value: "2,200 x 1,400 x 1,800 mm" },
      { label: "Warranty", value: "2 Years Parts & Service" },
    ],
  },
  {
    id: skuToProductId("CNC850"),
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
    id: skuToProductId("PK-ALF5K"),
    sku: "PK-ALF5K",
    name: "Automatic Liquid Filler ALF-5000",
    subtitle:
      "Automated filling system for high-viscosity liquids with precise volumetric control.",
    category: "packaging",
    categoryLabel: "Packaging & Labeling",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQPmVVxQ_LrTuB2zoeD13D3VZ8EoGs5AGfimiuWfsLzQ0q0nTLVEN60ncAPL-pIfIzm6jqVoh71NRucvlY31zblNZlpJr_fcIOuvePPP6qhYj_BFR_1idG-vJZy8aMEJXw_SZyRr1bC6sZYU0S97hZjycFCQ4j6jQ70pBYD5i1tS-tamsBe_mKS6z3kk1THW0PJtJsys3M0mvViQxtUOK5NLcJ0qzunCFuq1t2052Ms-Xqpn9h4mc5g_Km_iIkNT5RK_x-wsPVm2Ae",
    priceLabel: "Rp 125.000.000+",
    status: "indent",
    statusLabel: "Indent 4 Minggu",
  },
  {
    id: skuToProductId("PW-G500S"),
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
    id: skuToProductId("FDP-WGH-14H"),
    sku: "FDP-WGH-14H",
    name: "14-Head Multihead Weigher for Food",
    subtitle: "Precision multihead weigher for food processing lines.",
    category: "food",
    categoryLabel: "Food Processing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDN84ss-jG4xuT24rpQLoMxdlNuHtYa9jxj2oql5Jhgn2EOxnO5UenlFKSvYQw2BbsDKfb_auSweKFa5H88FSaWcpj5zh-MkpP2JJVfvmmhYlDzbXD8IrzsjYbzrXFiVxjZkgP3XdJnU8cDdGSso8lLcT-kCzv2XS44ZWGgrAQ8sFnsUxlXhOmpTGyY3Xd2rtnmHYpQqxyq6WBIsuHSZm7nMDRoN_rJHIdRZZX2NI4U5WXD6flzaS-nb26TB76ksGuQh3jGziXKHq80",
    priceLabel: "Rp 112.000.000+",
    status: "ready",
    statusLabel: "READY STOCK",
  },
  {
    id: skuToProductId("FDP-VAC-400"),
    sku: "FDP-VAC-400",
    name: "Automatic Vacuum Packaging Machine",
    subtitle: "Vacuum packaging system for food-grade production.",
    category: "food",
    categoryLabel: "Food Processing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfL8_-n5A0m1wo-LlFI_BxfXTrZuJgtYmCTsTRvIpVuJcpF464ry-kgqOnBKwPi5Jde3jRBzTGmxgd4mgSuwQdakeON3BbEebk8uvbulyKfQSX3CvnpUwukNy2PxIboVhZX3j9p3vd8k73hY6_-1O9WXp4ijKDbxNwasVH92dArB7-WKwULRszqQeQgFhh8_EzlSjmP3-MZ88gofP03UmcOI6tfNToWjMMjZK4-VRUt05Gp2c6w5mKAfQM7nnYaWtjOICVN8C2naAE",
    priceLabel: "Rp 45.000.000+",
    status: "ready",
    statusLabel: "READY STOCK",
  },
  {
    id: skuToProductId("FDP-DHY-200"),
    sku: "FDP-DHY-200",
    name: "Industrial Food Dehydrator",
    subtitle: "Industrial dehydrator for scalable food drying operations.",
    category: "food",
    categoryLabel: "Food Processing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBP5mM7r582n1iU7P0O4WE4wt3FOqNhst447DubuaGz_GGspb1tNNXG-J73geyqMngZLbGaHtlQuMEOy6OnLV7t4Q33cT8O9YLR_j7VU3zHn-3nuNmuL95WYbUmmVs2q5NQCk1gmXPNxtrC48M8N_l7R-7hHyEOVliRAQSEK1XLRxxYgja9aqwnYePO1kMmEWk3yymoOC95Do4N4xicqg7U4ovx0RxEeOBoTXhl8mI0lj29sA71I8A0dANGeWrWyqJ3ak4LbNhAZzFR",
    priceLabel: "Rp 78.000.000+",
    status: "indent",
    statusLabel: "INDEN",
  },
  {
    id: skuToProductId("FDP-LIQ-1000"),
    sku: "FDP-LIQ-1000",
    name: "Automatic Liquid Filling Machine for Beverages",
    subtitle: "High-throughput liquid filler for beverage production.",
    category: "food",
    categoryLabel: "Food Processing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWf8Ha5SEuSSNicuiRz_PRJN6OsAfjcQyHBq0DZimFsEL9hjX6zJTX1DY1OzteAere0maSqYaz9hGCRBrlbTyYUpzifecki7130Rwj8YSzXo0gCdi7gYaWMWkeSW7HwVY0N27l_04F3QlQoQHaixBtVPvD1SjrGwUISQLQO_ElzyMDB_ECdtsN82Itp7TdZ5WoN3ay_MelAi-Fobf9bMtdtOwSgI8AO7TMLjm5dGTUatG4NUZLsTTBjU_VBmtX7Kof-Xx1Sv9xglwL",
    priceLabel: "Rp 155.000.000+",
    status: "ready",
    statusLabel: "READY STOCK",
  },
  {
    id: skuToProductId("VMC-850-X4"),
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
    savedPriceNote: "Reflects current market rate. Logistics excluded.",
    savedSecondaryAction: "Request Brochure",
  },
  {
    id: skuToProductId("IND-RT-1200"),
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
    savedPriceNote: "Price varies by volume capacity. Request official quote.",
    savedSecondaryAction: "Technical Spec Sheet",
  },
  {
    id: skuToProductId("COMP-RS-25"),
    sku: "COMP-RS-25",
    name: "Rotary Screw Air Compressor",
    subtitle: "Heavy-duty industrial rotary screw air compressor",
    category: "power",
    categoryLabel: "Power Generators",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjkP-qmg4CouiF-qEmhJOw6JA8OZLVXlUekJQ7MggEC89N5VSwDnX9inwYztxML-3ijCo1YV2iuJB77rIjzzpSusuctLVyZ9dAlcLIoLZ7GRt61wF9nvaD2-Vl9Pwxc2itlZeFIPieXP4p9GcjAL7jAZYjh5TC2iZTx4nZ_ATrDZYGseOJ6kh16Bdtzzw4FEVldqTErjfMzL33GEGQGsV5gHe7gsftWDBzpwEmJ7yajADXky4UxJL6IjtHt7XNOF35HI-PPZjzS55O",
    priceLabel: "USD 7,200",
    status: "ready",
    statusLabel: "Ready Stock",
    savedPriceNote: "Stock available in Jakarta and Surabaya hubs.",
    savedSecondaryAction: "View Availability",
  },
  {
    id: skuToProductId("IND-CNC-6150"),
    sku: "IND-CNC-6150",
    name: "CNC Lathe CK-6150 Heavy Duty Precision",
    subtitle: "Heavy-duty CNC lathe for precision manufacturing.",
    category: "cnc",
    categoryLabel: "Mesin CNC",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzhx-KegwQZXeC96btpswAnCt6IrxB7Rnx-80odyyADbPc84PRQKRLCEVdPgtbAcu_9w_YR9otoZHUcRL7pM5u-tGp42jR-qNtIu1vD_TbjGZvttaSF78RnmPoWrVRGBtfMgzJ5gzCUJs4vYsHSJ_QTmbsAXLPhv3sML3O9mPn0BPcuyDPwDTAO-EJRKhKOW_9vDd9gveMlkgeH7ww5hFdEv-4Yv5ynSZfCYMd8I6-SXOMPwgYyh9pbGGvDP8oxXFuajwTNqgJvy4B",
    priceLabel: "Rp 215.000.000+",
    status: "ready",
    statusLabel: "READY STOCK",
  },
  {
    id: skuToProductId("PKG-AUT-800"),
    sku: "PKG-AUT-800",
    name: "Automatic Vertical Packing Machine V800",
    subtitle: "Vertical form-fill-seal packaging system.",
    category: "packaging",
    categoryLabel: "Packaging",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfL8_-n5A0m1wo-LlFI_BxfXTrZuJgtYmCTsTRvIpVuJcpF464ry-kgqOnBKwPi5Jde3jRBzTGmxgd4mgSuwQdakeON3BbEebk8uvbulyKfQSX3CvnpUwukNy2PxIboVhZX3j9p3vd8k73hY6_-1O9WXp4ijKDbxNwasVH92dArB7-WKwULRszqQeQgFhh8_EzlSjmP3-MZ88gofP03UmcOI6tfNToWjMMjZK4-VRUt05Gp2c6w5mKAfQM7nnYaWtjOICVN8C2naAE",
    priceLabel: "Rp 85.000.000+",
    status: "indent",
    statusLabel: "INDEN",
  },
  {
    id: skuToProductId("PRS-HYD-200T"),
    sku: "PRS-HYD-200T",
    name: "Hydraulic Press 200 Ton - Four Column",
    subtitle: "Four-column hydraulic press for heavy industrial forming.",
    category: "power",
    categoryLabel: "Power Generators",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBP5mM7r582n1iU7P0O4WE4wt3FOqNhst447DubuaGz_GGspb1tNNXG-J73geyqMngZLbGaHtlQuMEOy6OnLV7t4Q33cT8O9YLR_j7VU3zHn-3nuNmuL95WYbUmmVs2q5NQCk1gmXPNxtrC48M8N_l7R-7hHyEOVliRAQSEK1XLRxxYgja9aqwnYePO1kMmEWk3yymoOC95Do4N4xicqg7U4ovx0RxEeOBoTXhl8mI0lj29sA71I8A0dANGeWrWyqJ3ak4LbNhAZzFR",
    priceLabel: "Rp 420.000.000+",
    status: "ready",
    statusLabel: "READY STOCK",
  },
  {
    id: skuToProductId("LSR-FBR-1530"),
    sku: "LSR-FBR-1530",
    name: "Fiber Laser Cutting Machine 1500W",
    subtitle: "1500W fiber laser cutting for metal fabrication.",
    category: "cnc",
    categoryLabel: "Mesin CNC",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvVwloRCiGoLUIN6K7qcpYvxlBEnE0mQeqLn2PjFA9pX4vb77_l4Ki8YY70Gu-3zCQDEOIzELTxJB1Ecdmkl8ua84EGvfIp9NYxvud4hyzQ-aLxhzn9HAwTDkQd7OJwJPf8GpSZh3WJaPQrUq0AobG6i6OhUuqqI_A-ZBbziMfXXj1m185OC7-gTH8XSvvEN2WthQg8ZYi8GWkfiVkw_Cy1QsTIkLp8OIafM3GrhyGLwcoW4MDIm_zpehBJPACvzRQKsi7gCbaMZTu",
    priceLabel: "Rp 580.000.000+",
    status: "ready",
    statusLabel: "READY STOCK",
  },
  {
    id: skuToProductId("PLS-INJ-160T"),
    sku: "PLS-INJ-160T",
    name: "Plastic Injection Molding Machine 160T",
    subtitle: "160-ton injection molding machine for plastic parts.",
    category: "packaging",
    categoryLabel: "Packaging",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWf8Ha5SEuSSNicuiRz_PRJN6OsAfjcQyHBq0DZimFsEL9hjX6zJTX1DY1OzteAere0maSqYaz9hGCRBrlbTyYUpzifecki7130Rwj8YSzXo0gCdi7gYaWMWkeSW7HwVY0N27l_04F3QlQoQHaixBtVPvD1SjrGwUISQLQO_ElzyMDB_ECdtsN82Itp7TdZ5WoN3ay_MelAi-Fobf9bMtdtOwSgI8AO7TMLjm5dGTUatG4NUZLsTTBjU_VBmtX7Kof-Xx1Sv9xglwL",
    priceLabel: "Rp 340.000.000+",
    status: "indent",
    statusLabel: "INDEN",
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id || p.sku === id);
}

export function getProductBySku(sku: string) {
  return products.find((p) => p.sku === sku);
}

export function getSavedProducts() {
  return stitchSavedSkus
    .map((sku) => getProductBySku(sku))
    .filter((p): p is Product => Boolean(p));
}

export const profileDemoUser = {
  name: "Budi Santoso",
  title: "Lead Procurement Manager",
  company: "PT. Pangan Makmur Abadi",
  email: "budi.santoso@pangan-makmur.co.id",
  phone: "812 3456 7890",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCDacKoHOVBj636b1GgZd1Rm6kXfPzuEfp41kYKwofBieaYkkyMpTppaF28bE_1X6-irVhpwu5NVENEeIwtmBGjM7iZ3MVqkgYrYyFDYvxKpRAMo1ElxbY-PVeECwlRWUDLQxOTXT3vW7ptvjglmPcN_POowhxehRz0uR36tMckUgo-nAj8BXWkcCvtZdsuz9IGTSguttMLGbmBBoOlAADm7n_RxFHuYWWa4KkzldfOOii7pntVVU0fwObvepluw47OOo-ugdj0lQRc",
  settingsAvatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDHAWcGWozTVhCzqGrOEpzPFcCTFYHUwoHfUpfa5lzthIBVAZSiK7viGpF9joyemwaFSWRrd3yL9gU91bcp_555Ki-zvpGv0kJTtKjneezjTsjipgjqD6z6U9zfMgoaFj9MqbU88wPk897Y2xTXFfmwdxEH9lwPPqZtdI8zJIID5BymgDPgziyMR55KgYIHxd7hQOj7kayLGBpiMglCwGijveqUQB4IvXSHeOgXYo1c4UFxLKurx7-GgvZVKG3wTNYUW1zjBkaOyTVn",
  processedPoCount: 3,
  docCount: 5,
} as const;

export type DocCategory = "po" | "manual" | "brochure";

export type ProfileDocument = {
  id: string;
  name: string;
  category: DocCategory;
  sizeLabel: string;
  dateLabel: string;
  icon: "description" | "settings_applications" | "menu_book";
  iconBg: string;
  iconColor: string;
};

export const profileDocuments: ProfileDocument[] = [
  {
    id: "1",
    name: "PO-2023-0891-XL",
    category: "po",
    sizeLabel: "PDF • 1.2 MB",
    dateLabel: "Oct 12, 2023",
    icon: "description",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
  },
  {
    id: "2",
    name: "Hydraulic Press X100 Service Manual",
    category: "manual",
    sizeLabel: "PDF • 14.5 MB",
    dateLabel: "Sep 28, 2023",
    icon: "settings_applications",
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-tertiary",
  },
  {
    id: "3",
    name: "2024 Industrial Product Line",
    category: "brochure",
    sizeLabel: "PDF • 8.2 MB",
    dateLabel: "Aug 05, 2023",
    icon: "menu_book",
    iconBg: "bg-secondary-container",
    iconColor: "text-on-secondary-container",
  },
  {
    id: "4",
    name: "PO-2023-0742-MN",
    category: "po",
    sizeLabel: "PDF • 0.9 MB",
    dateLabel: "Jul 19, 2023",
    icon: "description",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
  },
];

export type OrderStatus = "processed" | "completed" | "cancelled";

export type ProfileOrder = {
  id: string;
  poNumber: string;
  dateLabel: string;
  status: OrderStatus;
  description: string;
  amount: string;
};

export const profileOrders: ProfileOrder[] = [
  {
    id: "1",
    poNumber: "PO #8829-01",
    dateLabel: "Oct 24, 2023",
    status: "processed",
    description: "Industrial Lathe G-Series",
    amount: "$14,250.00",
  },
  {
    id: "2",
    poNumber: "PO #8814-12",
    dateLabel: "Oct 18, 2023",
    status: "completed",
    description: "Maintenance Spare Parts",
    amount: "$2,840.15",
  },
  {
    id: "3",
    poNumber: "PO #8790-05",
    dateLabel: "Oct 12, 2023",
    status: "cancelled",
    description: "Hydraulic Press Unit",
    amount: "$31,000.00",
  },
  {
    id: "4",
    poNumber: "PO #8835-09",
    dateLabel: "Today",
    status: "processed",
    description: "Safety Compliance Gear",
    amount: "$5,120.00",
  },
];

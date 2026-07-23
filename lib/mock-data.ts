export type MachineStatus = "online" | "offline" | "alarm" | "maintenance";

export interface Machine {
  id: string;
  code: string;
  name: string;
  status: MachineStatus;
  temperature: number;
  pressure: number;
  batchNumber: string;
}

export interface Alarm {
  id: string;
  machineCode: string;
  severity: "critical" | "warning" | "info";
  message: string;
  time: string;
}

export interface SensorReading {
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  status: "normal" | "warning" | "critical";
}

export const machines: Machine[] = [
  {
    id: "1",
    code: "RT-001",
    name: "Retort Line A",
    status: "online",
    temperature: 121.4,
    pressure: 2.1,
    batchNumber: "B-2026-0142",
  },
  {
    id: "2",
    code: "RT-002",
    name: "Retort Line B",
    status: "alarm",
    temperature: 128.7,
    pressure: 2.4,
    batchNumber: "B-2026-0143",
  },
  {
    id: "3",
    code: "RT-003",
    name: "Retort Line C",
    status: "online",
    temperature: 119.8,
    pressure: 2.0,
    batchNumber: "B-2026-0144",
  },
  {
    id: "4",
    code: "RT-004",
    name: "Retort Line D",
    status: "maintenance",
    temperature: 0,
    pressure: 0,
    batchNumber: "—",
  },
];

export const alarms: Alarm[] = [
  {
    id: "1",
    machineCode: "RT-002",
    severity: "critical",
    message: "Suhu melebihi threshold 125°C",
    time: "2 menit lalu",
  },
  {
    id: "2",
    machineCode: "RT-001",
    severity: "warning",
    message: "Tekanan mendekati batas atas",
    time: "15 menit lalu",
  },
  {
    id: "3",
    machineCode: "RT-003",
    severity: "info",
    message: "Batch B-2026-0144 selesai fase heat",
    time: "32 menit lalu",
  },
];

export const dashboardStats = {
  machinesOnline: 2,
  machinesTotal: 4,
  activeAlarms: 1,
  activeBatches: 3,
};

export const liveReadings: SensorReading[] = [
  { label: "Suhu Rata-rata", value: "121.4", unit: "°C", trend: "up", status: "normal" },
  { label: "Tekanan Sistem", value: "2.1", unit: "bar", trend: "stable", status: "normal" },
  { label: "Cycle Time", value: "42", unit: "min", trend: "down", status: "normal" },
  { label: "Efficiency", value: "94.2", unit: "%", trend: "up", status: "normal" },
];

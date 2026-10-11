export type MachineStatus = "available" | "in-use" | "broken";
export type QueueEntry = { userId: string; duration: number; paidAmount: number; pointsUsed: number };
export type Machine = {
  id: string;
  type: "washer" | "dryer";
  status: MachineStatus;
  remaining: number;
  queue: number;
  queueDurations?: number[];
  queueEntries?: QueueEntry[];
  activeByMe?: boolean;
  paidAmount?: number;
  pointsUsed?: number;
};

export type BookingHistory = {
  id: string;
  machineId: string;
  service: "washer" | "dryer";
  total: number;
  date: string;
};
export type CurrentUser = {
  id: string;
  displayName: string;
  balance: number;
  points: number;
};

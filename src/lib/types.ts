export type MachineStatus = "available" | "in-use" | "broken";
export type Machine = {
  id: string;
  type: "washer" | "dryer";
  status: MachineStatus;
  remaining: number;
  queue: number;
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

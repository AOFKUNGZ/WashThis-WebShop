// แปลงจำนวนนาทีให้สั้นและอ่านง่าย โดยแสดงชั่วโมงเมื่อเวลาเท่ากับหรือเกิน 60 นาที
export function formatRemainingTime(minutes: number) {
  if (minutes < 60) return `${minutes} นาที`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes
    ? `${hours} ชม. ${remainingMinutes} นาที`
    : `${hours} ชม.`;
}

// เวลารวมที่ต้องรอ = เวลาคงเหลือของรอบปัจจุบัน + ระยะเวลาของทุกคิวก่อนหน้า
export function totalWaitTime(machine: { status: string; remaining: number; queueDurations?: number[] }) {
  return machine.status === "in-use"
    ? machine.remaining + (machine.queueDurations ?? []).reduce((total, duration) => total + duration, 0)
    : 0;
}

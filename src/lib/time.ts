// แปลงจำนวนนาทีให้สั้นและอ่านง่าย โดยแสดงชั่วโมงเมื่อเวลาเท่ากับหรือเกิน 60 นาที
export function formatRemainingTime(minutes: number) {
  if (minutes < 60) return `${minutes} นาที`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes
    ? `${hours} ชม. ${remainingMinutes} นาที`
    : `${hours} ชม.`;
}

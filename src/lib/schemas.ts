import { z } from "zod";

// RHF ส่งค่าทุก input ผ่าน Zod ก่อนเปลี่ยน state ของการจอง
export const bookingSchema = z.object({
  service: z.enum(["washer", "dryer"]),
  machineId: z.string().min(1, "กรุณาเลือกเครื่อง"),
  extraMinutes: z.number().int().min(0).max(30),
  detergent: z.boolean(),
  softener: z.boolean(),
  pointsToUse: z.number().int().min(0, "แต้มต้องไม่ติดลบ"),
  usePoints: z.boolean(),
});
export const topUpSchema = z.object({
  amount: z
    .number()
    .min(20, "เติมเงินขั้นต่ำ 20 บาท")
    .max(5000, "เติมได้สูงสุด 5,000 บาท"),
});
export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร")
    .max(40),
});
export const loginSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร")
    .max(40),
});
export const chatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "กรุณาพิมพ์ข้อความ")
    .max(300, "ข้อความยาวเกิน 300 ตัวอักษร"),
});
export type BookingValues = z.infer<typeof bookingSchema>;
export type TopUpValues = z.infer<typeof topUpSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type ChatValues = z.infer<typeof chatSchema>;

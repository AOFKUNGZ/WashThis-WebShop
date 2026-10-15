# WashThis! — ระบบจองเครื่องซักผ้า

เว็บแอปสำหรับดูสถานะและจองเครื่องซัก/อบผ้าแบบเรียลไทม์ พัฒนาด้วย Next.js, React, TypeScript และ Tailwind CSS โดยมีระบบเข้าสู่ระบบผ่าน Google เพื่อจัดการข้อมูลผู้ใช้

## ความสามารถหลัก

- แสดงสถานะเครื่อง: ว่าง, กำลังใช้งาน และเครื่องเสีย
- นับเวลาถอยหลังของเครื่องที่กำลังใช้งาน และอัปเดตคิวอัตโนมัติ
- จองเครื่องล่วงหน้า พร้อมดูจำนวนคิวและเวลารอรวม
- คำนวณค่าบริการซัก/อบ, ตัวเลือกน้ำยา และส่วนลดจากคะแนน
- ยกเลิกการใช้งานพร้อมคืนเงินและคะแนนเต็มจำนวน
- แจ้งปัญหาเครื่องผ่าน Notification
- โปรไฟล์ผู้ใช้, Wallet, คะแนน และประวัติการจอง
- สลับโหมดสว่าง/มืด และแชตจำลองกับผู้ดูแล

## เทคโนโลยี

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4
- NextAuth.js + Google OAuth
- React Hook Form + Zod
- Lucide React

## ความต้องการก่อนเริ่มต้น

- Node.js 20 ขึ้นไป
- npm 10 ขึ้นไป
- Google OAuth Client ID และ Client Secret (หากต้องการใช้ระบบล็อกอิน)

## วิธีติดตั้ง

1. Clone repository และเข้าสู่โฟลเดอร์โปรเจกต์

   ```bash
   git clone https://github.com/AOFKUNGZ/WashThis-WebShop.git
   cd WashThis-WebShop
   ```

2. ติดตั้ง dependencies

   ```bash
   npm install
   ```

3. สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์ แล้วกำหนดค่า Google OAuth

   ```env
   AUTH_SECRET=สร้างค่าสุ่มที่ยาวและปลอดภัย
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   ```

   ตั้งค่า Authorized redirect URI ใน Google Cloud Console สำหรับการพัฒนาเป็น:

   ```text
   http://localhost:3000/api/auth/callback/google
   ```

4. เริ่ม development server

   ```bash
   npm run dev
   ```

5. เปิด [http://localhost:3000](http://localhost:3000) ผ่านเบราว์เซอร์

## วิธีใช้งาน

1. กด **Login with Google** เพื่อเข้าสู่ระบบ
2. เลือกการ์ดเครื่องที่สถานะ **ว่าง** เพื่อเริ่มจอง หรือเลือกเครื่อง **กำลังทำงาน** เพื่อจองคิวล่วงหน้า
3. เลือกบริการและตัวเลือกเสริม แล้วระบุคะแนนที่ต้องการแลกส่วนลด
4. ยืนยันรายการ ระบบจะตัดเงิน/คะแนนและเริ่มนับเวลาหรือเพิ่มเข้าคิว
5. ดูเครื่องที่กำลังใช้งานได้จาก Sidebar และกดยกเลิกเมื่อต้องการคืนเงินกับคะแนน
6. กดไอคอนแจ้งเตือนบนการ์ดเครื่องเพื่อรายงานเครื่องเสีย

## คำสั่งที่ใช้บ่อย

| คำสั่ง | หน้าที่ |
| --- | --- |
| `npm run dev` | เปิดโหมดพัฒนา |
| `npm run lint` | ตรวจรูปแบบและปัญหา ESLint |
| `npm run build` | ตรวจและสร้าง production build |
| `npm run start` | เปิด production server หลัง build |

## โครงสร้างสำคัญ

```text
src/
├── app/                 # หน้าเว็บ, layout และ API route
├── components/          # Dashboard UI และ modal ที่นำกลับมาใช้ได้
├── lib/                 # Type, schema validation และ helper เวลา
├── auth.ts              # การตั้งค่า NextAuth / Google OAuth
└── proxy.ts             # การจัดการ route middleware
```

## หมายเหตุ

- ข้อมูลเครื่อง, Wallet, คะแนน และคิวในเวอร์ชันปัจจุบันเก็บใน React state จึงจะกลับสู่ค่าเริ่มต้นเมื่อรีเฟรชหน้าเว็บ
- ห้าม commit ไฟล์ `.env.local` หรือค่า OAuth secret ขึ้น repository

## สมาชิกกลุ่ม 
- 6804101309 นางสาวจารุวรรณ สิงค์ใจ
- 6804101318 นางสาวฐิติวรดา นาปัน
- 6804101319 นางสาวณฐิกา จันทร์เสถียร
- 6804101363 นางสาวพิมลวรรณ ตันมูล
- 6804101387 นายศกลกฤต มูลมั่ง
- 6804101393 นายหลู่ ลุงทุน

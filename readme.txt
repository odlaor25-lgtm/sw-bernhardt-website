# SW.BERNHARDT Legal Assistant Platform

ระบบช่วยเหลือทางกฎหมายด้วย AI สำหรับประชาชนไทย

## 🎯 วัตถุประสงค์

- ช่วยประชาชนตรวจสอบสัญญาและเข้าใจสิทธิทางกฎหมาย
- คำนวณสินเชื่อและตรวจสอบความถูกต้องตามกฎหมาย
- ให้ข้อมูลกฎหมายที่เข้าใจง่ายและเข้าถึงได้

## 🚀 การติดตั้งและใช้งาน

### ข้อกำหนดเบื้องต้น

- Node.js (เวอร์ชัน 14 หรือสูงกว่า)
- Firebase CLI
- บัญชี Firebase

### ขั้นตอนการติดตั้ง

1. **ติดตั้ง Firebase CLI**
```bash
npm install -g firebase-tools

เข้าสู่ระบบ Firebase
firebase login

สร้างโปรเจค Firebase
firebase init hosting

แก้ไขไฟล์ .firebaserc
{
  "projects": {
    "default": "your-actual-project-id"
  }
}

Deploy เว็บไซต์
firebase deploy

การพัฒนาในเครื่อง
firebase serve
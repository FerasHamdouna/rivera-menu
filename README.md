# مينيو Rivera

موقع المينيو الرقمي ولوحة التحكم لـ Rivera Cafe & Restaurant. المتطلبات كاملة في [PRD.md](PRD.md)، والبروتوتايبس في [prototypes/](prototypes/index.html).

## التجهيز لأول مرة

1. **مشروع Supabase**: اعمل مشروع مجاني على [supabase.com](https://supabase.com).
2. **قاعدة البيانات**: من لوحة Supabase افتح **SQL Editor** وشغّل الملفين بالترتيب:
   1. [supabase/migrations/20261103000000_init.sql](supabase/migrations/20261103000000_init.sql): الجداول والصلاحيات ومخزن الصور.
   2. [supabase/seed.sql](supabase/seed.sql): المينيو الحالي (7 أقسام، 43 صنف).
3. **قفل التسجيل**: من **Authentication → Sign In / Providers** طفّي **Allow new users to sign up**.
4. **المفاتيح**: انسخ `.env.example` لـ `.env.local` وعبّي القيم من **Project Settings → API Keys**، وحط كلمة سر مبدئية بـ `ADMIN_PASSWORD`.
5. **حساب الأدمن**:
   ```bash
   npm run admin:create
   ```
6. **التشغيل**:
   ```bash
   npm run dev
   ```

## بعد النشر

- الـ QR بيستعمل عنوان الموقع اللي فاتح منه لوحة التحكم. إذا صار في دومين خاص، حطه بـ `NEXT_PUBLIC_SITE_URL` (مثلاً `https://menu.rivera.ps`) عشان كل الأكواد تطلع عليه.
- الطباعة من **لوحة التحكم ← الطباعة**: المينيو A4 أو 4 كروت QR للطاولات. اختار **حفظ كـ PDF** من نافذة الطباعة، وفعّل **Background graphics**.

## أوامر

| الأمر | شو بيعمل |
|---|---|
| `npm run dev` | تشغيل محلي على `http://localhost:3000` |
| `npm run build` | بناء نسخة الإنتاج |
| `npm run db:seed` | يعيد توليد `supabase/seed.sql` من `prototypes/shared/data.js` |
| `npm run admin:create` | ينشئ حساب الأدمن المبدئي (ما بيعمل إشي إذا الحساب موجود) |

## البنية

```
src/lib/supabase/   عملاء Supabase: server (مع جلسة الأدمن)، browser، admin (service role، للسيرفر فقط)
src/lib/menu.ts     قراءة المينيو كامل بطلب واحد
src/lib/types.ts    أنواع الجداول
supabase/           ملف الجداول + البيانات الأولية
scripts/            توليد البيانات الأولية وإنشاء حساب الأدمن
prototypes/         البروتوتايبس (HTML ثابت)
```

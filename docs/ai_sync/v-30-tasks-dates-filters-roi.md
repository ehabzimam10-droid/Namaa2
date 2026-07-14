# سجل تزامن الذكاء الاصطناعي (AI Sync Log) - ترقية إدارة المهام وعوائد المشاريع للولي والأبناء (v-30)

يوثق هذا السجل عملية الترقية البنيوية لنظام إدارة المهام والمسؤوليات، وعرض العوائد الاستثمارية (ROI) للمشاريع المكتملة التمويل، وتصفير مشاكل التزامن سحابياً ومحلياً.

## 📂 الملفات المشمولة بالتغيير

### 1. الملفات الجديدة:
*   **[v-30-tasks-dates-filters-roi.md](file:///c:/Users/Arram/Documents/nama/docs/ai_sync/v-30-tasks-dates-filters-roi.md)**:
    *   سجل التزامن الحالي باللغة العربية لتوثيق التفاصيل التقنية.

### 2. الملفات المعدلة:
*   **[mockData.ts](file:///c:/Users/Arram/Documents/nama/src/data/mockData.ts)**:
    *   تحديث واجهة المهمة `Task` لتشمل خيار تاريخ ووقت الانتهاء: `endDate?: string` (بصيغة ISO/datetime).
*   **[AppContext.tsx](file:///c:/Users/Arram/Documents/nama/src/context/AppContext.tsx)**:
    *   تعديل واجهة السياق `AppContextType` لإضافة دالة `calculateROI` وتحديث دالة `assignManualTask`.
    *   تطبيق دالة `calculateROI(investedAmount, roiPercentage)` المساعدة لحساب العوائد المكتملة للأبناء.
    *   تحديث دالة `assignManualTask` لتقبل المعامل الاختياري `endDate` ومزامنته سحابياً في جدول `kid_tasks` تحت عمود `end_date`.
    *   تحديث جلب البيانات والخرائط `mappedTasksFromDb` لقراءة عمود `end_date` سحابياً وتعيينه لـ `endDate` محلياً.
*   **[AssignTaskModal.tsx](file:///c:/Users/Arram/Documents/nama/src/components/ui/AssignTaskModal.tsx)**:
    *   إضافة حالة وحقل إدخال التاريخ والوقت `datetime-local` باسم "تاريخ النهاية" في نموذج إسناد المهام اليدوية للأب.
*   **[SuggestedTaskWidget.tsx](file:///c:/Users/Arram/Documents/nama/src/components/ui/SuggestedTaskWidget.tsx)**:
    *   إضافة إمكانية تحديد وتحديث "تاريخ النهاية" ضمن التوصية الذكية المقترحة بالذكاء الاصطناعي قبل الاعتماد الرسمي للمهمة.
*   **[FatherProjectsPage.tsx](file:///c:/Users/Arram/Documents/nama/src/pages/FatherProjectsPage.tsx)**:
    *   التحقق مما إذا كان المشروع الاستثماري مكتمل التمويل بالكامل (`currentInvested >= totalRequired`).
    *   في حال الاكتمال، يعرض بطاقة زجاجية مميزة تحمل عنوان **"العوائد المستحقة 💰"** وتوضح المبالغ المدفوعة والعائد الدقيق المستحق لكل طفل مساهم (باستخدام دالة `calculateROI`).
*   **[KidTasksPage.tsx](file:///c:/Users/Arram/Documents/nama/src/pages/KidTasksPage.tsx)**:
    *   إدراج 4 فلاتر تبويبات للتحكم بعرض المهام: "قيد التنفيذ"، "قيد المراجعة"، "المنجزة"، و"غير منجزة".
    *   تعتبر المهمة "غير منجزة" (expired) إذا كانت حالتها معلقة (`pending`) وتجاوز الوقت الفعلي تاريخ الانتهاء المحدّد لها (`endDate`).
    *   عرض شريط عد تنازلي ديناميكي "الوقت المتبقي..." أو "انتهى الوقت" بجانب كل مهمة تشتمل على تاريخ نهاية.
    *   منع الطفل من إرسال إثبات للمهمة المنتهية الصلاحية وحظر الزر تلقائياً.

---

## 🛠️ تفاصيل التحقق والأنواع لـ TypeScript
*   تم التأكد من بناء المشروع بالكامل وتجاوز اختبار التحقق التجميعي لـ TypeScript بنسابيع تامة وبنسبة **100%** ودون أي أخطاء أو تحذيرات عبر الأمر:
    ```bash
    npx tsc --noEmit
    ```

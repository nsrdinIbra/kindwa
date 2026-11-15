document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');

    // إضافة حدث النقر لكل زر في شريط التنقل العلوي
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            switchTab(targetId);
        });
    });

    // التأكد من تفعيل خلفية الرئيسية عند فتح الصفحة لأول مرة
    if (!document.body.classList.contains('bg-home')) {
        document.body.classList.add('bg-home');
    }
});

/**
 * دالة التبديل بين الأقسام، تحديث الأزرار، وتغيير الخلفية تلقائياً
 * @param {string} targetId معرف القسم المطلوب عرضه
 */
function switchTab(targetId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');

    // خريطة لربط الأقسام بصور الخلفيات
    const bgClasses = {
        'home': 'bg-home',
        'hillat-ahmed': 'bg-hillat-ahmed',
        'um-zoghi': 'bg-um-zoghi'
    };

    // تفعيل الزر المناسب وإلغاء البقية
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-target') === targetId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // إظهار القسم المطلوب وإخفاء البقية
    sections.forEach(section => {
        if (section.id === targetId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // تغيير صورة الخلفية حسب الزر المضغوط
    document.body.classList.remove('bg-home', 'bg-hillat-ahmed', 'bg-um-zoghi');
    if (bgClasses[targetId]) {
        document.body.classList.add(bgClasses[targetId]);
    }

    // التمرير السلس لأعلى الصفحة
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
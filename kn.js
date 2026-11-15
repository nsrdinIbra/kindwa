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

    // استدعاء دالة جلب وعرض المقالات فور تحميل الصفحة
    loadArticles();
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

/**
 * دالة لجلب المقالات من ملف articles.json وعرضها ديناميكياً
 */
function loadArticles() {
    const container = document.getElementById('articles-container');
    if (!container) return;

    fetch('articles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('فشل في تحميل ملف المقالات');
            }
            return response.json();
        })
        .then(articles => {
            container.innerHTML = ''; // تفريغ الحاوية أولاً
            
            articles.forEach(article => {
                let paragraphsHtml = article.paragraphs.p(p => `<p>${p}</p>`.replace(/^/, '')).join(''); // تم تصحيح بناء الفقرات
                
                // إعادة صياغة توليد الفقرات بشكل آمن وبسيط
                let paragraphsList = article.paragraphs.map(p => `<p>${p}</p>`).join('');

                // إذا كان المقال يحتوي على صورة رئيسية واحدة
                let singleImageHtml = article.image 
                    ? `<div class="article-img-container"><img src="${article.image}" alt="${article.title}" class="article-img"></div>` 
                    : '';

                // إذا كان المقال يحتوي على معرض صور متعدد (مثل مقال العيون)
                let galleryHtml = '';
                if (article.images && article.images.length > 0) {
                    let imagesItems = article.images.map(img => `
                        <div class="gallery-item">
                            <img src="${img}" alt="صورة من المخيم الصحي" class="article-img">
                        </div>
                    `).join('');
                    
                    galleryHtml = `
                        <div class="article-gallery-title" style="margin-top: 20px; margin-bottom: 10px; font-weight: 700; color: var(--primary-color);">📷 صور من اليوم الصحي للعيون:</div>
                        <div class="article-gallery">${imagesItems}</div>
                    `;
                }

                let articleElement = document.createElement('article');
                articleElement.className = 'article-card';
                articleElement.style.marginBottom = '25px';
                
                articleElement.innerHTML = `
                    ${singleImageHtml}
                    <div class="article-meta" style="margin-top: 15px;">
                        <span class="article-tag">${article.tag}</span>
                        <span class="article-date">${article.date}</span>
                    </div>
                    <h4>${article.title}</h4>
                    ${paragraphsList}
                    ${galleryHtml}
                `;
                
                container.appendChild(articleElement);
            });
        })
        .catch(error => {
            console.error('خطأ في جلب المقالات:', error);
            container.innerHTML = '<p style="text-align:center; color: var(--text-muted);">عذراً، تعذر تحميل المقالات حالياً.</p>';
        });
}

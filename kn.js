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

    // جلب وعرض المقالات من ملف JSON فور تحميل الصفحة
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
 * دالة لجلب المقالات وعرضها مع دعم الصور المفردة، معرض الصور، وتعليقات Disqus
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
                // معالجة الفقرات
                let paragraphsHtml = '';
                if (article.paragraphs && Array.isArray(article.paragraphs)) {
                    paragraphsHtml = article.paragraphs.map(p => `<p>${p}</p>`).join('');
                }

                // عرض الصورة الرئيسية الفردية (إن وجدت)
                let singleImageHtml = article.image 
                    ? `<div class="article-img-container"><img src="${article.image}" alt="${article.title}" class="article-img"></div>` 
                    : '';

                // عرض معرض الصور المتعدد (إن وجد)
                let galleryHtml = '';
                if (article.images && Array.isArray(article.images) && article.images.length > 0) {
                    let imagesItems = article.images.map(img => `
                        <div class="gallery-item">
                            <img src="${img}" alt="صورة من الأرشيف" class="article-img">
                        </div>
                    `).join('');
                    
                    galleryHtml = `
                        <div class="article-gallery-title" style="margin-top: 20px; margin-bottom: 10px; font-weight: 700; color: var(--primary-color);">📷 معرض الصور:</div>
                        <div class="article-gallery">${imagesItems}</div>
                    `;
                }

                // قسم التعليقات (Disqus) - تمرير الـ ID وعنوان المقال
                let disqusHtml = `
                    <div class="comments-section" style="margin-top: 30px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 20px;">
                        <button class="toggle-comments-btn" onclick="toggleDisqus(this, 'disqus_thread_${article.id}', '${article.id}', '${encodeURIComponent(article.title)}')" style="background: var(--primary-color, #2c3e50); color: white; border: none; padding: 9px 18px; border-radius: 8px; cursor: pointer; font-family: 'Tajawal', sans-serif; font-size: 0.95rem; transition: background 0.3s;">
                            💬 عرض / إضافة تعليقات
                        </button>
                        <div id="disqus_thread_${article.id}" class="disqus-container" style="display: none; margin-top: 15px;"></div>
                    </div>
                `;

                let articleElement = document.createElement('article');
                articleElement.className = 'article-card';
                articleElement.style.marginBottom = '25px';
                
                articleElement.innerHTML = `
                    ${singleImageHtml}
                    <div class="article-meta" style="margin-top: 15px;">
                        <span class="article-tag">${article.tag || ''}</span>
                        <span class="article-date">${article.date || ''}</span>
                    </div>
                    <h4>${article.title}</h4>
                    ${paragraphsHtml}
                    ${galleryHtml}
                    ${disqusHtml}
                `;
                
                container.appendChild(articleElement);
            });
        })
        .catch(error => {
            console.error('خطأ في جلب المقالات:', error);
            container.innerHTML = '<p style="text-align:center; color: var(--text-muted);">عذراً، تعذر تحميل المقالات حالياً.</p>';
        });
}

/**
 * دالة لفتح وإغلاق صندوق تعليقات Disqus لكل مقال بشكل مستقل وفريد
 */
function toggleDisqus(button, containerId, articleId, articleTitle) {
    const container = document.getElementById(containerId);
    
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        button.textContent = 'إخفاء التعليقات 🔼';
        
        // التحقق مما إذا تم تحميل صندوق التعليقات لهذا المقال من قبل
        if (!container.hasChildNodes() || container.innerHTML.trim() === '') {
            
            // إعداد متغيرات Disqus الخاصة بهذا المقال تحديداً
            window.disqus_config = function () {
                this.page.url = window.location.href + '#article-' + articleId; // رابط فريد لكل مقال
                this.page.identifier = 'kandowa_article_' + articleId; // معرف فريد للمقال
                this.page.title = decodeURIComponent(articleTitle);
            };

            var disqus_shortname = 'balola'; // الـ Shortname الخاص بك
            
            var dsq = document.createElement('script'); 
            dsq.type = 'text/javascript'; 
            dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        }
    } else {
        container.style.display = 'none';
        button.textContent = '💬 عرض / إضافة تعليقات 🔽';
    }
}

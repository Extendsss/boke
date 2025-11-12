// Markdown 驱动文章列表
const posts = [
    {
        id: 1,
        title: '凌晨唱给月亮的歌',
        date: '2025-10-01',
        tags: ['诗', '爱情'],
        file: 'posts/2025-10-01-凌晨唱给月亮的歌.md'
    },
    {
        id: 2,
        title: '把注释写成情书',
        date: '2025-09-20',
        tags: ['代码', '生活'],
        file: 'posts/2025-11-01-把注释写成情书.md'
    },
    {
        id: 3,
        title: '静态站点的小确幸',
        date: '2025-08-03',
        tags: ['指南', '工具'],
        file: 'posts/2025-08-03-静态站点的小确幸.md'
    },
    {
        id: 4,
        title: '音乐与算法的相遇',
        date: '2025-05-11',
        tags: ['音乐', '算法'],
        file: 'posts/2025-05-11-音乐与算法的相遇.md'
    },
    {
        id: 5,
        title: '当List被多情的Map收养',
        date: '2025-11-05',
        tags: ['爱情', '代码'],
        file: 'posts/2025-11-05-当List被多情的Map收养.md'
    },
    {
        id: 6,
        title: '函数与索引的慢舞',
        date: '2025-11-10',
        tags: ['诗', '代码'],
        file: 'posts/2025-11-10-函数与索引的慢舞.md'
    },
    {
        id: 7,
        title: '把提交当成同意撤回一次',
        date: '2025-11-12',
        tags: ['指南', '工具'],
        file: 'posts/2025-11-12-把提交当成同意撤回一次.md'
    }
];

const postsEl = document.getElementById('posts');
const latestEl = document.getElementById('latest');
const filtersEl = document.getElementById('filters');
const qEl = document.getElementById('q');
document.getElementById('year').textContent = new Date().getFullYear();

// ==================== 主题切换功能 ====================
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

// 从 localStorage 读取主题,默认为深色
let currentTheme = localStorage.getItem('theme') || 'dark';

// 主题循环顺序
const themes = ['dark', 'light', 'green'];

// 应用主题
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem('theme', theme);

    // 更新按钮图标和文字
    if (theme === 'light') {
        themeIcon.textContent = '🌿';
        themeBtn.lastChild.textContent = ' 清新';
    } else if (theme === 'green') {
        themeIcon.textContent = '🌑';
        themeBtn.lastChild.textContent = ' 深色';
    } else {
        themeIcon.textContent = '☀️';
        themeBtn.lastChild.textContent = ' 浅色';
    }
}

// 初始化主题
applyTheme(currentTheme);

// 主题切换按钮点击事件 - 循环切换三个主题
themeBtn.addEventListener('click', () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    applyTheme(themes[nextIndex]);
});

// ==================== 文章渲染功能 ====================
function renderPosts(list) {
    postsEl.innerHTML = '';
    if (list.length === 0) {
        postsEl.innerHTML = `
            <div class="empty-state">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div style="font-size: 18px; margin-bottom: 8px;">没有找到匹配的文章</div>
                <div style="font-size: 14px;">试试其他关键词吧~</div>
            </div>`;
        return;
    }
    list.forEach(p => {
        const card = document.createElement('article');
        card.className = 'post-card';
        card.innerHTML = `
            <h3>${p.title}</h3>
            <div class="post-meta">${p.date} · ${p.tags.join(', ')}</div>
            <div class="read-more">阅读全文 →</div>
        `;
        card.onclick = () => openPost(p);
        postsEl.appendChild(card);
    });
}

// ==================== 文章打开功能（带图片备用链接） ====================
function openPost(post) {
    fetch(post.file)
        .then(res => res.text())
        .then(md => {
            // 支持主图|备用图语法
            const processedMd = md.replace(/!\[([^\]]*)\]\(([^|\s]+)\|([^)]+)\)/g, (match, alt, main, backup) => {
                const safeAlt = alt.replace(/"/g, '&quot;');
                const safeMain = main.trim();
                const safeBackup = backup.trim();
                return `<div class="img-wrapper">
                            <div class="img-loader"></div>
                            <img alt="${safeAlt}" src="${safeMain}" data-backup="${safeBackup}" class="fade-img previewable"/>
                        </div>`;
            }).replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, main) => {
                // 普通图片（无备用图）
                const safeAlt = alt.replace(/"/g, '&quot;');
                const safeMain = main.trim();
                return `<div class="img-wrapper">
                            <div class="img-loader"></div>
                            <img alt="${safeAlt}" src="${safeMain}" class="fade-img previewable"/>
                        </div>`;
            });

            const html = marked.parse(processedMd);

            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close">✕</button>
                    <h2>${post.title}</h2>
                    <div class="post-meta">${post.date} · ${post.tags.join(', ')}</div>
                    <hr>
                    <div class="article-content">${html}</div>
                    <div style="text-align: right; margin-top: 48px">
                        <button class="btn primary" onclick="closeModal()">关 闭</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            // 图片加载、备用切换
            modal.querySelectorAll('.article-content img').forEach(img => {
                const wrapper = img.closest('.img-wrapper');
                const loader = wrapper.querySelector('.img-loader');
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease';

                img.addEventListener('load', () => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.remove(), 400);
                    img.style.opacity = '1';
                });

                img.onerror = () => {
                    const backup = img.getAttribute('data-backup');
                    if (backup && img.src !== backup) {
                        console.log(`主图加载失败，切换备用图：${backup}`);
                        img.style.opacity = '0';
                        setTimeout(() => {
                            img.src = backup;
                        }, 200);
                    } else {
                        loader.remove();
                        img.replaceWith(Object.assign(document.createElement('div'), {
                            textContent: '（图片加载失败了~）',
                            style: 'text-align:center;color:#999;font-size:14px;margin:12px 0;'
                        }));
                    }
                };
            });

            // 🪞 图片点击预览
            modal.querySelectorAll('.previewable').forEach(img => {
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', () => {
                    const preview = document.createElement('div');
                    preview.className = 'img-preview-overlay';
                    preview.innerHTML = `
                        <div class="img-preview-content">
                            <img src="${img.src}" alt="${img.alt}">
                            <span class="img-preview-close">✕</span>
                        </div>
                    `;
                    document.body.appendChild(preview);
                    document.body.style.overflow = 'hidden';

                    // 点击关闭
                    preview.addEventListener('click', (e) => {
                        if (e.target.classList.contains('img-preview-overlay') ||
                            e.target.classList.contains('img-preview-close')) {
                            preview.classList.add('fade-out');
                            setTimeout(() => preview.remove(), 300);
                            document.body.style.overflow = '';
                        }
                    });
                });
            });

            modal.querySelector('.modal-close').onclick = closeModal;
            modal.onclick = (e) => {
                if (e.target.className === 'modal-overlay') closeModal();
            };
        })
        .catch(err => {
            console.error('加载文章失败：', err);
            alert('文章加载失败，请稍后再试');
        });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeIn 0.2s ease reverse';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 200);
    }
}

// ==================== 工具函数 ====================
function uniqueTags(data) {
    const s = new Set();
    data.forEach(p => p.tags.forEach(t => s.add(t)));
    return [...s];
}

function renderFilters() {
    const tags = uniqueTags(posts);
    filtersEl.innerHTML = '';
    tags.forEach(t => {
        const b = document.createElement('button');
        b.className = 'tag';
        b.textContent = t;
        b.onclick = () => {
            qEl.value = t;
            filter();
        }
        filtersEl.appendChild(b);
    });
}

function renderLatest() {
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    latestEl.innerHTML = '';
    sortedPosts.slice(0, 3).forEach(p => {
        const div = document.createElement('div');
        div.className = 'latest-post';
        div.style.cursor = 'pointer';
        div.innerHTML = `
            <div class="latest-post-title">${p.title}</div>
            <div class="post-meta">${p.date}</div>
        `;
        div.onclick = () => openPost(p);
        latestEl.appendChild(div);
    });
}

function filter() {
    const q = qEl.value.trim().toLowerCase();
    const filtered = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tags.join(' ').toLowerCase().includes(q)
    );
    renderPosts(filtered);
}

function initPosts() {
    renderPosts(posts.slice(0, 4));
}

// ==================== 事件监听 ====================
document.getElementById('clear').onclick = () => {
    qEl.value = '';
    initPosts();
};

document.getElementById('writeBtn').onclick = () => {
    alert('大小姐提示：写下你的第一篇小日记吧，鸽鸽~ 💝');
};

document.getElementById('aboutBtn').onclick = () => {
    alert('关于页面开发中，敬请期待~ ✨');
};

qEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') filter();
});

// ==================== 初始化 ====================
renderFilters();
renderLatest();
initPosts();

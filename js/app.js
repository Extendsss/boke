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
    },
    {
        id: 8,
        title: '不可变的孤独与可变的陪伴',
        date: '2025-11-13',
        tags: ['代码', '算法'],
        file: 'posts/2025-11-13-不可变的孤独与可变的陪伴.md'
    },
    {
        id: 9,
        title: '当月份越界时的浪漫误会',
        date: '2025-11-14',
        tags: ['诗', '代码'],
        file: 'posts/2025-11-14-当月份越界时的浪漫误会.md'
    },
    {
        id: 10,
        title: '午夜最后一秒的越界',
        date: '2025-11-15',
        tags: ['爱情', '代码'],
        file: 'posts/2025-11-15-午夜最后一秒的越界.md'
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

// ==================== 音乐播放功能 ====================
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
let audio = null;
let isPlaying = false;

// 音乐URL - 可以替换为你想要的音乐链接
const musicUrl = 'https://violet-02.oss-cn-beijing.aliyuncs.com/files/image-20251118163115.mp3';

musicBtn.addEventListener('click', () => {
    if (!audio) {
        audio = new Audio(musicUrl);
        audio.loop = true;
        audio.volume = 0.5;
    }

    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        musicIcon.textContent = '🎵';
        musicBtn.classList.remove('playing');
        musicBtn.lastChild.textContent = ' 音乐';
    } else {
        audio.play().catch(err => {
            console.error('播放失败:', err);
            alert('音乐播放失败,请检查网络连接');
        });
        isPlaying = true;
        musicIcon.textContent = '🎶';
        musicBtn.classList.add('playing');
        musicBtn.lastChild.textContent = ' 播放中';
    }
});

// ==================== 联系弹窗功能 ====================
const contactBtn = document.getElementById('contactBtn');
let tempFormData = {name: '', email: '', message: ''};

// 打开弹窗
contactBtn.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.id = 'contactOverlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal-content" style="max-width: 420px;">
            <button class="modal-close" id="closeContactBtn">✕</button>
            <h2 style="margin-bottom: 8px;">给鸽鸽留言 💌</h2>
            <div class="post-meta" style="margin-bottom: 20px;">大小姐会帮忙转达的~</div>
            <form id="contactForm">
                <input type="text" name="name" id="contactName" 
                       placeholder="你的昵称" 
                       value="${tempFormData.name}"
                       style="width: 100%; padding: 10px 12px; margin-bottom: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-size: 14px;" />
                <input type="email" name="email" id="contactEmail" 
                       placeholder="邮箱地址(方便回复)" 
                       value="${tempFormData.email}"
                       style="width: 100%; padding: 10px 12px; margin-bottom: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-size: 14px;" />
                <textarea name="message" id="contactMessage" 
                          rows="5" 
                          placeholder="想对鸽鸽说些什么呢？"
                          style="width: 100%; padding: 10px 12px; margin-bottom: 16px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-size: 14px; resize: vertical; font-family: inherit;">${tempFormData.message}</textarea>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" class="btn" id="cancelBtn">取消</button>
                    <button type="submit" class="btn primary" id="submitBtn">发送</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.getElementById('closeContactBtn');

    // 实时保存输入
    nameInput.oninput = () => tempFormData.name = nameInput.value;
    emailInput.oninput = () => tempFormData.email = emailInput.value;
    messageInput.oninput = () => tempFormData.message = messageInput.value;

    // 提交表单
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // 任意一项不为空即可发送
        if (!name && !email && !message) {
            showToast('至少写一点点嘛~', 'warning');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '发送中...';

        fetch('https://formspree.io/f/xdkbarpj', {
            method: 'POST',
            headers: {'Accept': 'application/json'},
            body: new FormData(form)
        })
            .then(response => {
                if (response.ok) {
                    showToast('留言已经飞进邮箱啦！💝', 'success');
                    tempFormData = {name: '', email: '', message: ''};
                    setTimeout(() => closeContact(true), 1500);
                } else {
                    throw new Error('发送失败');
                }
            })
            .catch(() => {
                showToast('似乎有点小状况，再试一次好不好？😢', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = '发送';
            });
    });

    // 取消/关闭按钮
    cancelBtn.onclick = () => closeContact(false);
    closeBtn.onclick = () => closeContact(false);
    overlay.onclick = (e) => {
        if (e.target.id === 'contactOverlay') closeContact(false);
    };
});

// 关闭弹窗（静默发送未完成的留言）
function closeContact(skipSend) {
    const overlay = document.getElementById('contactOverlay');
    if (!overlay) return;

    const hasContent = tempFormData.name.trim() ||
        tempFormData.email.trim() ||
        tempFormData.message.trim();

    // 如果有内容且不是成功提交后关闭，静默发送
    if (!skipSend && hasContent) {
        const formData = new FormData();
        formData.append('name', tempFormData.name || '匿名用户');
        formData.append('email', tempFormData.email || '未提供');
        formData.append('message', tempFormData.message || '（未完成的留言）');

        fetch('https://formspree.io/f/xdkbarpj', {
            method: 'POST',
            headers: {'Accept': 'application/json'},
            body: formData
        }).catch(() => console.log('静默发送失败'));
    }

    overlay.style.animation = 'fadeIn 0.2s ease reverse';
    setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
    }, 200);
}

// 美化的提示消息
function showToast(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 14px 20px;
        background: ${colors[type]};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10001;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

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

qEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') filter();
});

// ==================== 初始化 ====================
renderFilters();
renderLatest();
initPosts();

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
    }
];

const postsEl = document.getElementById('posts');
const latestEl = document.getElementById('latest');
const filtersEl = document.getElementById('filters');
const qEl = document.getElementById('q');
document.getElementById('year').textContent = new Date().getFullYear();

function renderPosts(list) {
    postsEl.innerHTML = '';
    if (list.length === 0) {
        postsEl.innerHTML = `
                    <div class="empty-state">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
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

function openPost(post) {
    fetch(post.file)
        .then(res => res.text())
        .then(md => {
            const html = marked.parse(md);
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
    renderPosts(posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tags.join(' ').toLowerCase().includes(q)
    ));
}

document.getElementById('clear').onclick = () => {
    qEl.value = '';
    filter();
};

document.getElementById('writeBtn').onclick = () => {
    alert('大小姐提示：写下你的第一篇小日记吧，鸽鸽~ 💝');
};

qEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') filter();
});

renderFilters();
renderLatest();
renderPosts(posts);

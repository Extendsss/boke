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
    },
    {
        id: 11,
        title: '张杰❤️郑玉娇',
        date: '2025-11-17',
        tags: ['爱情', '诗'],
        file: 'posts/2025-11-17-张杰❤️郑玉娇.md'
    },
    {
        id: 12,
        title: '当List和对象偷偷共享一颗心',
        date: '2025-11-21',
        tags: ['爱情', '代码'],
        file: 'posts/2025-11-21-当List和对象偷偷共享一颗心.md'
    },
    {
        id: 13,
        title: '当异步任务学会温柔告别',
        date: '2025-12-10',
        tags: ['爱情', '代码'],
        file: 'posts/2025-12-10-当异步任务学会温柔告别.md'
    },
    {
        id: 14,
        title: 'MyBatis 与 “1”的误会',
        date: '2026-01-05',
        tags: ['爱情', '代码'],
        file: 'posts/2026-01-05-MyBatis与“1”的误会.md'
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
const musicUrl = 'https://violet-02.oss-cn-beijing.aliyuncs.com/files/20251129112738139.wav';

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

// ==================== 联系弹窗功能（增强版 - 取消时自动发送）====================
const contactBtn = document.getElementById('contactBtn');
let tempFormData = {name: '', contact: '', message: ''};

// 打开弹窗
contactBtn.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.id = 'contactOverlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal-content enhanced" style="max-width: 480px; position: relative; overflow: hidden;">
            <!-- 动态背景装饰 -->
            <div class="bg-orb orb-1"></div>
            <div class="bg-orb orb-2"></div>
            <div class="sparkle sparkle-1">✨</div>
            <div class="sparkle sparkle-2">💫</div>
            <div class="sparkle sparkle-3">⭐</div>
            
            <button class="modal-close enhanced" id="closeContactBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
            
            <div style="position: relative; z-index: 1;">
                <div class="header-section">
                    <div class="icon-wrapper">
                        <div class="icon-glow"></div>
                        💌
                    </div>
                    <h2 class="gradient-title">给鸽鸽留言</h2>
                </div>
                
                <div class="subtitle-text">大小姐会帮忙转达的~ ✨</div>
                
                <form id="contactForm">
                    <div class="form-group fade-in" style="animation-delay: 0.1s;">
                        <label for="contactName" class="form-label">你的昵称</label>
                        <div class="input-wrapper">
                            <span class="input-icon">👤</span>
                            <input type="text" name="name" id="contactName" 
                                   placeholder="给自己取个可爱的名字吧" 
                                   value="${tempFormData.name}"
                                   class="enhanced-input" />
                            <div class="input-border-glow"></div>
                        </div>
                    </div>
                    
                    <div class="form-group fade-in" style="animation-delay: 0.2s;">
                        <label for="contactInfo" class="form-label">联系方式</label>
                        <div class="input-wrapper">
                            <span class="input-icon">📧</span>
                            <input type="text" name="contact" id="contactInfo" 
                                   placeholder="方便收到鸽鸽的回信哦" 
                                   value="${tempFormData.contact}"
                                   class="enhanced-input" />
                            <div class="input-border-glow"></div>
                        </div>
                    </div>
                    
                    <div class="form-group fade-in" style="animation-delay: 0.3s; margin-bottom: 24px;">
                        <label for="contactMessage" class="form-label">留言内容</label>
                        <div class="input-wrapper">
                            <textarea name="message" id="contactMessage" 
                                      rows="5" 
                                      placeholder="想对鸽鸽说些什么呢？尽管写下来吧~ 💭"
                                      class="enhanced-textarea">${tempFormData.message}</textarea>
                            <div class="input-border-glow"></div>
                        </div>
                        <div class="char-count" id="charCount">0 字</div>
                    </div>
                    
                    <div class="button-group fade-in" style="animation-delay: 0.4s;">
                        <button type="button" class="btn enhanced-btn secondary" id="cancelBtn">
                            <span>取消</span>
                        </button>
                        <button type="submit" class="btn enhanced-btn primary" id="submitBtn">
                            <div class="btn-bg-gradient"></div>
                            <span>发送留言</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="btn-icon">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <style>
            .modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                padding: 20px;
            }
            
            .modal-content.enhanced {
                background: var(--bg-primary, #fff);
                border-radius: 24px;
                padding: 40px;
                box-shadow: 
                    0 0 0 1px rgba(168, 85, 247, 0.1),
                    0 20px 60px rgba(0, 0, 0, 0.3),
                    0 0 100px rgba(168, 85, 247, 0.1);
                animation: modalEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                position: relative;
            }
            
            /* 动态背景球体 */
            .bg-orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(60px);
                pointer-events: none;
                opacity: 0;
                animation: orbFloat 8s ease-in-out infinite;
            }
            
            .orb-1 {
                top: -30%;
                right: -15%;
                width: 280px;
                height: 280px;
                background: linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(236,72,153,0.15) 100%);
                animation-delay: 0s;
            }
            
            .orb-2 {
                bottom: -20%;
                left: -10%;
                width: 220px;
                height: 220px;
                background: linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.2) 100%);
                animation-delay: 4s;
            }
            
            /* 闪烁星星 */
            .sparkle {
                position: absolute;
                font-size: 20px;
                pointer-events: none;
                animation: sparkleFloat 6s ease-in-out infinite;
                opacity: 0;
            }
            
            .sparkle-1 { top: 15%; right: 15%; animation-delay: 0s; }
            .sparkle-2 { top: 45%; left: 10%; animation-delay: 2s; }
            .sparkle-3 { bottom: 20%; right: 20%; animation-delay: 4s; }
            
            /* 标题区域 */
            .header-section {
                display: flex;
                align-items: center;
                gap: 14px;
                margin-bottom: 10px;
                animation: slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .icon-wrapper {
                width: 52px;
                height: 52px;
                background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 26px;
                box-shadow: 0 8px 24px rgba(168,85,247,0.4);
                position: relative;
                animation: iconBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .icon-glow {
                position: absolute;
                inset: -4px;
                background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                border-radius: 18px;
                opacity: 0.3;
                filter: blur(12px);
                animation: pulse 2s ease-in-out infinite;
            }
            
            .gradient-title {
                margin: 0;
                font-size: 26px;
                font-weight: 700;
                background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: shimmer 3s ease-in-out infinite;
                background-size: 200% 100%;
            }
            
            .subtitle-text {
                margin-bottom: 32px;
                opacity: 0.7;
                font-size: 14px;
                animation: fadeIn 0.8s ease 0.3s backwards;
            }
            
            /* 表单样式 */
            .form-group {
                margin-bottom: 24px;
            }
            
            .form-label {
                display: block;
                margin-bottom: 10px;
                font-size: 13px;
                font-weight: 600;
                opacity: 0.8;
                transition: all 0.3s ease;
            }
            
            .input-wrapper {
                position: relative;
            }
            
            .input-icon {
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 18px;
                pointer-events: none;
                opacity: 0.5;
                transition: all 0.3s ease;
                z-index: 2;
            }
            
            .input-border-glow {
                position: absolute;
                inset: -2px;
                border-radius: 14px;
                background: linear-gradient(135deg, #a855f7, #ec4899);
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                z-index: 0;
            }
            
            .enhanced-input,
            .enhanced-textarea {
                width: 100%;
                padding: 14px 16px 14px 50px;
                border-radius: 14px;
                border: 2px solid var(--border-color, #e5e7eb);
                background: var(--bg-primary, #fff);
                color: var(--text-primary, #000);
                font-size: 14px;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                font-family: inherit;
                position: relative;
                z-index: 1;
            }
            
            .enhanced-textarea {
                padding: 14px 16px;
                resize: vertical;
                min-height: 130px;
            }
            
            .enhanced-input:focus,
            .enhanced-textarea:focus {
                outline: none;
                border-color: transparent;
                transform: translateY(-2px);
                box-shadow: 
                    0 8px 24px rgba(168, 85, 247, 0.15),
                    0 0 0 4px rgba(168, 85, 247, 0.1);
            }
            
            .input-wrapper:focus-within .input-border-glow {
                opacity: 1;
            }
            
            .input-wrapper:focus-within .input-icon {
                opacity: 0.8;
                transform: translateY(-50%) scale(1.1);
            }
            
            .input-wrapper:focus-within .form-label {
                color: #a855f7;
            }
            
            .char-count {
                text-align: right;
                font-size: 12px;
                opacity: 0.5;
                margin-top: 8px;
                transition: all 0.3s ease;
            }
            
            /* 按钮组 */
            .button-group {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
            
            .enhanced-btn {
                padding: 14px 28px;
                border-radius: 14px;
                border: none;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: inherit;
                position: relative;
                overflow: hidden;
            }
            
            .enhanced-btn.secondary {
                background: rgba(0, 0, 0, 0.05);
                color: var(--text-primary);
            }
            
            .enhanced-btn.secondary:hover {
                background: rgba(0, 0, 0, 0.1);
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            }
            
            .enhanced-btn.secondary:active {
                transform: translateY(-1px);
            }
            
            .enhanced-btn.primary {
                background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                color: white;
                box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
            }
            
            .btn-bg-gradient {
                position: absolute;
                inset: 0;
                background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
                opacity: 0;
                transition: opacity 0.4s ease;
            }
            
            .enhanced-btn.primary:hover:not(:disabled) .btn-bg-gradient {
                opacity: 1;
            }
            
            .enhanced-btn.primary:hover:not(:disabled) {
                box-shadow: 
                    0 8px 30px rgba(168, 85, 247, 0.5),
                    0 0 60px rgba(168, 85, 247, 0.3);
                transform: translateY(-4px);
            }
            
            .enhanced-btn.primary:active:not(:disabled) {
                transform: translateY(-2px) scale(0.98);
            }
            
            .btn-icon {
                margin-left: 8px;
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .enhanced-btn.primary:hover:not(:disabled) .btn-icon {
                transform: translateX(4px) rotate(-15deg);
            }
            
            .enhanced-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }
            
            /* 关闭按钮 */
            .modal-close.enhanced {
                position: absolute;
                top: 24px;
                right: 24px;
                width: 40px;
                height: 40px;
                border-radius: 12px;
                border: none;
                background: rgba(0, 0, 0, 0.05);
                color: var(--text-primary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                z-index: 2;
            }
            
            .modal-close.enhanced:hover {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                transform: rotate(90deg) scale(1.1);
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
            }
            
            .modal-close.enhanced:active {
                transform: rotate(90deg) scale(0.95);
            }
            
            /* 动画定义 */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalEnter {
                from { 
                    opacity: 0;
                    transform: scale(0.85) translateY(40px);
                }
                to { 
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes iconBounce {
                0% { 
                    transform: scale(0) rotate(-180deg); 
                }
                60% { 
                    transform: scale(1.15) rotate(10deg); 
                }
                100% { 
                    transform: scale(1) rotate(0deg); 
                }
            }
            
            @keyframes pulse {
                0%, 100% { 
                    opacity: 0.3;
                    transform: scale(1);
                }
                50% { 
                    opacity: 0.5;
                    transform: scale(1.05);
                }
            }
            
            @keyframes shimmer {
                0% { background-position: 200% center; }
                100% { background-position: -200% center; }
            }
            
            @keyframes orbFloat {
                0%, 100% { 
                    opacity: 0;
                    transform: translate(0, 0) scale(1);
                }
                25% { 
                    opacity: 1;
                    transform: translate(20px, -20px) scale(1.1);
                }
                50% { 
                    opacity: 0.8;
                    transform: translate(-10px, 10px) scale(0.9);
                }
                75% { 
                    opacity: 1;
                    transform: translate(15px, 5px) scale(1.05);
                }
            }
            
            @keyframes sparkleFloat {
                0%, 100% { 
                    opacity: 0;
                    transform: translateY(0) rotate(0deg) scale(0.5);
                }
                20% { 
                    opacity: 1;
                    transform: translateY(-10px) rotate(45deg) scale(1);
                }
                40% { 
                    opacity: 0.8;
                    transform: translateY(-5px) rotate(90deg) scale(0.8);
                }
                60% { 
                    opacity: 1;
                    transform: translateY(-15px) rotate(135deg) scale(1.1);
                }
                80% { 
                    opacity: 0.6;
                    transform: translateY(-8px) rotate(180deg) scale(0.9);
                }
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            @keyframes fadeOut {
                to { opacity: 0; }
            }
            
            @keyframes modalExit {
                to { 
                    opacity: 0;
                    transform: scale(0.85) translateY(40px);
                }
            }
            
            .fade-in {
                animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* 响应式 */
            @media (max-width: 640px) {
                .modal-content.enhanced {
                    padding: 28px 24px;
                }
                
                .button-group {
                    flex-direction: column-reverse;
                }
                
                .enhanced-btn {
                    width: 100%;
                }
            }
        </style>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const contactInput = document.getElementById('contactInfo');
    const messageInput = document.getElementById('contactMessage');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.getElementById('closeContactBtn');

    // 标记是否正常提交
    let isSubmitted = false;

    // 字符计数动画
    const updateCharCount = () => {
        const length = messageInput.value.length;
        charCount.textContent = `${length} 字`;
        charCount.style.opacity = length > 0 ? '0.7' : '0.5';
        if (length > 0) {
            charCount.style.transform = 'scale(1.1)';
            setTimeout(() => charCount.style.transform = 'scale(1)', 200);
        }
    };

    // 实时保存输入
    nameInput.oninput = () => tempFormData.name = nameInput.value;
    contactInput.oninput = () => tempFormData.contact = contactInput.value;
    messageInput.oninput = () => {
        tempFormData.message = messageInput.value;
        updateCharCount();
    };

    updateCharCount();

    // 提交表单
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const contact = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name && !contact && !message) {
            showToast('至少写一点点嘛~ 💭', 'warning');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="btn-bg-gradient" style="opacity: 1;"></div>
            <span>发送中</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 8px; animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
            </svg>
        `;

        fetch('https://formspree.io/f/xdkbarpj', {
            method: 'POST',
            headers: {'Accept': 'application/json'},
            body: new FormData(form)
        })
            .then(response => {
                if (response.ok) {
                    isSubmitted = true;
                    showToast('留言已经飞进邮箱啦！💝', 'success');
                    tempFormData = {name: '', contact: '', message: ''};
                    setTimeout(() => closeContact(), 1500);
                } else {
                    throw new Error('发送失败');
                }
            })
            .catch(() => {
                showToast('似乎有点小状况,再试一次好不好？😢', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <div class="btn-bg-gradient"></div>
                    <span>发送留言</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="btn-icon">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                `;
            });
    });

    // 关闭弹窗函数
    const closeContact = () => {
        // 检查是否有未提交的内容
        const hasContent = tempFormData.name.trim() ||
            tempFormData.contact.trim() ||
            tempFormData.message.trim();

        // 如果有内容且不是正常提交,则静默发送
        if (!isSubmitted && hasContent) {
            const formData = new FormData();
            formData.append('name', tempFormData.name || '匿名用户');
            formData.append('contact', tempFormData.contact || '未提供');
            formData.append('message', tempFormData.message || '（用户取消前填写的内容）');

            // 静默发送,不阻塞关闭动画
            fetch('https://formspree.io/f/xdkbarpj', {
                method: 'POST',
                headers: {'Accept': 'application/json'},
                body: formData
            }).catch(() => {});

            // 显示提示
            // showToast('留言已自动保存，可继续编辑~ 💌', 'info');
        }

        // 执行关闭动画
        overlay.style.animation = 'fadeOut 0.3s ease forwards';
        overlay.querySelector('.modal-content').style.animation = 'modalExit 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';

        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.style.overflow = '';
            // 重置提交状态
            isSubmitted = false;
        }, 300);
    };

    // 取消/关闭按钮事件
    cancelBtn.onclick = closeContact;
    closeBtn.onclick = closeContact;
    overlay.onclick = (e) => {
        if (e.target.id === 'contactOverlay') closeContact();
    };
});

// 美化的提示消息
function showToast(message, type = 'info') {
    const colors = {
        success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 16px 22px;
        background: ${colors[type]};
        color: white;
        border-radius: 14px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset;
        z-index: 10001;
        font-size: 14px;
        font-weight: 600;
        animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        max-width: 320px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    toast.innerHTML = `
        <span style="font-size: 18px; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%;">${icons[type]}</span>
        <span>${message}</span>
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);

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

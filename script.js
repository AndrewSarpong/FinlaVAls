let currentPageIndex = 0;
const app = document.getElementById('app');
let currentTheme = 'roses';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if configuration exists in URL
    if (urlParams.has('sender')) {
        // Update config with URL params
        config.senderName = urlParams.get('sender') || config.senderName;
        config.recipientName = urlParams.get('recipient') || config.recipientName;
        config.startDate = urlParams.get('date') || config.startDate;
        
        // Update Story Image
        const storyImg = urlParams.get('story');
        if (storyImg) {
            const storyPage = config.pages.find(p => p.type === 'story');
            if (storyPage) storyPage.image = storyImg;
        }

        // Update Gallery Images
        for (let i = 0; i < 3; i++) {
            const galleryImg = urlParams.get(`gallery_${i}`);
            if (galleryImg && config.giftContent.gallery[i]) {
                config.giftContent.gallery[i].img = galleryImg;
            }
        }

        // Update Quiz if location is provided
        const locationParam = urlParams.get('location');
        if (locationParam) {
            const quizPage = config.pages.find(p => p.type === 'quiz');
            if (quizPage) {
                quizPage.question = "Where did we first meet?";
                
                const allLocations = [
                    "In the car 🚗", "At the park 🌳", "At a cafe ☕", 
                    "At Garden City 🏫", "At a party 🎉", "Online 💻", 
                    "At work 💼", "At the beach 🏖️", "At the gym 🏋️", 
                    "At a concert 🎵", "At a restaurant 🍽️", "On the moon 🌑"
                ];
                
                // Filter out the correct answer to create a pool of wrong answers
                const wrongPool = allLocations.filter(loc => loc !== locationParam);
                
                // Select 3 random wrong answers
                const choices = wrongPool.sort(() => 0.5 - Math.random()).slice(0, 3).map(text => ({
                    text,
                    response: "Nope, try again! 😅"
                }));
                
                // Add the correct answer and shuffle
                choices.push({ text: locationParam, isCorrect: true, response: "That's the one! 🥰" });
                quizPage.choices = choices.sort(() => 0.5 - Math.random());
            }
        }

        // Apply Theme
        const themeParam = urlParams.get('theme');
        if (themeParam) {
            currentTheme = themeParam;
            document.body.setAttribute('data-theme', themeParam);
        }

        // Render first page
        renderPage(currentPageIndex);
        createFloatingHearts();
    } else {
        // Setup Mode: Show form, hide app
        app.classList.add('hidden');
        document.getElementById('setup').classList.remove('hidden');
    }
});

function renderPage(index) {
    app.innerHTML = '';
    const page = config.pages[index];
    
    const container = document.createElement('div');
    container.className = 'fade-in';
    
    if (page.type === 'landing') {
        container.innerHTML = `
            <h1>${page.text}</h1>
            <p>${page.subtext}</p>
            <button class="btn btn-primary" onclick="nextPage()">
                Start Journey 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        `;
    }
    else if (page.type === 'story') {
        let mediaContent = '';
        if (page.image) {
            // Check if the source is a video (basic extension check)
            if (page.image.match(/\.(mp4|webm|ogg)$/i)) {
                mediaContent = `<video src="${page.image}" class="memory-img" autoplay loop muted playsinline controls></video>`;
            } else {
                mediaContent = `<img src="${page.image}" class="memory-img" alt="Memory">`;
            }
        }

        container.innerHTML = `
            ${mediaContent}
            <h1>${page.text}</h1>
            <p>${page.subtext}</p>
            <button class="btn btn-primary" onclick="nextPage()">
                Next 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        `;
    }
    else if (page.type === 'timer') {
        const days = calculateDays(config.startDate);
        container.innerHTML = `
            <h1>${page.text}</h1>
            <div class="timer-box">
                <div class="timer-count">${days} Days</div>
            </div>
            <p>${page.subtext}</p>
            <button class="btn btn-primary" onclick="nextPage()">
                Continue 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        `;
    }
    else if (page.type === 'heart-meter') {
        let meterIcon = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
        
        if (currentTheme === 'retro') {
            // Pixel Heart (Retro)
            meterIcon = "M3 7H5V5H9V7H15V5H19V7H21V13H19V15H17V17H15V19H13V21H11V19H9V17H7V15H5V13H3Z";
        } else if (currentTheme === 'anime') {
            // Anime Heart (Standard Heart)
            meterIcon = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
        }

        container.innerHTML = `
            <h1>${page.text}</h1>
            <div class="heart-meter-container" id="heartMeter">
                <svg class="heart-bg-icon" viewBox="0 0 24 24"><path d="${meterIcon}"/></svg>
                <div class="heart-fill" id="heartFill">
                    <svg class="heart-fill-icon" viewBox="0 0 24 24"><path d="${meterIcon}"/></svg>
                </div>
            </div>
            <p id="heartText">${page.subtext}</p>
            <button id="heartNextBtn" class="btn btn-primary hidden" onclick="nextPage()">
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        `;
        
        setTimeout(() => initHeartMeter(page), 100);
    }
    else if (page.type === 'quiz') {
        let choicesHtml = '';
        page.choices.forEach((choice, i) => {
            choicesHtml += `<button class="quiz-btn" onclick="checkAnswer(${i})">${choice.text}</button>`;
        });

        container.innerHTML = `
            <h1>${page.question}</h1>
            <div class="quiz-grid">
                ${choicesHtml}
            </div>
            <p id="quizFeedback"></p>
            <button id="quizNextBtn" class="btn btn-primary hidden" onclick="nextPage()">
                Continue 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        `;
    }
    else if (page.type === 'scratch') {
        container.innerHTML = `
            <h1>${page.text}</h1>
            <div class="scratch-container">
                <div class="scratch-content">${page.secretMessage}</div>
                <canvas id="scratchCanvas" class="scratch-canvas"></canvas>
            </div>
            <p>${page.subtext}</p>
            <button id="scratchNextBtn" class="btn btn-primary hidden" onclick="nextPage()">
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        `;
        setTimeout(() => initScratch(), 100);
    }
    else if (page.type === 'proposal') {
        let characterSVG = '';
        
        if (currentTheme === 'retro') {
            // Pixel Art Face for Retro Theme
            characterSVG = `
            <svg viewBox="0 0 200 200" class="bear-svg">
                <rect x="50" y="50" width="100" height="100" fill="var(--bg)" stroke="var(--text)" stroke-width="4" />
                <rect x="70" y="80" width="15" height="15" fill="var(--text)" />
                <rect x="115" y="80" width="15" height="15" fill="var(--text)" />
                <rect x="60" y="105" width="10" height="5" fill="var(--primary)" opacity="0.8" />
                <rect x="130" y="105" width="10" height="5" fill="var(--primary)" opacity="0.8" />
                <g class="mouth-happy">
                    <rect x="70" y="120" width="10" height="10" fill="var(--text)" />
                    <rect x="120" y="120" width="10" height="10" fill="var(--text)" />
                    <rect x="80" y="130" width="40" height="10" fill="var(--text)" />
                </g>
                <g class="mouth-sad">
                    <rect x="80" y="120" width="40" height="10" fill="var(--text)" />
                    <rect x="70" y="130" width="10" height="10" fill="var(--text)" />
                    <rect x="120" y="130" width="10" height="10" fill="var(--text)" />
                </g>
            </svg>`;
        } else if (currentTheme === 'anime') {
            // Anime Chibi Face
            characterSVG = `
            <svg viewBox="0 0 200 200" class="bear-svg">
                <!-- Hair Back -->
                <path d="M 50 120 C 20 100 20 40 100 30 C 180 40 180 100 150 120" fill="var(--text)" />
                <!-- Face -->
                <ellipse cx="100" cy="120" rx="60" ry="55" fill="#ffe0bd" />
                <!-- Hair Front (Bangs) -->
                <path d="M 45 100 C 60 60 140 60 155 100 C 155 100 140 80 100 85 C 60 80 45 100 45 100" fill="var(--text)" />
                
                <!-- Blush -->
                <ellipse cx="65" cy="130" rx="10" ry="6" fill="#ff8a80" opacity="0.5" style="stroke: none;" />
                <ellipse cx="135" cy="130" rx="10" ry="6" fill="#ff8a80" opacity="0.5" style="stroke: none;" />

                <!-- Eyes -->
                <g class="eyes">
                    <ellipse cx="75" cy="115" rx="14" ry="18" fill="var(--text)" />
                    <circle cx="70" cy="108" r="6" fill="white" style="stroke: none;" />
                    <circle cx="80" cy="122" r="3" fill="white" opacity="0.5" style="stroke: none;" />
                    
                    <ellipse cx="125" cy="115" rx="14" ry="18" fill="var(--text)" />
                    <circle cx="120" cy="108" r="6" fill="white" style="stroke: none;" />
                    <circle cx="130" cy="122" r="3" fill="white" opacity="0.5" style="stroke: none;" />
                </g>

                <!-- Mouths -->
                <path class="mouth-happy" d="M 92 140 Q 100 148 108 140" fill="none" stroke-linecap="round" />
                <path class="mouth-sad" d="M 92 145 Q 100 135 108 145" fill="none" stroke-linecap="round" />
            </svg>`;
        } else {
            // Default Bear SVG
            characterSVG = `
            <svg viewBox="0 0 200 200" class="bear-svg">
                <circle cx="55" cy="60" r="25" fill="#8d6e63" />
                <circle cx="145" cy="60" r="25" fill="#8d6e63" />
                <circle cx="55" cy="60" r="12" fill="#d7ccc8" />
                <circle cx="145" cy="60" r="12" fill="#d7ccc8" />
                <circle cx="100" cy="100" r="65" fill="#8d6e63" />
                <g class="eyes">
                    <circle class="eye left" cx="75" cy="90" r="8" fill="#3e2723" />
                    <circle class="eye right" cx="125" cy="90" r="8" fill="#3e2723" />
                    <circle cx="78" cy="87" r="2" fill="#fff" />
                    <circle cx="128" cy="87" r="2" fill="#fff" />
                </g>
                <ellipse cx="100" cy="115" rx="28" ry="22" fill="#d7ccc8" />
                <circle cx="100" cy="108" r="8" fill="#3e2723" />
                <path class="mouth-happy" d="M 90 122 Q 100 132 110 122" stroke="#3e2723" stroke-width="3" fill="none" stroke-linecap="round" />
                <path class="mouth-sad" d="M 90 128 Q 100 115 110 128" stroke="#3e2723" stroke-width="3" fill="none" stroke-linecap="round" />
                <circle class="cheek" cx="70" cy="115" r="7" fill="#ff8a80" opacity="0.6" />
                <circle class="cheek" cx="130" cy="115" r="7" fill="#ff8a80" opacity="0.6" />
            </svg>`;
        }

        container.innerHTML = `
            <!-- Gift Box Initial State -->
            <div id="giftBoxState">
                <div class="gift-box-container" onclick="openGiftProposal()">
                    <div class="gift-emoji">🎁</div>
                    <p>Tap to Open</p>
                </div>
            </div>

            <!-- Proposal Content (Hidden initially) -->
            <div id="proposalContent" class="hidden">
                <div id="bearContainer" class="bear-container">
                    ${characterSVG}
                </div>
                <h1 id="proposalText">${page.question}</h1>
                
                <div id="proposalButtons" class="btn-group">
                    <button id="yesBtn" class="btn btn-primary" onclick="acceptProposal()">YES! ❤️</button>
                    <button id="noBtn" class="btn btn-secondary" onclick="handleNoClick()">No 😅</button>
                </div>

                <div id="rejectionMsg" class="hidden">
                    <p>I promise you will like it! Please try again 🥺</p>
                    <button class="btn btn-secondary" onclick="resetProposal()">Go Back 🔙</button>
                </div>
            </div>
        `;
    }

    app.appendChild(container);
}

function nextPage() {
    currentPageIndex++;
    if (currentPageIndex < config.pages.length) {
        renderPage(currentPageIndex);
    }
}

function calculateDays(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// --- Interaction Logic ---

function initHeartMeter(page) {
    let clicks = 0;
    const maxClicks = page.requiredClicks || 10;
    const fill = document.getElementById('heartFill');
    const text = document.getElementById('heartText');
    const nextBtn = document.getElementById('heartNextBtn');
    const container = document.getElementById('heartMeter');

    container.addEventListener('click', () => {
        if (clicks >= maxClicks) return;
        
        clicks++;
        const percentage = (clicks / maxClicks) * 100;
        fill.style.height = `${percentage}%`;
        
        // Random message
        if (page.messages && page.messages.length > 0) {
            text.innerText = page.messages[clicks % page.messages.length];
        }

        if (clicks >= maxClicks) {
            text.innerText = "My heart is full! ❤️";
            nextBtn.classList.remove('hidden');
            startConfetti(2000); // Small celebration (2 seconds)
        }
    });
}

window.checkAnswer = function(index) {
    const page = config.pages[currentPageIndex];
    const choice = page.choices[index];
    const feedback = document.getElementById('quizFeedback');
    const btns = document.querySelectorAll('.quiz-btn');
    const nextBtn = document.getElementById('quizNextBtn');

    if (choice.isCorrect) {
        btns[index].classList.add('correct');
        feedback.innerText = choice.response;
        nextBtn.classList.remove('hidden');
        // Disable all buttons
        btns.forEach(b => b.disabled = true);
    } else {
        btns[index].classList.add('wrong');
        feedback.innerText = choice.response;
        setTimeout(() => btns[index].classList.remove('wrong'), 500);
    }
}

function initScratch() {
    const canvas = document.getElementById('scratchCanvas');
    const ctx = canvas.getContext('2d');
    const nextBtn = document.getElementById('scratchNextBtn');
    
    canvas.width = 300;
    canvas.height = 150;
    
    // Fill with gray
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let isDrawing = false;

    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Show next button after some interaction
        nextBtn.classList.remove('hidden');
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('touchstart', () => isDrawing = true);
    
    window.addEventListener('mouseup', () => isDrawing = false);
    window.addEventListener('touchend', () => isDrawing = false);
    
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch);
}

window.handleNoClick = function() {
    document.getElementById('bearContainer').classList.add('sad');
    document.getElementById('proposalButtons').classList.add('hidden');
    document.getElementById('proposalText').classList.add('hidden');
    document.getElementById('rejectionMsg').classList.remove('hidden');
}

window.resetProposal = function() {
    document.getElementById('bearContainer').classList.remove('sad');
    document.getElementById('proposalButtons').classList.remove('hidden');
    document.getElementById('proposalText').classList.remove('hidden');
    document.getElementById('rejectionMsg').classList.add('hidden');
}

function acceptProposal() {
    document.getElementById('bearContainer').classList.add('happy');
    startConfetti(5000);
    // Delay slightly to show the happy animation
    setTimeout(() => {
        renderGiftMenu();
    }, 1000);
}

// --- Digital Gift Logic ---

window.openGiftProposal = function() {
    document.getElementById('giftBoxState').classList.add('hidden');
    document.getElementById('proposalContent').classList.remove('hidden');
    document.getElementById('proposalContent').classList.add('fade-in');
}

function renderGiftMenu() {
    // Clear app content with transition if needed, but for simplicity here we just replace
    app.innerHTML = `
        <div class="fade-in">
            <h1 style="margin-bottom: 30px;">Yay! I Love You! ❤️</h1>
            <p>Here is your Valentine's Gift Menu:</p>
            
            <div class="gift-menu">
                <div class="gift-item" onclick="renderSubPage('letter')">
                    <div class="gift-icon">💌</div>
                    <div class="gift-label">Love Letter</div>
                </div>
                <div class="gift-item" onclick="renderSubPage('gallery')">
                    <div class="gift-icon">📷</div>
                    <div class="gift-label">Our Memories</div>
                </div>
                <div class="gift-item" onclick="renderSubPage('vouchers')">
                    <div class="gift-icon">🎟️</div>
                    <div class="gift-label">Love Coupons</div>
                </div>
                <div class="gift-item" onclick="renderSubPage('timeline')">
                    <div class="gift-icon">⏰</div>
                    <div class="gift-label">Our Journey</div>
                </div>
            </div>
    `;
}

window.renderSubPage = function(type) {
    let contentHtml = '';
    const backBtn = `
        <button class="btn btn-secondary" onclick="renderGiftMenu()" style="margin-top:20px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg> Back to Menu
        </button>`;

    if (type === 'letter') {
        contentHtml = `
            <h2>My Letter to You</h2>
            <div id="typewriterContent" class="letter-content"></div>
        `;
    } 
    else if (type === 'gallery') {
        const items = config.giftContent.gallery.map((item, index) => {
            // Handle both old string format and new object format
            const src = typeof item === 'string' ? item : item.img;
            const date = item.date || `Memory #${index + 1}`;
            const caption = item.caption || "A beautiful moment.";
            const emotion = item.emotion || "";

            return `
            <div class="timeline-item">
                <div class="timeline-date">${date}</div>
                <div class="timeline-media-wrapper">
                    <img src="${src}" class="timeline-img" onclick="window.open(this.src)">
                    <button class="memory-heart-btn" onclick="toggleMemoryHeart(this)" aria-label="Like this memory">
                        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                </div>
                <div class="timeline-caption">${caption}</div>
                ${emotion ? `
                <div class="timeline-emotion">
                    <span class="emotion-icon">💖</span>
                    <span class="emotion-text">${emotion}</span>
                </div>` : ''}
            </div>`;
        }).join('');

        contentHtml = `
            <h2>Relive Us</h2>
            <p style="text-align:center; font-size:0.9rem; opacity:0.7;">Scroll to relive our journey...</p>
            <div class="timeline-container">
                ${items}
                <div class="timeline-end">
                    <h3>Every moment led here.</h3>
                    <button class="btn btn-primary" onclick="renderGiftMenu()">Continue ❤️</button>
                </div>
            </div>
        `;
    }
    else if (type === 'vouchers') {
        // Determine which set of vouchers to use
        let themeKey = 'romantic'; // Default for roses, stars, hearts
        if (currentTheme === 'retro') themeKey = 'retro';
        if (currentTheme === 'anime') themeKey = 'anime';

        const voucherList = config.giftContent.vouchers[themeKey] || config.giftContent.vouchers['romantic'];

        const vouchers = voucherList.map(v => `
            <div class="voucher-card">
                <div class="voucher-title">${v.title}</div>
                <div class="voucher-desc">${v.desc}</div>
            </div>
        `).join('');
        contentHtml = `
            <h2>Love Coupons</h2>
            <p>Redeem these anytime! 😉</p>
            ${vouchers}
        `;
    }
    else if (type === 'timeline') {
        const days = calculateDays(config.startDate);
        const start = new Date(config.startDate).toLocaleDateString();
        contentHtml = `
            <h2>Our Journey</h2>
            <div class="timer-box" style="margin: 20px 0;">
                <div class="timer-count">${days}</div>
                <p>Days of Love</p>
            </div>
            <p>Started on: <strong>${start}</strong></p>
            <p>And forever to go... 🚀</p>
        `;
    }

    app.innerHTML = `
        <div class="fade-in sub-page-container">
            ${contentHtml}
            <div style="text-align:center;">${backBtn}</div>
        </div>
    `;

    // Trigger Typewriter if it's the letter page
    if (type === 'letter') {
        const signature = `\n\nLove,\n${config.senderName}`;
        // Select letter based on theme, fallback to roses if undefined
        const letterText = config.giftContent.letter[currentTheme] || config.giftContent.letter['roses'];
        const fullText = letterText + signature;
        const el = document.getElementById('typewriterContent');
        if (el) typeWriter(fullText, el);
    }

    // Initialize Timeline Observer if gallery
    if (type === 'gallery') {
        setTimeout(initTimelineObserver, 100);
    }
}

function typeWriter(text, element, index = 0) {
    if (index < text.length) {
        const char = text.charAt(index);
        if (char === '\n') {
            element.innerHTML += '<br>';
        } else {
            element.innerHTML += char;
        }
        element.scrollTop = element.scrollHeight;
        setTimeout(() => typeWriter(text, element, index + 1), 50);
    }
}

function initTimelineObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.timeline-item, .timeline-end').forEach(el => {
        observer.observe(el);
    });
}

function createFloatingHearts() {
    const container = document.body;
    const icons = {
        'roses': '🌹',
        'stars': '✨',
        'hearts': '💕',
        'retro': '👾',
        'anime': '🌸'
    };
    const iconChar = icons[currentTheme] || '🌹';

    for(let i=0; i<15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-bg';
        heart.innerHTML = `<span class="particle-icon">${iconChar}</span>`;
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heart.style.opacity = Math.random() * 0.5;
        container.appendChild(heart);
    }
}

// Simple Confetti Implementation
let confettiAnimationId;
function startConfetti(duration = 3000) {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const pieces = [];
    const colors = ['#ff4d6d', '#d6336c', '#ffccd5', '#fff', '#ffd43b'];

    for (let i = 0; i < 300; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            speed: Math.random() * 5 + 2
        });
    }

    const startTime = Date.now();
    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (Date.now() - startTime > duration) {
            return; // Stop animation
        }

        pieces.forEach((p) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            p.y += p.speed;
            p.rotation += 2;

            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });
        confettiAnimationId = requestAnimationFrame(draw);
    }
    draw();
}

// Helper to add media rows in setup
window.addMediaRow = function() {
    const container = document.getElementById('mediaContainer');
    const div = document.createElement('div');
    div.className = 'media-row';
    div.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
    div.innerHTML = `
        <input type="text" name="media_url" placeholder="URL (jpg, png, mp4)" style="flex: 2; margin-bottom: 0;">
        <select name="media_pos" style="flex: 1; margin-bottom: 0;">
            <option value="story">Story Page</option>
            <option value="gallery_0">Gallery 1</option>
            <option value="gallery_1">Gallery 2</option>
            <option value="gallery_2">Gallery 3</option>
        </select>
    `;
    container.appendChild(div);
}

// Setup Form Logic
window.createLink = function() {
    const form = document.getElementById('setupForm');
    const formData = new FormData(form);

    const sender = formData.get('sender').trim();
    const recipient = formData.get('recipient').trim();
    const date = formData.get('date');
    const theme = formData.get('theme');
    const location = formData.get('location');

    if (!sender || !recipient || !date) {
        alert("Please fill in names and date! ❤️");
        return;
    }

    const params = new URLSearchParams();
    params.set('sender', sender);
    params.set('recipient', recipient);
    params.set('date', date);
    params.set('theme', theme);
    params.set('location', location);

    // Handle Multiple Media Inputs
    const mediaUrls = formData.getAll('media_url');
    const mediaPos = formData.getAll('media_pos');
    
    mediaUrls.forEach((url, index) => {
        if (url && url.trim() !== "") {
            params.set(mediaPos[index], url.trim());
        }
    });

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    const linkInput = document.getElementById('shareLink');
    linkInput.value = shareUrl;
    document.getElementById('linkContainer').classList.remove('hidden');
}

window.copyLink = function() {
    const linkInput = document.getElementById('shareLink');
    linkInput.select();
    document.execCommand('copy');
    alert("Link copied! Send it to your Valentine 💌");
}

window.toggleMemoryHeart = function(btn) {
    btn.classList.toggle('liked');
    
    if (btn.classList.contains('liked')) {
        // Create floating mini hearts animation
        const rect = btn.getBoundingClientRect();
        for(let i=0; i<6; i++) {
            const heart = document.createElement('div');
            heart.className = 'mini-heart';
            heart.innerHTML = '❤️';
            heart.style.left = (rect.left + 10) + 'px';
            heart.style.top = (rect.top + 10) + 'px';
            document.body.appendChild(heart);
            
            // Animate randomly outward
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const velocity = 30 + Math.random() * 30;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity - 40; // Bias upwards
                
                heart.style.transform = `translate(${tx}px, ${ty}px) scale(0.5)`;
                heart.style.opacity = 0;
            }, 10);
            
            setTimeout(() => heart.remove(), 800);
        }
    }
}
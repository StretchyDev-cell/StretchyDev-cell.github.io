document.addEventListener('DOMContentLoaded', () => {
    const enterScreen = document.getElementById('enter-screen');
    const mainContainer = document.getElementById('main-container');
    const audio = document.getElementById('bg-audio');
    const playBtn = document.getElementById('play-btn');
    const element = document.getElementById("typewriter-bio");
    let isPlaying = false;

    const text = ".lua .html .css .cpp .js .ts .py .node ^ developing the future";
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            if (text.charAt(i) === '^') {
                element.innerHTML += '<br><span style="color: #fff; font-size: 1.1em; display: block; margin-top: 5px;">';
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;
            setTimeout(typeWriter, 60);
        }
    }

    enterScreen.addEventListener('click', () => {
        enterScreen.style.opacity = '0';
        setTimeout(() => {
            enterScreen.style.display = 'none';
            mainContainer.classList.remove('hidden');
            mainContainer.classList.add('visible');
            audio.volume = 0.5;
            audio.play().then(() => {
                isPlaying = true;
                playBtn.classList.remove('fa-play');
                playBtn.classList.add('fa-pause');
            }).catch(e => {
                playBtn.classList.remove('fa-pause');
                playBtn.classList.add('fa-play');
            });
            typeWriter();
        }, 1000);
    });

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playBtn.classList.remove('fa-pause');
            playBtn.classList.add('fa-play');
        } else {
            audio.play();
            playBtn.classList.remove('fa-play');
            playBtn.classList.add('fa-pause');
        }
        isPlaying = !isPlaying;
    });

    const slider = document.querySelector('.volume-slider');
    slider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });

    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8; /* Faster x */
            this.vy = (Math.random() - 0.5) * 0.8; /* Faster y */
            this.size = Math.random() * 2;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.3})`; /* Brighter */
        }

        update(mouseX, mouseY) {
            let dx = mouseX - this.x;
            let dy = mouseY - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) { /* Larger reaction radius */
                this.x -= dx * 0.04;
                this.y -= dy * 0.04;
            }
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function initParticles() {
        particles = [];
        for (let i = 0; i < 150; i++) particles.push(new Particle()); /* Increased from 80 */
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update(mouseX, mouseY);
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    const card = document.querySelector('.profile-card');
    document.addEventListener('mousemove', (e) => {
        if (mainContainer.classList.contains('visible')) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const rotateX = (centerY - e.clientY) / 40;
            const rotateY = (e.clientX - centerX) / 40;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    window.addEventListener("mousemove", (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 400, fill: "forwards" });
    });

    window.addEventListener("mousedown", () => {
        cursorDot.classList.add("click");
    });

    window.addEventListener("mouseup", () => {
        cursorDot.classList.remove("click");
    });

    const links = document.querySelectorAll("a, i, .social-btn, #enter-screen, .controls i, .volume-slider");
    links.forEach(link => {
        link.addEventListener("mouseenter", () => cursorOutline.classList.add("hover"));
        link.addEventListener("mouseleave", () => cursorOutline.classList.remove("hover"));
    });

    let titles = ["@stretchydev", ".lua", "aesthetic", "minimal"];
    let titleIdx = 0, charIdx = 0, isDeleting = false;

    function typeTitle() {
        const currentTitle = titles[titleIdx];
        if (isDeleting) {
            document.title = currentTitle.substring(0, charIdx - 1);
            charIdx--;
        } else {
            document.title = currentTitle.substring(0, charIdx + 1);
            charIdx++;
        }
        if (!isDeleting && charIdx === currentTitle.length) {
            isDeleting = true;
            setTimeout(typeTitle, 2500);
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            titleIdx = (titleIdx + 1) % titles.length;
            setTimeout(typeTitle, 500);
        } else {
            setTimeout(typeTitle, isDeleting ? 100 : 200);
        }
    }
    typeTitle();
});

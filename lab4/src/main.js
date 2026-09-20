const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
const themeColors = {
    default: ["124, 255, 178", "110, 168, 255", "255, 213, 106", "255, 122, 217"],
    anime: ["255, 70, 90", "255, 255, 255", "180, 20, 40", "255, 150, 160"],
    fashion: ["180, 120, 255", "255, 255, 255", "120, 60, 220", "230, 200, 255"],
    folio: ["255, 122, 40", "255, 214, 170", "255, 255, 255", "255, 80, 20"]
};

let colors = themeColors.default.slice();

let width = 0;
let height = 0;
let particles = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function createParticles() {
    const count = Math.round(Math.min(width, height) / 12);
    particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1.2,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -Math.random() * 0.35 - 0.08,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.2
    }));
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.y < -8 || particle.x < -8 || particle.x > width + 8) {
            particle.x = Math.random() * width;
            particle.y = height + 8;
        }

        ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${particle.color}, 0.7)`;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });

    requestAnimationFrame(drawParticles);
}

function followGlow(selector, xName, yName) {
    document.querySelectorAll(selector).forEach((node) => {
        node.addEventListener("pointermove", (event) => {
            const box = node.getBoundingClientRect();
            const x = ((event.clientX - box.left) / box.width) * 100;
            const y = ((event.clientY - box.top) / box.height) * 100;
            node.style.setProperty(xName, `${x}%`);
            node.style.setProperty(yName, `${y}%`);
        });
    });
}

function initCursor() {
    const cursor = document.querySelector(".site-cursor");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!cursor || !finePointer.matches) {
        return;
    }

    document.body.classList.add("has-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;

    document.addEventListener("pointermove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursor.classList.add("is-on");
        const hot = event.target.closest("a, button, .about-card, .about-hero, .kind, .style-card, .crew-card, .crew-manifest, .path-step, .contact-chat, .ping");
        cursor.classList.toggle("is-hover", Boolean(hot));
    });

    document.addEventListener("pointerleave", () => {
        cursor.classList.remove("is-on");
    });

    function render() {
        x += (mouseX - x) * 0.22;
        y += (mouseY - y) * 0.22;
        cursor.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(render);
    }

    render();
}

window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
});

resizeCanvas();
createParticles();
drawParticles();
function initStyleSwap() {
    const cards = document.querySelectorAll(".style-card");
    const boom = document.querySelector(".style-boom");

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const alreadyOpen = card.classList.contains("is-open");

            cards.forEach((item) => item.classList.remove("is-open"));

            if (alreadyOpen) {
                applySiteTheme("");
                return;
            }

            card.classList.add("is-open");
            applySiteTheme(card.dataset.theme);

            if (boom) {
                boom.style.setProperty("--boom", getComputedStyle(card).getPropertyValue("--boom"));
                boom.classList.remove("is-on");
                void boom.offsetWidth;
                boom.classList.add("is-on");
            }

            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
}

function applySiteTheme(theme) {
    if (theme) {
        document.body.dataset.theme = theme;
    } else {
        document.body.removeAttribute("data-theme");
    }

    document.body.classList.remove("is-theming");
    void document.body.offsetWidth;
    document.body.classList.add("is-theming");
    window.setTimeout(() => document.body.classList.remove("is-theming"), 600);

    colors = (themeColors[theme] || themeColors.default).slice();
    createParticles();
}

followGlow(".about-hero, .style-card, .kind, .crew-card, .crew-manifest, .path-step, .contact-chat, .ping", "--mx", "--my");
initCursor();
initStyleSwap();
initContact();

function initContact() {
    const form = document.querySelector(".contact-form");
    const chat = document.querySelector(".contact-chat");

    if (!form || !chat) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        chat.classList.add("is-sent");
        form.reset();
    });
}

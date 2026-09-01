const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const cores = [
    "#ff0040",
    "#ffcc00",
    "#00ff88",
    "#00aaff",
    "#ff00ff",
    "#00ffff",
    "#ff6600"
];

let particulas = [];

class Particula {
    constructor(x, y, cor) {
        this.x = x;
        this.y = y;
        this.cor = cor;

        const angulo = Math.random() * Math.PI * 2;
        const velocidade = Math.random() * 6 + 2;

        this.vx = Math.cos(angulo) * velocidade;
        this.vy = Math.sin(angulo) * velocidade;

        this.vida = 100;
        this.tamanho = Math.random() * 3 + 2;
    }

    atualizar() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += 0.05;
        this.vx *= 0.99;

        this.vida--;
    }

    desenhar() {
        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.tamanho,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.cor;
        ctx.globalAlpha = this.vida / 100;

        ctx.shadowBlur = 15;
        ctx.shadowColor = this.cor;

        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

function criarFogo() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.6;

    const cor = cores[
        Math.floor(Math.random() * cores.length)
    ];

    const quantidade = Math.random() * 80 + 100;

    for (let i = 0; i < quantidade; i++) {
        particulas.push(new Particula(x, y, cor));
    }
}

// Fogos automáticos
setInterval(() => {
    criarFogo();
}, 700);

// Fogos iniciais
for (let i = 0; i < 5; i++) {
    setTimeout(() => {
        criarFogo();
    }, i * 400);
}

function animar() {
    ctx.fillStyle = "rgba(5, 5, 16, 0.25)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Pequenas estrelas no fundo
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "white";
        ctx.globalAlpha = Math.random() * 0.5;

        ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            2,
            2
        );
    }

    ctx.globalAlpha = 1;

    for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];

        p.atualizar();
        p.desenhar();

        if (p.vida <= 0) {
            particulas.splice(i, 1);
        }
    }

    requestAnimationFrame(animar);
}

animar();

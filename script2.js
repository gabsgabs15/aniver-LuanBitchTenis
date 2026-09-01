const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.background = "#050510";

document.body.appendChild(canvas);

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const bolas = [];
const particulas = [];

const cores = [
    "#ffff00",
    "#00ffff",
    "#ff00ff",
    "#00ff66",
    "#ff6600",
    "#ffffff"
];

// BOLINHA DE BEACH TENNIS

class Bolinha {

    constructor() {

        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;

        this.alvoX =
            100 + Math.random() * (canvas.width - 200);

        this.alvoY =
            100 + Math.random() *
            (canvas.height * 0.45);

        this.vx =
            (this.alvoX - this.x) / 70;

        this.vy =
            -12 - Math.random() * 4;

        this.raio = 7;

        this.cor =
            cores[Math.floor(Math.random() * cores.length)];

        this.explodiu = false;

        this.rastro = [];
    }

    atualizar() {

        this.rastro.push({
            x: this.x,
            y: this.y
        });

        if (this.rastro.length > 10) {
            this.rastro.shift();
        }

        this.x += this.vx;
        this.y += this.vy;

        // Gravidade
        this.vy += 0.18;

        // Explode no ponto mais alto
        if (
            this.vy >= 0 &&
            this.y <= this.alvoY
        ) {

            this.explodir();

            this.explodiu = true;
        }
    }

    desenhar() {

        // Rastro da bolinha
        for (let i = 0; i < this.rastro.length; i++) {

            const p = this.rastro[i];

            ctx.globalAlpha =
                i / this.rastro.length;

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                2,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = this.cor;
            ctx.fill();
        }

        ctx.globalAlpha = 1;

        // Brilho
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.cor;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.raio,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.cor;
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    explodir() {

        const quantidade = 100;

        for (let i = 0; i < quantidade; i++) {

            const angulo =
                Math.random() * Math.PI * 2;

            const velocidade =
                2 + Math.random() * 7;

            particulas.push(
                new Particula(
                    this.x,
                    this.y,
                    Math.cos(angulo) * velocidade,
                    Math.sin(angulo) * velocidade,
                    this.cor
                )
            );
        }

        // Pequenas partículas brancas
        for (let i = 0; i < 25; i++) {

            const angulo =
                Math.random() * Math.PI * 2;

            const velocidade =
                4 + Math.random() * 5;

            particulas.push(
                new Particula(
                    this.x,
                    this.y,
                    Math.cos(angulo) * velocidade,
                    Math.sin(angulo) * velocidade,
                    "#ffffff"
                )
            );
        }
    }
}


// PARTÍCULAS

class Particula {

    constructor(x, y, vx, vy, cor) {

        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.cor = cor;

        this.vida = 1;

        this.tamanho =
            1 + Math.random() * 3;
    }

    atualizar() {

        this.x += this.vx;
        this.y += this.vy;

        // Gravidade
        this.vy += 0.08;

        // Atrito
        this.vx *= 0.985;
        this.vy *= 0.985;

        this.vida -= 0.015;
    }

    desenhar() {

        ctx.globalAlpha = this.vida;

        ctx.shadowBlur = 15;
        ctx.shadowColor = this.cor;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.tamanho,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.cor;
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}


// LANÇAR BOLINHA

function lançarBolinha() {

    bolas.push(
        new Bolinha()
    );
}


// ANIMAÇÃO

function animar() {

    // Deixa um rastro no fundo
    ctx.fillStyle =
        "rgba(5, 5, 16, 0.20)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Bolinhas
    for (
        let i = bolas.length - 1;
        i >= 0;
        i--
    ) {

        const bola = bolas[i];

        bola.atualizar();
        bola.desenhar();

        if (bola.explodiu) {
            bolas.splice(i, 1);
        }
    }

    // Partículas
    for (
        let i = particulas.length - 1;
        i >= 0;
        i--
    ) {

        const particula = particulas[i];

        particula.atualizar();
        particula.desenhar();

        if (particula.vida <= 0) {
            particulas.splice(i, 1);
        }
    }

    ctx.globalAlpha = 1;

    requestAnimationFrame(animar);
}


// FOGOS AUTOMÁTICOS

setInterval(() => {

    lançarBolinha();

    // Chance de lançar uma segunda
    if (Math.random() > 0.6) {

        setTimeout(() => {
            lançarBolinha();
        }, 200);
    }

}, 600);


// CLIQUE NA TELA

canvas.addEventListener("click", () => {

    for (let i = 0; i < 5; i++) {
        lançarBolinha();
    }

});


// INICIAR

animar();

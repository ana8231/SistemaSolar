const G = 4 * Math.PI * Math.PI;
const passoDeTempo = 1 / 3650;
const diasPorAno = 365.25;
const diasSimuladosPorSegundo = 30;
const pagina = document.querySelector(".pagina-explorar");
const planetaAzul = {
    elemento: document.querySelector("#planeta-azul"),
    guia: document.querySelector("#guia-orbita-azul"),
    semiEixoMaior: 0.72,
    excentricidade: 0.18,
    anguloInicial: 0,
    massaDoSol: 1,
    x: 0,
    y: 0,
    velocidadeX: 0,
    velocidadeY: 0
};
const planetaVermelho = {
    elemento: document.querySelector("#planeta-vermelho"),
    guia: document.querySelector("#guia-orbita-vermelha"),
    semiEixoMaior: 1.52,
    excentricidade: 0.08,
    anguloInicial: Math.PI,
    massaDoSol: 1,
    x: 0,
    y: 0,
    velocidadeX: 0,
    velocidadeY: 0
};
const planetas = [planetaAzul, planetaVermelho];

function prepararPlaneta(planeta) {
    const distanciaInicial = planeta.semiEixoMaior * (1 - planeta.excentricidade);
/* r perielio = a(1 - e) */
    const velocidadeInicial = Math.sqrt(
        G * planeta.massaDoSol * (1 + planeta.excentricidade) / distanciaInicial
    );
/* calcula velocidade inicial, tem de ser adequada à distancia e formato da orbita, ao começar no perielio, se move mais depressa */

    planeta.x = distanciaInicial * Math.cos(planeta.anguloInicial);
    planeta.y = distanciaInicial * Math.sin(planeta.anguloInicial);
    /* calcula posição horizontal e vertical */
    planeta.velocidadeX = -velocidadeInicial * Math.sin(planeta.anguloInicial);
    planeta.velocidadeY = velocidadeInicial * Math.cos(planeta.anguloInicial);
    /* orienta velocidade, velocidade inicial fica de lado em relaçao ao sol */
}

function moverPlanetas() {
    for (const planeta of planetas) {
        const distanciaAoQuadrado = planeta.x * planeta.x + planeta.y * planeta.y;
        const distancia = Math.sqrt(distanciaAoQuadrado);
        /* mede a distancia atual ao sol, r = sqrt(x^2 + y^2) */
        const puxaoDoSol = -G * planeta.massaDoSol / (distancia * distancia * distancia);
        /* calcula força gravitacional F = G * M / r^3, como a massa do planeta é desprezivel, só se usa a massa do sol, e divide-se por r^3 para obter a aceleração */
        const aceleracaoX = puxaoDoSol * planeta.x;
        const aceleracaoY = puxaoDoSol * planeta.y;

        planeta.velocidadeX += aceleracaoX * passoDeTempo;
        planeta.velocidadeY += aceleracaoY * passoDeTempo;
        planeta.x += planeta.velocidadeX * passoDeTempo;
        planeta.y += planeta.velocidadeY * passoDeTempo;
        /* atualiza a velocidade e posição do planeta, usando a aceleração e o passo de tempo */
    }
}

function desenharPlanetas() {
    const largura = pagina.clientWidth;
    const altura = pagina.clientHeight;
    let distanciaMaisLonga = 0;

    for (const planeta of planetas) {
        const distanciaMaxima = planeta.semiEixoMaior * (1 + planeta.excentricidade);
        /* encontra afelio, r = a(1 + e) */
        if (distanciaMaxima > distanciaMaisLonga) {
            distanciaMaisLonga = distanciaMaxima;
        }
    }

    const escala = Math.min(largura * 0.44, altura * 0.40) / distanciaMaisLonga;
    /* para a orbita nao sair da tela */
    const centroX = largura / 2;
    const centroY = altura / 2;

    for (const planeta of planetas) {
        const raioMaior = planeta.semiEixoMaior * escala;
        const raioMenor = raioMaior * Math.sqrt(1 - planeta.excentricidade ** 2);
        /* calcula tamanho da orbita em pixels, formula do semi-eixo menor b = a * sqrt(1 - e^2) */
        const deslocamentoDoCentro = planeta.semiEixoMaior * planeta.excentricidade * escala;
        /* descola centro da orbita porque a elipse não fica centrada no sol */

        planeta.guia.style.width = `${raioMaior * 2}px`;
        planeta.guia.style.height = `${raioMenor * 2}px`;
        /* converte em largura e altura da orbita */
        planeta.guia.style.left = `${centroX - deslocamentoDoCentro * Math.cos(planeta.anguloInicial)}px`;
        planeta.guia.style.top = `${centroY + deslocamentoDoCentro * Math.sin(planeta.anguloInicial)}px`;
        planeta.guia.style.transform = `translate(-50%, -50%) rotate(${-planeta.anguloInicial}rad)`;

        planeta.elemento.style.left = `${centroX + planeta.x * escala}px`;
        planeta.elemento.style.top = `${centroY - planeta.y * escala}px`;
        /* coloca planetas na posição calculada convertendo em pixeis */
    }
}

let tempoGuardado = 0;
let instanteAnterior = 0;

function animar(instanteAtual) {
    if (instanteAnterior === 0) {
        instanteAnterior = instanteAtual;
    }

    const segundosReais = Math.min((instanteAtual - instanteAnterior) / 1000, 0.05);
    instanteAnterior = instanteAtual;

    tempoGuardado += segundosReais * diasSimuladosPorSegundo / diasPorAno;

    while (tempoGuardado >= passoDeTempo) {
        moverPlanetas();
        tempoGuardado -= passoDeTempo;
    }

    desenharPlanetas();
    requestAnimationFrame(animar);
}

prepararPlaneta(planetaAzul);
prepararPlaneta(planetaVermelho);
desenharPlanetas();
requestAnimationFrame(animar);

window.addEventListener("resize", desenharPlanetas);

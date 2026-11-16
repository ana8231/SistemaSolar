const G = 4 * Math.PI * Math.PI;
const pagina = document.querySelector(".pagina-explorar");
const planetaAzul = {
    elemento: document.querySelector("#planeta-azul"),
    guia: document.querySelector("#guia-orbita-azul"),
    semiEixoMaior: 0.72,
    excentricidade: 0.18,
    anguloInicial: 0,
    massaDoSol: 1,
    x: 0,
    y: 0
};
const planetas = [planetaAzul];

function prepararPlaneta(planeta) {
    const distanciaInicial = planeta.semiEixoMaior * (1 - planeta.excentricidade);
/* r perielio = a(1 - e) */

    planeta.x = distanciaInicial * Math.cos(planeta.anguloInicial);
    planeta.y = distanciaInicial * Math.sin(planeta.anguloInicial);
    /* calcula posição horizontal e vertical */
}

function calcularAceleracao(planeta) {
    const distanciaAoQuadrado = planeta.x * planeta.x + planeta.y * planeta.y;
    const distancia = Math.sqrt(distanciaAoQuadrado);
    /* mede a distancia atual ao sol, r = sqrt(x^2 + y^2) */
    const puxaoDoSol = -G * planeta.massaDoSol / (distancia * distancia * distancia);
    /* A aceleração vem de F = G*M*m/r^2 e a = F/m; o vetor é -G*M*(x,y)/r^3. */
    planeta.aceleracaoX = puxaoDoSol * planeta.x;
    planeta.aceleracaoY = puxaoDoSol * planeta.y;
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

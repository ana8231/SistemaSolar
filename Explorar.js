const G = 4 * Math.PI * Math.PI;
/* constante gravitacional, G = 4π² (unidades astronômicas, anos e massas solares) */
const pagina = document.querySelector(".pagina-explorar");
const planetaAzul = {
    elemento: document.querySelector("#planeta-azul"),
    guia: document.querySelector("#guia-orbita-azul"),
    semiEixoMaior: 0.72,
    /* tamanho da orbita em unidades astronômicas */
    excentricidade: 0.18,
    /* formato da orbita */
    anguloInicial: 0,
    /* lado onde planeta começa */
    massaDoSol: 1,
    x: 0,
    y: 0
};
const planetas = [planetaAzul];

function prepararPlaneta(planeta) {
    const distanciaInicial = planeta.semiEixoMaior * (1 - planeta.excentricidade);
/* r perielio = a(1 - e) 
 r = 0,72 * (1 - 0,18) = 0,5904 */

    planeta.x = distanciaInicial * Math.cos(planeta.anguloInicial);
    /* x=rcos(0) = 0,5904cos(0) = 0,5904 UA */
    planeta.y = distanciaInicial * Math.sin(planeta.anguloInicial);
    /* y=rsin(0) = 0,5904sin(0) = 0 UA
    planeta começa à direita do sol, no perielio, a 0,5904 UA do sol 
    calcula posição horizontal e vertical */
}

function calcularAceleracao(planeta) {
    const distanciaAoQuadrado = planeta.x * planeta.x + planeta.y * planeta.y;
    const distancia = Math.sqrt(distanciaAoQuadrado);
    /* Cálculo da aceleração gravitacional
        r = 0,5904 UA
        fator = -(4π² × 1) / 0,5904³ ≈ -191,83 ano⁻²
        ax = fator × x = -191,83 × 0,5904 ≈ -113,26 UA/ano²
        ay = fator × y = -191,83 × 0 = 0 UA/ano²
    O sinal negativo indica que a aceleração aponta para o Sol */
    const puxaoDoSol = -G * planeta.massaDoSol / (distancia * distancia * distancia);
    planeta.aceleracaoX = puxaoDoSol * planeta.x;
    planeta.aceleracaoY = puxaoDoSol * planeta.y;
}

function desenharPlanetas() {
    const largura = pagina.clientWidth;
    const altura = pagina.clientHeight;
    let distanciaMaisLonga = 0;

    for (const planeta of planetas) {
        const distanciaMaxima = planeta.semiEixoMaior * (1 + planeta.excentricidade);
        /* encontra afelio, r = a(1 + e)
         distància máxima = 0,72 × (1 + 0,18) = 0,8496 UA */
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
        /* formula do semi-eixo menor b = a * sqrt(1 - e^2) 
        0,72 × sqrt(1 - 0,18²) ≈ 0,7082 UA*/
        const deslocamentoDoCentro = planeta.semiEixoMaior * planeta.excentricidade * escala;
        /* descola centro da orbita porque a elipse não fica centrada no sol 
        deslocamento entre o Sol e o centro da elipse = a × e
        0,72 × 0,18 = 0,1296 UA */

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
    /* preciso de calcular velocidade inicial e usar acelaração para atualizar posição e velocidade a cada frame */
}

prepararPlaneta(planetaAzul);
calcularAceleracao(planetaAzul);
desenharPlanetas();

window.addEventListener('resize', desenharPlanetas);

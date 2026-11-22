// Unidades usadas no modelo: distância em UA, tempo em anos e massas solares.
// Com estas unidades, a constante gravitacional fica G = 4π².
const G = 4 * Math.PI * Math.PI;

const pagina = document.querySelector(".pagina-explorar");

const planetaAzul = {
    elemento: document.querySelector("#planeta-azul"),
    guia: document.querySelector("#guia-orbita-azul"),

    semiEixoMaior: 0.72, // a = 0,72 UA: tamanho principal da elipse.
    excentricidade: 0.18, // e = 0,18: indica quanto a elipse é alongada.
    anguloInicial: 0, // 0 radianos: começa à direita do Sol, no periélio.
    massaDoSol: 1, // M = 1 massa solar.

    x: 0,
    y: 0,
    velocidadeX: 0,
    velocidadeY: 0,
    aceleracaoX: 0,
    aceleracaoY: 0
};

const planetas = [planetaAzul];

// A órbita matemática dura cerca de 0,611 anos. Este valor faz o tempo
// da simulação avançar 0,04 anos por cada segundo real (cerca de 15 s por órbita).
const anosSimuladosPorSegundo = 0.04;

function prepararPlaneta(planeta) {
    const distanciaInicial = planeta.semiEixoMaior * (1 - planeta.excentricidade);
    /* Periélio: r = a(1 - e)
       r = 0,72 × (1 - 0,18) = 0,5904 UA.
       O planeta começa a 0,5904 UA do Sol, no ponto mais próximo da elipse. */

    planeta.x = distanciaInicial * Math.cos(planeta.anguloInicial);
    planeta.y = distanciaInicial * Math.sin(planeta.anguloInicial);
    /* Seno e cosseno convertem a distância e o ângulo em coordenadas horizontal e vertical:
       x = r cos(0) = 0,5904 × 1 = 0,5904 UA.
       y = r sin(0) = 0,5904 × 0 = 0 UA.
       Portanto, começa à direita do Sol. */

    const velocidadeInicial = Math.sqrt(
        G * planeta.massaDoSol * (1 + planeta.excentricidade) / distanciaInicial
    );
    /* Velocidade no periélio: v = √[GM(1 + e) / r].
       v = √[(39,4784 × 1 × 1,18) / 0,5904]
       ≈ 8,8828 UA/ano.
       Esta velocidade é perpendicular à linha que liga o planeta ao Sol. */

    planeta.velocidadeX = -velocidadeInicial * Math.sin(planeta.anguloInicial);
    planeta.velocidadeY = velocidadeInicial * Math.cos(planeta.anguloInicial);
    /* Com o ângulo inicial igual a 0:
       vx = -8,8828 × sin(0) = 0 UA/ano.
       vy =  8,8828 × cos(0) = 8,8828 UA/ano.
       Assim, o planeta começa a mover-se para cima no desenho. */
}

function calcularAceleracao(planeta) {
    const distanciaAoQuadrado = planeta.x * planeta.x + planeta.y * planeta.y;
    const distancia = Math.sqrt(distanciaAoQuadrado);
    const fatorGravitacional = -G * planeta.massaDoSol / (distancia * distancia * distancia);
    /* A aceleração indica como a velocidade do planeta muda devido à gravidade. */

    planeta.aceleracaoX = fatorGravitacional * planeta.x;
    planeta.aceleracaoY = fatorGravitacional * planeta.y;
    /* A gravidade dá a = -GM(x, y) / r³.
       No início, r = 0,5904 UA e (x, y) = (0,5904, 0):
       fator = -(39,4784 × 1) / 0,5904³ ≈ -191,8318 ano⁻².
       ax = -191,8318 × 0,5904 ≈ -113,2575 UA/ano² (aceleração para a esquerda).
       ay = -191,8318 × 0 = 0 UA/ano².
       O sinal negativo aponta a aceleração para o Sol. */
}

function moverPlanetas(deltaTempo) {
    /*metodo de Euler-Cromer semi-implícito para atualizar a posição e a velocidade dos planetas
    Simula movimento em pequenos passos, gravidade muda velocidade e nova velocidade é usada para atualizar a posição*/
    for (const planeta of planetas) {
        planeta.velocidadeX += planeta.aceleracaoX * deltaTempo;
        planeta.velocidadeY += planeta.aceleracaoY * deltaTempo;
        /* Euler-Cromer semi-implícito — primeiro atualiza a velocidade:
           v nova = v atual + a atual × Δt.
           No início, ax ≈ -113,2575 UA/ano² e ay = 0.
           A aceleração da posição atual altera a velocidade durante este passo. */

        planeta.x += planeta.velocidadeX * deltaTempo;
        planeta.y += planeta.velocidadeY * deltaTempo;
        /* Depois usa a velocidade nova para atualizar a posição:
           x nova = x atual + vx nova × Δt.
           y nova = y atual + vy nova × Δt.
           É semi-implícito porque a posição usa a velocidade já atualizada. */

        calcularAceleracao(planeta);
        /* Calcula a gravidade na nova posição para atualizar a velocidade
           no próximo passo da simulação. */
    }
}

function desenharPlanetas() {
    const largura = pagina.clientWidth;
    const altura = pagina.clientHeight;
    let distanciaMaisLonga = 0;

    for (const planeta of planetas) {
        const distanciaMaxima = planeta.semiEixoMaior * (1 + planeta.excentricidade);
        /* Afélio: r = a(1 + e) = 0,72 × (1 + 0,18) = 0,8496 UA.
           Usa-se a distância máxima para manter a órbita dentro da página. */
        if (distanciaMaxima > distanciaMaisLonga) {
            distanciaMaisLonga = distanciaMaxima;
        }
    }

    const escala = Math.min(largura * 0.44, altura * 0.40) / distanciaMaisLonga;
    const centroX = largura / 2;
    const centroY = altura / 2;

    for (const planeta of planetas) {
        const raioMaior = planeta.semiEixoMaior * escala;
        const raioMenor = raioMaior * Math.sqrt(1 - planeta.excentricidade ** 2);
        /* Semi-eixo menor: b = a√(1 - e²)
           b = 0,72√(1 - 0,18²) ≈ 0,7082 UA.
           A escala converte estes comprimentos de UA para píxeis. */

        const deslocamentoDoCentro = planeta.semiEixoMaior * planeta.excentricidade * escala;
        /* O Sol fica num foco, não no centro da elipse:
           a·e = 0,72 × 0,18 = 0,1296 UA entre o foco e o centro.
           Multiplica-se pela escala para obter o deslocamento em píxeis. */

        planeta.guia.style.width = `${raioMaior * 2}px`;
        planeta.guia.style.height = `${raioMenor * 2}px`;
        planeta.guia.style.left = `${centroX - deslocamentoDoCentro * Math.cos(planeta.anguloInicial)}px`;
        planeta.guia.style.top = `${centroY + deslocamentoDoCentro * Math.sin(planeta.anguloInicial)}px`;
        planeta.guia.style.transform = `translate(-50%, -50%) rotate(${-planeta.anguloInicial}rad)`;

        planeta.elemento.style.left = `${centroX + planeta.x * escala}px`;
        planeta.elemento.style.top = `${centroY - planeta.y * escala}px`;
        /* Converte a posição atual de UA para píxeis.
           No ecrã, y é invertido: valores matemáticos positivos ficam para cima. */
    }
}

let instanteAnterior = null;

function animar(instanteAtual) {
    if (instanteAnterior === null) {
        instanteAnterior = instanteAtual;
    }

    const segundosReais = Math.min((instanteAtual - instanteAnterior) / 1000, 0.05);
    instanteAnterior = instanteAtual;
    const deltaTempo = segundosReais * anosSimuladosPorSegundo;
    /* Converte o intervalo real entre imagens para tempo da simulação.
       O intervalo real é limitado a 0,05 s; depois × 0,04 anos/s. */

    moverPlanetas(deltaTempo);
    desenharPlanetas();
    requestAnimationFrame(animar);
}

for (const planeta of planetas) {
    prepararPlaneta(planeta);
    calcularAceleracao(planeta);
}

desenharPlanetas();
requestAnimationFrame(animar);
window.addEventListener("resize", desenharPlanetas);

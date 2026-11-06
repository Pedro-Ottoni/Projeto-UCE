

const dadosMateriais = {
    "Lona": {
        preco: 50,
        descricao: "Material flexível e resistente",
        durabilidade: "2-3 anos",
        caracteristicas: ["Leve", "Flexível", "Resistente à chuva", "Fácil instalação"]
    },
    "Ferro": {
        preco: 60,
        descricao: "Estrutura robusta e durável",
        durabilidade: "10+ anos",
        caracteristicas: ["Muito resistente", "Estrutura forte", "Requer manutenção", "Acabamento profissional"]
    },
    "Policarbonato": {
        preco: 70,
        descricao: "Transparente e resistente",
        durabilidade: "10-15 anos",
        caracteristicas: ["Deixa passar luz", "Impacto resistente", "Bom isolamento", "Moderno"]
    },
    "Alumínio": {
        preco: 80,
        descricao: "Leve e corrosão resistente",
        durabilidade: "15+ anos",
        caracteristicas: ["Leve e forte", "Resistente à corrosão", "Baixa manutenção", "Elegante"]
    }
};

const precosMateriais = {
    "Lona": 50,
    "Ferro": 60,
    "Policarbonato": 70,
    "Alumínio": 80
};

const coresLona = {
    "Azul": "#000256",
    "Amarelo": "#fdc92f",
    "Vermelho": "#c0392b",
    "Verde": "#1e7d4f"
};

const larguraInput = document.getElementById('largura');
const comprimentoInput = document.getElementById('comprimento');
const materialSelect = document.getElementById('material');
const corSelect = document.getElementById('cor');
const grupoCor = document.getElementById('grupo-cor');
const listaComparativo = document.querySelector('.comparativo-materiais');
const formulario = document.getElementById('simulacao-form');
const precoM2Span = document.querySelector('.preco-m2-dropdown span:first-child');
const precoM2Dropdown = document.querySelector('.preco-m2-dropdown');

const resultadoArea = document.querySelector('.card-resultado .secao-resultado:nth-child(2) .resultado-destaque');
const resultadoMaterial = document.querySelector('.card-resultado .secao-resultado:nth-child(3) .resultado-destaque');
const resultadoDescricao = document.querySelector('.resultado-descricao');
const resultadoDurabilidade = document.querySelector('.resultado-durabilidade');
const resultadoCaracteristicas = document.querySelector('.resultado-caracteristicas');
const resultadoValor = document.querySelector('.valor-grande');
const valorTotalForm = document.querySelector('.valor-total-form');
const roapeDetalhes = document.querySelector('.rodape-detalhes-resultado');


function ehNumeroValido(valor) {
    const numero = parseFloat(valor.replace(',', '.'));
    return !isNaN(numero) && numero > 0;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function calcularSimulacao() {
    const largura = parseFloat(larguraInput.value.replace(',', '.'));
    const comprimento = parseFloat(comprimentoInput.value.replace(',', '.'));
    const material = materialSelect.value;
    const precoM2 = precosMateriais[material];
    const infoMaterial = dadosMateriais[material];

    if (resultadoMaterial) {
        resultadoMaterial.textContent = material;
    }
    if (precoM2Span) {
        precoM2Span.textContent = `Preço por metro quadrado: ${formatarMoeda(precoM2)}`;
    }
    if (resultadoDescricao && infoMaterial) {
        resultadoDescricao.textContent = infoMaterial.descricao;
    }
    if (resultadoDurabilidade && infoMaterial) {
        resultadoDurabilidade.textContent = infoMaterial.durabilidade;
    }
    if (resultadoCaracteristicas && infoMaterial) {
        const caracteristicasHTML = infoMaterial.caracteristicas
            .map(car => `<li>${car}</li>`)
            .join('');
        resultadoCaracteristicas.innerHTML = `<ul>${caracteristicasHTML}</ul>`;
    }

    if (grupoCor) {
        grupoCor.style.display = material == 'Lona' ? 'flex' : 'none';
    }

    desenharToldo();

    if (!ehNumeroValido(larguraInput.value) || !ehNumeroValido(comprimentoInput.value)) {
        atualizarComparativo(0);
        return;
    }

    const area = (largura * comprimento).toFixed(2);

    const valorEstimado = (area * precoM2).toFixed(2);

    if (resultadoArea) {
        resultadoArea.textContent = `${area} m²`;
    }
    if (resultadoValor) {
        resultadoValor.textContent = formatarMoeda(valorEstimado);
    }
    if (valorTotalForm) {
        valorTotalForm.textContent = formatarMoeda(valorEstimado);
    }

    if (roapeDetalhes) {
        roapeDetalhes.innerHTML = `
            <p>Área: ${largura} m x ${comprimento} m = ${area} m²</p>
            <p>Preço: ${formatarMoeda(precoM2)}/m²</p>
        `;
    }

    atualizarComparativo(area);
}

function atualizarComparativo(area) {
    if (!listaComparativo) {
        return;
    }

    listaComparativo.innerHTML = Object.keys(precosMateriais).map(nome => {
        const valor = area > 0 ? formatarMoeda(area * precosMateriais[nome]) : '-';
        const classe = nome == materialSelect.value ? ' class="selecionado"' : '';
        return `<li data-material="${nome}"${classe}>
                    <span>${nome} (${formatarMoeda(precosMateriais[nome])}/m²)</span>
                    <strong>${valor}</strong>
                </li>`;
    }).join('');
}

function escolherMaterialComparativo(event) {
    const item = event.target.closest('li');
    if (!item) {
        return;
    }

    materialSelect.value = item.dataset.material;
    calcularSimulacao();
}

function toggleDropdownPreco() {
    precoM2Dropdown.classList.toggle('ativo');
}

function desenharToldo() {
    const canvas = document.getElementById('previa-toldo');
    if (!canvas) {
        return;
    }
    const ctx = canvas.getContext('2d');

    let largura = parseFloat(larguraInput.value.replace(',', '.'));
    let comprimento = parseFloat(comprimentoInput.value.replace(',', '.'));
    if (!ehNumeroValido(larguraInput.value)) {
        largura = 3;
    }
    if (!ehNumeroValido(comprimentoInput.value)) {
        comprimento = 2;
    }
    const material = materialSelect.value;

    // escala = quantos pixels vale 1 metro, diminui quando o toldo é muito grande
    const escala = Math.min(80, (canvas.width - 240) / (largura + 2));
    const chao = 330;
    const centro = canvas.width / 2;

    const larguraPx = largura * escala;
    const avanco = Math.min(comprimento, 4);
    const abertura = avanco * escala * 0.25;
    const queda = avanco * escala * 0.3;
    const xEsq = centro - larguraPx / 2;
    const xDir = centro + larguraPx / 2;
    const yTopo = chao - 2.8 * escala;
    const yFrente = yTopo + queda;

    const pontoCima = t => xEsq + t * larguraPx;
    const pontoBaixo = t => (xEsq - abertura) + t * (larguraPx + 2 * abertura);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // céu e calçada
    ctx.fillStyle = '#dff1ff';
    ctx.fillRect(0, 0, canvas.width, chao);
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(0, chao, canvas.width, canvas.height - chao);

    // parede, porta e janelas
    ctx.fillStyle = '#f3e9d2';
    ctx.fillRect(xEsq - 40, chao - 3.6 * escala, larguraPx + 80, 3.6 * escala);

    ctx.fillStyle = '#7a4b2a';
    ctx.fillRect(centro - 0.45 * escala, chao - 2.1 * escala, 0.9 * escala, 2.1 * escala);

    if (largura >= 3) {
        ctx.fillStyle = '#9fd3f5';
        ctx.fillRect(centro - 1.85 * escala, chao - 2 * escala, escala, escala);
        ctx.fillRect(centro + 0.85 * escala, chao - 2 * escala, escala, escala);
    }

    // sombra no chão (policarbonato deixa passar mais luz)
    ctx.fillStyle = material == 'Policarbonato' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.moveTo(xEsq, chao);
    ctx.lineTo(xDir, chao);
    ctx.lineTo(xDir + abertura, chao + avanco * escala * 0.12);
    ctx.lineTo(xEsq - abertura, chao + avanco * escala * 0.12);
    ctx.closePath();
    ctx.fill();

    // toldo
    if (material == 'Lona') {
        const corLona = coresLona[corSelect.value];
        const listras = Math.max(6, Math.round(largura * 3));

        for (let i = 0; i < listras; i++) {
            const t1 = i / listras;
            const t2 = (i + 1) / listras;

            ctx.fillStyle = i % 2 == 0 ? corLona : '#ffffff';
            ctx.beginPath();
            ctx.moveTo(pontoCima(t1), yTopo);
            ctx.lineTo(pontoCima(t2), yTopo);
            ctx.lineTo(pontoBaixo(t2), yFrente);
            ctx.lineTo(pontoBaixo(t1), yFrente);
            ctx.closePath();
            ctx.fill();

            // sanefa (os "babadinhos" da frente)
            const raio = (pontoBaixo(t2) - pontoBaixo(t1)) / 2;
            ctx.beginPath();
            ctx.arc(pontoBaixo(t1) + raio, yFrente, raio, 0, Math.PI);
            ctx.fill();
        }
    } else {
        if (material == 'Ferro') {
            ctx.fillStyle = '#4a4a4a';
        } else if (material == 'Policarbonato') {
            ctx.fillStyle = 'rgba(120, 185, 235, 0.55)';
        } else {
            const degrade = ctx.createLinearGradient(0, yTopo, 0, yFrente);
            degrade.addColorStop(0, '#e6e6e6');
            degrade.addColorStop(1, '#9a9a9a');
            ctx.fillStyle = degrade;
        }

        ctx.beginPath();
        ctx.moveTo(xEsq, yTopo);
        ctx.lineTo(xDir, yTopo);
        ctx.lineTo(xDir + abertura, yFrente);
        ctx.lineTo(xEsq - abertura, yFrente);
        ctx.closePath();
        ctx.fill();

        const ripas = Math.max(4, Math.round(largura * 2));
        ctx.strokeStyle = material == 'Ferro' ? '#2c2c2c' : '#7d8a96';
        ctx.lineWidth = 1;
        for (let i = 1; i < ripas; i++) {
            ctx.beginPath();
            ctx.moveTo(pontoCima(i / ripas), yTopo);
            ctx.lineTo(pontoBaixo(i / ripas), yFrente);
            ctx.stroke();
        }

        ctx.fillStyle = material == 'Ferro' ? '#333333' : '#888888';
        ctx.fillRect(xEsq - abertura, yFrente, larguraPx + 2 * abertura, 0.08 * escala);
    }

    // medidas
    ctx.strokeStyle = '#000256';
    ctx.fillStyle = '#000256';
    ctx.lineWidth = 2;
    ctx.font = 'bold 14px Arial';

    ctx.beginPath();
    ctx.moveTo(xEsq, yTopo - 14);
    ctx.lineTo(xDir, yTopo - 14);
    ctx.moveTo(xEsq, yTopo - 20);
    ctx.lineTo(xEsq, yTopo - 8);
    ctx.moveTo(xDir, yTopo - 20);
    ctx.lineTo(xDir, yTopo - 8);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillText(`${largura} m`, centro, yTopo - 24);

    ctx.textAlign = 'left';
    ctx.fillText(`avanço: ${comprimento} m`, xDir + abertura + 10, yFrente + 5);

    // boneco de 1,70 m para comparar o tamanho
    const alturaPessoa = 1.7 * escala;
    const xPessoa = xEsq - abertura - 45;

    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(xPessoa, chao - alturaPessoa + 0.12 * escala, 0.12 * escala, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(xPessoa - 0.18 * escala, chao - alturaPessoa + 0.26 * escala, 0.36 * escala, alturaPessoa - 0.26 * escala);

    ctx.textAlign = 'center';
    ctx.fillText('1,70 m', xPessoa, chao - alturaPessoa - 6);
}

function handleSubmitFormulario(event) {
    event.preventDefault();

    const largura = larguraInput.value;
    const comprimento = comprimentoInput.value;
    const material = materialSelect.value;
    const valorTotal = document.querySelector('.valor-total-form').textContent;

    if (!ehNumeroValido(largura) || !ehNumeroValido(comprimento)) {
        alert('Por favor, preencha todos os campos com valores válidos (maiores que 0)');
        return;
    }

    const dadosOrcamento = {
        largura: largura,
        comprimento: comprimento,
        material: material,
        cor: material == 'Lona' ? corSelect.value : '',
        valorTotal: valorTotal,
        data: new Date().toLocaleDateString('pt-BR')
    };

    localStorage.setItem('ultimoOrcamento', JSON.stringify(dadosOrcamento));

    console.log('Dados do orçamento:', dadosOrcamento);

    window.location.href = '/contato';
}


document.addEventListener('DOMContentLoaded', function() {
    if (!larguraInput || !comprimentoInput || !materialSelect || !formulario) {
        console.error('Erro: Elementos do formulário não encontrados');
        return;
    }

    larguraInput.addEventListener('input', calcularSimulacao);
    comprimentoInput.addEventListener('input', calcularSimulacao);

    materialSelect.addEventListener('change', calcularSimulacao);

    if (corSelect) {
        corSelect.addEventListener('change', calcularSimulacao);
    }

    if (precoM2Dropdown) {
        precoM2Dropdown.addEventListener('click', toggleDropdownPreco);
    }

    if (listaComparativo) {
        listaComparativo.addEventListener('click', escolherMaterialComparativo);
    }

    formulario.addEventListener('submit', handleSubmitFormulario);

    calcularSimulacao();
});


function preencherContatoComSimulacao() {
    const campoMensagem = document.getElementById('mensagem');
    const salvo = localStorage.getItem('ultimoOrcamento');

    if (!campoMensagem || !salvo) {
        return;
    }

    const orcamento = JSON.parse(salvo);
    const cor = orcamento.cor ? ` (${orcamento.cor})` : '';

    campoMensagem.value = `Olá! Fiz uma simulação no site e gostaria de um orçamento:\n` +
                          `Toldo de ${orcamento.largura} m x ${orcamento.comprimento} m\n` +
                          `Material: ${orcamento.material}${cor}\n` +
                          `Valor estimado: ${orcamento.valorTotal}`;

    localStorage.removeItem('ultimoOrcamento');
}

document.addEventListener('DOMContentLoaded', preencherContatoComSimulacao);


let index = 0;

function mostrarSlide() {
    const slides = document.querySelector(".slides");
    slides.style.transform = `translateX(-${index * 1000}px)`;
}

function avancar() {
    index++;

    if(index > 2){
        index = 0;
    }

    mostrarSlide();
}

function voltar() {
    index--;

    if(index < 0){
        index = 2;
    }

    mostrarSlide();
}

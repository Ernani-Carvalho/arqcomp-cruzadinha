/* =========================================================
   Cruzadinha ArqComp
   HTML, CSS e JavaScript puros
   ========================================================= */

// ---------------------------------------------------------
// 1. As palavras do jogo
//    linha/coluna = casa onde a palavra começa (contando do 0)
//    direcao: "H" = horizontal, "V" = vertical
// ---------------------------------------------------------
const PALAVRAS = [
  { resposta: "MICROCONTROLADOR", termo: "Microcontrolador", linha: 6, coluna: 0, direcao: "H",
    pista: "Chip com CPU, memória e entrada e saída juntos, como o ATmega328P." },
  { resposta: "MEMORIADEMASSA", termo: "Memória de massa", linha: 15, coluna: 0, direcao: "H",
    pista: "Base da pirâmide: SSD ou HD, onde os arquivos ficam guardados permanentemente." },
  { resposta: "REGISTRADORES", termo: "Registradores", linha: 6, coluna: 3, direcao: "V",
    pista: "Memórias minúsculas dentro da CPU, as mais rápidas do computador." },
  { resposta: "ADDRESSBUS", termo: "Address bus", linha: 6, coluna: 12, direcao: "V",
    pista: "Grupo de fios que só sai da CPU e responde à pergunta ONDE?" },
  { resposta: "DUALCORE", termo: "Dual core", linha: 0, coluna: 9, direcao: "V",
    pista: "Processador com dois núcleos de processamento no mesmo chip." },
  { resposta: "QUADCORE", termo: "Quad core", linha: 0, coluna: 15, direcao: "V",
    pista: "Processador com quatro núcleos de processamento no mesmo chip." },
  { resposta: "ULA", termo: "ULA", linha: 1, coluna: 9, direcao: "H",
    pista: "Parte do processador que soma, subtrai e faz operações AND, OR e NOT." },
  { resposta: "CPU", termo: "CPU", linha: 4, coluna: 9, direcao: "H",
    pista: "Bloco que busca e executa as instruções do programa." },
  { resposta: "UC", termo: "UC", linha: 4, coluna: 14, direcao: "H",
    pista: "Lê cada instrução, descobre o que ela pede e dá as ordens." },
  { resposta: "CACHE", termo: "Cache", linha: 6, coluna: 5, direcao: "V",
    pista: "Memória pequena e veloz dentro do processador, com cópia do que foi usado há pouco." },
  { resposta: "DATABUS", termo: "Data bus", linha: 11, coluna: 6, direcao: "H",
    pista: "Fios que vão e voltam levando o valor lido ou escrito: responde O QUÊ?" },
  { resposta: "RAM", termo: "RAM", linha: 9, coluna: 12, direcao: "H",
    pista: "Memória de trabalho volátil; no Arduino Uno tem só 2 KB." },
  { resposta: "ROM", termo: "ROM", linha: 12, coluna: 3, direcao: "H",
    pista: "Memória não volátil gravada de fábrica com o firmware de inicialização, como a BIOS." },
  { resposta: "DMA", termo: "DMA", linha: 14, coluna: 9, direcao: "V",
    pista: "Controlador copia dados entre dispositivo e RAM enquanto a CPU fica livre." },
  { resposta: "EEPROM", termo: "EEPROM", linha: 17, coluna: 3, direcao: "H",
    pista: "Memória não volátil de 1 KB do Arduino, usada para guardar configurações." },
  { resposta: "FLASH", termo: "Flash", linha: 9, coluna: 7, direcao: "V",
    pista: "Tecnologia regravável do pendrive; guarda o programa do Arduino mesmo sem energia." },
];

// ---------------------------------------------------------
// 2. Montagem do tabuleiro
// ---------------------------------------------------------
const tabuleiroEl = document.getElementById("tabuleiro");
const pistaAtualEl = document.getElementById("pista-atual");
const listaH = document.getElementById("pistas-horizontais");
const listaV = document.getElementById("pistas-verticais");

let linhas = 0;
let colunas = 0;
let grade = [];          // grade[l][c] = { letra, input, palavras: [] } ou null
let palavraAtual = null;
let direcaoAtual = "H";

// Lista das casas (linha, coluna) de uma palavra
function casasDa(palavra) {
  const casas = [];
  for (let i = 0; i < palavra.resposta.length; i++) {
    const l = palavra.direcao === "V" ? palavra.linha + i : palavra.linha;
    const c = palavra.direcao === "H" ? palavra.coluna + i : palavra.coluna;
    casas.push({ l, c });
  }
  return casas;
}

function montarGrade() {
  // Descobre o tamanho do tabuleiro
  PALAVRAS.forEach((p) => {
    casasDa(p).forEach(({ l, c }) => {
      linhas = Math.max(linhas, l + 1);
      colunas = Math.max(colunas, c + 1);
    });
  });

  grade = Array.from({ length: linhas }, () => Array(colunas).fill(null));

  // Coloca as letras e confere se os cruzamentos batem
  PALAVRAS.forEach((p) => {
    casasDa(p).forEach(({ l, c }, i) => {
      const letra = p.resposta[i];
      if (!grade[l][c]) grade[l][c] = { letra, input: null, palavras: [] };
      if (grade[l][c].letra !== letra) {
        console.error(`Cruzamento errado em ${l},${c}: ${grade[l][c].letra} x ${letra}`);
      }
      grade[l][c].palavras.push(p);
    });
  });

  // Numeração: lida da esquerda para a direita, de cima para baixo
  const inicios = [...PALAVRAS].sort((a, b) => a.linha - b.linha || a.coluna - b.coluna);
  let numero = 0;
  const numeroDaCasa = {};
  inicios.forEach((p) => {
    const chave = `${p.linha},${p.coluna}`;
    if (!numeroDaCasa[chave]) numeroDaCasa[chave] = ++numero;
    p.numero = numeroDaCasa[chave];
  });

  // Desenha as casas
  tabuleiroEl.style.gridTemplateColumns = `repeat(${colunas}, var(--tam-casa))`;
  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < colunas; c++) {
      const casa = document.createElement("div");
      casa.className = "casa";
      const dado = grade[l][c];

      if (!dado) {
        casa.classList.add("vazia");
      } else {
        const chave = `${l},${c}`;
        if (numeroDaCasa[chave]) {
          const num = document.createElement("span");
          num.className = "numero";
          num.textContent = numeroDaCasa[chave];
          casa.appendChild(num);
        }
        const input = document.createElement("input");
        input.maxLength = 1;
        input.autocomplete = "off";
        input.spellcheck = false;
        input.setAttribute("autocapitalize", "characters");
        input.setAttribute("aria-label", `Casa linha ${l + 1}, coluna ${c + 1}`);
        input.dataset.l = l;
        input.dataset.c = c;
        input.addEventListener("click", () => aoClicarCasa(l, c));
        input.addEventListener("focus", () => aoFocarCasa(l, c));
        input.addEventListener("keydown", (e) => aoTeclar(e, l, c));
        input.addEventListener("input", (e) => aoDigitar(e, l, c));
        casa.appendChild(input);
        dado.input = input;
        dado.elemento = casa;
      }
      tabuleiroEl.appendChild(casa);
    }
  }
}

function montarPistas() {
  const ordenadas = [...PALAVRAS].sort((a, b) => a.numero - b.numero);
  ordenadas.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="num">${p.numero}</span><span>${p.pista}</span><span class="tam">(${p.resposta.length})</span>`;
    li.addEventListener("click", () => selecionarPalavra(p, 0));
    p.itemLista = li;
    (p.direcao === "H" ? listaH : listaV).appendChild(li);
  });
}

// ---------------------------------------------------------
// 3. Seleção e digitação
// ---------------------------------------------------------
function palavraNaCasa(l, c, direcao) {
  const dado = grade[l] && grade[l][c];
  if (!dado) return null;
  return dado.palavras.find((p) => p.direcao === direcao) || dado.palavras[0];
}

function destacar() {
  document.querySelectorAll(".palavra-ativa, .casa-ativa").forEach((el) => {
    el.classList.remove("palavra-ativa", "casa-ativa");
  });
  document.querySelectorAll(".pistas li.ativa").forEach((el) => el.classList.remove("ativa"));

  if (!palavraAtual) return;
  casasDa(palavraAtual).forEach(({ l, c }) => grade[l][c].elemento.classList.add("palavra-ativa"));
  const foco = document.activeElement;
  if (foco && foco.dataset && foco.dataset.l !== undefined) {
    foco.parentElement.classList.add("casa-ativa");
  }
  palavraAtual.itemLista.classList.add("ativa");
  const nomeDirecao = palavraAtual.direcao === "H" ? "Horizontal" : "Vertical";
  pistaAtualEl.innerHTML = `<strong>${palavraAtual.numero} ${nomeDirecao}:</strong> ${palavraAtual.pista}`;
}

function selecionarPalavra(palavra, indice) {
  palavraAtual = palavra;
  direcaoAtual = palavra.direcao;
  const { l, c } = casasDa(palavra)[indice];
  grade[l][c].input.focus();
  destacar();
}

let ultimoClique = null;
function aoClicarCasa(l, c) {
  const dado = grade[l][c];
  // Clicar de novo na mesma casa troca a direção (se ela for um cruzamento)
  if (ultimoClique === `${l},${c}` && dado.palavras.length > 1) {
    direcaoAtual = direcaoAtual === "H" ? "V" : "H";
  }
  ultimoClique = `${l},${c}`;
  palavraAtual = palavraNaCasa(l, c, direcaoAtual);
  direcaoAtual = palavraAtual.direcao;
  destacar();
}

function aoFocarCasa(l, c) {
  const dado = grade[l][c];
  if (!palavraAtual || !dado.palavras.includes(palavraAtual)) {
    palavraAtual = palavraNaCasa(l, c, direcaoAtual);
    direcaoAtual = palavraAtual.direcao;
  }
  destacar();
}

function irPara(l, c) {
  if (grade[l] && grade[l][c]) {
    grade[l][c].input.focus();
    return true;
  }
  return false;
}

function proximaCasa(l, c, passo) {
  const dl = direcaoAtual === "V" ? passo : 0;
  const dc = direcaoAtual === "H" ? passo : 0;
  return irPara(l + dl, c + dc);
}

function aoDigitar(e, l, c) {
  const input = e.target;
  const letra = input.value.normalize("NFD").replace(/[^A-Za-z]/g, "").toUpperCase().slice(-1);
  input.value = letra;
  limparMarcacao(l, c);
  if (letra) proximaCasa(l, c, 1);
}

function aoTeclar(e, l, c) {
  const input = e.target;
  switch (e.key) {
    case "Backspace":
      if (!input.value) {
        e.preventDefault();
        if (proximaCasa(l, c, -1)) document.activeElement.value = "";
      }
      limparMarcacao(l, c);
      break;
    case "ArrowRight":
      e.preventDefault(); direcaoAtual = "H"; irPara(l, c + 1) || aoFocarCasa(l, c); break;
    case "ArrowLeft":
      e.preventDefault(); direcaoAtual = "H"; irPara(l, c - 1) || aoFocarCasa(l, c); break;
    case "ArrowDown":
      e.preventDefault(); direcaoAtual = "V"; irPara(l + 1, c) || aoFocarCasa(l, c); break;
    case "ArrowUp":
      e.preventDefault(); direcaoAtual = "V"; irPara(l - 1, c) || aoFocarCasa(l, c); break;
    case "Enter":
      e.preventDefault(); pularPalavra(1); break;
    case "Tab":
      e.preventDefault(); pularPalavra(e.shiftKey ? -1 : 1); break;
    default:
      // Se a casa já tem letra, a nova letra substitui a antiga
      if (/^[a-zA-Z]$/.test(e.key) && input.value) input.value = "";
  }
}

// Vai para a palavra seguinte (ou anterior) na ordem das pistas
function pularPalavra(passo) {
  const ordem = [...PALAVRAS].sort((a, b) =>
    a.direcao === b.direcao ? a.numero - b.numero : a.direcao === "H" ? -1 : 1);
  const atual = ordem.indexOf(palavraAtual);
  const proxima = ordem[(atual + passo + ordem.length) % ordem.length];
  selecionarPalavra(proxima, 0);
}

// Quando o jogador muda uma letra, some a cor de certo/errado daquela casa
function limparMarcacao(l, c) {
  grade[l][c].elemento.classList.remove("certa", "errada");
}

// ---------------------------------------------------------
// 4. Conferir, contador e reiniciar
// ---------------------------------------------------------
const contadorEl = document.getElementById("contador");
const barraEl = document.getElementById("progresso-barra");
const mensagemEl = document.getElementById("mensagem");

function palavraDigitada(palavra) {
  return casasDa(palavra).map(({ l, c }) => grade[l][c].input.value || " ").join("");
}

function atualizarContador(acertos) {
  contadorEl.textContent = `${acertos} de ${PALAVRAS.length} palavras`;
  barraEl.style.width = `${(acertos / PALAVRAS.length) * 100}%`;
}

function mostrarMensagem(texto, tipo) {
  mensagemEl.textContent = texto;
  mensagemEl.className = "mensagem" + (tipo ? " " + tipo : "");
}

function conferir() {
  let acertos = 0;
  const certas = new Set();
  const erradas = new Set();

  PALAVRAS.forEach((p) => {
    const ok = palavraDigitada(p) === p.resposta;
    if (ok) acertos++;
    p.itemLista.classList.toggle("ok", ok);
    p.itemLista.classList.toggle("erro", !ok);
    casasDa(p).forEach(({ l, c }) => (ok ? certas : erradas).add(grade[l][c]));
  });

  // Uma casa de cruzamento fica verde se pelo menos uma das palavras dela está certa
  grade.flat().filter(Boolean).forEach((dado) => {
    dado.elemento.classList.remove("certa", "errada");
    void dado.elemento.offsetWidth; // reinicia a animação
    if (certas.has(dado)) dado.elemento.classList.add("certa");
    else if (erradas.has(dado)) dado.elemento.classList.add("errada");
  });

  atualizarContador(acertos);

  if (acertos === PALAVRAS.length) {
    mostrarMensagem("Programa executado sem erros! Você completou a cruzadinha inteira.", "sucesso");
  } else if (acertos === 0) {
    mostrarMensagem("Nenhuma palavra certa ainda. Leia as pistas com calma e tente de novo.", "alerta");
  } else {
    const faltam = PALAVRAS.length - acertos;
    const texto = faltam === 1 ? "Falta 1" : `Faltam ${faltam}`;
    mostrarMensagem(`Boa! ${acertos} certas. ${texto}: as pistas marcadas com ✗ precisam de revisão.`, "alerta");
  }
}

function reiniciar() {
  grade.flat().filter(Boolean).forEach((dado) => {
    dado.input.value = "";
    dado.elemento.classList.remove("certa", "errada");
  });
  PALAVRAS.forEach((p) => p.itemLista.classList.remove("ok", "erro"));
  atualizarContador(0);
  mostrarMensagem("Tabuleiro limpo. Sinal de reset: o Contador de Programa voltou ao início!");
  palavraAtual = null;
  ultimoClique = null;
  pistaAtualEl.textContent = "Selecione uma palavra";
  destacar();
}

document.getElementById("btn-conferir").addEventListener("click", conferir);
document.getElementById("btn-reiniciar").addEventListener("click", reiniciar);

// ---------------------------------------------------------
// 5. Decodificador de Instruções
//    A pista aparece e as letras chegam embaralhadas (com 2 intrusas).
//    O jogador monta a palavra antes de o tempo acabar.
// ---------------------------------------------------------
const TEMPO_PARTIDA = 120;
const LETRAS_INTRUSAS = 2;

const decPontosEl = document.getElementById("dec-pontos");
const decAcertosEl = document.getElementById("dec-acertos");
const decSequenciaEl = document.getElementById("dec-sequencia");
const decTempoEl = document.getElementById("dec-tempo");
const decClockEl = document.getElementById("dec-clock-barra");
const decEnderecoEl = document.getElementById("dec-endereco");
const decFaseEl = document.getElementById("dec-fase");
const decPistaEl = document.getElementById("dec-pista");
const decSlotsEl = document.getElementById("dec-slots");
const decChipsEl = document.getElementById("dec-chips");
const decMensagemEl = document.getElementById("dec-mensagem");
const btnIniciar = document.getElementById("btn-dec-iniciar");
const btnLimpar = document.getElementById("btn-dec-limpar");
const btnDica = document.getElementById("btn-dec-dica");
const btnPular = document.getElementById("btn-dec-pular");

let dec = null; // estado da partida

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Letras da resposta + intrusas, embaralhadas sem formar a resposta pronta
function gerarChips(resposta) {
  const alfabeto = "ABCDEFGHIJLMNOPRSTUVXZ";
  const letras = resposta.split("");
  for (let i = 0; i < LETRAS_INTRUSAS; i++) {
    letras.push(alfabeto[Math.floor(Math.random() * alfabeto.length)]);
  }
  let mistura;
  do {
    mistura = embaralhar(letras);
  } while (mistura.join("").includes(resposta) || mistura.join("").includes("CU"));
  return mistura;
}

function atualizarPlacarDec() {
  decPontosEl.textContent = dec.pontos;
  decAcertosEl.textContent = `${dec.acertos} de ${PALAVRAS.length}`;
  decSequenciaEl.textContent = `x${Math.min(dec.sequencia + 1, 5)}`;
  decTempoEl.textContent = `${dec.tempo}s`;
  decClockEl.style.width = `${(dec.tempo / TEMPO_PARTIDA) * 100}%`;
  decClockEl.classList.toggle("urgente", dec.tempo <= 15);
}

function mensagemDec(texto, tipo) {
  decMensagemEl.textContent = texto;
  decMensagemEl.className = "mensagem" + (tipo ? " " + tipo : "");
}

function iniciarDecodificador() {
  clearInterval(dec && dec.relogio);
  dec = {
    fila: embaralhar(PALAVRAS),
    indice: 0,
    pontos: 0,
    acertos: 0,
    sequencia: 0,
    tempo: TEMPO_PARTIDA,
    ativo: true,
    travado: false,
    relogio: null,
  };
  dec.relogio = setInterval(() => {
    dec.tempo--;
    atualizarPlacarDec();
    if (dec.tempo <= 0) encerrarDecodificador();
  }, 1000);
  btnIniciar.textContent = "Reiniciar";
  [btnLimpar, btnDica, btnPular].forEach((b) => (b.disabled = false));
  mensagemDec("");
  atualizarPlacarDec();
  carregarInstrucao();
}

function carregarInstrucao() {
  if (dec.indice >= dec.fila.length) return encerrarDecodificador();
  const palavra = dec.fila[dec.indice];
  dec.palavra = palavra;
  dec.slots = Array(palavra.resposta.length).fill(null); // cada slot guarda o chip usado
  dec.dicas = new Set();
  dec.travado = false;

  decEnderecoEl.textContent = `PC = 0x${dec.indice.toString(16).toUpperCase().padStart(2, "0")}`;
  decFaseEl.textContent = "BUSCA";
  decFaseEl.className = "fase busca";
  decPistaEl.textContent = palavra.pista;

  decChipsEl.innerHTML = "";
  gerarChips(palavra.resposta).forEach((letra) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = letra;
    chip.addEventListener("click", () => colocarChip(chip));
    decChipsEl.appendChild(chip);
  });
  desenharSlots();
}

function desenharSlots() {
  decSlotsEl.className = "decod-slots";
  decSlotsEl.innerHTML = "";
  dec.slots.forEach((chip, i) => {
    const slot = document.createElement("button");
    slot.className = "slot" + (dec.dicas.has(i) ? " dica" : "");
    slot.textContent = dec.dicas.has(i) ? dec.palavra.resposta[i] : chip ? chip.textContent : "";
    slot.setAttribute("aria-label", `Posição ${i + 1}`);
    slot.addEventListener("click", () => tirarChip(i));
    decSlotsEl.appendChild(slot);
  });
}

function colocarChip(chip) {
  if (!dec || !dec.ativo || dec.travado || chip.disabled) return;
  const livre = dec.slots.findIndex((s, i) => s === null && !dec.dicas.has(i));
  if (livre === -1) return;
  dec.slots[livre] = chip;
  chip.disabled = true;
  desenharSlots();
  if (dec.slots.every((s, i) => s !== null || dec.dicas.has(i))) executar();
}

function tirarChip(i) {
  if (!dec || !dec.ativo || dec.travado || dec.dicas.has(i) || !dec.slots[i]) return;
  dec.slots[i].disabled = false;
  dec.slots[i] = null;
  desenharSlots();
}

function limparSlots() {
  dec.slots.forEach((chip, i) => {
    if (chip && !dec.dicas.has(i)) {
      chip.disabled = false;
      dec.slots[i] = null;
    }
  });
  desenharSlots();
}

// Fase de execução: confere a palavra montada
function executar() {
  const montada = dec.slots.map((chip, i) => (dec.dicas.has(i) ? dec.palavra.resposta[i] : chip.textContent)).join("");
  decFaseEl.textContent = "EXECUÇÃO";
  decFaseEl.className = "fase execucao";
  dec.travado = true;

  if (montada === dec.palavra.resposta) {
    const multiplicador = Math.min(dec.sequencia + 1, 5);
    // Só as letras montadas pelo jogador valem pontos (as da dica não)
    const ganho = (dec.palavra.resposta.length - dec.dicas.size) * 10 * multiplicador;
    dec.pontos += ganho;
    dec.acertos++;
    dec.sequencia++;
    decSlotsEl.classList.add("certo");
    mensagemDec(`Instrução executada! ${dec.palavra.termo} (+${ganho} pontos${multiplicador > 1 ? `, sequência x${multiplicador}` : ""})`, "sucesso");
    atualizarPlacarDec();
    setTimeout(() => {
      if (!dec.ativo) return;
      dec.indice++;
      carregarInstrucao();
    }, 900);
  } else {
    dec.sequencia = 0;
    decSlotsEl.classList.add("errado");
    mensagemDec("Instrução inválida! A sequência zerou. Reorganize as letras.", "alerta");
    atualizarPlacarDec();
    setTimeout(() => {
      if (!dec.ativo) return;
      dec.travado = false;
      decFaseEl.textContent = "BUSCA";
      decFaseEl.className = "fase busca";
      limparSlots();
    }, 700);
  }
}

function darDica() {
  if (!dec || !dec.ativo || dec.travado) return;
  const resposta = dec.palavra.resposta;
  const pos = dec.slots.findIndex((chip, i) => !dec.dicas.has(i) && (!chip || chip.textContent !== resposta[i]));
  if (pos === -1) return;

  // Devolve o chip que estava na posição e "gasta" um chip com a letra certa
  if (dec.slots[pos]) {
    dec.slots[pos].disabled = false;
    dec.slots[pos] = null;
  }
  let chip = [...decChipsEl.children].find((c) => !c.disabled && c.textContent === resposta[pos]);
  if (!chip) {
    // a letra certa está em outra posição: libera de lá
    const outro = dec.slots.findIndex((c, i) => c && c.textContent === resposta[pos] && !dec.dicas.has(i));
    chip = dec.slots[outro];
    dec.slots[outro] = null;
  }
  chip.disabled = true;
  dec.slots[pos] = chip;
  dec.dicas.add(pos);
  dec.pontos = Math.max(0, dec.pontos - 5);
  atualizarPlacarDec();
  desenharSlots();
  if (dec.slots.every((s, i) => s !== null || dec.dicas.has(i))) executar();
}

function pularInstrucao() {
  if (!dec || !dec.ativo || dec.travado) return;
  dec.sequencia = 0;
  mensagemDec(`Pulou! A resposta era ${dec.palavra.resposta}.`, "alerta");
  // a palavra pulada volta para o fim da fila
  dec.fila.push(dec.fila.splice(dec.indice, 1)[0]);
  atualizarPlacarDec();
  carregarInstrucao();
}

function encerrarDecodificador() {
  clearInterval(dec.relogio);
  dec.ativo = false;
  [btnLimpar, btnDica, btnPular].forEach((b) => (b.disabled = true));
  [...decChipsEl.children].forEach((c) => (c.disabled = true));
  decFaseEl.textContent = "HALT";
  decFaseEl.className = "fase";
  btnIniciar.textContent = "Jogar de novo";

  let nivel = "Nível HD: ainda está lento, mas dá para acelerar treinando!";
  if (dec.acertos === PALAVRAS.length) nivel = "Nível registrador: decodificou tudo!";
  else if (dec.acertos >= 10) nivel = "Nível cache: muito rápido!";
  else if (dec.acertos >= 5) nivel = "Nível RAM: bom ritmo!";
  decPistaEl.textContent = `Fim da execução: ${dec.acertos} de ${PALAVRAS.length} palavras e ${dec.pontos} pontos.`;
  mensagemDec(nivel, "sucesso");
}

// Teclado: digitar uma letra pega o chip correspondente; Backspace devolve o último
document.addEventListener("keydown", (e) => {
  const painelAtivo = document.querySelector(".painel.ativo");
  if (!dec || !dec.ativo || painelAtivo.id !== "decodificador") return;
  if (e.key === "Backspace") {
    e.preventDefault();
    for (let i = dec.slots.length - 1; i >= 0; i--) {
      if (dec.slots[i] && !dec.dicas.has(i)) return tirarChip(i);
    }
    return;
  }
  const letra = e.key.toUpperCase();
  if (/^[A-Z]$/.test(letra)) {
    const chip = [...decChipsEl.children].find((c) => !c.disabled && c.textContent === letra);
    if (chip) colocarChip(chip);
  }
});

btnIniciar.addEventListener("click", iniciarDecodificador);
btnLimpar.addEventListener("click", () => dec && dec.ativo && !dec.travado && limparSlots());
btnDica.addEventListener("click", darDica);
btnPular.addEventListener("click", pularInstrucao);

// ---------------------------------------------------------
// 6. Abas
// ---------------------------------------------------------
document.querySelectorAll(".aba").forEach((aba) => {
  aba.addEventListener("click", () => {
    document.querySelectorAll(".aba").forEach((a) => {
      a.classList.toggle("ativa", a === aba);
      a.setAttribute("aria-selected", a === aba);
    });
    document.querySelectorAll(".painel").forEach((p) => {
      p.classList.toggle("ativo", p.id === aba.dataset.alvo);
    });
  });
});

// ---------------------------------------------------------
// Início
// ---------------------------------------------------------
montarGrade();
montarPistas();

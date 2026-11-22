# Cruzadinha ArqComp

Jogo de cruzadinha para treinar os termos da aula de **Tópicos de Arquitetura Computacional** (Sprint 3). O site também traz um segundo jogo, o **Jogo da Memória Cache**, que usa as mesmas palavras.

Feito com HTML, CSS e JavaScript puros, sem bibliotecas.

**Site publicado:** _link do GitHub Pages aqui_

## Como jogar

### Cruzadinha

1. Clique numa casa do tabuleiro ou numa pista da lista.
2. Digite as letras direto nas casas (maiúsculas, sem acento e sem espaço). O cursor avança sozinho.
3. Clique duas vezes numa casa de cruzamento para trocar entre horizontal e vertical.
4. Atalhos: setas para andar pelo tabuleiro, `Backspace` para apagar e voltar, `Enter` ou `Tab` para ir à próxima palavra.
5. Clique em **Conferir**: as palavras certas ficam verdes, as erradas ficam vermelhas, e o contador mostra quantas você acertou (por exemplo, "8 de 16 palavras").
6. Clique em **Reiniciar** para limpar o tabuleiro e começar de novo.

### Jogo da Memória Cache

1. Vire duas cartas por vez e ligue cada **termo** à sua **pista**.
2. Par certo é um **cache hit**: as cartas ficam abertas. Par errado é um **cache miss**: as cartas voltam.
3. Ganhe encontrando os 8 pares. O placar mostra hits, misses, taxa de acerto e tempo.
4. Cada partida sorteia 8 das 16 palavras. Clique em **Nova partida** para jogar de novo.

## Palavras e pistas

O tabuleiro usa as 16 palavras da lista, e todas se cruzam com pelo menos uma outra.

### Horizontais

| Nº | Palavra | Pista |
|----|---------|-------|
| 3 | ULA | Parte do processador que soma, subtrai e faz operações AND, OR e NOT. |
| 4 | CPU | Bloco que busca e executa as instruções do programa. |
| 5 | UC | Lê cada instrução, descobre o que ela pede e dá as ordens. |
| 6 | MICROCONTROLADOR | Chip com CPU, memória e entrada e saída juntos, como o ATmega328P. |
| 11 | RAM | Memória de trabalho volátil; no Arduino Uno tem só 2 KB. |
| 12 | DATABUS | Fios que vão e voltam levando o valor lido ou escrito: responde O QUÊ? |
| 13 | ROM | Memória não volátil gravada de fábrica com o firmware de inicialização, como a BIOS. |
| 15 | MEMORIADEMASSA | Base da pirâmide: SSD ou HD, onde os arquivos ficam guardados permanentemente. |
| 16 | EEPROM | Memória não volátil de 1 KB do Arduino, usada para guardar configurações. |

### Verticais

| Nº | Palavra | Pista |
|----|---------|-------|
| 1 | DUALCORE | Processador com dois núcleos de processamento no mesmo chip. |
| 2 | QUADCORE | Processador com quatro núcleos de processamento no mesmo chip. |
| 7 | REGISTRADORES | Memórias minúsculas dentro da CPU, as mais rápidas do computador. |
| 8 | CACHE | Memória pequena e veloz dentro do processador, com cópia do que foi usado há pouco. |
| 9 | ADDRESSBUS | Grupo de fios que só sai da CPU e responde à pergunta ONDE? |
| 10 | FLASH | Tecnologia regravável do pendrive; guarda o programa do Arduino mesmo sem energia. |
| 14 | DMA | Controlador copia dados entre dispositivo e RAM enquanto a CPU fica livre. |

## Estrutura do projeto

```
index.html   página com as duas abas de jogo
style.css    tema visual de placa de circuito
script.js    lógica da cruzadinha e do jogo da memória
README.md    este arquivo
```

## Fonte do conteúdo

As pistas foram escritas com base no e-book *[SP3 MAT3] Tópicos de Arquitetura Computacional* (SPTech).

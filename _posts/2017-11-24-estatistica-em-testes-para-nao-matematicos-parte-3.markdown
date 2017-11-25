---
layout: post
title:  'Estatística em testes para não matemáticos - Probabilidades'
date:   2017-11-24 11:21:00
category: Growth
image: '/assets/images/blog/2017-11-24-estatistica-em-testes-para-nao-matematicos-part-3-featured.jpg'
image_credit: 'Henrique Freitas Souza'
---

Até onde sei ainda não temos tecnologia desenvolvida para prever o futuro. Em vista disso, podemos usar matemática para ao menos inferir algo sobre ele. Encontrar uma resposta para uma hipótese com um teste não é garantia de que a resposta encontrada é a verdade absoluta. É por isso que precisamos ter algum nível de certeza sobre a validade da resposta encontrada. Para quantificar esse nível de certeza são calculadas as chamadas proporções — ou probabilidades.

<!--more-->

Este post é o terceiro de uma série com 6 em que vou destrinchar os principais conceitos estatísticos para testes online. Os tópicos serão:

- [A importância de entender estatística para testes]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %})
- [Hipóteses]({{ absolute_url }}{% post_url 2017-11-23-estatistica-em-testes-para-nao-matematicos-parte-2 %})
- Probabilidades (este post)
- Histogramas e curvas de densidade
- P-valor, alfa, beta e tamanho do efeito
- Setup de testes e configuração de calculadoras

## Estatística descritiva e estatística inferencial

Em análise de dados, estudos estatísticos geralmente são classificados em um dos dois grupos: estatística descritiva ou esatatística inferencial. Embora sejam usados em conjunto é importante entender que existe diferença entre os dois termos, especialmente porque na esmagadora maioria dos casos em que realizamos testes com amostras online, não temos acesso a toda a população.

- Estatística descritiva: busca explicar conjuntos de dados. Sumarizar estes conjuntos de dados com médias ou explicar a distribuição destes dados são operações de estatística descritiva. É importante notar que em estatística descritiva não é possível tirar conclusões que estão além do conjunto de dados estudado.
- Estatística inferencial: busca explicar características de toda uma população baseado em partes dela. Testes com hipóteses são estudos estatísticos dentro deste grupo.

## Probabilidades

Estatística inferencial é baseada na ideia de **probabilidade**, ou a chance de um dado evento acontecer. Probabilidades são divididas em dois tipos: independente e condicional.

### Probabilidade independente

A independência entre probabilidades signfica que a probabilidade de um evento acontecer não está atrelada eventos anteriores. Pense em um dado com seis faces. Na primeira jogada pode sair qualquer número entre 1 e 6. Na segunda também, na terceira a mesma coisa e por aí vai. O mesmo conceito se aplica a uma moeda em um jogo de cara e coroa por exemplo.

### Probabilidade condicional

A probabilidade muda de acordo com eventos passados. Um exemplo é um baralho de cartas completo, em que existe igual probabilidade de tirar qualquer uma delas do bolo. A medida que as cartas vão saíndo do baralho, a probabilidade de tirar uma das restantes aumenta.

## A lei dos números grandes

Qual a probabilidade de um dado evento ocorrer? Quanto maior o número de tentativas (ou eventos, ou observações), mais precisa é a estimativa dessa probabilidade. Esse fenômeno é chamado de lei dos números grandes. Desconsiderando as limitações com teste com amostras online citadas no [post introdutório]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %}) desta série, quanto maior a amostra do tráfego disponível, mais precisa será a probabilidade em torno das hipóteses que estão sendo estudadas.

Para testes em software, os testes são baseados em ações que os indivíduos de uma amostra são ou não capazes de concluir e a principal medição é o percentual dos indivíduos da amostra que concluem a determinada ação. Este percentual é conhecido como **taxa de conversão**. Em termos estatísticos, o número é representado de forma absoluta e chamado de **proporção** (ou probabilidade) de sucesso (representado pela letra P). É impossível saber qual a verdadeira taxa de conversão (P) quando o tamanho da população é desconhecido (e esta é a realidade de produtos digitais). Aqui estamos falando de estatística inferencial quando precisamos estimar a proporção P para a ocorrência de um dado evento determinado em uma hipótese.

## Probabilidades combinadas

Probabilidades ainda podem ser combinadas, contanto que os eventos probabilísticos sejam **mutuamente exclusívos**. O que isso quer dizer é que dois ou mais eventos podem acontecer sem interferência entre sí. Um exemplo no mundo online seria “quantos visitantes que acessaram a página de categoria também acessaram a página de produto?” (assumindo que é possível chegar a essa página de produto sem antes passar pela página de categoria). Se os eventos não são mutuamente exclusívos, é necessário subtrair a porção desses eventos que se cruzam antes de combinar as probabilidades para evitar amostras duplicadas.

Ainda dentro do contexto de testes com amostras online, o número em estudo é a probabilidade de sucessos de acordo com a hipótese formuladada, ou a taxa de conversão. O projetista de testes calcula a taxa de conversão média de cada amostra, para calcular a **taxa de conversão média das amostras**, e também uma **margem de erro**. A soma e a subtração da margem de erro com a taxa de conversão média das amostras forma um intervalo que representa as potenciais taxas de conversão para amostras estudadas, chamado de **intervalo de confiança**. Como cada amostra provavelmente possui algum grau de diferença entre as demais colhidas, um intervalo de possíveis taxas de conversão é estimado para inferir a taxa de conversão média de toda a população.

O intervalo de confiança será explorado em mais detalhes no próximo post, sobre histogramas e curvas de densidade.

O número P que chamamos de probabilidade de sucesso é a base para as demais projeções usadas para estimar diferenças entre dois grupos de estudo, inclusive em testes online. No post seguinte irei detalhar sua relação com outros termos estatísticos e como eles se relacionam.

## Leitura complementar

Parte desses conceitos eu aprendi [neste site](http://jukebox.esc13.net/untdeveloper/RM/Stats_Module_2/){:target="\_blank"}. Inclusive os exemplos que usei foram tirados dele. Vale a pena ler os capítulos, que estão ilustrados, a linguagem é bem didática e possuem exercícios matemáticos para fixação dos conceitos.

Bora estimar probabilidades!

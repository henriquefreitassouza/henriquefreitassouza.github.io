---
layout: post
title:  'Estatística em testes para não matemáticos - Histogramas e curvas de densidade'
date:   2017-11-26 09:59:00
category: Growth
image: '/assets/images/blog/2017-11-26-estatistica-em-testes-para-nao-matematicos-part-4-featured.jpg'
image_credit: 'Henrique Freitas Souza'
---

Ao longo de um teste, várias amostras são obtidas e suas taxas de conversão são calculadas frente ao efeito induzido pelo pesquisador. O próximo passo é agrupar e classificar esses dados de tal forma que seja possível tirar as informações necessárias para inferir dados sobre toda a população. Como exatamente isso acontece e qual sua importância para a execução de testes?

<!--more-->

Este post é o quarto de uma série com 6 em que vou destrinchar os principais conceitos estatísticos para testes online. Os tópicos serão:

- [A importância de entender estatística para testes]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %})
- [Hipóteses]({{ absolute_url }}{% post_url 2017-11-23-estatistica-em-testes-para-nao-matematicos-parte-2 %})
- [Probabilidades]({{ absolute_url }}{% post_url 2017-11-24-estatistica-em-testes-para-nao-matematicos-parte-3 %})
- Histogramas e curvas de densidade (este post)
- P-valor, alfa, beta e tamanho do efeito
- Setup de testes e configuração de calculadoras

## Medidas de tendência central e distribuição dos dados

Para explicar conjuntos de dados em testes geralmente são usados dois tipos de números: um que seja representativo de todo o grupo e outro que explique a dispersão dos dados. Ao primeiro dá-se o nome de **medida de tendência central** e o segundo de **medida de distribuição**. Três medidas de tendência central são:

- Média: a média é a medida mais conhecida entre elas. É calculada pela soma de todos os dados numéricos e dividido pela quantidade de dados somados.
- Mediana: a mediana é obtida após ordenar os dados e selecionar o número que estiver no meio do conjunto. Se o conjunto tiver uma quantidade par de dados, a mediana é a média dos dois números mais ao meio.
- Modo: o modo é o número que aparece com mais frequência em um conjunto de dados.

Cada medida tem seus usos e dentro de testes é comum usar a média. Algumas ferramentas de testes mostram a diferença entre grupos de controle e variações usando gráficos de boxplot. Estes gráficos mostram a dispersão dos dados em quatro quadrantes e a medida de tendência central usada é a mediana.

Além das medidas de tendência central existem as medidas de distribuição de dados. Entender a forma como os dados se distribuem é importante para calcular o quanto eles **desviam** da medida de tendência central. Duas dessas medidas são:

- Variância: a variabilidade média dos dados.
- Desvio padrão: a raiz quadrada da variância, usada em conjunto com a média para estimar a variabilidade média dos dados.

A melhor explicação que encontrei para a existência dessas duas medidas está [aqui](https://stats.stackexchange.com/questions/35123/whats-the-difference-between-variance-and-standard-deviation){:target="\_blank"}. A comunidade diz que a variância é melhor para explicar dispersão em termos matemáticos enquanto o desvio padrão é mais usado para determinar a dispersão dos dados em relação a média, já que ambos os números estão na mesma escala. É como se o desvio padrão fosse uma “normalização” da variância.

## A classificação das probabilidades de sucesso

No [post anterior]({{ absolute_url }}{% post_url 2017-11-24-estatistica-em-testes-para-nao-matematicos-parte-3 %}) escrevi um pouco sobre os fundamentos da teoria da probabilidade, a probabilidade de sucesssos dentro do contexto do online que chamamos de taxa de conversão e a coleta de várias amostras para registro dessas taxas. Falarei agora sobre o que acontece uma vez que são registradas as taxas de conversão das amostras.

Ao longo da execução de um teste, o tráfego participante é contabilizado e também o número de indivíduos que executaram a ação em estudo que representa a conversão em cada uma das variações do teste (seja submeter um formulário, clicar em um CTA, comprar e etc). Amostras desse tráfego são separadas e suas taxas de conversão são colhidas. Essas taxas são classificadas em “baldes” chamados de **frequências**. Tanto a forma de separação das amostras quanto frequências são definidas e ajustadas pela ferramenta conforme os dados dos participantes vão sendo colhidos. Um exemplo delas seria “entre 0% e 0,99%, entre 1% e 1,99%, entre 2% e 2,99%, ..., entre n% e n,99%”. As amostras colhidas do tráfego são então classificadas dentro da frequência apropriada.

O gráfico que representa as distribuições de amostras por taxas de conversão é o **histograma** e cada variação do teste tem o seu. O histograma é um gráfico de distribuição de dados numéricos em frequências por número de ocorrências em cada frequência. Nesse caso, as frequências são os intervalos de probabilidades de sucesso, representadas no eixo x (abcissas) e o número de amostras em cada frequência, representadas no eixo y (ordenadas).

![histograma não normalizado]({{ "/assets/images/blog/2017-11-26-estatistica-em-testes-para-nao-matematicos-part-4-image-1.jpg" | absolute_url }})

## A Lei dos Números Grandes e o Teorema do Limite Central

O importante em um histograma dentro do contexto de testes com amostras é a sua forma. Quanto mais amostras vão sendo coletadas e mais taxas de conversão vão sendo calculadas, mais o histograma vai tomando uma forma específica. Quando eu escrevi sobre [probabilidades]({{ absolute_url }}{% post_url 2017-11-24-estatistica-em-testes-para-nao-matematicos-parte-3 %}) eu mencionei a chamada Lei dos Números Grandes, que diz que quanto maior o grupo de estudo, mais as médias dos eventos observados em amostras desse grupo vão se aproximando da média para toda a população. Isso fica visível em um histograma a medida que mais amostras vão sendo classificadas dentro das frequências. O formato que o histograma assume se parece com uma montanha, ou um **sino**.

![histograma normalizado]({{ "/assets/images/blog/2017-11-26-estatistica-em-testes-para-nao-matematicos-part-4-image-2.jpg" | absolute_url }})

É fundamental que o histograma se distribua dessa forma pois quanto mais próximo de um sino, mais próximo o histograma fica de uma **distribuição normal**. A distribuição normal está dentro de um campo na matemática chamado de **distribuição probabilística**, que são funções matemáticas que tratam de explicar a probabilidade de ocorrência de deterinados eventos. Há mais de um tipo de distribuição probabilística e a que explica a distribuição normal é a **distribuição probabilística contínua**. A distribuição probabilística contínua calcula a probabilidade de um número estar dentro de algum intervalo de valores. Quando o histograma assume a forma de um sino e se torna parecido com uma distribuição normal – conhecida também como distribuição gaussiana ou distribuiçao em forma de sino – as propriedades da distribuição normal se aplicam ao conjunto de dados coletados e os cálculos apropriados podem ser feitos. Distribuições podem ser de vários tipos e a que se chama normal recebe esse nome justamente por causa de seu formato.

![histograma normalizado com curva gaussiana]({{ "/assets/images/blog/2017-11-26-estatistica-em-testes-para-nao-matematicos-part-4-image-3.jpg" | absolute_url }})

A partir daqui já cabe a introdução de um segundo conceito: o **Teorema do Limite Central**. Ele é um tanto similar a Lei dos Números Grandes em sua definição. O Teorema do Limite Central diz que quanto maior for o grupo de estudo, mas a distribuição das médias de diferentes amostras dentro deste grupo se aproximará de uma distribuição normal. A Lei dos Números Grandes fala sobre distribuição de dados em relação a uma média e o Teorema do Limite Central fala sobre o formato que a distribuição possui se arranjada em um gráfico.

## Variáveis contínuas e discretas

Antes de entrar mais a fundo em curvas de distribuição, uma palavrinha sobre os tipos das chamadas **variáveis** numéricas e suas características.

Funções de distribuição probabilística diferem por conta das variáveis sobre as quais operam. Uma variável é um evento que descreve algo e assume valores numéricos. Variáveis podem ser:

- Discretas: assumem uma possibilidade finita de dados.
- Contínuas: podem assumir uma possibilidade infinita de dados.

Um exemplo de variável discreta é o número sorteado em um dado de seis faces ao ser arremessado. As possibilidades só podem ser 1, 2, 3, 4, 5 ou 6. Um exemplo de variável contínua é a probabilidade de sucesso para determinado evento, que pode assumir qualquer valor. A distribuição normal é uma função de distribuição probabilística contínua pois lida com variáveis contínuas.

## A regra empírica

Agora que os conceitos sobre a geração do histograma e sua aproximação com a distribuição normal foram explicados, é hora de explicar o porquê disso. As funções de distribuição probabilística fazem cálculos sobre a **área** da distribuição e o objetivo é saber qual a probabilidade de um dado número estar dentro da área delimitada. Como probabilidades de sucesso podem assumir qualquer valor e é impossível saber qual é essa probabilidade para toda a população, o cálculo da área se torna útil para determinar uma faixa de possíveis valores onde a probabilidade de sucessso pode estar, sendo esta área o intervalo de confiança, brevemente apresentado no [post anterior]({{ absolute_url }}{% post_url 2017-11-24-estatistica-em-testes-para-nao-matematicos-parte-3 %}). Além disso, uma distribuição normal admite a chamada **regra empírica**: esta regra, convenientemente conhecida como regra 68-95-99,7, diz que 68% dos dados em uma distribuição normal estão concentrados a uma medida de distância do centro da distribuição, 95% dos dados estão a duas medidas de distância do centro e 99,7% a três medidas de distância do centro. A medida de distância é o desvio padrão e o centro da distribuição é a média.

![distribuição normal]({{ "/assets/images/blog/2017-11-26-estatistica-em-testes-para-nao-matematicos-part-4-image-4.jpg" | absolute_url }})

Uma vez que a distribuição normal tenha sido encontrada para cada variação do teste, são necessários mais alguns cálculos para obter os números que são mostrados no painel de uma ferramenta de testes. Essas curvas também precisam ser sobrepostas para extrair a diferença entre elas. Falarei sobre este processo no próximo post.

Bora estudar estatística!

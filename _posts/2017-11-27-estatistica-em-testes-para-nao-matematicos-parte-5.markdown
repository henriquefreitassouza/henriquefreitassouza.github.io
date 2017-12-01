---
layout: post
title:  'Estatística em testes para não matemáticos - P-valor, alfa, beta e tamanho do efeito'
date:   2017-11-27 09:47:00
category: Growth
image: '/assets/images/blog/2017-11-27-estatistica-em-testes-para-nao-matematicos-part-5-featured.jpg'
image_credit: 'Henrique Freitas Souza'
---

As ferramentas para testes mais conhecidas conseguem cuidar dos cálculos envolvidos na execução dos experimentos, porém o projetista deve ser capaz de fornecer as variáveis matemáticas que compõem estes cálculos. Explicarei quais são estas variáveis e como elas se relacionam para gerar o resultado de um teste.

<!--more-->

Este post é o quinto de uma série com 6 em que vou destrinchar os principais conceitos estatísticos para testes online. Os tópicos serão:

- [A importância de entender estatística para testes]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %})
- [Hipóteses]({{ absolute_url }}{% post_url 2017-11-23-estatistica-em-testes-para-nao-matematicos-parte-2 %})
- [Probabilidades]({{ absolute_url }}{% post_url 2017-11-24-estatistica-em-testes-para-nao-matematicos-parte-3 %})
- [Histogramas e curvas de densidade]({{ absolute_url }}{% post_url 2017-11-26-estatistica-em-testes-para-nao-matematicos-parte-4 %})
- **P-valor, alfa, beta e tamanho do efeito** (este post)
- [Setup de testes e configuração de calculadoras]({{ absolute_url }}{% post_url 2017-11-29-estatistica-em-testes-para-nao-matematicos-parte-6 %})

## Um pouco mais sobre regra empírica

No post sobre [histogramas e curvas de densidade]({{ absolute_url }}{% post_url 2017-11-26-estatistica-em-testes-para-nao-matematicos-parte-4 %}) eu falei sobre a utilidade de distribuições para o cálculo de áreas. Em particular, sobre a importância da distribuição normal pois seu formato admite algumas propriedades matemáticas importantes. Essas propriedades são a descrição de informações sobre a área de curvas e a regra empírica, usadas para calcular números capazes de inferir informações sobre a população de estudo. Finalizei o post com a definição da regra empírica porém não expliquei qual sua utilidade.

A regra empírica, ou regra 68-95-99,7, fala sobre a maneira como dados se distribuem ao longo de uma curva gaussiana – ou distribuição normal. 68% dos dados estão a uma medida de distância, ou desvio padrão, 95% estão a dois desvios padrão e 99,7% estão a três desvios padrão. O desvio padrão é uma medida de variabilidade que está na mesma escala da média de um conjunto de dados. Considere a curva gaussiana:

![curva gaussiana]({{ "/assets/images/blog/2017-11-27-estatistica-em-testes-para-nao-matematicos-part-5-image-1.jpg" | absolute_url }})

Dizer que 68% dos dados estão a uma medida de distância, ou um desvio padrão, significa dizer que 68% dos valores encontrados vão cair dentro de um intervalo específico, determinado pela porção mais ao meio da curva gaussiana. Quando um teste está em execução e amostras estão sendo computadas com suas probabilidades de sucesso (as taxas de conversão ou proporções), essas probabilidades possuem 68% de chances de estar a um desvio padrão da média, 95% de chances de estar a dois e 99,7% de estar a três.

No entanto, é importante ter um número que seja capaz de representar todas as probabilidades das amostras individuais e classificar este número dentro da área da distribuição. Este número chama-se **p-valor**.

## P-valor

Uma definição mais formal para o p-valor é a de que ele é a probabilidade de obter um efeito tão extremo quanto o observado, considerando que a hipótese nula é verdadeira. No post sobre [hipóteses]({{ absolute_url }}{% post_url 2017-11-23-estatistica-em-testes-para-nao-matematicos-parte-2 %}) eu comentei que não é possível assumir que a hipótese alternativa é verdade apenas porque existem evidências que neguem uma hipótese nula. É importante lembrar que existem duas probabilidades para a hipótese nula: a de que ela é falsa e também **a de que ela é verdadeira**. O mesmo vale para a hipótese alternativa. Em nossa realidade de marketeiros e designers de produto, tendemos a acreditar e torcer para a hipótese alternativa, afinal fizemos o melhor layout, com a melhor proposta de valor e divulgamos nos canais onde estão nossas personas. Como então a hipótese alternativa não seria verídica? O p-valor é o número que tenta responder se as alterações são mesmo melhores do que manter tudo como estava e para isso, deve-se assumir que as alterações não performam melhor do que a versão original do produto.

Dito isso, a probabilidade de obter um efeito tão extremo quando o observado, considerando que a hipótese nula é verdadeira significa, no mundo de testes online: qual é a chance de ver o tráfego de um site ou aplicativo se comportar da forma que foi observada no teste se não fosse feita nenhuma mudança no produto? Se a probabilidade é baixa, então é bem provável que o comportamento observado não tenha sido obra do acaso. Nesse caso, tende-se a acreditar na hipótese alternativa (as alterações no produto foram o que apresentou a mudança de comportamento do tráfego estudado).

Outro ponto importante sobre usar o p-valor para decidir entre hipóteses nula e alternativa é que não é possível provar a resposta encontrada. Sempre haverá uma margem de erro associada a ela e em alguns casos a resposta encontrada simplesmente será a errada ([falsos positivos e falsos negativos]({{ absolute_url }}{% post_url 2017-11-23-estatistica-em-testes-para-nao-matematicos-parte-2 %})). Por isso, rejeitar a hipótese nula não significa que a alternativa esteja certa, o projetista de teste apenas possui mais certeza para acreditar na informação colhida ao final do teste. O que se pode fazer é executar o teste novamente para verificar se o valor encontrado cai dentro do intervalo esperado ou não. O negócio ainda terá que decidir se irá agir conforme o resultado do teste ou não considerando a margem de erro na resposta.

O quão baixo p-valor precisa ser para que o resultado de um teste possa tender em prol da hipótese alternativa? Depende. O valor é definido pelo projetista de testes de acordo com o nível de acurácia que ele precisa e as necessidades de cada negócio. Esse número limite que é comparado com o p-valor é chamado de **alfa**.

![curva gaussiana com p-valor e alfa]({{ "/assets/images/blog/2017-11-27-estatistica-em-testes-para-nao-matematicos-part-5-image-2.jpg" | absolute_url }})

## Alfa

Esse alfa, ou **nível de significância**, é o mesmo que eu escrevi no post sobre [hipóteses]({{ absolute_url }}{% post_url 2017-11-23-estatistica-em-testes-para-nao-matematicos-parte-2 %}). Ele é a probabilidade de o resultado ser um falso positivo. O valor de alfa é uma constante que representa uma área dentro da distribuição normal. Essa área vai de uma das extremidades até o valor definido. Os valores mais comuns adotados para uso em ferramentas de teste e calculadoras são 0,1, 0,05 e 0,01 (ou 10%, 5% e 1% de chances de falso positivo, respectivamente). Essas ferramentas costumam pedir que o projetista defina o inverso de alfa para os cálculos, ou 1 - alfa. O inverso de alfa é o número conhecido como **significância estatística** e representa a probabilidade de o valor encontrado estar correto assumindo que a hipótese nula é verdadeira. Outra forma de pensar neste número é como sendo a probabilidade de rejeitar a hipótese nula considerando que ela é verdadeira, ou ainda, a probabilidade de o resultado encontrado não ter sido coincidência.

Na prática, o p-valor precisa ser menor do que o alfa em uma das extremidades da distribuição normal. Quando isso acontece, o resultado encontrado no estudo é dito “estatisticamente significante”.

![curva gaussiana com p-valor menor do que alfa]({{ "/assets/images/blog/2017-11-27-estatistica-em-testes-para-nao-matematicos-part-5-image-3.jpg" | absolute_url }})

## Testes com uma e duas caudas

Embora o valor definido para alfa seja constante, a maneira como ele é distribuído na curva gaussiana pode mudar de acordo com as configurações do teste. Em um estudo online, por exemplo, o pesquisador pode ter como objetivo conhecer a diferença de performance entre uma alteração feita em um site contra a configuração já existente. Se o objetivo é apenas verificar se a alteração performa melhor então o teste é em **uma cauda** e se o objetivo é verificar se a alteração performa melhor ou pior do que o que já existe o teste é em **duas caudas**. Cauda diz respeito ao formato da distribuição normal, em que as extremidades são chamadas de caudas.

![curva gaussiana com duas caudas]({{ "/assets/images/blog/2017-11-27-estatistica-em-testes-para-nao-matematicos-part-5-image-4.jpg" | absolute_url }})

Quando o teste é com uma cauda, o valor de alfa é concentrado na extremidade à direita da distribuição e p-valor precisa passar de alfa apenas nesta extremidade. Se o teste é com duas caudas, o valor de alfa é dividido entre as extremidades e o número passa a ser alfa/2. Se um alfa é 0,05 por exemplo, quando consideradas as duas caudas de uma distribuição o número será distribuído em 0,025 para cada extremidade, e p-valor precisa ser menor do que alfa/2 em uma das extremidades.

## O deslocamento de p-valor na distribuição normal

Para saber se p-valor é menor ou maior do que alfa é preciso saber o quanto ele se desloca da média para ter a estimativa de diferença entre efeitos observados nas variações de um teste. A diferença é medida em número de desvios padrão e esse número é chamado de **z-score**. Os deslocamentos em z-scores ao longo da distribuição normal [estão disponíveis na internet em tabelas para consulta](http://www.z-table.com/){:target="\_blank"}. Para cada “passo” em z-scores a tabela mostra uma respectiva área da distribuição normal em um número que vai de quase zero a quase um, sendo que quanto mais próximo de zero menor é a área da distribuição coberta e quanto mais próximo de um, maior é a área. Uma tabela de z-scores que mostra as áreas acima da média por exemplo se parece com a desta imagem:

![tabela de z-scores]({{ "/assets/images/blog/2017-11-27-estatistica-em-testes-para-nao-matematicos-part-5-image-5.jpg" | absolute_url }})

Z-scores podem ser números positivos ou negativos de forma que z-scores negativos estão abaixo da média e os positivos estão acima. A leitura dessas tabelas é feita da seguinte forma: uma vez que um p-valor é calculado, a área associada a ele está na célula que intersecta uma linha e uma coluna. Suponha que um p-valor calculado seja de 1,96. O primeiro passo é procurar pelo número 1,9 na primeira coluna da tabela. Encontrado esse número, o passo seguinte é encontrar o número 0,06, a parte restante do número 1,96. Basta olhar a primeira linha da tabela, com os cabeçalhos que vão de 0,00 a 0,09. A área equivalente do número 1,96 estará então na célula que cruza a linha e coluna correspondentes. Neste caso, o número é 0,9750 (ou 97,50% da distribuição, considerando uma tabela de z-scores que mostra toda a área da distribuição normal). Como a área de uma distribuição é um número que vai de zero a um, é necessário traduzir os números de p-valor e alfa para a escala usada na distribuição. O z-score é uma medida útil pois descreve a distância de um número em relação a média e descreve essa distância de uma forma que possa ser colocada dentro da distribuição normal.

Há várias tabelas de z-score online e elas diferem entre tabelas que mostram as áreas à direita da distribuição normal (acima da média), tabelas que mostram a área à esquerda da distribuição normal (abaixo da média) e tabelas que mostram toda a área, com z-scores negativos e positivos.

## Z-score de alfa: valor crítico

Para obter o z-score de alfa, chamado de **valor crítico**, o caminho é o inverso do feito para obter o z-score do p-valor. Como a área de alfa já é conhecida e foi definida pelo projetista de testes, basta dividí-lo por 2 e subtrair 50% do valor encontrado. O número final é a área da distribuição coberta por alfa, que pode ser consultada na tabela de z-scores para encontrar o z-score equivalente. Considere o alfa de 0,05 por exemplo. Dividido por 2 fica 0,025. Subtraia 0,5 (50%). O número final é 47,5% (ou 0,475). O z-score equivalente a 0,475 é 1,96. Os z-scores normalmente associados ao alfa são 1,645 para 0,1, 1,96 para 0,05 e 2,576 para 0,01 então não é necessário fazer o cálculo sempre que for fazer um teste.

O z-score de alfa é chamado de valor crítico porque ele é o número que dividide a distribuição em duas regiões: a região de **falha ao rejeitar a hipótese nula** e a região de **rejeição da hipótese nula**. Enquanto alfa representa a área das extremidades da distribuição normal associada ao falso positivo, o valor crítico é o “divisor de águas” entre a rejeição e a não rejeição da hipótese nula, ou entre estatisticamente significante e não estatisticamente significante.

![regiões de falha ao rejeitar a hipótese nula e sucesso ao rejeitar a hipótese nula]({{ "/assets/images/blog/2017-11-27-estatistica-em-testes-para-nao-matematicos-part-5-image-6.jpg" | absolute_url }})

Uma vez que a média da amostra, o valor crítico e o desvio padrão são conhecidos é possível calcular uma métrica já citada no [post sobre probabilidades]({{ absolute_url }}{% post_url 2017-11-24-estatistica-em-testes-para-nao-matematicos-parte-3 %}), o intervalo de confiança. O intervalo de confiança é uma área de possíveis valores onde a taxa de conversão pode cair. O cálculo é feito duas vezes: uma para o intervalo superior e outra para o intervalo inferior. O intervalo superior é obtido somando a média ao produto do valor crítico com o desvio padrão. O intervalo inferior é obtido subtraíndo a média do produto do valor crítico com o desvio padrão.

Em suma:

- P-valor: probabilidade de encontrar um comportamento extremo assumindo que a hipótese nula é verdadeira.
- Alfa: probabilidade de falso positivo.
- Z-score: número de desvios padrão em relação a média.
- Valor crítico: ponto de separação entre as áreas de rejeição e não rejeição da hipótese nula.

## Curvas de densidade combinadas

Todo o processo descrito para cálculos em testes gera um p-valor para comparação com alfa, porém esse é o processo para uma variação dentro do teste. Testes possuem no mínimo duas: uma chamada de **controle** e as demais chamadas de **tratamentos** (ou variações). O grupo de controle é o grupo que não recebe nenhum tipo de tratamento e os grupos de tratamentos possuem algum tipo de modificação em relação ao grupo de controle. Cada grupo de controle e tratamento tem sua coleta e classificação de dados, seu histograma, sua curva de densidade e seu p-valor. É necessário combinar essas curvas e projetar um único p-valor para comparação com alfa. Essa combinação de curvas é apenas uma projeção em que as duas curvas são colocadas no mesmo plano e os números de p-valor e a medida de desvio são calculadas de forma combinada.

![curvas gaussianas combinadas]({{ "/assets/images/blog/2017-11-27-estatistica-em-testes-para-nao-matematicos-part-5-image-7.jpg" | absolute_url }})

A métrica de desvio nessa combinação é o **erro padrão**, e ele é derivado do desvio padrão. O erro padrão é usado, entre outras situações, para determinar a variabilidade entre os dados quando há mais de uma média no conjunto, o que passa a ser o caso quando duas ou mais distribuições normais são combinadas. O erro padrão é usado no lugar do desvio padrão para gerar o intervalo de confiança e a média combinada é a subtração das médias das distribuições normais combinadas. O produto passa a ser entre o z-score e a raiz quadrada da variância de cada distribuição normal dividida pelo tamanho da amostra em cada distribuição normal.

Com um único p-valor e uma única medida de desvio, o valor obtido representa todo o grupo de controle e tratamentos.

## Significância estatística e tamanho da amostra

Logo na [introdução desta série]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %}) eu comentei sobre um erro comum na execução de testes: o de acreditar que significância estatística é motivo para a parada de um teste. O que acontece é que ao longo da execução de um teste a significância estatística pode ser alcançada zero, uma ou n vezes. Você pode um dia abrir a ferramenta usada para o teste e receber uma mensagem dizendo que a significância estatística foi alcançada e no dia seguinte a ferramenta informar que a significância não foi alcançada para o mesmo teste.

Isso acontece porque as amostras estão sendo coletadas ao longo do teste e os números apresentam muita variabilidade – especialmente no começo de um teste. Encontrar o tamanho da amostra apropriado é de suma importância para que o teste tenha validade. Quanto maior a amostra, menor o erro padrão e mais estreita se torna a distribuição normal e isso está relacionado com a [Lei dos Números Grandes e o Teorema do Limite Central]({{ absolute_url }}{% post_url 2017-11-26-estatistica-em-testes-para-nao-matematicos-parte-4 %}). A amostra influencia o erro padrão, que por sua vez influencia o chamado **poder estatístico**, ou a probabilidade de rejeitar a hipótese nula corretamente em favor da hipótese alternativa. Algumas calculadoras de teste pedem para que o projetista informe, entre outras coisas, o poder estatístico para calcular o tamanho da amostra necessária para um teste.

## Poder estatístico e seus quatro componentes: beta, tamanho do efeito, alfa e tamanho da amostra

Visualmente falando, o poder estatístico representa a área da distribuição normal relacionada a hipótese alternativa que não intersecta com a distribuição normal da hipótese nula. Poder estatístico é representado por 1 - beta.

![curvas gaussianas combinadas]({{ "/assets/images/blog/2017-11-27-estatistica-em-testes-para-nao-matematicos-part-5-image-8.jpg" | absolute_url }})

O poder estatístico é formado por quatro componentes:

- Beta: este beta é o mesmo do post sobre [hipóteses]({{ absolute_url }}{% post_url 2017-11-23-estatistica-em-testes-para-nao-matematicos-parte-2 %}), ou a probabilidade de um falso negativo. Quanto menor for o beta, maior o poder estatístico.
- Tamanho do efeito: tamanho do efeito é uma medida de distância entre as médias das distribuições normais sobrepostas. É a diferença entre essas médias dividida pelo desvio padrão.
- Alfa: probabilidade de falso positivo. Quanto menor for alfa, maior é o beta e consequentemente menor o poder estatístico.
- Tamanho da amostra: quantidade de amostras participantes do teste. Quanto maior a amostra, menor o beta e maior o poder estatístico.

Ajustar alfa e beta apropriadamente significa dizer o quanto de erro um negócio está disposto a aceitar na resposta de um teste. O tamanho do erro aceito dependerá de cada negócio mas é comum assumir 0,05 de alfa e 0,2 para beta. O valor de beta não costuma ser definido em nenhuma das ferramentas de teste mais conhecidas, é assumido 0,2 por padrão. No entanto, pode ser que seja necessário trabalhar com outros betas e nesse caso é útil fazer os cálculos estatísticos para testes usando planilhas.

## Leitura complementar

- [Este vídeo](https://www.youtube.com/watch?v=zTABmVSAtT0){:target="\_blank"} explica de maneira bem didática a distinção entre os termos p-valor, alfa, valor crítico e z-score e como eles se relacionam.
- [Estes vídeos](https://theebmproject.wordpress.com/power-type-ii-error-and-beta/){:target="\_blank"} descrevem em detalhes os conceitos de beta, tamanho do efeito e poder estatístico.

Bora validar hipóteses!

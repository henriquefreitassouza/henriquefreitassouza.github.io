---
layout: post
title:  'Estatística em testes para não matemáticos - A importância de saber estatística'
date:   2017-11-22 10:35:00
categories: [Matemática]
image: '/assets/images/blog/2017-11-22-estatistica-em-testes-para-nao-matematicos-part-1-featured.jpg'
image_credit: 'Evan Miller'
---

Você costuma fazer testes do tipo a/b, split ou outros e se pergunta se os dados que a ferramenta de testes fornece são válidos? Se a resposta é não, você deveria. Para tirar o máximo de proveito de testes online é necessário conhecer alguns tópicos em estatística. Neste e nos próximos 5 posts vou falar quais são esses tópicos e como configurar corretamente as ferramentas e calculadoras disponíveis para garantir a veracidade dos dados que são mostrados.

<!--more-->

Este post é o primeiro de uma série com 6 em que vou destrinchar os principais conceitos estatísticos para testes online. Os tópicos serão:

- **A importância de entender estatística para testes** (este post)
- [Hipóteses]({{ absolute_url }}{% post_url 2017-11-23-estatistica-em-testes-para-nao-matematicos-parte-2 %})
- [Probabilidades]({{ absolute_url }}{% post_url 2017-11-24-estatistica-em-testes-para-nao-matematicos-parte-3 %})
- [Histogramas e curvas de densidade]({{ absolute_url }}{% post_url 2017-11-26-estatistica-em-testes-para-nao-matematicos-parte-4 %})
- [P-valor, alfa, beta e tamanho do efeito]({{ absolute_url }}{% post_url 2017-11-27-estatistica-em-testes-para-nao-matematicos-parte-5 %})
- [Setup de testes e configuração de calculadoras]({{ absolute_url }}{% post_url 2017-11-29-estatistica-em-testes-para-nao-matematicos-parte-6 %})

Farei em posts separados para não tornar a leitura muito difícil. Este post será dedicado a esclarecer a importância de compreender alguns dos conceitos estatísticos envolvidos em testes com amostras e quais são os tipos de testes disponíveis para aplicações online.

## Por quê os resultados das ferramentas para testes não seriam verídicos em primeiro lugar?

Eles são. O problema está em interpretar os dados se o projetista de testes não possui conhecimentos para questionar os resultados obtidos. Um exemplo simples é o termo **significância estatística**. Se você inicia um teste e o pára assim que a ferramenta diz que a significância estatística foi alcançada, você provavelmente terá resultados não condizentes com a realidade. Significância estatística não é motivo para parada de um teste, como explicarei em outro post. Esta é só uma das formas de como testes podem ser incorretamente conduzidos. [Faça uma pesquisa rápida na internet](https://www.google.com.br/search?biw=1536&bih=734&ei=I3AVWv66LIOgwgSVx5e4Aw&q=ab+tests+done+wrong&oq=ab+tests+done+wrong&gs_l=psy-ab.3..33i22i29i30k1.5850.7240.0.7331.13.9.0.0.0.0.256.1048.0j5j1.6.0....0...1c.1.64.psy-ab..7.5.792...0j0i22i30k1j0i22i10i30k1j33i160k1j33i21k1.0.Of9q5XbMUnQ){:target="\_blank"} e você irá encontrar vários outros exemplos de erros comuns em implementações de teste.

## O quanto é necessário conhecer de matemática para trabalhar com testes?

O suficiente para entender a maneira como os conceitos se relacionam. Não é necessário saber calcular fórmulas complexas no papel mas saber o que elas são e o que representam suas variáveis é fundamental para fazer a leitura correta de dados de testes com amostras. As ferramentas fazem o cálculo mas o que elas retornam como resultado ainda deve ser propriamemte interpretado. Algumas calculadoras de tamanho de amostra ou de duração de testes pedem informações que serão diretamente inseridas nas fórmulas matemáticas que calculam esses números, [como a da imagem que aparece no topo deste post](https://www.evanmiller.org/ab-testing/){:target="\_blank"}, e as que não pedem tais informações assumem números padrão. O problema com isso é que nem sempre a configuração definida representa a realidade de cada negócio, daí o cuidado a se ter com definições padrão. Um exemplo está na definição do chamado **efeito mínimo detectável**. Dependendo do tipo de negócio que você possui, pode não fazer sentido declarar uma variação em um teste como sendo a vencedora por uma diferença muito pequena. O tamanho da diferença que você quer ver entre as variações em um teste é definida por esta variável e é comum que calculadoras e ferramentas de teste definam um número padrão. Configurar este parâmetro reflete no tamanho da amostra necessária para executar um teste, o que implica diretamente no tempo necessário para colher os dados.

## Características de testes com amostras online

O trabalho que um projetista de testes em software tem para preparar amostras e conduzir grupos de estudo não é muito diferente do trabalho de pesquisas com amostras em outras áreas como medicina e política. Na medicina, por exemplo, o que muda é que o ambiente de testes é bem mais controlado, o número de amostras é bem menor e a significância estatística requerida é geralmente maior do que a adotada em testes online. Pesquisas nessa área podem usar outros métodos de testes com grupos que não o que será descrito nesse post dependendo do que possuem para trabalhar e dos objetivos do estudo. Já o campo de estudos em política é mais parecido com a realidade de quem trabalha em um departamento de marketing ou produto. Para conhecer as intenções de voto da população, várias amostras são colhidas para participar de uma pesquisa de intenção de voto e com base nas respostas dessas amostras são inferidas informações sobre toda a população.

Algumas características específicas de testes online são:
- O pouco controle que o projetista de testes tem sobre o ambiente de estudos (o online).
- O grupo de estudos é formado por usuários anônimos cuja única identificação é um cookie instalado em suas máquinas, que possui prazo de validade e pode ser removido pelos próprios participantes do estudo.
- É difícil traçar características do grupo de estudos. O estudo então é feito sobre os comportamentos do grupo.
- Experiências entre múltiplos dispositivos e navegadores são normalmente problemáticas em testes e causam ruídos na coleta de dados.

O número de variáveis externas fora de controle são simplesmente incontáveis. Garantir a qualidade das amostras e dos procedimentos de teste garante a qualidade dos dados resultantes.

## Tipos de teste

Falamos tanto no teste do tipo a/b que as vezes parece que este é o único tipo de teste existente. Há outros tipos de teste que podem ser aplicados dependendo da situação e tipo de conteúdo a ser testado. Os tipos de teste são:

- Teste a/b: um tipo de teste em que amostras são separadas em dois grupos. Um dos grupos recebe algum tipo de tratamento diferenciado e os comportamentos dos dois grupos são analisados em busca de correlações entre o tratamento aplicado e o comportamento apresentado. Um exemplo em testes online é a separação do tráfego entre duas versões de uma página web.
- Teste mvt: o teste mvt, ou multivariável, estuda o comportamento de múltiplos tratamentos simultâneos para diferentes amostras do grupo de estudo. Os comportamentos são analisados em busca de correlações entre os tratamentos aplicados e os comportamentos apresentados. Um exemplo em testes online é a separação do tráfego em três ou mais versões de uma página web com alterações em diferentes elementos.
- Teste a/b/n: similar ao teste mvt. Sua diferença está na forma como o tratamento é aplicado nas diversas variações. Enquanto um teste do tipo mvt estuda diversas variações, o teste a/b/n estuda diferenças de uma mesma variação. Um exemplo em testes online é a separação do tráfego em três ou mais versões de uma página web com várias alterações de um mesmo elemento.
- Teste split: o teste split é característico de testes online e consiste no redirecionamento do tráfego de sites entre diferentes endereços. Pode ser usado para testar diferentes variações do layout de uma página ou diferentes páginas.
- Teste mab: o teste mab, ou multi armed bandit, é um tipo de teste que incorpora aprendizado de máquina em seu processo. O tráfego é dividido e analisado pelos modelos preditivos, que classificam grupos de visitantes com base em traços comuns de comportamento.

Em geral o teste a/b é o mais usado pois dá mais certeza ao pesquisador sobre a correlação entre o tratamento aplicado a variação b e o comportamento das amostras. Quando novas variáveis são envolvidas o teste se torna mais complexo e a possibilidade de erros aumenta. Em um teste a/b o estudo possui um foco bem definido e o estudo é melhor direcionado. Testes com muitas variações diferentes ou diversas variações de um mesmo elemento são mais comuns quando o tráfego do site é menor e as alterações nos testes são mais agressivas.

## Estatística para testes

Nos posts seguintes irei entrar nos tópicos importantes da estatística para testes. Acompanhe este blog para conhecê-los e saber como aplicá-los em testes online.

Bora aprender estatística!

---
layout: post
title:  'Estatística em testes para não matemáticos - Hipóteses'
date:   2017-11-23 11:07:00
category: Growth
image: '/assets/images/blog/2017-11-23-estatistica-em-testes-para-nao-matematicos-part-2-featured.jpg'
image_credit: 'Slideplayer'
---

Existem vários tipos de testes baseados em amostragens e hoje vou falar sobre o mais comum quando se fala em testes online, como o a/b: testes baseados em hipóteses. Trarei luz à importância de hipóeses para testes e como esse conceito é usado na matemática — e em testes.

<!--more-->

Este post é o segundo de uma série com 6 em que vou destrinchar os principais conceitos estatísticos para testes online. Os tópicos serão:

- [A importância de entender estatística para testes]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %})
- Hipóteses (este post)
- Probabilidades
- Histogramas e curvas de densidade
- P-valor e alfa
- Setup de testes e configuração de calculadoras

## Fundamentos de estatística para testes

No [post anterior]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %}) expliquei porque é importante conhecer estatística ao construir testes com amostras online. Dado o contexto para o aprendizado de estatística, os fundamentos abordados aqui não serão focados em fórmulas matemáticas ou em aspéctos filosóficos de seu funcionamento. O intuito é apresentar os conceitos e mostrar como usá-los para configurar testes apropriadamente.

## População x amostra

A distinção entre os dois termos é de suma importância conceitualmente falando. Uma população representa todos os indivíduos de algum grupo. A população de um país, por exemplo, é composta por todos os indivíduos que vivem em determinado país. No mundo de software online, uma população é todo o tráfego de visitantes em um site ou app. Já a amostra representa uma porção da população. A amostra é usada para inferir informações que se apliquem a toda uma população. No caso de estudos online ou sobre populações de um país, por exemplo, é impossível estudar todos os indivíduos para inferir informações da população. Nestes casos, são usadas amostras para o estudo e os resultados são usados para descrever a população como um todo. Uma amostra precisa ser:
- Significante: isto é, ser grande os suficiente para o estudo em questão.
- Representativa: as características da amostra precisam ser fiéis aquelas da população.
- Randômica: a seleção da amostra precisa ser randômica para evitar análises tendenciosas.

Ferramentas de teste irão garantir a seleção randômica da amostra, mas a significância e a representatividade serão determinadas pelo projetista de testes.

## O início de tudo: hipóteses

Como mencionei anteriormente, há várias formas de fazer testes com amostras. A mais comum no mundo online e também a adotada pelas ferramentas de testes mais conhecidas é o teste baseado em hipóteses. Uma hipótese é uma afirmação feita com base na leitura de dados sobre determinados comportamentos ou eventos. O objetivo de um teste é então pôr esta hipótese à prova para dizer se ela é verdadeira ou falsa. Estudos baseados em testes admitem dois tipos de hipóteses, em termos estatísticos: a **hipótese nula** e a **hipótese alternativa** (também chamada de hipótese alfa). Uma hipótese alternativa é um efeito esperado após um teste e a hipótese nula é a não existência desse efeito. Um exemplo em testes online de hipótese alternativa é de que trocar a cor de um botão na home de um site trará 10% mais acessos na página de produto enquanto na hipótese nula a troca do botão não influencia a taxa de conversão.

A definição das hipóteses é importante pois definirá os possíveis resultados a serem esperados no fim de um teste. Algumas empresas costumam trabalhar com duas definições de hipóteses: Uma hipótese conceitual e uma hipótese matemática. A hipótese conceitual é a descrição da crença com base na leitura de dados e a hipótese matemática é a tradução da hipótese conceitual para termos matemáticos. Essa distinção é feita para quantificar a hipótese e assim torná-la possível de ser analisada de forma mais detalhada após os resultados de um teste. Um exemplo de hipótese conceitual é: “fazer ajustes no botão da home irá fazer com que mais pessoas naveguem pelas páginas de produto”. A hipótese matemática então vai dar o contexto do tamanho da melhoria ao dizer algo como: “um botão vermelho e em negrito irá atrair 10% a mais dos visitantes para páginas de produto”.

As hipóteses ainda podem ser escritas usando os termos matemáticos apropriados, que serão discutidos no post sobre histogramas e curvas de distribuição.

Ao final da execução de um teste será obtido um de dois possíveis resultados: a hipótese nula foi **rejeitada** ou **aceita**. Aceitar a hipótese nula significa que a alteração induzida no teste não teve o efeito esperado e rejeitar a hipótese nula significa que há evidências que sugerem que a alteração induzida no teste causou uma mudança de comportamento do grupo de estudo. A nomenclatura pode parecer estranha mas na prática ela significa que não é só porque o pesquisador induziu uma alteração para parte do grupo de estudo que essa alteração foi a causa de uma mudança de comportamento, caso ela exista. No exemplo do botão na home de um site, assumindo que a cor do botão foi trocada e o texto foi formatado como negrito, quem garante que foi essa a alteração que causou uma mudança de comportamento dos usuários do site, assumindo que a mudança de comportamento tenha de fato ocorrido? Rejeitar a hipótese nula não significa aceitar de imediato a hipótese alternativa. A probabilidade de que a mudança de comportamento observada foi induzida pelo projetista de testes é calculada e será definida em outro post.

### Erros em testes

Existe ainda a possibilidade do resultado de um teste estar errado, mesmo que os procedimentos tenham sido feitos corretamente. Isso acontece porque o estudo é feito com amostras e não com toda a população, e existe a chance de a amostra não representar todas as características da população estudada. Essa possibilidade abre margem para dois tipos de erros, conhecidos em termos estatísticos como **erro do tipo I** (também chamado de alfa ou falso positivo) e **erro do tipo II** (também chamado de beta ou falso negativo).

- O erro do tipo I acontece quando a hipótese nula é rejeitada quando ela deveria ter sido aceita. Em outras palavras, **afirmar que algo é verdadeiro quando não é**.
- O erro do tipo II acontece quando a hipótese nula é aceita quando na verdade a hipótese alternativa deveria ter sido aceita. Em outras palavras, **afirmar que algo é falso quando não é**.

O erro do tipo I está diretamente associado a um conceito a ser explicado em detalhes em outro post, chamado **alfa**. Talvez você já tenha ouvido falar no complemento desse número, chamado de **significância estatística**. Por hora, a significância estatística é o parâmetro definido nas ferramentas de teste que dá um nível de confiança no resultado obtido para o estudo. Geralmente são assumidos os valores de 90%, 95% ou 99%. O que 95% de significância estatística, por exemplo, quer dizer na prática é que a cada 20 repetições de um teste, em uma delas o resultado será um falso positivo, ou erro do tipo I.

Já o erro do tipo II está associado ao conceito de **beta**. Novamente, o complemento dele é mais conhecido e os detalhes deste número também serão discutidos em outro post. Em uma calculadora de testes, por exemplo, pede-se o complemento de beta para calcular a probabilidade de encontrar o efeito esperado em um teste e geralmente assume-se 80%. Na prática, a cada dez vezes que o teste foi executado, o resultado em duas das execuções será um falso negativo, ou erro do tipo II.

Uma forma comum de explicar a relação entre hipóteses nula e alternativa, bem como os possíveis erros na determinação da veracidade de hipóteses, é fazer um paralelo com o sistema jurídico penal. Imagine que um juiz precisa decidir se um réu é inocente ou culpado. Pela lei, presume-se que um cidadão é inocente (hipótese nula) até que se prove o contrário (hipótese alternativa). Dispostos em uma tabela, os possíveis desfechos do julgamento são:

![Estratégias de crescimento]({{ "/assets/images/blog/2017-11-22-estatistica-em-testes-para-nao-matematicos-part-1-image-1.jpg" | absolute_url }})

Se foram encontradas evidências contra o réu, a hipótese nula (sua inocência) será negada. Se estas mesmas evidências apontam que o réu cometeu o crime pelo qual está sendo julgado, a hipótese alternativa (sua culpa) será aceita. Agora se as evidências não são fortes o suficiente, o juís poderá proferir o veredito errado culpando um inocente (falso positivo ou tipo I) ou inocentando um culpado (falso negativo ou tipo II).

Voltando a realidade corporativa, a margem de erro aceitável deve ser definida pela organização com base no preço a ser pago por um erro. No caso de testes com amostras online é comum pensar que erros do tipo I, ou falsos positivos, são muito mais severos do que erros do tipo II, pois na prática significa tomar decisões com base em informações inverídicas. O erro do tipo II não é tão severo se pensarmos que na prática isso significa que o negócio perdeu uma oportunidade. Neste caso a operação continua como estava. Pense que em uma área como a medicina, estas margens precisam ser o mais próximas de zero o possível, afinal os estudos lidam diretamente com vidas. Por outro lado, buscar essas margens pequenas requer mais amostras e mais tempo de execução e consequentemente gera mais custos para a empresa.

Hipóteses estabelecem a base para a configuração de testes e o que analisar nos dados coletados. Por mais contra intuitívo que hipóteses possam parecer em um projeto de testes baseado em dados, dada sua aparente subjetividade, elas são úteis pois refletem as características do negócio em questão. As hipóteses são construídas com base na realidade de cada negócio e por isso faz sentido analisar os dados levantados contra estas hipóteses. No fim, a análise dos dados de um teste se torna mais certeira.

Acompanhe os próximos posts para saber como testar suas hipóteses. O próximo tópico é **probabilidades**.

Bora criar hipóteses!

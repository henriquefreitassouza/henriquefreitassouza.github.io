---
layout: post
title:  'Estatística em testes para não matemáticos - Setup de testes e configuração de calculadoras'
date:   2017-11-29 09:12:00
category: Growth
image: '/assets/images/blog/2017-11-29-estatistica-em-testes-para-nao-matematicos-part-6-featured.jpg'
image_credit: 'Optimizely, VWO, Oracle, Google, Adobe, Unbounce'
---

Configurar testes com amostras online requer alguns cuidados. Configurações erradas podem invalidar os achados do estudo e levar negócios a tomarem decisões com base em dados inverídicos – o que é potencialmente pior do que não ter dados. Neste sentido, realizar testes online pode ser um tiro no pé se não feito com cautela.

<!--more-->

Este post é o último de uma série com 6 em que vou destrinchar os principais conceitos estatísticos para testes online. Os tópicos serão:

- [A importância de entender estatística para testes]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %})
- [Hipóteses]({{ absolute_url }}{% post_url 2017-11-23-estatistica-em-testes-para-nao-matematicos-parte-2 %})
- [Probabilidades]({{ absolute_url }}{% post_url 2017-11-24-estatistica-em-testes-para-nao-matematicos-parte-3 %})
- [Histogramas e curvas de densidade]({{ absolute_url }}{% post_url 2017-11-26-estatistica-em-testes-para-nao-matematicos-parte-4 %})
- [P-valor, alfa, beta e tamanho do efeito]({{ absolute_url }}{% post_url 2017-11-27-estatistica-em-testes-para-nao-matematicos-parte-5 %})
- Setup de testes e configuração de calculadoras (este post)

## O processo de execução de testes

Os posts anteriores detalharam etapas do processo de estudo em ferramentas de teste. Sumarizadas, elas se parecem com isso:

- Definir alfa e beta aceitáveis para o negócio.
- Separar o grupo de estudo em controle e um ou mais tratamentos.
- Colher a quantidade de amostras com n indivíduos por grupo.
- Colher a quantidade de amostras com n indivíduos por grupo que apresentam o comportamento sendo observado pelo pesquisador.
- Calcular a taxa de conversão (ou proporção, ou probabilidade de sucesso) de cada amostra.
- Classificar a taxa de conversão em uma frequência de taxas de conversão.
- Coletar n amostras de tal forma que 68% das taxas de conversão estejam a uma medida de distância da média amostral, 95% dos dados estejam a duas medidas de distância da média amostral e 99,7% dos dados estejam a três medidas de distância da média amostral.
- Projetar as distribuições normais do grupo de controle e dos grupos de tratamentos em um mesmo plano para normalizar as médias em torno da média populacional, a medida de desvio padrão e calcular o p-valor combinado.
- Verificar se p-valor é mais extremo do que alfa considerando que a hipótese nula é verdadeira. Se for, o resultado é estatisticamente significante e se não for, não é estatisticamente significante.
- Verificar se o tamanho da amostra é grande o suficiente para parar o teste ao atingir significância estatística.

Alguns detalhes ficaram de fora nos posts anteriores e os acrescentarei neste.

## O efeito mínimo detectável

Efeito mínimo detectável, brevemente mencionado no [post introdutório da série]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %}), é o tamanho da diferença que o pesquisador quer ver entre duas ou mais variações em um teste. É o [tamanho de efeito]({{ absolute_url }}{% post_url 2017-11-27-estatistica-em-testes-para-nao-matematicos-parte-5 %}) mínimo a ser considerado pelo pesquisador. As vezes simplesmente não faz sentido para o negócio detectar diferenças muito pequenas. É importante entender o efeito mínimo detectável porque ele está diretamente relacionado ao tamanho da amostra. Quanto menor o efeito mínimo detectável, maior deverá ser o tamanho da amostra e consequentemente o tempo para coleta de dados. A hipótese matemática pode conter um tamanho de efeito mínimo com o qual o projetista consegue trabalhar. Se ao final do teste o efeito mínimo não foi detectado, o projetista pode verificar qual o tamanho do efeito que foi detectado e negar a hipótese nula com ele (caso a significância estatística e tamanho de amostra sejam o suficiente) ou optar pela falha na rejeição da hipótese nula.

Há empresas que definem em suas hipótese um tamanho esperado em aumento de conversões mas o aumento acaba sendo menor. O negócio pode então aceitar esse aumento e implementar as mudanças no produto ou evitar o trabalho de fazer mudanças para obter um ganho que não compensa.

## Tamanho apropriado de amostra para um teste

O tamanho da amostra depende de quatro fatores:
- O efeito mínimo detectável
- Alfa
- Beta
- A taxa de conversão atual (ou a taxa de conversão da hipótese nula)

Algumas calculadoras assumem pelo menos o beta como 0,2, sem possibilidade para mudar a taxa de falsos negativos. Ao colocar esses valores em uma calculadora ela pode mostrar a quantidade de indivíduos em uma amostra que são necessários em cada variação do grupo de estudo ou a quantidade total de participantes necessários no teste. Vou usar a [calculadora do Evan Miller](https://www.evanmiller.org/ab-testing/sample-size.html){:target="\_blank"} por exemplo, uma das mais conhecidas:

![calculadora de tamanho de amostra do Evan Miller]({{ "/assets/images/blog/2017-11-29-estatistica-em-testes-para-nao-matematicos-part-6-image-1.jpg" | absolute_url }})

Ela diz qual a quantidade de indivíduos cada variação do teste precisa ter. Os parâmetros para configuração são:

- Baseline conversion rate: é a taxa de conversão média do negócio atual. Essa taxa é assumida na hipótese nula.
- Minimum detectable effect: é o tamanho da diferença que o pesquisador quer ver entre as conversões do grupo de controle e grupos de tratamentos. Quanto maior esse número, maior a diferença a ser detectada e menor a amostragem necessária. A leitura dele é feita em conjunto com o baseline conversion rate. Considerando os 20% de conversão média atuais e efeito mínimo detectável de 5%, taxas abaixo de 15% e acima de 25% serão corretamente detectadas considerando a margem de erro estabelecida em beta.
- Statistical power (1 - beta): é a probabilidade de corretamente rejeitar a hipótese nula quando a alternativa é verdadeira. Beta é a probabilidade de falso positivo e 1 - beta é o poder estatístico.
- Significance level (alfa): é a probabilidade de encontrar um falso positivo. Alfa e nível de significância são sinônimos. No exemplo, alfa está configurado para 5% (ou 0,05).

Outra calculadora que [aparece nos primeiros resultados de uma busca online](https://www.google.com.br/search?ei=tpweWq-mCIKYwAS6yrlg&q=ab+test+sample+size+calculator&oq=ab+test+sample+size&gs_l=psy-ab.3.0.0j0i67k1j0.621269.622274.0.623710.11.7.0.1.1.0.220.799.0j2j2.4.0....0...1c.1.64.psy-ab..7.4.586...0i22i30k1.0.qS3_ax37bpo){:target="\_blank"} é a do Optimizely.

![calculadora de tamanho de amostra da Optimizely]({{ "/assets/images/blog/2017-11-29-estatistica-em-testes-para-nao-matematicos-part-6-image-2.jpg" | absolute_url }})

Ela é mais simples se comparada à calculadora anterior e assume um poder estatístico de 100% (ou 1) de acordo com a documentação, o que explica o tamanho de amostra ser maior do que a calculada usando a calculadora do [Evan Miller](https://www.evanmiller.org/){:target="\_blank"} usando os mesmos parâmetros. Quanto maior o poder estatístico (1 - beta), menor é o beta (menor a margem de falsos positivos) e maior a amostra precisa ser.

Calculadoras podem diferir também entre cálculos com uma e duas caudas. Algumas calculadoras assumem que o pesquisador queira saber apenas de melhoria da taxa de conversão na hipótese alternativa e não de pioras. Essencialmente o que muda é a distribuição de alfa pelas extremidades da distribuição da hipótese nula. Como p-valor precisa ser ainda menor considerando duas caudas, o tamanho da amostra precisa ser maior. Recomendo sempre a leitura da documentação da calculadora, caso o projetista for usar uma calculadora online. Outra opção é o projetista usar planilhas excel para calcular tamanho da amostra.

## Duração estimada do teste

Outra métrica comum de ser medida é a duração estimada para um teste. Para calcular a duração é suficiente dividir o tamanho do grupo de estudo pelo número médio de visitantes diários no produto. As calculadoras podem pedir os mesmos parâmetros usados para calcular o tamanho da amostra em calculadoras de duração para saber qual o tamanho do total do grupo de estudo necessário no teste. A calculadora da VWO por exemplo pede, além das taxas de conversão atual e estimada, o número de variações e o percentual de visitantes que serão incluídos no teste para determinar o tamanho total do grupo de estudo.

![calculadora de duração estimada da VWO]({{ "/assets/images/blog/2017-11-29-estatistica-em-testes-para-nao-matematicos-part-6-image-3.jpg" | absolute_url }})

Conhecer o tempo de duração do teste pode ser útil para planejar prazos porém o tamanho da amostra é um número muito mais importante de ser atingido. Como o número de visitas diárias informado na calculadora é uma média, essa estimativa de duração não pode ser considerada verdade absoluta. Se um teste chega no número de dias estimado e o tamanho da amostra ainda não é suficiente, deixe o teste rodando até que isso aconteça, tomando cuidado para que o teste **não passe muito tempo sendo executado**.

## Qualidade das amostras coletadas

No [primeiro post da série]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %}) eu comentei sobre as limitações de testes com amostras online. Em suma, projetistas de testes possuem pouco controle sobre as condições as quais os participantes do teste estão expostos, o que influencia na qualidade das amostras obtidas. Se não administradas com o máximo de controle possível, essas condições podem invalidar os achados de um teste. Algumas delas são:

- Interferência entre grupos de estudo de controle e variações
- Múltiplos experimentos
- Expiração de cookies
- Sazonalidade e características temporais
- Cross browser e múltiplos dispositivos

### Interferência entre grupos de estudo de controle e variações

De alguma forma isso pode estar ligado ao problema de cross browser e múltiplos dispositivos onde participantes no grupo de controle passam a ver o efeito induzido no grupo de tratamentos e vice e versa. Esse tipo de interferência pode acontecer também no caso de algum visitante recomendar outro para visitar o produto e esse visitante recomendado cair em uma variação diferente no teste. Imagine que você está testando um valor diferente para frete de uma determinada categoria de produtos. Seu grupo de controle vê a página com o valor de frete normal e o grupo de tratamento vê a página com um valor de frete mais baixo. O visitante que viu o frete por um valor menor pode recomendar o produto para amigos mas nem todos os que entrarem na página encontrarão o valor de frete mais barato por terem caído em grupos diferente daquele cujo o frete mais barato foi aplicado. Isso gera ruído na amostra. Algo que pode ajudar o projetista de testes nesse momento é pensar na repercussão do que será testado para saber se um teste com amostras é a melhor forma de validar a hipótese formulada.

### Múltiplos experimentos

Testes podem ser encadeados. Em empresas onde são feitos muitos testes, um cuidado a se tomar é a interferência que experimentos possuem entre sí. Testes encadeados geralmente são feitos de forma **mutuamente exclusíva**, o que significa que os participantes do experimento A não serão expostos ao experimento B e vice e versa. Outra forma é executar testes de forma **sequencial**, onde um teste termina para que outro comece. Testes mutuamente exclusivos e sequenciais reduzem o possível ruído causado pelas induções de tratamento feitas pelo pesquisador. Um [post na documentação do Optimizely](https://help.optimizely.com/Build_Campaigns_and_Experiments/Mutually_exclusive_experiments_in_Optimizely_Classic){:target="\_blank"} explica bem a questão usando um exemplo de um teste na home de um site e outro na busca:

![múltiplos experimentos]({{ "/assets/images/blog/2017-11-29-estatistica-em-testes-para-nao-matematicos-part-6-image-4.png" | absolute_url }})

Múltiplos experimentos podem ser úteis para reduzir o tempo necessário na execução de testes, desde que haja amostra o suficiente.

### Expiração de cookies

Pelo fato de visitantes de sites e apps serem basicamente anônimos, o cookie é a forma pela qual ferramentas os identificam. Isso é importante para manter a consistência do experimento. Se o visitante retornar ao produto após ter sido selecionado para participar do teste, a experiência precisa se manter consistente. Há alguns problemas com cookies:

- Podem ser deletados pelo participante do teste ou bloqueados
- Não são cross browser ou multi plataforma
- Possuem data de validade

Em suma, sem cookies a garantia de qualidade da amostra é zero. Com cookies a garantia de qualidade da amostra é algo acima de zero. A data de expiração de cookies varia conforme a ferramenta sendo usada. A documentação do [VWO](https://vwo.com/knowledge/what-are-the-cookies-stored-by-vwo/){:target="\_blank"} por exemplo, diz que o tempo de vida dos cookies que a ferramenta instala é de 100 dias. Geralmente isso pode ser modificado pelo projetista de testes conforme a necessidade e não pode ser modificado após o início de um teste.

Dada a instabilidade de cookies para identificar participantes de teste, não é possível afirmar que amostras online estão livres de ruídos, por mais cuidado que o projetista de testes tenha tido. Quanto maior o tempo do teste, mais ruído vai sendo acrescentado às amostras. Um teste que roda por tempo demais, por exemplo, pode ter um percentual razoavelmente grande da amostra com ruídos, a ponto de invalidar os achados do teste. É comum assumir que testes que rodam por mais de 30 dias já tenham uma quantidade considerável de ruídos no grupo de estudo.

### Sazonalidade e características temporais

Eventos sazonais são exporádicos. Acontecem apenas em determinado momento. Recentemente tivemos a Black Friday, um exemplo de evento sazonal. A recomendação é evitar fazer testes nestes períodos pois possivelmente o grupo de estudo se comportará de forma diferente dos demais períodos. Pense que alguém que entra em um e-commerce em um dia comum está buscando um produto com determinadas características, e preço baixo pode ou não ser uma delas, enquanto alguém que entra em um e-commerce durante a Black Friday está provavelmente buscando preços baixos.

Além da sazonalidade, o grupo de estudo pode se comportar de maneira diferente em determinados períodos, como finais de semana. Dependendo do tipo de negócio e produto, menos pessoas acessam aos finais de semana. Mesmo durante a semana podem haver diferenças. Pode ser que toda quarta a noite os clientes de um e-commerce recebam um e-mail com ofertas exclusivas e parte deles se interessam por isso.

### Cross browser e múltiplos dispositivos

A maior das dificuldades quando se trata de testes é identificar a experiência entre vários browsers e dispositivos. Mesmo dentro de um browser, o visitante pode optar por usar o modo de navegação anônima e depois voltar em uma sessão normal, contabilizando duas vezes a mesmsa pessoa. Diferentes browsers serão contabilizados como diferentes usuários e o mesmo vale para diferentes dispositivos, mesmo que pertençam a mesma pessoa. Há algumas formas para diminuir o ruído gerado mas não há formas conhecidas de eliminar completamente o problema, como testar com base em [regiões geográficas](https://www.goinflow.com/ab-testing-cross-device-world/){:target="\_blank"} ou [usar o Google Analytics Universal com User IDs](https://conversionxl.com/blog/sample-pollution/){:target="\_blank"}, o que requer um sistema de login implementado e uma view específica no Google Analytics para contabilizar sessões entre múltiplos dispositivos.

Amostras sempre terão algum ruído, o que dá pra fazer é colocar alguma das medidas de segurança citadas para tentar diminuir esse ruído.

## Significância estatística e tamanho da amostra

Além de calcular tamanho de amostra e duração do teste, há calculadoras de significância estatística. Significância estatística é conhecida também como o complemento de alfa, ou 1 - alfa. Esse número é muito mais comum de ser usado por calculadoras ou ferramentas de teste pois é de mais fácil compreensão por quem não tem uma base estatística e precisa executar testes. As calculadoras de significância estatística recebem como entrada o nível de significância estatística, o número de visitantes e de eventos de conversão observados em cada variação. A calculadora do [AB Test Guide](https://abtestguide.com/calc/){:target="\_blank"} aceita como entrada também a opção de escolha entre testes com uma cauda e duas caudas.

![calculadora de significância estatística da AB Test Guide]({{ "/assets/images/blog/2017-11-29-estatistica-em-testes-para-nao-matematicos-part-6-image-5.jpg" | absolute_url }})

Neste exemplo, o teste é com duas caudas e por isso é possível determinar pioras na performance de um tratamento contra o grupo de controle.

## Diferenças entre números reportados no painel de uma ferramenta de testes e em uma ferramenta de analytics

É normal que os números de acessos e conversões reportados no painel de ferramentas de teste sejam diferente daqueles visualizados em um software de analytics. Há diversos motivos pra isso mas alguns deles são a diferença na forma como um software de analytics e um de testes registram visitantes únicos, sessões e eventos de conversão, erros na implementação de algum dos scripts e a diferença de tempo no carregamento dos scripts. Dada a dificuldade de identificar visitantes online cada fabricante encontrou uma solução para o problema que apresenta diferenças em relação as demais.

Uma forma de igualar as visualizações é usar a ferramenta de analytics como painel de relatórios e enviar dados de testes para lá.

## O viés comercial de ferramentas para testes online

A proposta de valor oferecida pela maioria das ferramentas mais conhecidas é que o projetista de testes se livra de ter que saber estatística para trabalhar com testes. Para atingir esse objetivo, fabricantes assumem valores padrão para algumas variáveis como o beta (e consequentemente seu complemento, o poder estatístico) ou se o teste é com uma ou duas caudas. Pode até ser possível que um projetista não precise saber absolutamente nada sobre estatística para executar testes e consiga usar tais ferramentas. O problema nesse caso passa a ser a falta de ferramentas para questionar os números obtidos e sua validade em relação a realidade do negócio. Como falei no [começo da série]({{ absolute_url }}{% post_url 2017-11-22-estatistica-em-testes-para-nao-matematicos-parte-1 %}), um pouco de matemática pode enriquecer a análise de um teste. Estatística pode também dar munição ao projetista de testes para não se tornar refém de ferramentas e calculadoras que executam tais cálculos em uma estrutura de caixa preta.

## Leitura complementar

Dois posts da ConversionXL que recomendo são a [execução de múltiplos testes simultaneamente](https://conversionxl.com/blog/can-you-run-multiple-ab-tests-at-the-same-time/){:target="\_blank"} e os motivos que levam a [poluição de amostras](https://conversionxl.com/blog/sample-pollution/){:target="\_blank"}.

Bora otimizar conversões!

---
layout: post
title:  'APIs e Carrinhos de Supermercado'
date:   2018-07-04 21:20:00
categories: [Desenvolvimento]
image: '/assets/images/blog/2018-06-04-apis-e-carrinhos-de-supermercado.jpg'
image_credit: 'Visual Hunt'
---

Como é de costume em minha área de atuação, tive que apresentar conceitos técnicos para uma audiência não técnica. O assunto da vez: [APIs]({% post_url 2017-12-12-fundamentos-das-apis %}). APIs possuem bastante valor de negócio, seja na redução de custos para operar certas tecnologias, aumentar a performance de aplicativos ou aumentar a escalabilidade. Consegui explicar o conceito fazendo uma analogia bem simples: compras. Ao longo deste post, você saberá o que é uma API, para que serve e quais suas vantagens sem precisar conhecer os jargões que assombram esta tecnologia.

<!--more-->

## Vamos as compras

Não sei você, caro leitor, mas aprendi com minha familia a fazer as tais compras do mês: todo começo de mês vou ao supermercado e compro o que vou consumir ao longo do mês ~~(e algumas guloseimas saborosas que diminuem minha expectativa de vida)~~. Quando chego no supermercado, a primeira coisa que faço é ir buscar um carrinho. Com carrinho em mãos, passeio pelos corredores do supermercado e vou analisando cuidadosamente os produtos nas gôndolas. Levo na mente uma listinha do que vou comprar mas gosto de ver o que tem de novo nas gôndolas. Passo setor a setor do supermercado colocando no carrinho os produtos que preciso até encher. Ao final, passo no caixa, ele registra produto a produto e me cobra o valor de tudo o que foi colocado no carrinho multiplicado pelas quantidades de cada produto. Por fim, levo tudo e vou embora pra casa ~~tomando yogurt~~.

## Vamos as compras: modo API

O processo de ir as compras é similar ao que ocorre no ambiente digital. Dando nome aos bois:

**Carrinho de supermercado**: A representação das nossas queridas APIs.

**Supermercado**: Um banco de dados cheio de coisas que queremos comprar.

**Caixa**: Um guardião que garante que temos permissão para comprar o que queremos comprar.

**Produtos**: Dados. Muitos dados!!! (ou não).

E a jornada de compras digital fica assim:

Quero fazer comprar, só que não vou mais ao mercado andando ou de carro. Vou falar com a API, um carrinho de compras super inteligente, pra ela ir buscar minhas comprar. Entrego pra ela a listinha das coisas que quero comprar (e dessa vez a listinha tem **exatamente** o que eu quero), e também entrego uma autorização dizendo que: 1. A API pode fazer as compras em meu nome. 2. Pedindo autorização para o dono do supermercado pra comprar dados, ou produtos, no supermercado dele (o dono tem o costume de não deixar qualquer um comprar no mercado dele). Com a lista e a autorização em mãos, a API vai para o supermercado digital, nosso banco de dados, buscar o que está na lista. O supermercado onde a API vai, no entanto, é um pouco diferente: o caixa fica na entrada. a API passa no caixa primeiro pra depois pegar os produtos. O caixa pega a listinha de produtos e a autorização da API, leva para o dono do supermercado e pergunta pra ele se eu posso comprar o que está na lista. Se o dono do supermercado autorizar, a API passa nas prateleiras onde estão os produtos da listinha, enche o carrinho, sai do supermercado e me entrega em casa, rápido assim!

## Traçando um paralelo entre APIs e compras

Carrinhos de compras possuem uma capacidade em relação ao tanto de objetos que podem levar, o dinheiro que tenho no cartão não é infinito, o caixa conta cada centavo e eu não posso ficar passeando pelos corredores. Estas são todas verdades (a do dinheiro também, infelizmente) aplicáveis ao fascinante mundo das APIs. Veja como:

1. APIs possuem uma capacidade pra carregar coisas. A capacidade não é definida por espaço físico, no entanto, e sim pelo nível de acesso que ela tem para comprar. Esse nível de acesso pode ser ditado por dinheiro mas também por permissões de usuário. Se uma criança vai ao supermercado, por exemplo, ela ~~provavelmente~~ não terá permissão para levar cigarros ou bebidas alcólicas. Ou num exemplo corporativo, eu posso pedir para uma API buscar o nome de todos os meus colegas de trabalho mas não o salário deles (a não ser que o financeiro aprove).
2. Dinheiro pode ou não ser uma moeda de troca. Eu nunca fui em um supermercado onde tivesse que pagar pra usar um carrinho. Mas APIs são carrinhos de outro nível! Algumas só podem ser usadas mediante pagamento. Tem outras que são de uso gratuito só pra passar em alguns corredores e pegar alguns produtos. Pra acessar produtos mais premium é necessário pagar uma taxa.
3. O caixa digital é mais do que um caixa, é um guardião. A preocupação dele é saber se sou um cidadão vip (autorizado pelo super dono da supermercado) para que a API entre no supermercado usando meu nome. Se a API passou pelo caixa, tá tudo certo! As vezes o caixa pode deixar a API passar com ressalvas, como "você pode ir, mas não pode entrar na seção de bebidas alcólicas como você havia pedido, o dono não deixou". A API segue a vida, sem passar onde não pode.
4. APIs são bem objetivas: olham o que está na listinha, passam nos corredores certos pra pegar e tchau! Sem rodeios ~~(e sem guloseimas que possam diminuir minha expectativa de vida, pra bem ou pra mal)~~.

Fazer compras com a ajuda da API é rápido, eficiente e o custo do frete é baixíssimo (eletricidade gasta no processo). O dono do supermercado pode parecer um tanto ranzinza mas ele faz isso para garantir que os produtos de sua loja sejam bem usados por quem pode usá-los.

## Explicações cotidianas to the rescue

Entender como APIs funcionam e porque são importantes pode ser útil para ajudar audiências não técnicas a tomarem decisões estratégicas quanto a implementação e uso destas tecnologias. Um profissional que entenda de tais tecnologias pode ajudar a organização a decidir pela sua adoção ou não. Este exemplo me ajudou a passar o conceito e espero que ajude outros!

## Leitura complementar

Desafio: leia o que [escrevi sobre APIs em outro post]({% post_url 2017-12-12-fundamentos-das-apis %}) e me diga se está fácil de entender (spoiler: tem jargão e código).

Bora usar APIs!

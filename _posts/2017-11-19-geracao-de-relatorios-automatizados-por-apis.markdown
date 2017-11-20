---
layout: post
title:  'Geração de relatórios automatizados por APIs'
date:   2017-11-19 13:13:00
category: Growth
image: '/assets/images/blog/2017-11-19-geracao-de-relatorios-automatizados-por-apis-featured.jpg'
---

Recentemente me envolvi em um projeto em que eu precisava construir um repositório de alimentação de relatórios. As fontes que continham as informações de interesse estavam espalhadas em pelo menos 6 sistemas diferentes e juntar essas informações semanalmente demandava algumas horas de um dia, o que tornava a manutenção desses relatórios bem cara se pensarmos no valor/hora de uma pessoa.

<!--more-->

## Benefícios da automação

Automação é fundamental para pensar em produtividade e escalabilidade. Automatizar tarefas com algum grau de repetitividade significa aproveitar melhor o tempo para pensar em questões mais estratégicas ou táticas de um negócio. Para uma startup é simplesmente uma questão de sobrevivência pensar desta forma. Uma automação bem feita significa também redução de custos uma vez que é possível escalar cada vez mais rápido com pouco ou nenhum aumento nos custos necessários para manter a operação. Uma mal feita, ao contrário, custa para manter e não escala apropriadamente.

Hoje em dia há centenas de ferramentas com paineis de gestão de informações sobre quaisquer aspéctos de um negócio. Podemos citar gestão de anúncios, CRM, analytics, sistemas administrativos e tantos outros. Acontece que muitas dessas informações precisam ser extraídas e combinadas em diferentes visões para auxiliar tomadores de decisão e nem sempre há uma integração nativa entre sistemas configurada para montar essas visões. Esse cenário gera inúmeras planilhas e documentos carregados com dados de vários sistemas que são baixados e tratados manualmente, portanto, sujeito a falhas humanas e dedicação de tempo em uma tarefa extremamente operacional.

Planilhas, por um lado, são extremamente dinâmicas no que diz respeito as possibilidades para tratamento dos dados inseridos. Há muitos casos em que faz sentido manter uma planilha atualizada com certa frequência em prol de construir uma ferramenta, especialmente se o orçamento for baixo. O trabalho que desenvolvi foi em uma destas planihas, que continha diversas informações que davam um panorama da saúde da empresa como um todo.

## Automação com APIs

As fontes das quais precisei extrair dados permitem não só a exportação dos dados para planilha mas também em um formato chamado JSON. O nome é um acrônimo para Javascript Object Notation e esse tipo de arquivo é muito usado para criar comunicações entre sistemas que, a priori, não se entendem. Um exemplo desse formato seria:

{% highlight JSON %}
{
  "nome": "Adwords",
  "conta": "xpto",
  "gasto_total": "48032.44",
  "impressoes": "188492"
}
{% endhighlight %}

Onde cada entrada consiste de dois valores, em forma de chave e valor. O valor à esquerda representa um identificador enquanto o valor à direita (após os dois pontos) consiste em um valor. Os valores são agrupados em chaves e ao grupo se dá o nome de objeto. Um objeto pode conter vários conjuntos de chave / valor dentro dele e armazenar até mesmo outros objetos.

O JSON é um formato útil por ser padronizado e entendido por diferentes linguagens de programação. Todas as linguagens mais conhecidas possuem uma forma para preparar objetos JSON para envio pela internet (serialização) e recebimento dos objetos para uso na aplicação (desserialização). É este formato que é entregue pela maioria das ferramentas. A entrega do JSON acontece por meio de chamadas a um serviço dentro das ferramentas chamado de API, ou Application Programming Interface. Este serviço funciona como uma ponte que entrega determinados dados conforme solicitado e estes dados são entregues por meio de endereços especiais chamados de endpoints.

## Um exemplo prático de funcionamento de APIs

Imagine que você queira saber as avaliações dadas pela crítica ao filme Batman: O Cavaleiro Das Trevas Retorna. Uma base de dados como a [OMDB](http://www.omdbapi.com/){:target="\_blank"} possui as informações que você busca e disponibiliza uma API para fazer a consulta. Basta acessar o endpoint http://www.omdbapi.com/?apikey=<strong>suaapi</strong>&t=Batman+The+Dark+Knight e você terá uma informação como esta:

{% highlight JSON %}
{
  "Title": "Batman: The Dark Knight Returns, Part 1",
  "Year": "2012",
  "Rated": "PG-13",
  "Released": "25 Sep 2012",
  "Genre": "Animation, Action, Adventure",
  "Language": "English",
  "Country": "USA",
  "Awards": "5 nominations.",
  "Metascore": "N/A",
  "imdbRating": "8.0",
  "imdbVotes": "42,023",
}
{% endhighlight %}

A porção do endereço com o termo "suaapi" se refere a autenticação, que nada mais é do que uma chave de segurança que evita o mau uso da API. O JSON retornado foi simplificado mas a avaliação buscada retornou na chave / valor de identificador "imdbRating", com o valor 8.0. Talvez você ainda esteja se perguntando qual a utilidade de ter o trabalho para fazer a chamada certa ao endpoint e o resultado ser um bloco de texto com um formato estranho. É aqui que começamos a falar de automação: este trabalho pode ser feito uma única vez e configurado para ser re-executado sempre que você quiser, desta forma o objeto JSON que retorna terá sempre os valores mais recentes a sua disposição. É necessário agora manipular o objeto para extrair apenas o que for necessário.

## De volta ao projeto de automação

As ferramentas com as quais trabalhei para extrair as informações que precisava possuem APIs com vasta documentação e diversos endpoints para puxar dados diferentes. Uma vez que capturei os objetos JSON o trabalho foi alimentar a fonte normalizada, isto é, o local que recebeu e tratou os dados vindos dos sistemas. Esse local, que serviria de fonte para o painel de relatórios, foi uma planilha criada no Google Sheets. O Google Sheets foi escolhido por possuir uma ferramenta de criação de scripts chamada [Google Apps Script](https://www.google.com/script/){:target="\_blank"}, usada para estender as capacidades padrão das ferramentas do Google. Uma de suas maiores vantagens, no entanto, está em possuir uma forma de se comunicar com a internet e fazer a leitura de arquivos externos. Nesse caso, precisava fazer a leitura dos objetos JSON e colocá-los em uma planilha então foi perfeito.

Com o editor de scripts aberto, algumas poucas linhas de código já me trouxeram os objetos JSON que precisava:

{% highlight javascript %}
var spreadsheet = "https://sheets.google.com/id=spreadsheet1";
var sheet = SpreadsheetApp.openByUrl(spreadsheet).getSheetByName("name");
// Essa chamada irá retornar um JSON como o do exemplo acima
var url = "http://www.omdbapi.com/?apikey=suaapi&t=Batman+The+Dark+Knight";
var response = UrlFetchApp.fetch(url);
var json = JSON.parse(response);
// Como eu só quero a informação de avaliação, seleciono apenas ela dentro do JSON retornado
sheet.getRange("A1").setValue(json.imdbRating);
{% endhighlight %}

Isso poderia ter sido feito de várias formas mas o processo é idêntico: fazer a chamada ao endpoint, capturar o JSON retornado, prepará-lo para uso (desserializá-lo) e colocar o valor no local desejado. Usei o exemplo do OMDB pois a API é pública, diferente das que eu usei no caso prático.

Para finalizar, o próprio editor de scripts dos aplicativos do Google possui uma opção para definir uma periodicidade para execução dos scripts. Apenas configurei a ferramenta para executar a cada hora e voilá, construí uma fonte de dados automatizada! É importante ficar atento a atualizações nas APIs e seus endpoints mas não é todo dia que isso acontece então você pode se dar ao luxo de concentrar seus esforços e tempo em compreender os dados que estão chegando ao relatório e não na manutenção dele.

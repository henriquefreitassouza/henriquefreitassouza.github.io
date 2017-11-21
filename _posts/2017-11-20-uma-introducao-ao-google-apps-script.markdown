---
layout: post
title:  'Uma introdução ao Google Apps Script'
date:   2017-11-20 15:05:00
category: Growth
image: '/assets/images/blog/2017-11-20-uma-introducao-ao-google-apps-script-featured.jpg'
---

No meu [último post]({% post_url 2017-11-19-geracao-de-relatorios-automatizados-por-apis %}) falei brevemente sobre o [Google Apps Script](https://www.google.com/script/){:target="\_blank"}, um produto do Google usado para estender as capacidades dos demais produtos da empresa e fazer automações. Irei entrar mais a fundo nas capacidades da ferramenta e como ela pode poupar um tempo considerável de quem trabalha com marketing ou produto e está sempre coletando e tratando dados para relatórios.

<!--more-->

Usei o Google Apps Script pela primeira vez quando precisei trazer dados de fontes externas para dentro de uma planilha que estava no Google Sheets. O trabalho que fiz foi parecido com o que descrevi no post anterior: consumir os dados pra tratar e alimentar as células corretas na planilha. Meu interesse na ferramenta me levou a estudá-la mais a fundo para saber o que mais é possível realizar. Acabei descobrindo umas coisas bem legais e úteis que irei compartilhar neste post.

## O Google Apps Script

A ferramenta nada mais é do que um editor de scripts. A linguagem usada é um porte do Javascript para ser usado em aplicações de pequeno porte, como o caso de scripts de automação. Quem já está acostumado a trabalhar com Javascript ou linguagens similares não precisa aprender uma nova linguagem para usar o editor de scripts. A diferença do Javascript usado dentro do Google Apps Script é que ele possui diversas classes já implementadas para manipular outros aplicativos do Google e auxiliadores para realizar tarefas como chamadas a documentos externos.

Além de modificar conteúdo dentro de documentos criados em aplicativos como o Google Docs, o Google Spreadsheets ou o Google Slides, os scripts permitem fazer uma infinidade de coisas como criar novos menus dentro dos documentos, disparar e-mails pelo Gmail, criar e organizar documentos no Drive, consumir APIs como a do Google Maps e construir workflows inteiros para citar apenas algumas coisas. Dentro da documentação da ferramenta há uma página dedicada a [cases](https://developers.google.com/apps-script/guides/support/case-studies){:target="\_blank"} feitos por usuários.

## Como usar o Google Apps Script

Essencialmente há duas formas de criar scripts com a ferramenta: criar o script vinculado a um documento do Google existente no Drive ou criar um script sem associação a documentos.

### Scripts vinculados a documentos

Algumas das funcionalidades que citei anteriormente, como criar menus em documentos, são possíveis de serem feitas apenas em scripts vinculados a documentos. Estes scripts recebem permissões e métodos especiais quando criados com uma vinculação a um documento. Uma vez vinculado, o script não pode ser desvinculado do documento. Para criar um script vinculado a um documento basta abrir o menu Ferramentas > Editor de scripts.

![Acesso ao editor de scripts]({{ "/assets/images/blog/2017-11-20-uma-introducao-ao-google-apps-script-image-1.jpg" | absolute_url }})

Uma vez aberto, o editor de scripts irá carregar com um arquivo em branco chamado Code.gs criado.

![Acesso ao editor de scripts]({{ "/assets/images/blog/2017-11-20-uma-introducao-ao-google-apps-script-image-2.jpg" | absolute_url }})

A interface do painel é a mesma independente de o documento criado estar vinculado a um documento ou não. O painel lateral esquerdo mostra os arquivos que fazem parte do projeto e a porção direita contém o conteúdo do arquivo que está sendo usado no momento. No caso do arquivo Code.gs há apenas uma função pré definida chamada myFunction. É necessário informar na ferramenta qual a função que deve ser chamada no momento da execução do script, o que deve ser feito no menu Executar > Executar função > Nome da função, onde nome da função é a função que está definida dentro do arquivo que irá rodar.

![Acesso ao editor de scripts]({{ "/assets/images/blog/2017-11-20-uma-introducao-ao-google-apps-script-image-3.jpg" | absolute_url }})

Para visualizar qualquer saída que o script gerou basta visualizar o log do console.

![Acesso ao editor de scripts]({{ "/assets/images/blog/2017-11-20-uma-introducao-ao-google-apps-script-image-4.jpg" | absolute_url }})

Este log é diferente do log de execução. Enquanto o log de execução registra as saídas da execução do script o log do console registra dados enviados pelo usuário e exceções de execução de funções. Para enviar dados ao log, seja para testar uma saída por exemplo, use:

{% highlight javascript %}
Logger.log("Hello World!");
{% endhighlight %}

![Acesso ao editor de scripts]({{ "/assets/images/blog/2017-11-20-uma-introducao-ao-google-apps-script-image-5.jpg" | absolute_url }})

Outra funcionalidade interessante do Google Apps Script é configurar os chamados triggers, que ficam a espera de um determinado evento para executar uma ação associada a ele. Triggers possuem duas categorias: temporais e com base em evento. Triggers temporais disparam periodicamente, sendo o período determinado pelo usuário, e triggers baseados em evento disparam quando determinado evento ocorre. Alguns destes triggers são:

{% highlight javascript %}
function onEdit(e) {
  // TODO
}

function onChange(e) {
  // TODO
}

function onOpen(e) {
  // TODO
}
{% endhighlight %}

São implementados como funções porém os nomes acima são entendidos como triggers e o código dentro destas funções é executado quando o evento ocorre. Uma aplicação prática no Google Spreadsheets, por exemplo, é dar uma resposta para usuários após certas alterações em planilhas. Considere o exemplo:

{% highlight javascript %}
function onEdit(e) {
  if (e.range.getA1Notation() == "L8") {
    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.getRange("L9").setValue(e.oldValue);
  }
}
{% endhighlight %}

Esta função escuta o evento de edição em qualquer célula da planilha a qual está associada, verifica se a célula alterada é a da posição L8 e então atualiza outra célula com base na edição, inserindo o valor que a célula continha antes da modificação.

![Acesso ao editor de scripts]({{ "/assets/images/blog/2017-11-20-uma-introducao-ao-google-apps-script-image-6.jpg" | absolute_url }})

Há muito mais possibilidades de uso para o Google Apps Script. Imagine que você tenha um documento com uma lista de contatos armazenada no Drive. Você pode criar um script para capturar os contatos dessa lista, cadastrar no Google Contacts e então disparar um e-mail para a base pelo Gmail. Se o procedimento deve ser feito com certa frequência, um trigger configurado é o suficiente para ter esse processo automatizado.

### Scripts sem vinculação a documentos

As possibilidades de uso de scripts sem vinculação a documentos são similares as de scripts vinculados. Diferente dos primeiros, eles aparecerão no Drive como arquivos e podem ser usados para criar Web Apps ou servir de utilitários, como um automatizador de tarefas. Um exemplo seria organizar novos arquivos que entram no Drive em uma determinada pasta ou com determinado nome.

## Web Apps

Scripts com e sem vinculação a arquivos podem ser transformados em Web Apps, o que significa que eles podem ser usados para interagir com aplicações externas. Estes scripts precisam conter pelo menos uma destas duas funções:

{% highlight javascript %}
function doGet(e) {
  //TODO
}

function doPost(e) {
  //TODO
}
{% endhighlight %}

O retorno delas deve ser um objeto contendo HTML ou texto e ser do tipo HtmlOutput ou TextOutput, respectivamente. Para interagir com o script via uma aplicação web basta publicar esse script como um Web App, acessar seu endereço e passar os dados que serão manipulados pelo script.

## Recursos adicionais

Essas são apenas algumas das funcionalidades do Google Apps Script. Minha sugestão é que você coloque o [site da documentação](https://developers.google.com/apps-script/){:target="\_blank"} nos seus favoritos pois você fará muito uso dela. No link de [guias](https://developers.google.com/apps-script/overview){:target="\_blank"} há projetos de fácil execução para quem já quer colocar a mão na massa e aprender fazendo na seção "5-Minute Quickstarts" e em [suporte](https://developers.google.com/apps-script/support){:target="\_blank"} há links para perguntas feitas no Stack Overflow e outros recursos.

Bora automatizar!

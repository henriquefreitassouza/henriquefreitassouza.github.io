---
layout: post
title:  'Os fundamentos das APIs'
date:   2017-12-12 21:34:00
categories: [Desenvolvimento]
image: '/assets/images/blog/2017-12-12-fundamentos-das-apis-featured.png'
image_credit: 'Pixabay'
---

APIs são extremamente úteis para automatizar processos e personalizar fluxos de trabalho. Do ponto de vista técnico, contribuem para o desenvolvimento de aplicações distribuídas. Saber trabalhar com APIs é fundamental para criar aplicações que sejam capazes de se comunicar com o mundo exterior, indispensável para serviços atuais.

<!--more-->

No meu [primeiro post neste blog]({{ absolute_URL }}{% post_url 2017-11-19-geracao-de-relatorios-automatizados-por-apis %}), falei um pouco sobre como usei APIs para automatizar a extração de dados para um relatório em planilhas. Entrarei mais nos detalhes de como fiz isso.

Antes, o que é uma API? API é a sigla para Application Programming Interface, ou Interface de Programação de Aplicação. APIs são canais para troca de informação entre sistemas. APIs fornecem ou recebem dados de fontes terceiras que projetistas de software podem usar em suas próprias aplicações. Apesar de serem conceitos similares, existem algumas diferenças entre APIs e os chamados **webhooks**, que são notificadores de eventos. Enquanto APIs são explicitamente chamadas por uma aplicação, webhooks notificam esta aplicação na ocorrência de determinado evento. Exemplos de webhooks são os usados em gateways de pagamento. Quando um cliente faz uma compra, uma notificação é enviada para o lojista, que despacha a mercadoria (no caso de uma compra física em uma loja virtual). Chamadas a webhooks podem inclusive ser feitas com APIs.

## O funcionamento das APIs

As principais aplicações de negócio para APIs são integrar sistemas e automatizar processos. A integração consiste na construção de um fluxo de informação por onde dados trafegam entre dois ou mais pontos e a automação é coletar, processar, armazenar e entregar dados sem uma constante intervenção humana. APIs reduzem custos e aumentam desempenho de operações. Web services costumam fazer uso de APIs.

A arquitetura na qual APIs funcionam envolve pelo menos duas entidades: um **cliente**, que solicita informações, e um **servidor**, que entrega as informações solicitadas. A comunicação entre essas entidades acontece por meio de um **protocolo**, que é um conjunto de regras conhecidas por emissores e receptores. Como os dados trafegam pela web, o protocolo usado geralmente é o **HTTP**. Uma requisição feita pelo protocolo HTTP possui quatro partes:

- URL: o endereço do local onde estão os dados.
- Método: a operação que será realizada no servidor. Pode ser GET, POST, PUT e DELETE.
- Cabeçalhos: informações adicionais a serem enviadas com os dados.
- Corpo: os dados que serão enviados.

E uma resposta possui três partes:

- Código de status: um número com três digitos que informa o status da operação requisitada pelo cliente.
- Cabeçalhos: informações adicionais a serem recebidas com os dados.
- Corpo: os dados que serão recebidos.

Os principais formatos de dados que trafegam por apis são **XML** e **JSON**.

XML possui uma estrutura similar a HTML:

{% highlight xml %}
<pedido>
  <item>
    <nome>Smartphone</nome>
    <preco>899.99</preco>
  </item>
  <item>
    <nome>Smart TV</nome>
    <preco>1299.99</preco>
  </item>
  <total>2199.98</total>
  <status>aguardando pagamento</status>
</pedido>
{% endhighlight %}

E JSON é bem similar a objetos Javascript:

{% highlight json %}
{
  "pedido": {
    "items": [
      {
        "nome": "Smartphone",
        "preco": 899.99
      },
      {
        "nome": "Smart TV",
        "preco": 1299.99
      }
    ],
    "total": "2199.98",
    "status": "aguardando pagamento"
  }
}
{% endhighlight %}

Além de serem baseadas no protocolo HTTP e usarem formatos de dados já estabecidos, a forma como APIs são construídas também possuem padrões. Os dois padrões mais conhecidos são **SOAP** e **REST**. Enquanto SOAP é um protocolo, REST é um estilo arquitetural, ou uma forma de organização dos componentes usados na comunicação entre sistemas. [As principais diferenças entre os dois](https://blog.smartbear.com/apis/understanding-soap-and-rest-basics/){:target="\_blank"} são:

- SOAP pode ser usado com outros protocolos que não o HTTP e usa XML.
- REST é baseado em HTTP e consegue trabalhar com diferentes formatos de arquivo.

REST é o formato mais usado para construir APIs pois possui uma curva de aprendizado menor e é mais rápido se comparado ao SOAP.

## Autenticação

Pode ser que seja necessário fornecer credenciais ao servidor ao qual uma API se conecta para estabelecer uma comunicação. A autenticação pode ser feita das seguintes formas:

- Fornecendo um usuário e senha.
- Fornecendo uma chave de autenticação.

Autenticação com usuário e senha é feito enviando as credenciais codificadas no header Authentication e há mais de uma forma de autenticar com chaves de autenticação. Algumas são:

- Enviando a chave de autenticação junto com a URL na forma de um parâmetro.
- Enviando a chave de autenticação dentro do header Authentication.
- Enviando a chave de autenticação no corpo da requisição.
- Usando o protocolo de autenticação Oauth.

### Autenticação com usuário e senha

O envio de usuários e senhas pelo header Authentication é feito da seguinte forma, exemplificado em [cURL](https://curl.haxx.se/){:target="\_blank"}:

**curl -H "Authorization: Bearer base64(\<usuário>:\<senha>)" \<url\>**

Onde base64(\<usuário\>:\<senha\>) é o par de credenciais codificadas em base 64, necessário para enviar informações de autenticação via headers. A junção do usuário e senha se dá por dois pontos (:) e se não há senha, ao final do usuário basta inserir os dois pontos.

### Autenticação com chave

A chave de autenticação substitui o uso de usuários e senhas e é gerada dentro de uma aplicação protegida por credenciais. A forma mais simples de obter tal chave é fazer o login em um aplicativo que possua API e gerar a chave de autenticação. Essa chave pode estar associada a permissões de uso dependendo dos recursos que o fabricante disponibiliza. A chave pode dar acesso de visualização ou de escrita para determinados dados ou todos eles.

Uma vez que a chave tenha sido gerada, é possível usá-la para fazer a autenticação com o servidor. Uma das formas de autenticar com chaves é a enviando junto com a URL de requisição como parâmetro:

**https://api.servico.com/dados?api_key=chave_de_autenticacao**

Onde api_key é o nome do parâmetro e chave_de_autenticacao é a chave gerada pela aplicação detentora dos dados. O nome do parâmetro não possui padrão, é necessário descobrir na documentação de cada API como fazer a respectiva chamada.

É possível enviar chaves de autenticação pelo header Authentication. Neste caso a chave funciona como o usuário e não há senha, apenas os dois pontos no final da chave e o conjunto codificado em base 64.

Uma forma menos comum de autenticar com chave é enviá-la no corpo da requisição e novamente, a forma como o envio é feito varia em cada aplicação.

### Oauth

Dado que chaves de autenticação precisam ser armazenadas com segurança e sua gestão manual pode se tornar complicada, surgiu um protocolo de autenticação que é bem usado hoje em dia, chamado Open Authentication (Oauth). Este protocolo é seguro pois faz a gestão das chaves necessárias e faz uma espécie de autenticação em duas etapas por trás dos panos. A especificação atual do protocolo é a Oauth2. Há algumas variações na implementação do Oauth2 mas em geral funciona da seguinte forma:

- Uma solicitação de acesso ao sistema é enviada ao servidor.
- O solicitante é redirecionado para o servidor para se autenticar com usuário e senha.
- Uma vez autenticado, o solicitante recebe um código de autorização.
- Esse código de autorização é enviado para o servidor junto com uma chave do cliente, que é gerada na aplicação detentora dos dados.
- Uma vez que a combinação tenha sido aceita pelo servidor, o solicitante recebe um token de acesso.

Esse token pode ser usado para manipular os dados da aplicação. Algumas aplicações dão prazo de validade ao token para aumentar a segurança. Neste caso é necessário refazer o processo de autenticação. Acessos também podem estar associados a permissões específicas de uso.

## Usando uma API

Uma vez autenticado, a manipulação da API se dará por meio dos chamados **endpoints**, que são URLs que contém os dados que serão recuperados, enviados, modificados ou excluídos. Uma chamada a um endpoint como este, por exemplo:

**https://api.servico.com/dados**

Poderia dar um retorno como este:

{% highlight json %}
{
  "clientes": [
    {
      "nome": "Miguel",
      "email": "cliente1@servico.com",
      "telefone": "11 4446-9965"
    },
    {
      "nome": "Laura",
      "email": "cliente2@servico.com",
      "telefone": "13 4526-9847"
    }
  ]
}
{% endhighlight %}

O método usado no header neste caso foi o GET. Este é o método usado para recuperar informações do servidor. Os demais métodos são:

- POST: envia dados para o servidor.
- PUT: atualiza informações gravadas no servidor.
- DELETE: exclui dados do servidor.

Uma requisição do tipo POST terá um endpoint similar ao do GET e em seu corpo serão transmitidos os dados que serão gravados no servidor. Um exemplo de tal requisição usando o [Google Apps Script](https://developers.google.com/apps-script/){:target="\_blank"} seria:

{% highlight javascript %}
  var customer = {
    "nome": "Marcelo",
    "email": "cliente3@servico.com",
    "telefone": "11 9485-6685"
  };

  var options = {
    "method": "post",
    "payload": customer
  };

  response = UrlFetchApp.fetch("https://api.servico.com/dados", options);
{% endhighlight %}

Onde customer recebe o conteúdo que será enviado no corpo da requisição. O método foi declarado como POST na chave "method" das opções. Os métodos PUT e DELETE funcionam de forma similar ao POST.

APIs são extremamente simples de usar e fornecem uma interface segura para manipulação de dados. Elas são uma ponte que integra os mais variados tipos de serviço e tornam a web mais rica a cada dia. Embora possuam um padrão seguido pela indústria, cada aplicação possui seus detalhes que a diferem das demais. A documentação de uso da API é, então, fundamental para um bom entendimento das suas capacidades. E o [Stack Overflow](https://stackoverflow.com/){:target="\_blank"}, claro!

## Leitura complementar

A Zapier possui [um curso](HTTPs://zapier.com/learn/apis/){:target="\_blank"} bem detalhado sobre os fundamentos de APIs que vai desde o conceito até a forma de implementação em uma aplicação.

Bora integrar e automatizar!

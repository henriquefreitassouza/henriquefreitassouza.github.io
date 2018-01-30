---
layout: post
title:  'Google Apps Script com OAuth2'
date:   2018-01-29 14:42:00
categories: [Marketing, Desenvolvimento]
image: '/assets/images/blog/2018-01-29-google-apps-script-com-oauth2-featured.jpeg'
image_credit: 'Digital Ocean'
---

[Já escrevi em posts anteriores]({% post_url 2017-11-20-uma-introducao-ao-google-apps-script %}) sobre o [Google Apps Script](https://www.google.com/script/){:target="\_blank"} e como aproveitá-lo em projetos de automação de marketing. Essa ferramenta faz parte da suíte de aplicativos do Google e serve para criar extensões e plugins para os demais produtos da empresa. Vou explorar neste post um conceito importante para comunicação entre diferentes ferramentas e como usá-lo dentro do Google Apps Script: **OAuth2**.

<!--more-->

## O que é OAuth2?

Se trata da segunda versão de um protocolo de autorização em que recursos protegidos de algum tipo de sistema são acessados por usuários que possuam as devidas permissões. O que difere OAuth de outras formas de autorização é que o dono dos recursos protegidos não precisa compartilhar senhas de acesso. A implementação mais comum do protocolo é usada por empresas como [Google](https://developers.google.com/identity/sign-in/web/sign-in){:target="\_blank"} e [Facebook](https://developers.facebook.com/docs/facebook-login){:target="\_blank"}, que disponibilizam APIs para que sites e aplicativos possam criar sistemas de login com base na tecnologia desenvolvida por estas empresas. A segunda versão do protocolo OAuth é o padrão normalmente usado e não possui retrocompatibilidade. Caso precise de um refresh sobre o que são APIs e como funcionam, [leia meu post sobre o assunto]({% post_url 2017-12-12-fundamentos-das-apis %}).

## Por que usar OAuth?

Trabalhar com métodos como chaves de API requer quer o projetista de software utilize e armazene a chave de forma segura em sua aplicação. Embora alguns serviços tenham sistemas de permissão e restrição de uso das chaves, elas ainda estão sob a responsabilidade do desenvolvedor e são a única medida de segurança que impede pessoas não autorizadas a acessar recursos protegidos. Outro problema com chaves é que geralmente elas não levam em consideração o nível de privilégios que um usuário possui, o que torna difícil a distribuição correta das permissões. O protocolo OAuth trabalha com a ideia de tokens, chaves que podem ou não possuir um período de vida, possuem um escopo associado e pertencem a um único usuário.

Para exemplificar a diferença entre o funcionamento de OAuth com tokens e uma chave de API, por exemplo, imagine o seguinte cenário: alguém chega em um hotel e pede um quarto. O gerente dá a essa pessoa um bolo de chaves que abre todas as portas mesmo que ela vá usar apenas uma chave para entrar um quarto específico. Ao final da estadia, a pessoa vai embora e se esquece de devolver as chaves para o gerente. A experiência no hotel foi tão legal que ela resolve levar um conhecido, emprestando para ele o bolo de chaves com acesso a todos os quartos. No final do período, o hóspede faz a festa no hotel e vai embora, deixando terra arrasada por onde passou. Neste exemplo, a chave de API é o bolo de chaves. Essas chaves não expiram, acessam todos os cômodos do hotel e qualquer um pode usar.

Imagine agora a reescrita deste cenário: a mesma pessoa vai em um outro hotel e solicita um quarto. O gerente pergunta para quantas pessoas e se possui preferências particulares. Após a pessoa responder, o gerente separa uma chave, entrega na mão do hóspede e informa o número do quarto. Ao final da estadia a pessoa devolve a chave para o gerente e deixa o hotel. A experiência foi muito agradável e essa pessoa recomenda um conhecido. O conhecido vai conhecer o hotel e se depara com o gerente, que lhe pergunta que tipo de quarto ele gostaria. Após descrever um quarto diferente do amigo que o indicou, o gerente lhe entrega uma outra chave, que abre a porta de outro quarto. Ao final da estadia, o indicado devololve a chave para o gerente e vai embora. Neste segundo exemplo, a chave é um token. Essa chave é usada por um usuário específico para acessar um recurso específico e está a disposição deste usuário enquanto ele for hóspede do hotel. Este é o conceito usado no fluxo de autorização do OAuth: a autenticação e concessão dos recursos protegidos é administrada tendo em vista a segurança. Mesmo que outro usuário tenha acesso a um token de autenticação, esse token não terá utilidade se não for associado a ele.

## O fluxo de autorização do protocolo OAuth2

De forma geral, um fluxo OAuth2 funciona da seguinte forma:

- Um usuário executa uma ação que dá início ao fluxo, como clicar em um botão
- A aplicação que armazena os dados protegidos pede as credenciais do usuário
- Se as credenciais estiverem corretas, o usuário é identificado. Caso contrário, o sistema rejeita a entrada do usuário
- O usuário autenticado recebe um token que o permite acessas os recursos designados pelo dono dos dados protegidos
- O usuário requisita dados protegidos e passa seu token de acesso
- Se o token e o usuário são reconhecidos, os dados são concedidos

## Como OAuth2 e o Google Apps Scripts são usados em conjunto?

Serviços externos usam diferentes formas para autenticar e autorizar usuários, e as vezes podem usar mais de uma. No caso dos apps do Google, por exemplo, eles costumam ter a disposição tanto chaves de API quanto OAuth2. O Google Apps Script não possui suporte nativo a OAuth2 porém possui bibliotecas externas que podem ser adicionadas aos projetos criados na ferramenta. Vejamos na prática como todo o processo funciona conectando uma planilha do Google Sheets com o Google Search Console (antigo Webmaster Tools).

### 1. Crie um novo arquivo no Google Sheets

Crie um arquivo novo e vá em Tools > Script Editor. O editor de scripts é o Google Apps Script.

![Google Apps Script]({{ "/assets/images/blog/2018-01-29-google-apps-script-com-oauth2-image-1.jpeg" | absolute_url }})

Com exceção do arquivo Code.gs, os demais arquivos foram criados por mim. A primeira coisa a ser feita é instalar a biblioteca que dá suporte a OAuth2. Com o editor aberto vá em Resources > Libraries. O campo "Find a Library" busca bibliotecas disponíveis para extensão do script. O código da biblioteca OAuth2 usada neste post é 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF. Basta colar este código na caixa de busca e aparecerá a biblioteca. Selecione a versão mais recente (24 na época da escrita deste post) e selecione OK.

![Google Apps Script]({{ "/assets/images/blog/2018-01-29-google-apps-script-com-oauth2-image-2.jpeg" | absolute_url }})

### 2. Configure o projeto associado ao script da planilha no Google Cloud Console

O [Google Cloud Console](https://console.cloud.google.com/){:target="\_blank"} é uma plataforma sobre a qual são construídos aplicativos usados pelos serviços do Google, como plugins. Nesta plataforma são gerenciados os aplicativos criados por desenvolvedores e as credenciais de acesso que esses aplicativos possuem aos serviços do Google. Para acessar o Google Cloud Console vá em Resources > Cloud Platform project. Abrirá um modal com um link cujo texto possui o formato [nome-do-script]-project-id-[id-do-projeto], onde [nome-do-script] é o nome dado ao script associado a planilha e [id-do-projeto] é um identificador único atribuído pelo Google Cloud Console.

![Google Apps Script]({{ "/assets/images/blog/2018-01-29-google-apps-script-com-oauth2-image-3.jpeg" | absolute_url }})

Todo projeto criado no Google Apps Script cria também um projeto no Google Cloud Console, que é responsável pela gestão da autorização de uso de serviços tanto do Google quanto externos pelo script.

![Google Apps Script]({{ "/assets/images/blog/2018-01-29-google-apps-script-com-oauth2-image-4.jpeg" | absolute_url }})

Uma vez que o projeto esteja aberto, é necessário selcionar os serviços do Google que serão usados. Há um para o Search Console, que será usado neste post. Dentro da caixa "Getting Started" clique em "Enable APIs and get credentials like keys". No menu lateral, vá para "Library" e na caixa de busca digite "Search Console". O prmeiro resultado é o da API chamada "Google Search Console API". Clique nele e clique no botão "Enable".

![Google Apps Script]({{ "/assets/images/blog/2018-01-29-google-apps-script-com-oauth2-image-5.jpeg" | absolute_url }})

Selecionada a API, é necessário informar como será feito o processo de autorização aos dados que a API entregará. Existem basicamente dois tipos: chave de autenticação e OAuth2. Neste post será usada a opção OAuth2. No menu lateral, acesse a opção "Credentials" e na tela exibida, clique no botão "Create credentials". No drop down que surge, clique em "OAuth client ID".

![Google Apps Script]({{ "/assets/images/blog/2018-01-29-google-apps-script-com-oauth2-image-6.jpeg" | absolute_url }})

O Google Cloud Console pergunta que tipo de aplicativo o desenvolvedor está criando. Para trabalhar com o Google Apps Script é necessário selecionar a opção "Web application" e preencher as informações que surgem na porção inferior da tela. As duas informações necessárias para preenchimento são o nome do aplicativo e a URL de redirecionamento, que será usada para redirecionar o usuário após a autenticação. Embora seja obrigatório a especificação, a informação do nome do aplicativo não será usada fora do Google Cloud Console. A URL de redirecionamento será o próprio script do Google Apps Script, que irá manipular os recursos de dados usados. A URL de um script possui o formato https://script.google.com/macros/d/[SCRIPT ID]/usercallback, onde [SCRIPT ID] é o identificador do script gerado pela ferramenta. Esse id pode ser acessado em File > Project properties. Copie o id e monte o restante da URL.

![Google Apps Script]({{ "/assets/images/blog/2018-01-29-google-apps-script-com-oauth2-image-7.jpeg" | absolute_url }})

Configurado o projeto e a forma de autorização, duas informações serão disponibilizadas: um CLIENT ID e um CLIENT SECRET. Essas informações serão usadas para construir a URL de autenticação associada ao projeto, portanto serão usadas no código. Feitas estas configurações, copie estas credenciais e feche o Google Cloud Console.

![Google Apps Script]({{ "/assets/images/blog/2018-01-29-google-apps-script-com-oauth2-image-8.jpeg" | absolute_url }})

### 3. Escreva os códigos de autorização e chamadas a API

Agora que o Google Cloud Console está pronto para gerenciar requisições de um aplicativo externo é possível fazer chamadas a este serviço, contanto que existam credenciais com permissões de acesso aos recursos do Search Console. A primeira coisa a ser feita é escrever o código que será usado para autorizar usuários que queriam acessar o Search Console a partir da planilha. O editor de scripts criou um arquivo chamado Code.gs e uma função vazia. Eu recomendo a criação de um arquivo que contenha as variaveis globais do código para facilitar a manutenção. Renomeie este arquivo para "Variables.gs". Para renomear um arquivo, aponte o cursor do mouse para o triângulo próximo ao nome do arquivo. Clicando no triângulo irá surgir um drop down com três opções, uma sendo "Rename". Ao escolher um novo nome de arquivo ele será automaticamente renomeado.

Instancie as seguintes variaveis no arquivo:

{% highlight javascript %}
var CLIENT_ID = 'SEU_CLIENT_ID';
var CLIENT_SECRET = 'SEU_CLIENT_SECRET';
var SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
var SITE = 'SEU_SITE_NO_SEARCH_CONSOLE';

var searchConsoleData = spreadsheet.getActiveSpreadsheet().getSheetByName('Search Console');

var startDate = Utilities.formatDate(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), Session.getScriptTimeZone(), 'yyyy-MM-dd');
var endDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
{% endhighlight %}

CLIENT_ID e CLIENT_SECRET são as credenciais fornecidas pelo Google Cloud Console na criação no método de autorização. Coloque-as nos locais indicados por "SEU_CLIENT_ID" E "SEU_CLIENT_SECRET". O escopo de acesso é necessário para qualquer fluxo OAuth2 e representa o conjunto de permissões a que um usuário tem acesso. Todos os escopos de produtos do Google para uso em autorizações OAuth2 estão disponíveis [neste link](https://developers.google.com/identity/protocols/googlescopes){:target="\_blank"}. O Search Console possui dois escopos: https://www.googleapis.com/auth/webmasters.readonly, para apenas leitura e https://www.googleapis.com/auth/webmasters, para leitura e modificação das informações. Neste post será usado o escopo de somente leitura. A variável SITE contém o site cadastrado no Search Console cujos dados iremos consultar. O nome do site deve ser informado da forma como está no search console. Se o site é, por exemplo, http://henriquefreitas.com, a variável deve ser preenchida de acordo.

Renomeie a pasta criada no arquivo do Google Sheets para "Search Console". Esta pasta irá receber as informações do Search Console pela API. A variável searchConsoleData carrega essa pasta para uso.

Por uma questão didática, o período usado para construir o relatório foi codificado mas é interessante apresentar essas informações para que os usuários possam escolher o período dos relatórios. No exemplo, serão retornados dados dos últimos sete dias.

Crie um novo arquivo em File > New > Script file. Dê um nome para o arquivo e clique em OK. Neste arquivo será colocado o código que cria o objeto que dá início ao fluxo de autorização OAuth2:

{% highlight javascript %}
function getService() {
  return OAuth2.createService('searchconsole')
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      .setCallbackFunction('authCallback')

      .setPropertyStore(PropertiesService.getUserProperties())

      .setScope(SCOPE)

      .setParam('login_hint', Session.getActiveUser().getEmail())
      .setParam('access_type', 'offline');
}

function authCallback(request) {
  var service = getService();
  var isAuthorized = service.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Access granted. This tab can be closed.');
  } else {
    return HtmlService.createHtmlOutput('Access denied. Check if your credentials are correct and you have the required permissions to visualize the data. If everything is ok and you are still experiencing issues, please contact the developer of this application. This tab can be closed.');
  }
}
{% endhighlight %}

Repare que as variáveis criadas no arquivo de variáveis são reconhecidas neste novo arquivo. A função getService é a responsável por criar e retornar um objeto OAuth2 com escopo e autenticação definidos. Vários métoods são encadeados para obter o resultado final:

- setAuthorizationBaseUrl monta a URL base de autenticação. Essa URL é composta por informações como o CLIENT ID e o CLIENT SECRET portanto ela muda para cada usuário. A porção base, no entanto, é especificada neste método.
- setTokenUrl é a URL que retorna tokens de autenticação para usuários autorizados.
- setCallbackFunction aponta uma função a ser executada após uma tentativa de autenticação.
- setPropertyStore determina o local onde tokens autorizados são armazenados.
- setScope determina o escopo de acesso aos dados protegidos.
- setParam adiciona configurações específicas de serviços do Google. O parâmetro login_hint previne que a tela de login seja mostrada várias vezes para usuários logados em mais de uma conta do Google. O parâmetro access_type autoriza o uso das informações offline.

A função authCallback é executada sempre que getService é chamada. Ela verifica se a autorização foi concedida e informa ao usuários solicitante. No exemplo, uma aba é aberta no navegador com um texto informando o status da tentativa de autenticação.

Crie um terceiro arquivo em File > New > Script file. Dê um nome para o arquivo e clique em OK. Neste arquivo serão feitas as chamadas ao serviço e solicitados os dados do Search Console mediante autenticação. Digite o seguinte código:

{% highlight javascript %}
function getSearchConsole() {
  var apiUrl = 'https://www.googleapis.com/webmasters/v3/sites/' + SITE + '/searchAnalytics/query?fields=rows&alt=json';
  var response = getSearchConsoleData(apiUrl, ['query']);

  if (response) {
    var json = JSON.parse(response);

    if (!json.error) {
      var reportHeaders = [['Keyword', 'Clicks', 'Impressions', 'CTR', 'Position']];
      displaySearchConsoleData(json, reportHeaders, 1, 1);
    }
  }
}

function getSearchConsoleData(url, dimensions) {
  var response = null;
  var headers, payload, options;
  var service = getService();

  if (service.hasAccess()) {
    headers = {'Authorization': 'Bearer ' + service.getAccessToken() };
    payload = {
      'startDate': startDate,
      'endDate': endDate,
      'dimensions': dimensions
    };
    options = {
      'headers': headers,
      'contentType': 'application/json',
      'method': 'post',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    };

    try {
      response = UrlFetchApp.fetch(url, options);
    } catch (e) {}

  } else showDialog();

  return response;
}

function displaySearchConsoleData(json, reportHeaders, numKeys, initialColumnPosition) {
  var report = [];

  for (var i in json.rows) {
    var keys = [];
    for (var j = 0; j < numKeys; j++) {
      keys.push(
        json.rows[i].keys[j]
      );
    };
    report.push(keys);

    report[i].push(
      json.rows[i].clicks,
      json.rows[i].impressions,
      json.rows[i].ctr,
      json.rows[i].position
    );
  };

  searchConsoleData.getRange(1, initialColumnPosition, 1, reportHeaders[0].length).setValues(reportHeaders);
  searchConsoleData.getRange(2, initialColumnPosition, report.length, reportHeaders[0].length).setValues(report);
}
{% endhighlight %}

O código foi montado desta forma pensando em reúso. É possível fazer diferentes chamadas a API especificando diferentes visões de dados para serem retornadas. A função getSearchConsole monta a URL contendo o endpoint da API que contém os dados de interesse, faz uma chamada a essa URL usando a função getSearchConsoleData que foi criada passando como parâmetros a URL e uma lista com apenas um item: query. Query é o parâmetro que retorna as palavras chave registradas no Search Console. Outros possíveis parâmetros de retorno são page, device, country, search type e date. Para passar mais de um parâmetro na lista, basta incluir novos itens no array, por exemplo: ['query', 'page', 'device']. Essa lista de parâmetros representa as dimensões pelas quais as métricas serão organizadas. Por fim, verifica se a chamada foi bem sucedida, decodifica a string de retorno que está em formato JSON e escreve os dados na planilha usando o método displaySearchConsoleData, criada no fim do arquivo. Os parâmetros recebidos em displaySearchConsoleData são o retorno da chamada a API decodificado, o cabeçalho do relatório em um array multidimensional, um número de chaves que representa seções específicas do arquivo de retorno a chamada da API e o número da coluna mais à esquerda onde os dados serão escritos na planilha.

Esse número de chaves tem a ver com a forma como objeto javascript de retorno está estruturado:

{% highlight javascript %}

{
  {
    keys: {
      'query': 'palavra_chave'
    },
    clicks: 1000,
    impressions: 1000,
    ctr: 1.0,
    position: 3.2
  },
  {
    keys: {
      'query': 'outra_palavra'
    },
    clicks: 2000,
    impressions: 3000,
    ctr: 0.6,
    position: 1.2
  }
}

{% endhighlight %}

a seção keys contém as dimensões e as métricas estão nas demais propriedades do objeto. O parâmetro que informa o número de chaves basicamente informa quantas dimensões o arquivo de retorno tem para que a função de imprimir os dados na tela monte a tabela corretamente. O último parâmetro informa a partir de qual coluna o relatório deve ser gerado.

A função getSearchConsoleData consulta o objeto OAuth2 pela função getSearvice e verifica se o usuário está autorizado a puxar os daos do Search Console. Caso esteja, prepara uma chamada a API usando um método estático do Google Apps Script: UrlFetchApp.fetch(url, options). Esse método retorna um objeto HTTPResponse contendo os dados e cabeçalhos de resposta. A função showDialog, usada caso a chamada a API não tenha dado certo, será criada em outro arquivo e dá instruções para que o usuário se autentique caso não esteja autenticado.

A função displaySearchConsoleData mostra na planilha os dados retornados da API e recebe como parâmetros o objeto contendo os dados de retorno, uma lista de cabeçalhos em um array multidimensional e os já comentados número de chaves e o número da coluna a partir do qual o relatório será mostrado. Essa função passa por todos os registros e constrói um array muldidimensional. Esses arrays de cabeçalho e conteúdo possuem duas dimensões, a primeira representando a linha e a segunda a coluna onde os dados serão persistidos. Essa função faz uso da variável searchConsoleData, que armazena a pasta com a planilha que foi definida no arquivo de variáveis globais.

### 4. Construa um mecanismo que permita o usuário interagir com a API

Até o momento não há como interagir com esse script a partir da planilha. Crie um arquivo novo e escreva o seguinte código:

{% highlight javascript %}

function showSidebar() {
  var service = getService();
  var page, template;

  if (!service.hasAccess()) {
    var authorizationUrl = service.getAuthorizationUrl();
    template = HtmlService.createTemplate(
      '<h1>Autentication</h1> ' +
      '<a href="<?= authorizationUrl ?>" target="\_blank">Authorize the use of data from Search Console and Analytics</a>. ' +
      '<p>Why do I need to do this?</p> ' +
      '<p>This application extract data from Search Console and Analytics on your behalf, using your credentials and permissions. Such operation must be approved by you.</p>' +
      '<p>Google Sheets should present you with an authentication screen automatically but if that doesn\'t happen you can use the link available on this sidebar.</p>'
    );
    template.authorizationUrl = authorizationUrl;
  } else {
    template = HtmlService.createTemplate('You are already authorized. This sidebar can be closed.');
  }

  page = template.evaluate();
  SpreadsheetApp.getUi().showSidebar(page);
}

function showDialog() {
  service = getService();
  if (!service.hasAccess()) Browser.msgBox('Authorize this script to get Search Console and Google Analytics data on your behalf. Go to Search Console > Login.', Browser.Buttons.OK);
}

function getData() {
  try {
    getSearchConsole();
  } catch (e) {
    Browser.msgBox(e, Browser.Buttons.OK);
  }
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Search Console')
      .addItem('Login', 'showSidebar')
      .addItem('Refresh data', 'getData')
      .addToUi();

  showDialog();
}
{% endhighlight %}

A função showSidebar monta uma barra lateral na planilha com um link para autenticação e acesso aos dados do Search Console. Se o usuário já estiver autenticado, esta informação será apresentada a ela na barra lateral.

A função showDialog apresenta uma mensagem pedindo que o usuário navegue até o menu Search Console > Login, que será criado no fim deste arquivo.

A função getData faz uma chamada a API do Search Console. Se a chamada não dá certo, apresenta uma mensagem de erro para o usuário.

A função onOpen é uma função especial do Google Apps Script que executa sempre que o arquivo associado, neste caso a planilha, é aberta. Sempre que o arquivo for aberto, esta função criará um menu chamado Search Console com duas opções: Login, para iniciar o fluxo de autenticação e apontando para a função showSidebar, e um menu chamado Refresh data, que faz uma chamada a API.

### 5. Automatize a chamada a API (opcional)

Da forma como está, os dados dos últimos sete dias do Search Console serão escritos na planilha especificada mas é possível automatizar essa chamada para que os usuários não precisem acessar este menu sempre que precisarem interagir com os dados. Para isso, vá no editor de scripts e acesse o menu Edit > Current project's triggers. Essa opção também está disponível na barra lateral, por meio de um relógio preto. Ao clicar no relógio ou usar o menu, aparecerá um modal para criação de triggers. Experimente criar um novo trigger que chame a função getData a cada hora por exemplo, clique em Save, e de hora em hora esta função será chamada e os dados da planilha serão atualizados automaticamente!

![Google Apps Script]({{ "/assets/images/blog/2018-01-29-google-apps-script-com-oauth2-image-9.jpeg" | absolute_url }})

## Automação com Google Apps Script

Scripts como o deste post são extremamente úteis para automatizar tarefas repetidas e realocar pessoas em tarefas mais estratégicas para o departamento onde trabalham ou mesmo para a empresa como um todo. Automação e extensão de funcionalidades de produtos Google são apenas algumas das coisas que o Google Apps Script pode fazer. A ideia por trás deste editor de scripts é fazer com que os produtos Google possam realmente ser adaptados para a realidade de cada organização e não o inverso. Trabalhar com o Search Console neste exemplo demonstra ainda uma outra vantagem de usar um script: backup. O Search Console armazena dados dos últimos três meses e para ter dados históricos alguém precisa fazer backups periódicos destes dados. Com um script que automatize esta tarefa fica fácil.

## Leitura complementar

Leia os seguintes conteúdos para se aprofundar mais nestes assuntos:

- [Biblioteca OAuth2](https://github.com/googlesamples/apps-script-oauth2){:target="\_blank"} disponibilizada pelo próprio Google e usada neste post
- [Documentação do Google Apps Script](https://developers.google.com/apps-script/overview){:target="\_blank"}
- [Meu post de introdução a APIs]({% post_url 2017-12-12-fundamentos-das-apis %})
- [Meu post sobre os fundamentos do Google Apps Script]({% post_url 2017-11-20-uma-introducao-ao-google-apps-script %})
- [Os fundamentos de OAuth, por Aaron Parecki](https://aaronparecki.com/oauth-2-simplified/){:target="\_blank"}
- [OAuth2 com Google Apps](https://developers.google.com/identity/protocols/OAuth2){:target="\_blank"}
- [Playground de experimentação com OAuth2 para os serviços do Google](https://developers.google.com/oauthplayground/){:target="\_blank"}
- [Lista de endpoints e testes de chamadas as APIs do Google](https://developers.google.com/apis-explorer/#p/){:target="\_blank"}

Bora automatizar!

---
layout: post
title:  'RD Station e Google Sheets: exportação automática de leads para planilhas'
date:   2018-09-02 14:07:00
categories: [Marketing, Desenvolvimento]
image: '/assets/images/blog/2018-09-02-rd-station-e-google-sheets-featured.png'
image_credit: 'Resultados Digitals / Google'
---

Você usa o RD Station para fazer a gestão dos seus leads? E exporta dados de leads para planilhas para realizar análises mais aprofundadas e gerar visualizações de dados? Se sim, imagino que você, de tempos em tempos, exporta manualmente os leads de uma ou mais listas de segmentação e os importa para dentro de suas planilhas. E se eu te dissesse que dá pra tornar esta tarefa automática, sem a ajuda de ferramentas como Zapier e Pluga, que podem se tornar caras a medida que a base de dados aumenta? Vou mostrar neste post como fazer para que o RD Station envie automaticamente leads para planilhas e assim você concentre a maior parte de seu tempo em análise e extração de insights. Bora?

<!--more-->

**[SPOILER ALERT] Vamos escrever algumas linhas de código! Se você não tem familiaridade com programação não se preocupe que vou explicar o que cada linha faz :) o ideal, no entanto, é que você tenha alguma familiaridade com qualquer linguagem ou lógica de programação para entender 100% do que será feito. [FIM DO SPOILER ALERT]**

## Atualização - 04/09/2020

- Este post agora possui uma parte 2: [RD Station e Google Sheets Parte 2 - Migrando para a AWS]({% post_url 2020-09-03-rd-station-e-google-sheets-na-aws %}).
- A [tabela de preços do Zapier](https://zapier.com/pricing){:target="_blank"} mudou. O plano que suporta 3.000 chamadas não existe mais, agora existe um com até 2.000 chamadas e o plano seguinte vai para 5.000 chamadas.
- [O Google Apps Script agora suporta a engine V8](https://developers.google.com/apps-script/guides/v8-runtime){:target="_blank"}, o que permite a criação de aplicativos que utilizem a sintaxe moderna de JavaScript em ES6. Nem todos os recursos do ES6 são suportados até a data de atualização deste post.
- O formato do webhook do RD Station [irá mudar](https://developers.rdstation.com/pt-BR/migration/webhooks){:target="_blank"}.
- Não existe mais distinção entre fluxos de automação paralelos e gerenciais. Todo fluxo de automação é paralelo.
- O limite atual de células em uma planilha do Google Sheets é de [5.000.000](https://support.google.com/drive/answer/37603?hl=en){:target="_blank"}.

## Planilhas? WTF

Exportar dados de uma fonte para outra é tarefa comum quando se trata de agrupar conjuntos de dados para análise ou visualização. Agregadores de dados bem conhecido são as planilhas eletrônicas – os Exceis e Sheets da vida. Planilhas são convenientes para armazenar, manipular e visualizar dados das mais diversas naturezas em formato tabular. São fáceis de entender e sua organização gera um padrão de comunicação entre pessoas e também entre ferramentas, por isso ainda não deram lugar a ferramentas mais robustas e inteligentes para o mesmo fim. Se você não vive sem suas planilhas de métricas sabe bem do que estou falando. Agora, é sabido que planilhas não são nada sem dados e que uma parte considerável do nosso tempo é gasto preenchendo células nos locais corretos para gerar as informações que nos levarão aos valiosos insights. Diminuir este tempo, então, significa ter mais tempo para se preocupar com análise. Ferramentas como Zapier e Pluga facilitam a vida nesse sentido, já que possuem conectores com centenas de outras ferramentas e uma interface amigável para a criação de fluxos de dados entre elas. Por que então não usá-las?

A escolha do plano de uso destas ferramentas depende da quantidade de chamadas feitas a elas. Um plano inicial para processar uma quantidade pequena de dados pode dar conta do recado a um custo baixo porém quanto maior a base, maior deverá ser o plano da ferramenta de integração (para referência, no momento da escrita deste texto, em Agosto de 2018, o Zapier cobra USD 62,50 mensais para até 3.000 chamadas em seu plano professional. Acima disso o plano passa a ser o professional plus, cujo preço sobe para USD 156,25. Com base nisso vou considerar que 3.000 chamadas é pouco, mas entendo que depende do contexto de cada empresa e da existência de caixa para pagar essa mensalidade. Considere que, na aplicação de automatizar o envio de de leads para uma ferramenta externa, uma chamada significa enviar um lead para esta ferramenta, que no nosso caso é uma planilha. Nesta conta, no máximo 3.000 leads poderão ser enviados pelo Zapier no plano professional).

![Planos e recursos do Zapier]({{ "/assets/images/blog/2018-09-02-rd-station-e-google-sheets-image-1.png" | absolute_url }})
Planos e recursos do Zapier

O tamanho do plano faz com que as aplicações que dependam de integrações sejam limitadas com base no número de chamadas feitas na ferramenta, e o que exceder o limite fica pendurado em uma fila esperando o reinício da contagem de chamadas ou o pagamento de um plano maior. Isso ainda pode ser aceitável para alimentar planilhas cujo consumo tem data definida mas análises ad hoc – com potenciais descobertas – podem ser deixadas de lado para não estourar o plano da ferramenta. Outra desvantagem é contar com este tipo de integração para ações sazonais, como co-marketing ou presença em eventos, onde geralmente as empresas recebem um volume grande de leads. Se não for previsto, este volume de entrada anormal pode gerar surpresas e estourar o plano, fazendo com que a integração deixe de funcionar. Mais um ponto: durante a construção da integração será necessário testá-la. Uma vez que a integração esteja em produção, cada chamada a ela consome do plano, mesmo que seja uma chamada de teste. Há outra forma de garantir a integração sem depender destes integradores.

## A receita ~~não mais~~ secreta por trás da integração

A partir do plano PRO o [RD Station](https://www.rdstation.com/){:target="_blank"} possui recursos para que desenvolvedores possam criar integrações entre a ferramenta de automação de marketing e outras ferramentas, sejam elas ferramentas internas –  desenvolvidas pela própria empresa – ou externas. Estes recursos são chamados de APIs e Webhooks, interfaces – ou portas – para que dados possam ir para dentro e para fora de um sistema. Embora sejam parecidas no sentido de trafegarem dados, o que difere uma API de um Webhook é o fato de a primeira receber comandos para fazer algo enquanto a segunda envia dados para algum lugar definido pelo desenvolvedor após alguma coisa acontecer. Caso queira entender melhor o que é uma API, escrevi dois posts sobre: [um introdutório e sem jargão]({% post_url 2018-07-04-apis-e-carrinhos-de-supermercado %}) e [outro com um viés mais técnico]({% post_url 2017-12-12-fundamentos-das-apis %}). O foco do post será no segundo recurso: o Webhook.

Para que um webhook envie dados para algum lugar ele precisa de duas informações:

* Um endereço para onde os dados devem ser enviados
* Saber em que momento os dados devem ser enviados

Este endereço precisa ser uma URL que esteja preparada para receber os dados do webhook. É aí que está a mágica: esta URL pode ser o endereço de uma planilha (ok, a URL é de um script que controla a planilha, como mostrarei logo mais).

A ação que dispara o webhook é chamada de gatilho, é algo que precisa acontecer para, só então, o webhook mandar os dados para o endereço. Este gatilho é configurado na ferramenta que dispara o webhook, que no nosso caso é o RD Station.

Hora de falar um pouco sobre o lado da planilha para então colocar-mos a mão na massa!

## Planilhas com scripts?

Desenvolver scripts em planilhas não é algo novo. Muitos estão acostumados com o VBA no Excel. Faremos algo nesta linha, mas usando outro software de gestão de planilhas, outra ferramenta de scripts e outra linguagem de programação. O software de gestão de planilhas é o [Google Sheets](https://www.google.com/sheets/about/){:target="_blank"}, a ferramenta de scripts é o Google Apps Script e a linguagem de programação é Apps Script, criada pelo Google e baseada em JavaScript. A similaridade de Apps Script com JavaScript tem um benefício imediato: JavaScript é uma linguagem usada em aplicações web, portanto quem já desenvolve em JavaScript não precisa aprender uma linguagem nova e quem aprende Apps Script pode aproveitar o conhecimento para desenvolver para a web com JavaScript. Quanto ao software gerenciador de planilhas, uma vantagem em trabalhar especificamente com o Google Sheets está no fato de a ferramenta estar na nuvem e configurada para trabalhar com o recebimento de dados de outras ferramentas. Isso significa que não precisamos escrever código para “abrir uma porta” por onde os dados podem entrar porque essa parte já está feita. Falarei brevemente sobre a forma de funcionamento do Google Apps Script mas caso seja do seu interesse conhecer a ferramenta com mais profundidade, [leia o post que escrevi sobre o assunto]({% post_url 2017-11-20-uma-introducao-ao-google-apps-script %}).

## Da teoria a mão na massa: a configuração da planilha

Vamos começar pelo Google Sheets. Crie uma planilha em sua conta. Com a planilha criada, acesse o menu Tools e clique em Script Editor.

![Planilha em branco. Menu Tools / Script Editor aberto]({{ "/assets/images/blog/2018-09-02-rd-station-e-google-sheets-image-2.png" | absolute_url }})
Planilha em branco. Menu Tools / Script Editor aberto.

A interface do Google Apps Script será mostrada.

![Tela inicial do Google Apps Script com função pré criada]({{ "/assets/images/blog/2018-09-02-rd-station-e-google-sheets-image-3.png" | absolute_url }})
Tela inicial do Google Apps Script com função pré criada.

O Google Apps Script se divide em três principais seções: o menu de ferramentas, no topo, o painel de arquivos associados a planilha, à esquerda, e a interface de escrita de código, à direita.

Um grande aliado na escrita de códigos para o Google Apps Script é a [documentação oficial](https://developers.google.com/apps-script/reference/){:target="_blank"}. Lá está documentado tudo o que é característico do Apps Script que pode ajudar durante o desenvolvimento.

O primeiro passo será informar para o Google Apps Script (que a partir de agora vou chamar apenas de GAS) que o script deverá receber e tratar dados externos, ou, se comunicar com o mundo externo. Nos termos do GAS, o script será um aplicativo web (web app). Para fazer isto, apague a função padrão e crie duas outras, chamadas doGet e doPost. Ambas recebem um argumento “e” que representa os dados recebidos pelo script.

{% highlight javascript %}
function doGet(e) {
  // Todo
}

function doPost(e) {
  // Todo
}
{% endhighlight %}

A função doGet recebe dados que são passados pelo endereço do script. Se, por exemplo, o endereço do script for https://script.google.com/d/id_do_script/exec?nome=Henrique&cargo=cientista_de_dados, o que está a direita do sinal de interrogação são os parâmetros passados, na forma de chave=valor e separados por um sinal de igual. A primeira chave, no exemplo, é “nome” e o valor é “Henrique”. Conjuntos de chave / valor são separados por ampersands, ou “e comercial” (&).

![Funções doGet e doPost, que caracterizam o script como sendo um aplicativo web (web app)]({{ "/assets/images/blog/2018-09-02-rd-station-e-google-sheets-image-4.png" | absolute_url }})
Funções doGet e doPost, que caracterizam o script como sendo um aplicativo web (web app).

Para ser caracterizado como um web app, o script só precisa de uma das funções. Declaramos a doGet apenas para tratar a saída caso o endereço do script seja acessado diretamente (improvável mas possível). Se a função não estivesse declarada, um acesso direto a URL do script iria mostrar uma mensagem como "O script terminou a execução e não há nada a ser exibido na saída". Com a função declarada e sem nada dentro, o script irá mostrar uma tela em branco. Manteremos desta forma.

A função que vai receber e tratar os dados do RD Station é a doPost. Ela recebe dados passados no corpo de uma mensagem que trafega pela web. Essas mensagens são lidas por servidores, e é justamente o papel de servidor que o nosso script está fazendo.

Para começar, vamos escrever o código que irá tratar os dados e exibí-los na planilha. Dentro da função doPost escreva o seguinte trecho de código:

{% highlight javascript %}
// Verifica se a chamada POST veio com dados no corpo e se os dados estão no formato correto
if (e.postData.contents && e.postData.type == 'application/json') {
   // Caso existam dados eles virão em formato JSON e é necessário transformar estes dados para usá-los no aplicativo
  var lead = JSON.parse(e.postData.contents);

  // Chama uma função personalizada para gravar o lead na planilha
  gravarMensagem(lead);
}
{% endhighlight %}

O que este código está fazendo, em sequência:

* Verifica se o parâmetro definido na função POST está com dados e também se o tipo de informação que está vindo para o script é JSON (JavaScript Object Notation), um formato padrão para comunicação entre aplicativos. Se estiver, significa que o webhook conseguiu acessar a URL e entregar os dados do lead
* Caso os dados estejam no parâmetro, faz o chamado parse deles, que é transformar a informação que chegou no script em um formato que dê para trabalhar dentro do aplicativo. Apesar de o RD Station enviar um JSON para o script, ele vem codificado na forma de texto. O parse faz a decodificação do JSON para que seja possível manipular esses dados dentro do script. O Apps Script usa a mesma classe e método do JavaScript para tratar este texto JSON. O parse é feito usando JSON.parse() e o método recebe o texto que será tratado, que neste caso é o texto que veio do webhook. O texto tratado é armazenado na variável lead.
* A linha seguinte chama uma função de nome gravarMensagem e recebe um argumento. Passamos o lead que foi tratado na linha anterior com o parse. Esta função escreve o lead na planilha. A função não foi criada ainda. Para criar esta função, escreva o seguinte código logo abaixo da função doPost:

{% highlight javascript %}
function gravarMensagem(mensagem) {
  // Abre a planilha e seleciona a aba Sheet1
  var celulas = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');

  // Seleciona as células que conterão o cabeçalho. Em ordem, os parâmetros são: primeira linha, primeira coluna, última linha, última coluna
  var cabecalho = celulas.getRange(1, 1, 1, 8);

  // Escreve os nomes das colunas nas células de cabeçalho
  cabecalho.setValues([['Nome', 'Email', 'Data de Criação', 'Empresa', 'Origem da Primeira Conversão', 'Estágio no Funil', 'Lead Scoring', 'Interesse']]);

  // Cria uma trava que impede que dois ou mais usuários executem o script simultaneamente
  var trava = LockService.getScriptLock();

  // Espera 2 segundos até que as linhas de código a seguir terminem
  trava.waitLock(2000);

  // Navega pelos dados enviados pelo webhook
  for (var i = 0; i < mensagem.leads.length; i++) {

    // Escreve os dados na planilha
    celulas.appendRow([mensagem.leads[i].name,
                       mensagem.leads[i].email,
                       mensagem.leads[i].created_at,
                       mensagem.leads[i].company,
                       mensagem.leads[i].first_conversion.source,
                       mensagem.leads[i].lead_stage,
                       mensagem.leads[i].fit_score,
                       mensagem.leads[i].interest]);

    // Atualiza a planilha com a nova linha
    SpreadsheetApp.flush();
  }

  // Desativa a trava do script para que possa receber outras mensagens do webhook
  trava.releaseLock();
}
{% endhighlight %}

Os espaços e comentários dão a impressão de que o código é longo mas em realidade ele é bem simples. Em sequência:

* Abre a planilha associada ao script e seleciona a aba com o nome Sheet1. SpreadsheetApp é o nome da classe que gerencia planilhas e o funcionamento dela pode ser consultado na documentação do GAS.
* Seleciona as linhas da planilha que conterão o cabeçalho. Para escrever na planilha usando a classe SpreadsheetApp é necessário antes selecionar a ou as células que terão novos valores. Há muitas outras propriedades que podemos extrair dos leads, incluíndo campos personalizados. Para deixar o exemplo simples, selecionamos apenas algumas das propriedades.
* Escreve as colunas do cabeçalho na primeira linha da planilha. O argumento do método setValues recebe uma lista com duas dimensões, por isso os valores são passados dentro de dois pares de colchetes.
* Se o fluxo de automação do RD Station tiver como critério de entrada ser novo ou já existir em certa lista de segmentação, todos os leads existentes na lista serão enviados simultaneamente ou em intervalos muito curtos de tempo. Isso gera um problema pois o script não consegue gerenciar o recebimento de muitas mensagens simultaneamente e acaba escrevendo uma linha por cima da outra, fazendo com que alguns registros sumam. Para contornar o problema, usamos a classe LockService, que faz a gestão de acessos simultâneos ao script.
* O método waitLock é usado para travar a seção do código que vem após ele, garantindo que apenas um acesso por vez seja feito. Os demais acessos entram em uma fila para serem processados conforme a trava vai sendo liberada.
* O RD Station envia os dados com uma organização específica, disponível [no GitHub da Resultados Digitais](https://github.com/ResultadosDigitais/rdocs/blob/master/rdstation_integration.json){:target="_blank"}. Este documento será importante para entendermos a organização dos dados e assim saber como navegar por eles. A navegação será feita usando um laço do tipo for cuja condição de término é que uma variável chamada i tenha valor igual ao total de leads enviados pelo webhook (tirando o caso em que o critério de entrada do fluxo de automação é ser novo ou existente em uma lista de segmentação, cada webhook deve enviar apenas um lead então o laço for vai ter sua variável i começando em 0 e terminando em 1.
* Para cada volta no laço, adiciona uma nova linha na planilha escrevendo os dados do lead. Repare que o objeto mensagem possui uma propriedade leads, que é uma lista. Para navegar nesta lista usamos a variável i que vai sendo alterada ao final de cada volta no laço. O método appendRow é inteligente o suficiente para descobrir qual a última linha preenchida e pular para a linha abaixo para escrever nas células, assim o cabeçalho não é sobrescrito.
* Após escrever a linha, usamos o método flush da classe SpreadsheetApp para “aplicar” as alterações na planilha. As operações de escrita em células são agrupadas para serem feitas em conjuntos, melhorando a performance do web app. Neste caso precisamos que a linha seja gravada sem esperar por algum agrupamento, pois essa operação precisa ser feita antes da liberação da trava.
* Uma vez que o laço termine a trava é desfeita e outros acessos podem ser feitos ao laço, sem que linhas de leads sejam sobrescritas.

Este código é executado a partir da função doPost sempre que um novo lead é enviado, via webhook, para o script. Note que o cabeçalho é escrito sempre. Poderíamos ter feito uma verificação de existência do cabeçalho, mas para ficar simples vamos deixar desta forma. As linhas com os leads não são sobrescritas graças a trava de segurança que foi feita para evitar múltiplos acessos dentro do laço.

O passo seguinte é publicar o aplicativo. Publicar o aplicativo significa tornar o web app público, o que é necessário para que o RD Station consiga enviar os dados. Para publicar o aplicativo, acesse o menu Publish > Deploy as a Web App. Especifique a versão do projeto (neste caso, New) e documente as mudanças ao longo da evolução do projeto. Nas permissões, use seu usuário para autorizar o script e informe que qualquer pessoa pode acessá-lo, mesmo um usuário anônimo, para que o RD Station consiga se conectar com o script. Ao clicar no botão “Deploy”, o GAS pedirá para que você autorize o script a escrever em planilhas usando suas credenciais. Após a autorização, o aplicativo será publicado e uma URL pública será criada. É esta URL que vamos passar para o RD Station mais adiante.

![Tela de publicação do aplicativo]({{ "/assets/images/blog/2018-09-02-rd-station-e-google-sheets-image-5.png" | absolute_url }})
Tela de publicação do aplicativo.

![Aplicativo publicado com a URL pública gerada]({{ "/assets/images/blog/2018-09-02-rd-station-e-google-sheets-image-6.png" | absolute_url }})
Aplicativo publicado com a URL pública gerada.

Chegou o momento de configurar o RD Station para enviar os dados para a planilha, mas antes vale um aviso: ao permitir que qualquer pessoa possa executar o script, uma brecha de segurança é aberta para que dados não intencionados sejam enviadas para o script. A princípio o script (no papel de servidor) está configurado para receber quaisquer requisições GET ou POST. Este é um ponto importante a ter em mente especialmente se sua empresa faz uso do G Suite e a conta de e-mail que está sendo usada para autenticar as ações de quem executa o script é corporativa. É importante tratar os dados de entrada para ter certeza de que o retorno é o esperado.

## Mais mão na massa: o RD Station

O RD Station permite criar webhooks de duas maneiras: usando o recurso de webhooks que está no menu Integrações, que aparece ao clicar / apertar o nome da conta na porção superior direita da tela e usando os fluxos de automação. O que difere entre as formas de criar o webhook é que ao fazer a criação pelo menu de integrações, só é possível enviar leads via webhook após eventos de conversão ou nova oportunidade enquanto pelos fluxos de automação é possível tratar os leads antes de enviá-los. Vou mostrar as duas formas, bem como quando usar uma e quando usar outra. Começando pelo método de criar o webhook pelo menu de integrações. Ao abrir a página de integrações, a opção de configurar webhooks estará disponível junto com outras opções de integração. Aperte o botão “Configurar” ao lado da opção de webhooks para abrir a tela com a listagem dos webhooks criados e um botão no canto superior direito da tela para criar novos webhooks. Aperte este botão para abrir um popup com os dados a serem preenchidos.

![Popup com os dados a serem preenchidos para a criação do webhook]({{ "/assets/images/blog/2018-09-02-rd-station-e-google-sheets-image-7.png" | absolute_url }})
Popup com os dados a serem preenchidos para a criação do webhook.

O nome do webhook é um identificador interno, para organização. A URL é o endereço para onde o webhook deve mandar os dados dos leads. Esta é a URL que foi gerada ao fazer a publicação do web app pelo GAS. O gatilho pode ser Conversão ou Oportunidade. Caso seja Oportunidade o campo abaixo some e é só salvar o webhook. Caso o gatilho seja a Conversão, você pode opcionalmente selecionar eventos de conversão específicos, útil para registrar apenas os leads que converterem em determinada landing page ou formulário. Se o campo ficar em branco, todas as conversões serão enviadas pelo webhook. Ao salvar o webhook, o RD Station iniciará o envio dos dados após o evento definido no gatilho acontecer.

A segunda forma de criar um webhook é usando fluxos de automação. Usarei esta forma para fazer a integração neste post pois separei alguns leads para o envio. A integração por fluxo permite adicionar etapas entre o evento que irá causar o disparo do webhook e o disparo em sí. Desta forma você pode, por exemplo, notificar um endereço de e-mail quando um lead for enviado, adicionar uma tag ou mudar o estagio do lead no funil por exemplo, conforme as capacidades dos fluxos de automação.

Para configurar o webhook por fluxos, vá em Relacionar > Automação de Marketing e crie um novo  fluxo de automação. Escolha entre o paralelo e o gerencial e dê um nome para o fluxo. Escolha o evento que dará início ao fluxo, que pode ser conversão ou entrada em uma lista de segmentação. Construa o fluxo de acordo com as suas necessidades e no final escolha a ação “Enviar para a URL (Integração)”. A URL a ser informada é a URL gerada na publicação do web app. A [documentação do RD Station para envio de webhooks por fluxos de automação](https://ajuda.rdstation.com.br/hc/pt-br/articles/115001273943){:target="_blank"} sugere criar uma espera de um minuto entre a entrada do lead no fluxo de automação e o envio dele para a URL de integração.

![Fluxo de automação configurado para enviar leads de uma lista para o script]({{ "/assets/images/blog/2018-09-02-rd-station-e-google-sheets-image-8.png" | absolute_url }})
Fluxo de automação configurado para enviar leads de uma lista para o script.

Ao finalizar, salve e ative o fluxo de integração. Neste ponto, a integração já deve funcionar e assim que um lead atende as condições do fluxo de automação ele será enviado para o script, que fará o tratamento da informação e o mostrará na planilha.

![Leads entrando na planilha, na ordem em que chegam até o script]({{ "/assets/images/blog/2018-09-02-rd-station-e-google-sheets-image-9.png" | absolute_url }})
Leads entrando na planilha, na ordem em que chegam até o script.

Sempre que um novo lead entrar na lista, ele entrará também no fluxo de automação e será enviado para a planilha. Como usamos o método appendRow o novo lead não irá sobrescrever dados existentes.

Listas grandes podem demorar para serem escritas na planilha e uma sugestão para otimização é exportar manualmente a lista completa, importar para o Google Sheets e ligar a integração apenas para novos leads. O RD Station limita a quantidade de chamadas feitas a suas APIs e webhooks com base no plano contratado. Para referência, entrei em contato com o suporte no dia 30/08/2018 e fui informado que estes são os limites de envio:

* 120 conversões por minuto nos planos Pro ou inferior
* 500 conversões por minuto no plano Enterprise

Limites bem confortáveis para pequenas empresas que buscam ganhar escala e reduzir custos. Também é importante ter em mente a quantidade máxima de células que o Google Sheets pode ter, [que é 2.000.000](https://support.google.com/drive/answer/37603?hl=en){:target="_blank"}. Esse número é usado para determinar a quantidade de linhas e colunas que o arquivo pode ter. Quanto menor o número de colunas, maior o de linhas porém menos informação você terá em cada linha. Por outro lado, quanto maior o número de colunas, menor o de linhas porém mais informações sobre o lead estarão tabuladas. No exemplo deste post, usamos oito colunas. Para aproveitar o máximo de linhas possíveis de serem geradas, selecione todas as colunas em branco depois de interesse, clique com o botão direito do mouse sobre a seleção e clique em “Delete Columns I – Z” (pode ser que no seu caso a quantidade de colunas em branco seja diferente. Delete todas as que estão em branco). Agora, o máximo de linhas que podem ser armazenadas neste arquivo é 250.000, contando a linha do cabeçalho (2.000.000 células disponíveis / 8 colunas).

Pronto! Sempre que um lead atender a determinadas condições dentro do RD Station, ele será enviado automaticamente para uma planilha. Dessa forma a coleta de dados deixa de ser um problema e é possível investir mais tempo focando em análise e extração de insights dos dados.

Por fim: você é desenvolvedor e conhece uma forma melhor de fazer a integração? Não deixe de compartilhar e me ajude a tornar este texto cada vez melhor!

Você já viu a parte 2 deste post? [RD Station e Google Sheets Parte 2 - Migrando para a AWS]({% post_url 2020-09-03-rd-station-e-google-sheets-na-aws %}).

Bora automatizar!

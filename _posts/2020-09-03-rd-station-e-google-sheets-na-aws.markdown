---
layout: post
title:  'RD Station e Google Sheets Parte 2 - Migrando para a AWS'
date:   2020-09-03 19:23:00
categories: [Desenvolvimento, Infraestrutura]
image: '/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-featured.png'
image_credit: 'Resultados Digitais / Google / Amazon'
---

Há exatos 2 anos eu escrevi um post neste blog explicando [como criar uma integração entre RD Station e Google Sheets]({% post_url 2018-09-02-rd-station-e-google-sheets %}). Com apenas um webhook, um fluxo de automação e algumas linhas de código, é possível automatizar o envio de leads para planilhas e diminuir o tempo gasto com a coleta de dados. Para uma operação pequena o procedimento funciona bem, mas e quando a base de dados começa a ficar grande, há diversas pessoas usando e performance começa a virar uma questão? É hora de migrar para uma arquitetura mais robusta.

<!--more-->

Antes de prosseguir: a leitura do post anterior não é obrigatória para assimilar os conceitos apresentados neste post, porém recomendo a leitura caso você queira saber como automatizar o envio de leads do RD Station para uma planilha sem depender de plugins. Para ver o post anterior, basta clicar neste link: [RD Station e Google Sheets]({% post_url 2018-09-02-rd-station-e-google-sheets %}).

Ao longo do post são mostrados comandos em SQL e Javascript, além da configuração de um projeto em Node.js. Assumo que você tenha alguma familiaridade com estas tecnologias.

## Os limites de uma planilha

O primeiro problema com uma integração que utilize webhooks do RD Station já é sentido logo ao ligar a automação utilizando listas de segmentação grandes (acima de 3.000 leads): o de sobrescrita de linhas na planilha. Cada lead é enviado pelo webhook individualmente, tornando necessária a gestão de múltiplos acessos ao script com permissão para escrita na planilha. O Google Apps Script (ou GAS) [limita o número de execuções simultâneas de um script a 30 por usuário](https://developers.google.com/apps-script/guides/services/quotas){:target="_blank"}. Como no post anterior a planilha foi configurada para autenticar usuários anônimos utilizando as credenciais de um usuário com permissão de escrita da planilha, cada chamada ao script pelo webhook consome da cota por usuário. Um sistema de trava e destrava foi criado para gerenciar os acessos simultâneos, mas ainda assim ineficaz na gestão de muitos leads sendo enviados pelo webhook. Note que a princípio este problema existe apenas ao ligar a automação utilizando uma lista de segmentação já populada.

O problema pode ser contornado ao determinar uma data de corte e criar duas listas de segmentação: uma até a data de corte e uma depois da data de corte. Todos os leads até a data de corte são então cadastrados manualmente na planilha e a automação é ligada a partir da lista de leads após o corte. Resolvido o problema, a planilha passa a ser alimentada com dados de novos leads, até que uma das coisas começa a acontecer:

- O limite de células é atingido ou está próximo do fim
- O problema de excesso de chamadas ao GAS se repete em função de muitos novos leads entrando no flxuo de automação simultaneamente
- A planilha, que vive em um diretório no Google Drive, é modificada ou apagada acidentalmente
- O arquivo começa a ficar muito pesado para carregar

Estes são apenas os problemas que diminuem a acessibilidade ao arquivo, há de se considerar também as implicações jurídicas de deixar um histórico de leads em um diretório no Google Drive.

Felizmente, o local para onde esta solução será migrada mitiga ou sana os problemas citados e muitos outros.

## Infraestrutura em nuvem

Criar e manter uma infraestrutura para coleta, processamento e armazenamento de dados em casa é bem custoso. Considere apenas os custos de antemão com máquinas e pessoal qualificado. Antes mesmo de armazenar um único bit, a empresa que se aventura em criar seu próprio hub de dados possivelmente dedicará meses para fazer com que tudo funcione conforme o planejado. Adicione a burocracia interna para aprovação de tal empreitada e os custos constantes de manutenção e rapidamente você tem um projeto que, provavelmente, não se pagará.

Para abstrair a complexidade de gerir a infraestrutura necessária para dar vida a aplicações, diversas empresas ao redor do mundo oferecem serviços de aluguel de suas próprias infraestruturas: máquinas, equipamentos de rede, configurações e pessoal qualificado que cuidam de tudo o que acontece "por trás dos panos" para que a aplicação (ou apanhado de software e dados, o que gera valor direto para o negócio) seja criada e mantida sem a preocupação de preparar todo o ambiente de hospedagem do zero.

Uma das empresas que oferece tal serviço é a Amazon, com sua divisão de soluções de infraestrutura Amazon Web Services (ou AWS). É a solução da AWS que será utilizada neste post.

Outra pausa antes de seguir: tudo o que será feito na AWS poderia ter sido feito no Google Cloud. A escolha pela AWS se deu em função de esta ter sido a solução utilizada em projetos anteriores.

## Amazon Web Services

As soluções de computação em nuvem da AWS são preparadas para lidar com diferentes volumes de tráfego: elas "escalam" conforme a demanda, o que significa dizer que mais recursos da infraestrutura vão sendo alocados conforme a demanda e liberados após o uso. A precificação das ferramentas é feita de acordo com o uso da infraestrutura, não há um valor ou tabela de valores determinado na maioria dos serviços como é com um provedor de hospedagem tradicional. Estes serviços estão divididos em dezenas de categorias e com eles é possível desde armazenar arquivos de texto a processar algoritmos de redes neurais.

![As diferentes categorias de serviços oferecidas pela AWS]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-1.png" | absolute_url }})
As diferentes categorias de serviços oferecidas pela AWS.

Para este exercício, vamos utilizar os seguintes serviços:

- AWS API Gateway
- AWS Lambda
- AWS RDS MySQL

Juntos, estes serviços serão responsáveis por receber o webhook do RD Station (o mesmo do post anterior), tratar os dados de entrada e inserir estes dados em um banco de dados MySQL.

![O desenho da arquitetura a ser montada na AWS]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-2.png" | absolute_url }})
O desenho da arquitetura a ser montada na AWS.

### AWS API Gateway

O AWS API Gateway é o construtor de APIs da AWS. Com este serviço é possível construir APIs REST e também websockets, para criar aplicativos de mensagem instantânea. Com uma API REST é possível abrir uma porta para escuta do webhook do RD Station.

### AWS Lambda

O AWS Lambda é um serviço capaz de executar instruções em diferentes linguagens de programação. O serviço irá orquestrar o uso dos demais recursos da infraestrutura e será acionado assim que demandado pela API. Se você conhece a arquitetura MVC (Model, View, Controller), o AWS Lambda vai agir como um controller.

### AWS RDS MySQL

A AWS tem uma categoria de serviços chamada de RDS, ou Relational Database Service, que suporta a configuração de diversos bancos de dados conhecidos, como PostgreSQL, MariaDB ou MySQL. Há também um gerenciador de bancos de dados construído em cima do MySQL chamado AWS Aurora, com foco em performance. Neste exercício vamos trabalhar com uma instância do MySQL nativo.

Além dos serviços descritos, vamos precisar de outros três para fazer a publicação da arquitetura:

- AWS IAM
- AWS VPC
- AWS CloudWatch

### AWS IAM

Todo serviço na AWS possui restrições de acesso. As permissões são concedidas a usuários do sistema e também a outros serviços. O sistema de permissões da AWS é o IAM, ou Identity Access Management.

### AWS VPC

Além das permissões de usuários, serviços na AWS podem ou não estar isolados da internet. Serviços isolados ficam em uma rede cujas regras são determinadas pelos usuários administradores e os dispositivos dentro desta rede podem ser conectados à internet conforme a liberação de acessos. Esse isolamento é chamado de VPC, ou Virtual Private Cloud. O banco de dados estará dentro desta rede segura.

## AWS CloudWatch

Cada execução de código no AWS Lambda gera um log de execução. Este log deve, obrigatoriamente, ser armazenado no CloudWatch. O serviço permite o armazenamento e a gestão de quaisquer logs, incluíndo as chamadas na API, mas para este exercício apenas o log da execução do código será armazenado.

Cada serviço pode ser configurado nos mínimos detalhes por um painel administrativo, chamado de **console**.

## Configuração do ambiente

### Criação da conta na AWS

A criação de uma conta na AWS não tem custos. Ao longo do primeiro ano de uso, [diversos serviços são gratuitos](https://aws.amazon.com/free/){:target="_blank"}, incluíndo os que vamos usar ao longo do post.

Para utilizar os serviços, [crie uma conta na AWS](https://portal.aws.amazon.com/billing/signup#/start){:target="_blank"} e faça login no console.

![O console]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-3.jpg" | absolute_url }})
O console.

Todos os serviços da AWS possuem redundância, o que significa dizer que estão replicados em servidores localizados em diferentes partes do planeta. Você pode escolher em qual região quer trabalhar e como os serviços que você utiliza serão replicados nas demais regiões, para garantir a disponibilidade caso algo venha a acontecer com a infraestrutura onde sua aplicação está hospedada. Ao criar a conta, a região padrão é a Ohio (us-east-2), nos Estados Unidos. Há um centro de dados da AWS em São Paulo (sa-east-1) que pode ser utilizado para servir aplicações que serão utilizadas no Brasil. Para este exercício, mantive a configuração padrão (us-east-2) e o idioma do console em inglês.

### Criação do banco de dados

A primeira coisa que vamos fazer no ambiente é criar o banco de dados. Para isso, utilize a barra de buscas na tela inicial e digite RDS. Clique no primeiro resultado. O mesmo caminho pode ser feito indo no menu Services. Ao entrar pela primeira vez em um serviço na AWS a página exibida é a página inicial do serviço. Clique no botão "Create database".

![Configurações do banco de dados]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-4.jpg" | absolute_url }})
Configurações do banco de dados.

Há diversas opções para customizar a criação do banco.

Mantenha marcada a opção "Standard Create", para exibir todas as configurações.

Selecione o banco de dados MySQL e a edição MySQL Community. Mantenha a versão do MySQL sugerida (na data de escrita deste post, a 8.0.17).

Em templates, selecione Free tier.

Configure o nome de identificador da instância do banco de dados e a senha. Este nome não é o nome do banco de dados em sí, é o nome que identifica a instalação do banco de dados e as configurações aplicadas.

Mantenha as configurações de hardware sugeridas.

Em Connectivity, garanta que há uma VPC selecionada. Ao criar um banco de dados, ele é associado a uma VPC.

Expanda as opções clicando em Additional connectivity configuration.

Em Subnet group garanta que o grupo de rede padrão está selecionado.

Em Public access marque a opção Yes. Será possível acessar o banco de dados a partir de serviços fora da VPC, e isso será feito apenas para criar o banco de dados e a tabela onde armazenaremos os dados do RD Station. Finalizada a criação do banco e da tabela, vamos desabilitar o acesso público e deixar que a VPC controle o tráfego que chega até o banco de dados.

Em Existing VPC security groups, selecione a opção default.

Mantenha as demais configurações e clique em Create database.

![Tela inicial da nova instância do MySQL]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-5.jpg" | absolute_url }})
Tela inicial da nova instância do MySQL.

Agora que o banco de dados está criado, anote o endpoint, que é o endereço para conectar no banco, a porta determinada (a porta padrão é 3306), o usuário e a senha definidos no passo anterior. Com estes dados é possível utilizar qualquer cliente MySQL para se conectar ao banco de dados.

Ainda não é possível se conectar ao banco de dados. Embora a opção Public access tenha sido marcada como Yes na criação do banco, serviços fora da VPC continuam não conseguindo acessar o banco porque não conseguem entrar na VPC. É necessário liberar o acesso, o que será feito listando o endereço IP da sua máquina na lista de endereços com autorização a se conectar na VPC.

### Configuração de rede na VPC

Utilize a barra de buscas a partir do menu Services para pesquisar por "VPC". Clique no primeiro resultado. Será mostrada a tela inicial do serviço.

No menu de opções do serviço, clique em Security Groups, na seção Security. Será mostrada a lista de grupos de segurança configurados para a VPC padrão que é criada junto com a conta na AWS.

![Lista de grupos de segurança dentro da VPC padrão]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-6.jpg" | absolute_url }})
Lista de grupos de segurança dentro da VPC padrão.

Cada grupo de segurança representa um conjunto de regras para a entrada e a saída de tráfego de cada serviço dentro da VPC. É possível criar diversos grupos com configurações diferentes para cada serviço. Neste exercício vamos apenas editar o grupo de segurança padrão para autorizar o endereço IP da sua máquina a acessar o banco de dados.

Clique no ID do grupo de segurança padrão. Nas abas Inbound rules e Outbound rules estão as regras de entrada e saída de tráfego, respectivamente. A regra de saída padrão é autorizar toda a saída de tráfego pela VPC. Clique em Edit inbound rules.

Clique no botão Add rule. Para cada regra no grupo de segurança devem ser especificados o tipo de tráfego, o protocolo, a porta e o endereço de origem. Para autorizar o seu endereço de IP a estabelecer uma conexão com o banco de dados selecione o tipo All TCP. O protocolo e a porta vão ser preenchidos automaticamente. Clique em Source e selecione My IP. Seu endereço de IP será adicionado a tabela. Clique em Save rules para aplicar a configuração.

Seu endereço de IP agora está autorizado a passar pela VPC e se conectar ao banco de dados pelo endpoint determinado na criação do banco. Vamos agora testar esta conexão.

### Configuração do banco de dados

Para este exercício, vou utilizar o MySQL Workbench, que pode ser [baixado gratuitamente](https://dev.mysql.com/downloads/workbench/){:target="_blank"} no site do MySQL. Com o MySQL aberto, clique em nova conexão. Dê um nome para a conexão, mantenha o modo _Standard (TCP/IP) selecionado e preencha os parâmetros Hostname, Port, Username e Password com os dados criados no processo de criação da nova instância MySQL na AWS. Clique em Test connection para verificar se está sendo possível se conectar ao banco a partir da sua máquina local. Se estiver tudo OK, clique em "OK" para abrir uma nova conexão com o banco de dados.

![Conexão aberta entre o banco de dados e o MySQL Workbench]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-7.jpg" | absolute_url }})
Conexão aberta entre o banco de dados e o MySQL Workbench.

Vamos criar uma tabela neste banco chamada rdstation. Para isso, monte a seguinte query no editor de queries:

{% highlight sql %}
CREATE DATABASE rdstation;
{% endhighlight %}

Execute o comando clicando no ícone de raio, na barra de ferramentas acima do editor de texto ou pelo atalho CTRL + Enter (ou command + Enter). Um novo banco de dados foi criado. Precisamos agora criar uma tabela neste banco para armazenar os leads vindos do RD Station. Antes de criar a tabela precisamos selecionar o banco de dados. Para selecionar o banco de dados recém criado, execute a seguinte query:

{% highlight sql %}
USE rdstation;
{% endhighlight %}

Com o banco selecionado, crie a tabela leads:

{% highlight sql %}
CREATE TABLE leads(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200),
  email VARCHAR(200)
);
{% endhighlight %}

O banco de dados agora está configurado para receber os dados dos leads vindos pelo webhook do RD Station.

### Criação da função lambda

O passo seguinte é configurar o serviço Lambda, que executa os trechos de código que vão acionar os demais serviços utilizados na arquitetura a ser criada. Os códigos são executados a partir de funções, invocadas após algum evento. Estas funções são chamadas de funções lambda. Não é necessário configurar ambiente para executar uma função lambda, isso já é feito na AWS. A única preocupação é escrever o código e carregá-lo para dentro do serviço.

Utilizando a barra de buscas, pesquise por "Lambda" e clique no primeiro resultado. Ao entrar na página do serviço Lambda, clique em "Criar função".

![Configurações da nova função]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-8.jpg" | absolute_url }})
Configurações da nova função.

A Amazon disponibiliza uma lista de templates para funções que normalmente são criadas. Para este exercício, vamos trabalhar com uma nova função em branco (Author from scratch).

O passo seguinte é dar um nome a função, seguindo as mesmas regras utilizadas por linguagens de programação.

Neste exercício será usada a linguagem Javascript rodando em ambiente Node.js. A versão mais recente disponível na data deste post será usada (12.x).

O passo seguinte é estabelecer as permissões de execução para esta função. É possível criar um conjunto de permissões (papel) sem sair da tela de criação da função lambda. Para isso, marque a opção "Create a new role with basic Lambda permissions".

Por fim, clique em Create function.

![Tela de edição da função recém criada]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-9.jpg" | absolute_url }})
Tela de edição da função recém criada.

Agora que a função está criada, precisamos configurar o momento em que ela será acionada. Conforme o desenho da arquitetura estabelecido no começo deste post, precisamos que a função seja chamada assim que a API receber os dados de um webhook. Vamos criar esta API a partir da função lambda criada.

No bloco Designer, clique em Add trigger. Expanda as opções no campo de busca que aparece e selecione API Gateway. Ao selecionar esta opção, um assistente de configuração de nova API vai abrir. Selecione Create an API e marque a opção REST API. Em segurança, mantenha a opção Open. Expanda as opções em Additional settings. Dê um nome para a API e, opcionalmente, um nome para o estágio de desenvolvimento padrão da API. Você pode criar diversos estágios de desenvolvimento, útil para separar o ambiente de desenvolvimento do de testes e do de produção por exemplo. Com as configurações feitas, clique em Add.

Nas opções da função, encontre o bloco de opções VPC. Precisamos adicionar esta função lambda dentro da VPC onde está o banco de dados. Esta não é a única forma de fazer esta conexão, é possível deixar a função lambda fora da VPC e estabelecer uma conexão com a VPC e com o banco. Mantendo a função lambda dentro da VPC, no entanto, eliminamos a etapa de configuração da conexão entre a função lambda e a VPC. Lembre-se de que os objetos dentro da VPC não possuem acesso à internet por definição, neste exercício será possível fazer isso pois a função só se conecta com o banco de dados que está dentro da VPC e não precisa chamar outros serviços na internet.

Em VPC, clique em Edit. Selecione a VPC padrão, as três subnets padrão e o grupo de segurança padrão. Note que ao selecionar o grupo de segurança padrão, a página irá listar todas as regras Inbound e Outbound definidas nas configurações do grupo de segurança, incluíndo a que criamos para autorizar o seu IP a acessar a VPC. Clique em Save.

A função está configurada, mas ainda faltam duas tarefas: dar permissão de leitura da API para a função criada e pegar o endereço do endpoint para o qual o webhook do RD Station deve mandar os dados.

### Configurando as permissões da função lambda ###

Ao criar a função lambda, marcamos a opção para que um conjunto de permissões fosse criado com as permissões mínimas para que a função seja executada. Estas permissões mínimas autorizam a função a:
- Escrever logs no AWS CloudWatch
- Acessar e gravar dados no AWS EC2, que é o serviço de máquinas virtuais da AWS onde as funções ficam armazenadas.

Precisamos autorizar a função a receber os dados da API que foi criada. Para fazer isso, acesse o menu Services e busque por "IAM". Clique no primeiro resultado. No menu de opções, clique em Roles.

![Exibição dos papéis criados]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-10.jpg" | absolute_url }})
Exibição dos papéis criados.

O papel criado ao criar a função nome possui o nome da função. Clique neste papel.

Clique no botão "Attach policies". A página vai exibir uma lista de possíveis permissões que podem ser aplicadas a este papel. Na caixa de busca, encontre a permissão "AmazonAPIGatewayInvokeFullAccess". Selecione a permissão e clique em "Attach policy". A permissão será adicionada ao papel, e todos os serviços que fazem uso deste papel terão esta e as demais permissões deste papel.

### Encontrando o endereço da API ###

A última etapa da configuração básica é pegar o endereço do endpoint na API criada. Para fazer isso, acesse o menu Services. Na caixa de busca, digite por "API" e clique na primeira opção. A tela inicial irá mostrar que já existe uma API criada, a que foi criada ao determinar o gatilho da função lambda. Clique nesta API. Veja que já existe um endpoint criado para esta API com o nome que você deu para a função. Ao ser publicada, a API deverá ser chamada da seguinte forma: https://endereco-da-api/estagio/nomeDaFuncao, onde estágio é o nome do estágio padrão criado no momento de criação da API e nomeDaFuncao é o recurso do endpoint que está associado a função lambda. Se você não incluir na URL o nome da função (também chamado de recurso ou método) no endereço de chamada a API, você vai ver um erro na tela ao acessar este endereço direto no navegador dizendo "Missing authentication token".

Para encontrar o endereço da API criada, acesse o menu Stages e clique no estágio que foi criado na etapa de criação da API. Anote o endereço em Invoke URL. Note que este endereço não está com o recurso anexado à URL (não tem o nome da função após o nome do estágio). O endereço completo precisa ter o nome do recurso. Para saber qual o nome exato do recurso, basta ir em Resources, acima de Stages no menu.

## O orquestrador

Lembre-se: a função lambda criada irá orquestrar os demais recursos da infraestrutura. Precisamos ensiná-la a fazer isso. Vá até a página do serviço lambda e acesse a função criada. Note que há um editor de códigos. Podemos criar os comandos direto no editor. Há uma limitação com o editor padrão, no entanto: não podemos instalar pacotes. No caso do Node.js, não podemos utilizar o NPM (Node Package Manager). Precisamos do pacote mysql para criar a conexão com o banco de dados dentro da função lambda e este pacote não está instalado neste ambiente. Todas as dependências necessárias para o projeto precisam ser carregadas neste ambiente.

Para carregar os arquivos necessários, crie uma pasta e comece um novo projeto em Node.js na raiz desta pasta. Caso não possua o Node.js instalado em sua máquina, [faça a instalação](https://nodejs.org/en/){:target="_blank"} antes de seguir.

Uma vez que o Node.js esteja instalado em sua máquina, abra um terminal e acesse a pasta raiz do projeto a ser carregado no AWS Lambda. Dentro da pasta, rode o comando:

{% highlight shell %}
npm init
{% endhighlight %}

O comando irá pedir algumas informações para a inicialização do projeto, como nome do autor e arquivo de inicialização. Preencha as informações do pacote como preferir, mantenha o ponto de entrada na função como sendo o arquivo index.js e confirme as opções quando estiver tudo preenchido.

É necessário instalar o pacote mysql, [disponível no NPM](https://www.npmjs.com/package/mysql){:target="_blank"}. Rode o seguinte comando no terminal:

{% highlight shell %}
npm install mysql
{% endhighlight %}

O pacote será instalado na pasta do projeto, junto com suas dependências, dentro de uma pasta chamada node_modules.

Com o mysql instalado, podemos utillizá-lo para fazer a conexão com o banco de dados.

Abra seu editor de códigos preferido e crie, na raiz da pasta do projeto, um arquivo chamado index.js. Este arquivo irá armazenar o código que vamos escrever para receber o webhook do RD Station e armazenar seus dados no banco de dados.

### A estrutura básica de uma função lambda

Toda função lambda é iniciada com uma estrutura básica:

{% highlight javascript %}

exports.handler = async (event) => {

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from lambda!')
  };
  return response;
}

{% endhighlight %}

Este objeto handler contém o "coração" da função. As ações de importância são executadas dentro de uma função no objeto o status da execução é retornado ao final. Antes de escrever o código da função, faremos um ajuste para executá-la de forma síncrona:

{% highlight javascript %}

exports.handler = function(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  callback(null, {
    statusCode: 200,
    body: 'Hello from lambda!',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

{% endhighlight %}

Há alguns pontos de atenção na reescrita desta função:
- A função sendo inicializada agora recebe três parâmetros
- O retorno é dado por uma função chamada callback
- Dizemos para o objeto context que as chamadas a função callback não devem esperar o processamento da fila de eventos antes de sua execução
- O objeto de retorno agora tem uma propriedade de cabeçalhos que passa cabeçalhos web. O cabeçalho Access-Control-Allow-Origin permite que a API seja chamada por serviços web de fora do domínio onde a API está hospedada, e é obrigatório para que a API possa ser acessada nestes casos.

A função será executada de forma síncrona até que seu término seja determinado por meio da chamada a callback.

Com a configuração feita, vamos escrever o código da função e abstrair essa chamada a função callback.

{% highlight javascript %}

const mysql = require('mysql');

function handleEvent(event) {
  if (event.body != null) return JSON.parse(event.body);

  return null;
}

function handleCallback(callback, error, status_code, message) {
  callback(error, {
    statusCode: status_code,
    body: message,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

{% endhighlight %}

Começamos importando o pacote mysql. Em seguida, criamos duas funções: handleEvent e handleCallback. A função handleEvent trata o objeto event. Este objeto possui informações sobre a requisição feita e possui uma propriedade chamada body. Quando uma requisição do tipo POST é feita e o corpo da requisição é preenchido (caso do webhook do RD Station), esta propriedade do objeto estará preenchida. Para tornar o exercício simples, apenas é verificado se a propriedade body do objeto evento está preenchida e, caso esteja, tenta fazer a conversão (parse) do objeto assumindo que ele veio em formato JSON.

A função seguinte, handleCallback, abstrai a chamada a callback, recebida ao invocar a função associada ao objeto handler. Esta função retorna para o solicitante o resultado da execução da função.

Vamos agora criar o objeto de conexão com o banco.

{% highlight javascript %}

const connection = mysql.createConnection({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DATABASE
});

{% endhighlight %}

Vamos criar na função lambda algumas variáveis de ambiente que vão armazenar as credenciais de acesso ao banco. A AWS possui um serviço feito para armazenar este tipo de informação chamado AWS Secrets Manager. O recurso, no entanto, está fora da lista de recursos que podem ser usados gratuitamente.

Com os preparativos feitos, vamos agora escrever a função que irá receber o webhook e gravá-lo no banco de dados.

{% highlight javascript %}

exports.handler = function(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  let response = handleEvent(event);

  if (response && response.hasOwnProperty('leads')) {
    let lead = response.leads[0];
    setTimeout(function() {
      // Esta sintaxe do comando INSERT é válida no MySQL mas não é padrão da linguagem
      connection.query('INSERT INTO leads SET ?', {name: lead.name, email: lead.email}, function(error, results, fields) {
        connection.release();

        if (error) throw error;

        handleCallback(callback, null, 200, 'ok');
      });
    }, 1000);
  } else handleCallback(callback, null, 200, 'Script ended');
};

{% endhighlight %}

Esta função:
- Determina que a função callback não precisa esperar o término de outros eventos que ainda precisem ser processados.
- Verifica se o corpo de uma requisição a API existe e possui dados no formato JSON.
- Verifica se o objeto retornoado possui uma propriedade chamada leads*
- Caso não possua leads, invoca a função callback
- Caso possua leads, dá um intervalo de 1 segundo para que uma query de inserção no banco de dados seja executada.

\* [O formato do webhook irá mudar](https://developers.rdstation.com/pt-BR/migration/webhooks){:target="_blank"}.

Este é o arquivo index.js completo:

{% highlight javascript %}

const mysql = require('mysql');

function handleEvent(event) {
  if (event.body != null) return JSON.parse(event.body);

  return null;
}

function handleCallback(callback, error, status_code, message) {
  callback(error, {
    statusCode: status_code,
    body: message,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

const connection = mysql.createConnection({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DATABASE
});

exports.handler = function(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  let response = handleEvent(event);

  if (response && response.hasOwnProperty('leads')) {
    let lead = response.leads[0];
    setTimeout(function() {
      // Esta sintaxe do comando INSERT é válida no MySQL mas não é padrão da linguagem
      connection.query('INSERT INTO leads SET ?', {name: lead.name, email: lead.email}, function(error, results, fields) {
        connection.release();

        if (error) throw error;

        handleCallback(callback, null, 200, 'ok');
      });
    }, 1000);
  } else handleCallback(callback, null, 200, 'Script ended');
};

{% endhighlight %}

Salve o arquivo. Selecione todos os arquivos criados na pasta (index.js, a pasta node_modules e o arquivo package.json) e os adicione em um arquivo compactado. O formato do arquivo compactado deve ser zip.

![Pasta compactada com os arquivos index.js, node_modules e package.json]({{ "/assets/images/blog/2020-09-03-rd-station-e-google-sheets-na-aws-image-10.jpg" | absolute_url }})
Pasta compactada com os arquivos index.js, node_modules e package.json.

Com a pasta compactada contendo os arquivos do projeto, acesse o painel do AWS Lambda e, dentro do bloco Function code, clique no botão Actions > Upload a .zip file. Uma janela de seleção de arquivos vai se abrir. Selecione o arquivo compactado com os arquivos do projeto e clique em Save. Estes arquivos estarão disponíveis no editor da função lambda, assim como o pacote mysql e suas dependências.

### Configurando as variáveis de ambiente

Na criação do objeto de conexão com o banco de dados, utilizamos cinco variáveis de ambiente:
- RDS_HOST
- RDS_PORT
- RDS_DATABASE
- RDS_USER
- RDS_PASSWORD

Precisamos criar estas variáveis no ambiente lambda. Navegue até o bloco Environment variables, abaixo do editor de código, e clique em Edit. Adicione no campo Key o nome RDS_HOST e no campo Value o endpoint obtido ao criar o banco de dados. Clique em Add environment variable para adicionar mais uma variável de ambiente no projeto. Crie as demais variáveis e adicione as configurações obtidas ao criar a instância do banco de dados e o banco de dados em sí. Clique em Save quando terminar.

## Configurando o webhook no RD Station

O passo final é ativar o disparo de webhooks no RD Station, o que pode ser feito via configurações da conta do RD Station ou via fluxos de automação, [como explicado na parte 1 desta série]({% post_url 2018-09-02-rd-station-e-google-sheets %}). Basta seguir o mesmo procedimento e trocar apenas o endereço para envio do webhook. No lugar do endereço do GAS será utilizado o endereço da API criada no AWS API Gateway, lembrando que o endereço deve conter o nome do endpoint e o recurso.

## Próximos passos

Ao executar este exercício, você teve uma breve introdução a alguns dos serviços oferecidos pela AWS. Esta mesma arquitetura poderia ter sido feita de outras formas, utilizando outros serviços para armazenamento. O RD Station pode ser apenas uma fonte de entrada para um Data Warehouse ou um Data Lake, ou ainda poderia ter passado por um pipeline de dados mais complexo antes de ser armazenado no banco de dados. As possibilidades são diversas e a forma de implementação irá depender da necessidade de cada projeto. A [documentação da AWS](https://docs.aws.amazon.com/index.html){:target="_blank"} é uma ótima fonte de informações, bem como os inúmeros posts no Stack Overflow de pessoas que tiveram dificuldades ao configurar os recursos da AWS.

Por fim: você encontrou algum erro neste post ou conhece uma forma de melhorar este trabalho? Fique a vontade para me adicionar no LinkedIn, cujo link está na minha assinatura neste post.

Bora continuar automatizando!

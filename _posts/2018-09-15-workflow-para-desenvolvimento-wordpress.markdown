---
layout: post
title:  'Workflow automático para desenvolvimento de temas e plugins no WordPress'
date:   2018-09-15 16:29:00
categories: [Desenvolvimento]
image: '/assets/images/blog/2018-09-15-workflow-para-desenvolvimento-wordpress-featured.png'
image_credit: 'WordPress, Henrique Freitas Souza'
---

Se tem uma coisa que não parece ter uma forma correta de fazer ([ou tem até certo ponto](https://developer.wordpress.org/themes/basics/organizing-theme-files/){:target="_blank"}) é organizar o desenvolvimento de um tema ou um plugin para WordPress. Há pelo menos dezenas de formas diferentes de preparar os arquivos para produção. Deixarei registrada a forma como eu atualmente organizo os projetos que desenvolvo, um processo que acredito ser fundamental para estabelecer um processo de produção padrão, uma comunicação uniforme entre as e os desenvolvedores dos projetos e a manutenção dos arquivos no futuro.

<!--more-->

**[WARNING] Irei assumir que você tenha familiaridade com desenvolvimento em WordPress, saber usar o NPM e conhece gerenciadores de tarefas. [/WARNING]**

Vou dividir o assunto nos seguintes tópicos:

* Download e instalação dos boilerplates de plugins e temas
* Criação da estrutura de pastas dos projetos
* Criação dos pacotes dos projetos com o NPM
* Download do Gulp e dependências para os projetos
* Criação da automação para compilar os arquivos e gerar as versões de produção

## A Manutenção do WordPress

Manter o WordPress atualizado e livre de erros é uma tarefa bem desafiadora. Isso porque várias partes dele são feitas por desenvolvedoras e desenvolvedores independentes entre sí e disponibilizadas ao público como plugins e temas. Para garantir consistência em todo o ecossistema, a [Automattic](https://automattic.com/){:target="_blank"} impõe uma série de regras para a criação de [temas](https://developer.wordpress.org/themes/release/theme-review-guidelines/){:target="_blank"} e [plugins](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/){:target="_blank"} que a comunidade precisa seguir antes de terem seus trabalhos aprovados para serem exibidos nos repositórios online do [WordPress.org](https://wordpress.org/themes/){:target="_blank"}. Isso já ajuda, mas um plugin ou tema conflitante com outro ainda aparece por hora. Já tive até mesmo a experiência de desenvolver um plugin que funciona perfeitamente com versões do WordPress que usam o editor de páginas e posts nativo [TinyMCE](https://codex.wordpress.org/TinyMCE){:target="_blank"}, ou seja, todas pelo menos desde a versão 3.1, mas que certas partes deixam de funcionar quando instalo o plugin do [Gutenberg](https://wordpress.org/gutenberg/){:target="_blank"} e faço uso da [WP REST API](https://developer.wordpress.org/rest-api/){:target="_blank"} com JavaScript.

Para evitar ao máximo problemas de incompatibilidade, busco sempre entender em meus projetos quais os plugins necessários para garantir uma experiência consistente com aquilo o que as pessoas que farão uso da plataforma esperam. Não limito em um número específico mas tento usar o mínimo de dependências externas sem ter que reinventar a roda. Com a definição do que vou usar de terceiros e o que vou desenvolver, trato de fazer a configuração dos boilerplates do tema e do plugin.

## Boilerplates

Eu nunca inicio o desenvolvimento de um plugin ou tema completamente do zero. Conto sempre com a ajuda dos tais boilerplates: estruturas de pastas e arquivos organizados de tal forma a se comunicar com o [Core do WordPress](https://make.wordpress.org/core/handbook/about/){:target="_blank"} seguindo um padrão condizente com as regras de publicação dos trabalhos nos repositórios oficiais da Automattic. Existem boilerplates para temas e para plugins.

### Boilerplate para temas

![Página inicial do boilerplate Underscores exibindo as opções avançadas]({{ "/assets/images/blog/2018-09-15-workflow-para-desenvolvimento-wordpress-image-1.png" | absolute_url }})
Página inicial do boilerplate Underscores exibindo as opções avançadas

A própria Automattic, por meio de sua [divisão responsável pelo desenvolvimento de temas](https://themeshaper.com/){:target="_blank"}, mantém um boilerplate, chamado \_s [(Underscores)](https://underscores.me/){:target="_blank"}. Ao abrir o site do Underscores, basta escrever o nome do tema e apertar o botão "Generate". Um arquivo compactado será enviado para a sua máquina. Basta fazer o upload deste arquivo para o WordPress, seja pelo gerenciador de temas do painel administrativo ou copiando e colando a pasta descompactada para a wp-content/themes (ou o seu diretório padrão de temas) e pronto! Um tema novinho, em branco e funcionando será ativado em sua instalação do WordPress. Este boilerplate não só agiliza a criação de alguns arquivos como o functions.php ou o style.css mas gera alguns outros arquivos .php com funções separadas para facilitar o entendimento e a manutenção do projeto.

Abaixo do campo para digitar o nome do tema há um link para exibir opções avançadas. Ao apertar o link, opções para definir o slug (identificador) do tema, informações sobre o autor e descrição aparecem. Há opções para criar um boilerplate adaptado para temas que farão uso do [WooCommerce](https://woocommerce.com/){:target="_blank"} e criar folhas de estilo Sass.

![Arquivos e pastas na raiz do Underscores com a opção "\_sassify!" selecionada]({{ "/assets/images/blog/2018-09-15-workflow-para-desenvolvimento-wordpress-image-2.png" | absolute_url }})
Arquivos e pastas na raiz do Underscores com a opção "\_sassify!" selecionada

Os arquivos essenciais para o funcionamento de um tema são o functions.php e o style.css. Estes dois já foram criados, bem como vários outros para renderizar diferentes páginas como a de resultados de busca, posts do blog e templates para cabeçalho e rodapé. O functions.php foi separado em blocos menores e este arquivo faz o papel de agregador entre estes blocos. Os arquivos que compõem o functions.php ficam dentro do diretório **inc**. Há uma pasta **js** na raiz do tema com scripts para ajustes de acessibilidade, navegação mobile e funcionalidades do [Customizer](https://developer.wordpress.org/themes/customize-api/){:target="_blank"}. A pasta **languages** armazena os arquivos de tradução do tema, a **layouts** guarda folhas de estilo e já vem com dois arquivos CSS para configurar a exibição da área de conteúdo principal e a de barra lateral. A pasta **sass** foi incluída após marcar a opção "\_sassify!" e inclui arquivos .scss com a redefinição dos estilos padrão dos navegadores e definição de estilos para alguns elementos, como botões. Por fim, a pasta **template-parts** possui os blocos dinâmicos de conteúdo de páginas, posts, página não encontrada e resultados de busca.

Os conteúdos destas pastas são referenciados nos arquivos que estão na raiz do tema. Os seguintes arquivos fazem uso do conteúdo de template-parts para renderizar a página completa:

* archive.php
* index.php
* page.php
* search.php
* single.php

Os arquivos header.php e footer.php são o cabeçalho e o rodapé padrão do tema, presentes em todas as páginas. O screenshot.png é uma imagem a ser exibida no painel administrativo para o tema. A imagem é completamente transparente e possui resolução de 1200 x 900px.

### Boilerplate para plugins

![Página inicial do boilerplate wppb]({{ "/assets/images/blog/2018-09-15-workflow-para-desenvolvimento-wordpress-image-3.png" | absolute_url }})
Página inicial do boilerplate wppb

Assim como temas, plugins possuem seus boilerplates. O mais usado foi criado em 2011 pelo desenvolvedor [Tom McFarlin](https://github.com/tommcfarlin/){:target="_blank"} e hoje é mantido pelo [Devin Vinson](https://github.com/DevinVinson/){:target="_blank"}. O boilerplate está [hospedado no Github](https://github.com/DevinVinson/WordPress-Plugin-Boilerplate){:target="_blank"} e serve de base para geradores de boilerplates online, com funcionamento similar ao Underscores. Um destes projetos é o [WordPress Plugin Boilerplate Generator, ou wppb](https://wppb.me/){:target="_blank"}, mantido pelo desenvolvedor [Enrique Chávez](https://enriquechavez.co/){:target="_blank"} e com apoio do Devin Vinson.

Ao preencher as informações do plugin e apertar o botão "Build Plugin", um arquivo compactado será enviado para a sua máquina.

![Arquivos e pastas na raiz do boilerplate para criação de plugins]({{ "/assets/images/blog/2018-09-15-workflow-para-desenvolvimento-wordpress-image-4.png" | absolute_url }})
Arquivos e pastas na raiz do boilerplate para criação de plugins

Este plugin já pode ser instalado no WordPress via painel administrativo fazendo o upload do arquivo compactado ou copiando os arquivos do plugin para a wp-content/plugins (ou o seu diretório de instalação de plugins).

Um plugin precisa essencialmente de duas coisas para ser um plugin: um arquivo .php com um comentário e [hooks](https://developer.wordpress.org/plugins/hooks/){:target="_blank"} que o ligam ao Core. O boilerplate já deixa essa estrutura pronta e cria diversas outras pastas e arquivos para organizar o plugin. As pastas **admin** e **public** armazenam os arquivos que compõem as partes de administração pelo painel do WordPress e exibição pública do plugin no site, respectivamente. A pasta **includes** contém funções de configuração do plugin e definição de hooks. A pasta **languages** contém os arquivos de tradução do plugin.

Cada boilerplate gerado pela ferramenta web vai criar um arquivo na raiz com o nome do plugin, definido no campo slug. Esse arquivo contém o cabeçalho do plugin, com as informações que serão exibidas no painel de administração do WordPress. O campo description possui um descritivo genérico, que precisa ser preenchido dentro do arquivo. A raiz ainda contém um arquivo index.php em branco e uninstall.php, que pode ser usado para realizar ações que devem ser executadas no ato da desinstalação do plugin.

Embora este boilerplate seja bem completo, em geral cinco arquivos serão editados para construir e exibir as funcionalidades do plugin:

* **class-nome-do-plugin.php**, dentro de includes. Este arquivo faz a gestão dos hooks e das funções definidas nos demais arquivos de configuração do plugin.
* **class-nome-do-plugin-admin.php**, dentro de admin. Este arquivo define as funções usadas para gerenciar o plugin no painel administrativo.
* **nome-do-plugin-admin-display.php**, dentro de admin/partials. Este arquivo renderiza HTML no painel administrativo.
* **class-nome-do-plugin-public.php**, dentro de public. Este arquivo define as funções que serão executadas na parte pública do site.
* **nome-do-plugin-public-display.php**, dentro de public/partials. Este arquivo renderiza HTML na parte pública do site.

O termo "nome-do-plugin" é o nome definido no campo slug do gerador de boilerplate online.

## Antes de seguirmos, uma palavrinha sobre os boilerplates

Boilerplates podem ser muito úteis para iniciar um projeto rapidamente, pois a estrutura básica já está pronta e pode ser adicionada ao WordPress sem que uma linha de código seja escrita. Por outro lado, são organizados tendo em vista o desenvolvimento e a manutenção de projetos complexos com diversas funcionalidades. Para plugins e temas simples, um boilerplate pode não fazer muito sentido. Em plugins e temas que fazem uso de frameworks CSS a estrutura de estilos pode também não ser a mais adequada. Cabe a quem está desenvolvendo optar pelo uso ou não de boilerplates e também se irá seguir com a estrutura padrão.

## Organização de um novo projeto

Algo muito comum no desenvolvimento de um tema para WordPress é criar posts, templates e taxonomias personalizadas. Isso pode ser feito facilmente adicionando as funcionalidades no arquivo functions.php e também criando um plugin para gerenciar estas partes do tema. As duas abordagens tem prós e contras e não há um consenso sobre qual é a forma correta de fazer. Esta é outra decisão que cabe as e aos desenvolvedores. Eu costumo seguir o caminho de criar um plugin para desenvolver as funcionalidades do tema. Gosto desta abordagem pois consigo trabalhar no tema de forma independente, sem perder conteúdo em uma eventual troca de tema. Seguindo por este caminho, meu trabalho é garantir que as informações armazenadas pelo plugin possam ser resgatadas em outros temas.

Para organizar o espaço de trabalho, eu crio uma pasta que vai armazenar todos os plugins e temas que estiver desenvolvendo para determinada empresa. É nesta pasta que faço a inicialização do [git](https://git-scm.com/){:target="_blank"}, e tudo o que estiver dentro dela passará a ser monitorado por mudanças. Dentro desta pasta eu crio outras duas, uma chamada **plugins** e outra chamada **temas**. Dentro da pasta plugins, crio outras duas: uma com o nome **src** e outra com o nome **dist**. A pasta src vai ter os arquivos usados em desenvolvimento e a pasta dist vai ter os arquivos que serão usados na versão em produção do plugin. Dentro de src eu coloco os arquivos do boilerplate que gerei online. Faço o mesmo processo na pasta temas. Crio as pastas src e dist e copio os arquivos de dentro do boilerplate do tema para a pasta src. A estrutura de pastas segue este padrão:

nome-da-empresa/

nome-da-empresa/plugins

nome-da-empresa/plugins/nome-do-plugin

nome-da-empresa/plugins/nome-do-plugin/src

nome-da-empresa/plugins/nome-do-plugin/dist

nome-da-empresa/temas

nome-da-empresa/temas/nome-do-tema

nome-da-empresa/temas/nome-do-tema/src

nome-da-empresa/temas/nome-do-tema/dist

O termo nome-da-empresa é o nome da empresa para qual os plugins e temas serão criados, nome-do-plugin é o nome do plugin criado e nome-do-tema é o nome do tema criado.

## NPM e Gulp: automação de tarefas para preparação dos arquivos

Costumo fazer certos procedimentos para tornar temas e plugins mais leves:

* Concatenar arquivos similares em um só para carregamento único sempre que possível
* Minificar arquivos para remover espaços entre linhas de código
* Compactar imagens para reduzir o tamanho dos arquivos
* Carregar as versões de produção de bibliotecas de terceiros dentro do meu código
* Compilar os arquivos .scss para a saída em .css

Fazer estas coisas sempre que os arquivos são editados pode levar um tempo considerável. Para que eu não tenha que fazer isso na mão, uso o [Gulp](https://gulpjs.com/){:target="_blank"}. O Gulp é um gerenciador de tarefas que apoia o desenvolvimento de projetos automatizando tarefas comuns mas que não estão ligadas ao desenvolvimento do código em sí, como a criação dos arquivos, compilação e preparação para produção. O Gulp está disponível no [Node Package Manager, ou NPM](https://www.npmjs.com/){:target="_blank"}. O NPM é um gerenciador de pacotes que possui um repositório com diversas bibliotecas de código aberto. O NPM, por sua vez, é o gerenciador de pacotes do [Node.js](https://nodejs.org/){:target="_blank"}, um ambiente de servidor que executa JavaScript. Para instalar o Gulp é necessário ter o NPM e para instalar o NPM é necessário ter o Node.js. Ao baixar e instalar o Node.js para o seu sistema operacional, o NPM será instalado junto.

Uma vez que a estrutura de pastas esteja pronta, crio um novo pacote dentro das pastas nome-do-tema e nome-do-plugin. Para isso, usando o console eu navego até estes diretórios, um de cada vez, usando o seguinte comando: {% highlight javascript %}npm init{% endhighlight %}

![Criação do pacote na pasta do plugin]({{ "/assets/images/blog/2018-09-15-workflow-para-desenvolvimento-wordpress-image-5.png" | absolute_url }})
Criação do pacote na pasta do plugin

O comando irá pedir alguns inputs para configurar o pacote. Uma vez preenchidos o pacote será configurado. Um arquivo chamado package.json foi gerado. Este arquivo especifica as dependências do pacote criado. Por hora ele só vai conter os dados que foram passados pelo console no momento da criação mas conforme novas dependências forem sendo instaladas, elas serão listadas no package.json. Comecei criando o pacote pela pasta do plugin mas a ordem é irrelevante. Após repetir o processo na pasta do tema um pacote será criado para este tema. Crio um pacote para cada tema e plugin presente na pasta de projetos da empresa, assim cada pacote é desenvolvido de maneira independente.

O próximo passo é instalar o Gulp. A ferramenta possui uma interface de linha de comando que deve ser instalada no escopo global, portanto será instalada apenas uma vez:

{% highlight javascript %}
npm install --g gulp-cli
npm install --save-dev gulp
{% endhighlight %}

Note que uma nova pasta apareceu no diretório onde estão as pastas src e dist criadas anteriormente. A pasta chama-se **node_modules** e contém todas as dependências não só do pacote que estamos desenvolvendo mas de todos os pacotes que estamos usando. Se, por exemplo, nosso pacote depende de um pacote A e esse pacote A depende de um pacote B, ambos estarão na pasta node_modules. Note também que peguei o pacote gulp com a flag -\-save-dev, o que marca o pacote como sendo uma dependência apenas para desenvolvimento, não sendo necessária para executar o pacote. Estes pacotes fazem parte de um escopo diferente, o que é uma forma de isolar as dependências para melhor organização e consumo de recursos. O NPM possui ao menos três escopos para gestão de pacotes:

* **Global**: pacotes no escopo global podem ser referenciados em todos os projetos.
* **Local**: este é o padrão usado pelo npm install. Após a instalação, o package.json adiciona a linha do pacote adicionado na seção de dependências.
* **Desenvolvimento**: este é o escopo especificado por -\-save-dev. Pacotes marcados como dependências de desenvolvimento são usados apenas durante a construção do pacote. Outras pessoas que usarem este pacote e instalarem as dependências com npm install não baixarão os pacotes listados em dependências de desenvolvimento por padrão. Pacotes marcados com -\-save-dev ficarão em uma seção dedicada a dependências de desenvolvimento no package.json.

A instalação do Gulp e dependências deverá ser feita para todos os outros plugins e temas. A interface de linha de comando precisa ser instalada apenas uma vez então a instalação do gulp-cli não vai ser feita para os demais pacotes.

## Configuração do gulpfile.js

Para que possa ser usado, o Gulp precisa ler as instruções de um arquivo chamado gulpfile.js. Esse arquivo irá conter as instruções que o Gulp deve executar sempre que os arquivos do projeto forem modificados. O gulpfile.js deve ser criado na raiz do pacote, que neste caso são as pastas dos projetos que abrigam as pastas src, dist e node_modules. O gulpfile.js irá também carregar as dependências do gulp para realizar as ações que queremos, como concatenar arquivos, minificar e compilar arquivos Sass.

Como faremos uso de pacotes de terceiros para configurar o gulpfile.js teremos que carregá-las no pacote via NPM. Cada projeto terá as suas dependências. Para este projeto de exemplo, vou usar algumas com as quais tenho trabalhado em projetos recentes. Para isso, usando o console e o comando npm install vamos pegar os seguintes pacotes:

{%highlight javascript %}

npm install --save-dev gulp-sass gulp-autoprefixer gulp-uglify gulp-cssnano gulp-rename merge2

{% endhighlight %}

Diversas dependências de desenvolvimento foram separadas por espaços após a flag -\-save-dev. Elas são:

* Sass (gulp-sass): compila arquivos com extensão .scss em .css
* Autoprefixer (gulp-autoprefixer): adiciona as extensões CSS específicas de cada navegador como -webkit, -o, -ms ou -moz conforme a necessidade. A consulta é feita no site [Caniuse](https://caniuse.com/){:target="_blank"}
* Uglify (gulp-uglify): minifica arquivos JavaScript
* Css Nano (gulp-cssnano): minifica arquivos CSS
* Rename (gulp-rename): renomeia arquivos
* Merge (merge2): faz a gestão da execução de multiplas tarefas simultaneamente

Com as dependências instaladas, podemos carregá-las no gulpfile.js e configurar as tarefas que devem ser executadas automaticamente. Começando pelo plugin, crie um arquivo na raiz do pacote (onde estão as pastas src, dist, node_modules e o arquivo package.json) chamado gulpfile.js. Escreva o seguinte dentro dele:

{% highlight javascript %}

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var merge = require('merge2');

var diretorios = {
  src: './src/',
  dist: './dist/',
  node_modules: './node_modules/'
};

{% endhighlight %}

As dependências são carregadas com a função require e carregadas em variáveis a serem referenciadas no restante do arquivo. Uma variável chamada "diretorios" foi criada e armazena um objeto contendo os caminhos para as pastas src, dist e node_modules a partir da raiz. Ela é opcional, gosto de usá-la apenas para organizar os diretórios que referencio bastante.

O passo seguinte é criar as tarefas. A primeira coisa que faço é criar uma tarefa que chamo de esqueleto: essa tarefa coloca na pasta dist os arquivos que já estão prontos para serem usados em produção e cria a estrutura de pastas do projeto.

{% highlight javascript %}

gulp.task('construir-esqueleto', function() {
  return gulp.src([
    diretorios.src + '**/*.php',
    diretorios.src + '**/*.txt',
    diretorios.src + '**/*.pot'
  ])
  .pipe(gulp.dest(diretorios.dist));
});

{% endhighlight %}

Gulp usa sintaxe [Glob](https://en.wikipedia.org/wiki/Glob_(programming)){:target="_blank"} para encontrar e manipular arquivos. O código acima usa o objeto gulp declarado anteriormente para buscar arquivos com extensões .php, .txt e .pot dentro do diretório raiz e qualquer um abaixo dele e colocá-los no diretório especificado dentro de diretorios.dist. Usamos return aqui para retornar o "stream de execução" da tarefa e assim deixar que outras tarefas saibam sobre sua execução. Isso é importante para montar uma fila de tarefas de forma a especificar as dependências entre tarefas. Por exemplo, preciso que os arquivos JavaScript e CSS de terceiros que venha a usar estejam carregadas antes de gerar o script final. Com o retorno do stream eu aviso outras tarefas sobre o estado da execução da tarefa atual.

Seguindo, vamos criar uma tarefa para compilar os scripts JavaScript e colocá-los na pasta dist.

{% highlight javascript %}

gulp.task('construir-script', function() {
  var scripts_admin = gulp.src([
    diretorios.src + 'admin/js/nome-do-plugin-admin.js'
  ])
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest(diretorios.dist + 'admin/js'));

  var scripts_publico = gulp.src([
    diretorios.src + 'public/js/nome-do-plugin-public.js'
  ])
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest(diretorios.dist + 'public/js'));

  return merge(scripts_admin, scripts_public);
});

{% endhighlight %}

Como não vamos usar bibliotecas JavaScript externas não há uma tarefa para carregá-las na pasta do projeto. Caso tivesse, essa tarefa precisaria ser criada e executada antes da tarefa de compilação dos scripts. Quando o boilerplate do plugin foi gerado, foram criados arquivos JavaScript e CSS com os nomes "nome-do-plugin-admin.js", "nome-do-plugin-admin.css", "nome-do-plugin-public.js" e "nome-do-plugin-public.css", sendo nome-do-plugin o nome do plugin definido no campo slug da página de geração de boilerplates do wppb.

A tarefa construir-script irá:

* Carregar os arquivos JavaScript que estão nas pastas js dos diretórios admin e public
* Fazer a minificação dos arquivos JavaScript
* Adicionar o sufixo ".min" nos arquivos
* Copiar o arquivo final para o diretório dist, nas pastas admin/js e public/js respectivamente
* Retornar a combinação dos streams de execução armazenadas nas variáveis scripts_admin e scripts_publico

Repare que não estamos usando o return direto no objeto gulp, estamos armazenando os streams nas variáveis scripts_admin e scipts_publico. Os dois arquivos são retornados dentro do objeto merge, que fará a gestão da execução das tarefas e irá garantir sua execução na ordem em que devem ser executadas. Outro ponto: no método src do objeto gulp estamos passando um array com apenas um item. O método também aceita strings então poderia ter escrito gulp.src(diretorios.src + 'admin/js/nome-do-plugin.js') por exemplo e a tarefa ainda seria executada normalmente. Costumo passar uma lista apenas para manter consistência de escrita entre as tarefas.

Faremos um processo similar para preparar os arquivos CSS. O boilerplate do plugin não veio preparado para o desenvolvimento de Sass então não há um diretório específico para trabalhar com arquivos Sass. O que costumo fazer é apagar a pasta css e o que tiver dentro dela e no lugar crio uma chamada scss, tanto no diretório admin quanto no public. Dentro desta pasta serão colocados todos os arquivos com extensão .scss e as pastas com as partials, mixins, variáveis e etc. Na pasta também terá um arquivo com o nome nome-do-plugin-admin.css dentro do diretório admin e nome-do-plugin-public.css dentro do diretório public. Eu apago estes arquivos e gero outros usando Sass, mantendo o nome, o sufixo .min e o diretório dentro de dist.

{% highlight javascript %}

gulp.task('construir-estilo', function() {
  var estilo_admin = gulp.src([
    diretorios.src + 'admin/scss/nome-do-plugin.admin.scss'
  ])
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(cssnano())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest(diretorios.dist + 'admin/css'));

  var estilo_publico = gulp.src([
    diretorios.src + 'public/scss/nome-do-plugin.public.scss'
  ])
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(cssnano())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest(diretorios.dist + 'public/css'));

  return merge(estilo_admin, estilo_publico);
});

{% endhighlight %}

Esta tarefa irá:

* Buscar os estilos nome-do-plugin-admin.scss e nome-do-plugin-public.scss dentro dos diretórios admin e public, na pasta scss criada anteriormente
* Compilar os arquivos em saídas .css
* Adicionar as extensões de navegadores conforme a necessidade
* Minificar os arquivos .css
* Adicionar o sufixo .min nos nomes dos arquivos
* Colocá-los nas pastas admin/css e public/css dentro dos diretórios admin e public
* Retornar os streams de execução combinados

Com as tarefas prontas, é hora de configurar o gulp para executá-la. Faço isso em três etapas:

* Criando uma tarefa que chama a construir-esqueleto e copia os arquivos para o diretório dist
* Criando uma tarefa que pega tudo o que está no diretório dist e copia para o diretório de instalação do WordPress
* Configurando a tarefa padrão do gulp para executar as duas tarefas anteriores e monitorar por mudanças nos arquivos de desenvolvimento

{% highlight javascript %}

gulp.task('configurar-projeto', ['construir-esqueleto', 'construir-script', 'construir-estilo']);

{% endhighlight %}

A tarefa configurar-projeto está recebendo um array com os nomes das tarefas criadas anteriormente e não uma função de callback. Este array indica que a tarefa configurar projeto só pode ser executada após as tarefas construir-esqueleto, construir-script e construir-estilo forem criadas. Como não há uma função de callback nada será feito após a execução das tarefas. A tarefa configurar-projeto é usada neste caso apenas como um atalho para executar as tarefas que criamos anteriormente. Após a tarefa configurar-projeto finalizar a execução, o diretório dist deverá estar com todos os arquivos marcados para serem copiados para dist.

Para testar, abra um console e navegue até o diretório onde está o arquivo gulpfile.js (na raiz do plugin). Escreva:

{% highlight javascript %}

gulp configurar-projeto

{% endhighlight %}

Após o console acusar a finalização do script, a pasta dist deverá estar com os arquivos que pedimos para serem copiados.

![Tarefas executadas com sucesso]({{ "/assets/images/blog/2018-09-15-workflow-para-desenvolvimento-wordpress-image-6.png" | absolute_url }})
Tarefas executadas com sucesso

Entre no diretório dist e abra as pastas admin e public. Repare que a pasta que está nestes diretórios se chama css e o arquivo dentro dela é o .css compilado, não o .scss que estamos trabalhando em desenvolvimento. A pasta scss não foi criada dentro do diretório dist. Note também que os nomes dos arquivos css e js nas duas pastas estão com o sufixo .min aplicados.

O passo seguinte é pegar tudo o que está no diretório dist e copiar para o diretório de instalação do WordPress.

{% highlight javascript %}

gulp.task('configurar-projeto-em-stage', ['configurar-projeto'], function() {
  return gulp.src([
    diretorios.dist + '**/*'
  ])
  .pipe(gulp.dest('/diretorio/de/instalacao/do/wordpress/wp-content/plugins/nome-do-plugin'));
});

{% endhighlight %}

Assumo que os plugins da sua instalação do WordPress estejam dentro de uma pasta chamada wp-content/plugins. Se não for caso, o diretório deve ser o de instalação dos plugins. A pasta nome-do-plugin será criada se não existir e todos os arquivos de dist serão colocados lá dentro. A tarefa configurar-projeto-em-stage precisa que a configurar-projeto seja executada para só então executar o que está na função de callback.

Por fim, vamos configurar a tarefa padrão do gulp, a default, para executar as tarefas anteriores e monitorar os arquivos de desenvolvimento por mudanças de forma que sempre que algum arquivo for salvo, as tarefas são executadas novamente.

{% highlight javascript %}

gulp.task('default', ['configurar-projeto-em-stage'], function() {
  gulp.watch(diretorios.src + '**/*', ['configurar-projeto-em-stage']);
});

{% endhighlight %}

A tarefa default é a tarefa que o gulp chama se o comando gulp for digitado no console sem que o nome de uma ou mais tarefas tenha sido especificado. Esta tarefa está configurada para monitorar o diretório diretorios.src e tudo o que tiver dentro dele por mudanças nos arquivos. Caso uma mudança seja detectada, a tarefa irá executar configurar-projeto-em-stage, disparando toda a cadência de tarefas que criamos, e voltará a escutar por mudanças nos arquivos.

Estamos quase prontos! Há um problema que criamos com o gulp que precisa ser resolvido.

Se lembra que mudamos os nomes dos arquivos "nome-do-plugin-admin.js", "nome-do-plugin-public.js", "nome-do-plugin-admin.css" e "nome-do-plugin-public.css" adicionando a extensão .min neles? Isso faz com que a referência a estes arquivos que o plugin está fazendo deixe de funcionar. Precisamos informar nas configurações do plugin que os novos arquivos possuem a extensão .min neles.

Para fazer isso, abra o arquivo nome-do-plugin-admin.php, sendo nome-do-plugin o nome do plugin criado. Há dois métodos neste arquivo: enqueue-styles e enqueue-scripts. Esses métodos são associados ao hook admin_enqueue_scripts dentro de includes/class-nome-do-plugin.php. Repare que neste arquivo aberto, o método enqueue_styles chama a função wp_enqueue_style, do Core, para carregar uma folha de estilos css.

{% highlight javascript %}

wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/nome-do-plugin-admin.css', array(), $this->version, 'all' );

{% endhighlight %}

O que precisa ser feito é adicionar o sufixo .min ao nome do arquivo css sendo carregado. Neste exemplo o nome do arquivo será nome-do-plugin-admin.min.css.

De forma similar, o método enqueue_scripts faz a busca por um arquivo JavaScript sem a extensão .min usando a função wp_enqueue_script.

{% highlight javascript %}

wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/nome-do-plugin-admin.js', array( 'jquery' ), $this->version, false );

{% endhighlight %}

O arquivo precisa ter o sufixo .min, de forma que seu nome passe a ser nome-do-plugin-admin.min.js.

Como você deve ter imaginado, precisamos ajustar também os nomes dos arquivos CSS e JavaScript na pasta public, editando o arquivo nome-do-plugin-public.php. Ele possui as mesmas funções enqueue-styles e enqueue-scripts que são associadas a um hook no arquivo includes/class-nome-do-plugin.php. O que muda é o nome do hook, que passa a ser wp_enqueue_scripts. Os arquivos a serem buscados agora são nome-do-plugin-public.min.css e nome-do-plugin.min.js.

Agora sim! A automação está feita e sempre que o desenvolvimento deste plugin for retomado, basta abrir um console, navegar até a pasta raiz do plugin onde o arquivo gulpfile.js está e escrever gulp. Simples assim! Os arquivos serão carregados no diretório dist e também no diretório de instalação do WordPress e o método watch ficará de olho em mudanças nos arquivos para que sejam automaticamente carregados no servidor.

Apenas para recapitular, fizemos o seguinte para preparar o ambiente de desenvolvimento com um tema e um plugin:

* Baixamos os boilerplates de criação de temas e plugins
* Copiamos os arquivos dos boilerplates para os diretórios nome-da-empresa/plugins/nome-do-plugin/src e nome-da-empresa/temas/nome-do-tema/src
* Criamos ao lado dos diretórios src um diretório chamado dist, um dentro da pasta plugins e outro dentro da pasta temas
* Instalamos o Node.js e o NPM
* Dentro da pasta raiz do plugin, que até então continha as pastas src e dist, criamos um pacote com o comando npm init
* Usamos o NPM para instalar a interface de linha de comando do gulp no escopo global
* Usamos o NPM para instalar o gulp e diversas dependências no projeto usando a flag -\-save-dev
* Criamos na raiz do plugin um arquivo chamado gulpfile.js e escrevemos as tarefas que o gulp deve executar
* Configuramos o gulp para escutar mudanças em quaisquer arquivos dentro da pasta src e então copiá-los para a pasta dist e para a pasta da instalação do WordPress
* Alteramos os arquivos class-nome-do-plugin-admin.php e class-nome-do-plugin-public.php para informar onde estão os arquivos JavaScript e CSS compilados pelas tarefas do gulp

Agora sim! O plugin irá rodar sem problemas no ambiente de instalação do WordPress. Fizemos o procedimento para o projeto do plugin mas também faço para o tema e quaisquer outros projetos dentro da pasta de projetos da empresa para a qual estou desenvolvendo os plugins e temas. Embora o procedimento seja o mesmo, cada projeto tem suas dependências então o gulpfile.js ficará diferente. Outro ponto de atenção é o uso de bibliotecas como frameworks CSS e JavaScript. Em nosso exemplo não fizemos uso de nada fora do boilerplate ou do Core mas caso tivessemos feito, seria necessário importar os arquivos das bibliotecas para dentro da pasta dist. Quando trabalho com uma biblioteca como o Bootstrap, por exemplo, puxo o pacote pelo NPM, crio um ou mais arquivos .scss que importam os componentes do Bootstrap que vou usar e na minha tarefa de criação do estilo CSS eu peço para o gulp considerar os arquivos do Bootstrap dentro de node_modules para serem compilados, assim gero a versão final do CSS com o que preciso da bibliteca. Outro exemplo de uso de arquivos externos está no boilerplate do Underscores. Dentro da pasta js que fica na raiz do tema há três arquivos: customizer.js, navigation.js e skip-link-focus-fix.js. Estes arquivos são usados em situações diferentes e são chamados dependendo da área de acesso do site. O customizer.js por exemplo carrega no momento de edição do tema usando a interface visual do painel de administração. Costumo incluir estes scripts na tarefa do gulp de criar o script JavaScript final, porém gero arquivos diferentes já que não faz sentido carregar todos no mesmo arquivo em todas as páginas.

Com cada projeto configurado, a pasta nome-da-empresa/plugins terá um projeto diferente para cada plugin e nome-da-empresa/temas terá um projeto diferente para cada tema.

## Configuração do Git

Para finalizar, costumo criar um arquivo chamado .gitignore dentro da pasta nome-da-empresa para instruir ao Git tudo o que eu não quero que seja monitorado por mudanças para subir para o repositório. Adiciono pelo menos uma linha neste arquivo:

{% highlight javascript %}

**/node_modules

{% endhighlight %}

Assim como o Gulp, o Git usa Glob para encontrar arquivos e pastas. Esta linha informa ao git para não considerar mudanças nas pastas node_modules presentes em quaisquer projetos, já que isso faria com que fossem mandados para os repositórios arquivos que não fazem sentido serem armazenados. Sempre que outra pessoa acessar o projeto ela deve rodar o comando npm init para pegar o conteúdo da node_modules. Se a pessoa não for desenvolver, basta baixar os arquivos da pasta dist.

## Esta é a forma correta de configurar o fluxo de trabalho?

Como disse no início do post, há diversas formar de organizar arquivos e pastas para facilitar o desenvolvimento. Não há um consenso sobre a melhor forma ou a oficial de se fazer e as instruções oficiais do WordPress não cobrem diversos cenários, abrindo espaço para a criatividade. Configurar um projeto desta forma pode dar mais trabalho no início mas o esforço se paga quando você precisa editar o mesmo projeto meses depois e consegue navegar facilmente entre pastas e arquivos pois estão organizados.

## Leitura adicional

Você provavelmente fará muito uso das documentações das ferramentas que usamos neste post. As páginas do [WordPress](https://codex.wordpress.org/Developer_Documentation){:target="_blank"}, [NPM](https://docs.npmjs.com/){:target="_blank"} e [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/README.md){:target="_blank"} serão suas amigas ao longo do processo. O [StackOverflow](https://stackoverflow.com/){:target="_blank"} também será um aliado indispensável para combater os erros que irão surgir com mensagens enigmáticas.

Indo além do que falamos, vale conhecer a documentação do [Sass](https://sass-lang.com/guide){:target="_blank"} e como integrar frameworks externos como o [Bootstrap](https://getbootstrap.com/docs/4.1/getting-started/theming/){:target="_blank"} usando a biblioteca [gulp-sass](https://www.npmjs.com/package/gulp-sass){:target="_blank"}. Falando nas bibliotecas do NPM, cada uma possui sua página com documentação de uso e opções que não exploramos.

Bora organizar a casa!

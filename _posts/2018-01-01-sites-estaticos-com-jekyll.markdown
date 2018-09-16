---
layout: post
title:  'Sites estáticos com Jekyll e GitHub Pages'
date:   2018-01-01 19:47:00
categories: [Desenvolvimento]
image: '/assets/images/blog/2018-01-01-sites-estaticos-com-jekyll-featured.jpg'
image_credit: 'Henrique Freitas Souza, Jekyll'
---

Quando se fala em construir sites uma opção comum é usar um CMS, ou Content Management System. O gerenciador de conteúdo possui uma estrutura pronta para ser executada em produção e agiliza o trabalho de equipes de desenvolvimento. Outra opção é usar os chamados gerenciadores de sites estáticos. Quais suas diferenças em relação a um CMS tradicional e como eles funcionam? Este é o assunto do post.

<!--more-->

Gerenciadores de conteúdo são a tecnologia por trás de muitos sites na internet. Apenas o [WordPress](https://wordpress.org/){:target="_blank"} é o CMS presente [em quase 30% dos sites em toda a internet](https://w3techs.com/technologies/overview/content_management/all){:target="_blank"}, com 60% de market share. No total, cerca de 50% de toda a internet funciona com alguma tecnologia de CMS. O que os torna tão populares é a combinação entre facilidade de uso, tecnologia open source, temas e plugins prontos para uso. Nem todas as plataformas de CMS são abertas mas as mais usadas são as que abraçam o conceito de código livre e há uma comunidade de entusiastas dando continuidade aos projetos. Há casos, no entanto, em que o projeto não requer a robustez de um CMS e pode se beneficiar de uma estrutura mais enxuta. Entra o gerenciador de sites estáticos.

## Sites estáticos x dinâmicos

Sites ditos dinâmicos geralmente possuem alguma interação com sistemas de bancos de dados e outros bancos de informação que entregam ou enviam informações conforme solicitado. Essas informações alimentam a estrutura do site para entregar conteúdo. Um exemplo de tal dinamismo está na paginação de sites, em que uma nova porção de conteúdo é recuperada de alguma fonte mediante pedido, neste caso representado por um clique em um botão ou o rolar até certo percentual da página. Note que a forma da páginação por sí só não significa que um site é dinâmico mas sim o fato de conteúdo ser manipulado em fontes externas e entregue sob demanda para um solicitante. Outro exemplo é o da página de produto de e-commerces. A estrutura da página é a mesma mas seu conteúdo muda conforme o produto que é selecionado.

Um site estático, por outro lado, não é alimentado por fontes externas. Seu conteúdo está todo disponível no HTML que é servido ao navegador. Um site dinâmico pode possuir páginas estáticas. Um bom exemplo disso são as páginas institucionais de sites corporativos. O conteúdo geralmente não muda pois se trata de informações sobre a empresa.

## Gerenciadores de sites estáticos

Assim como o CMS, um gerenciador de sites estáticos possui estrutura para produzir sites completos. Esses sistemas possuem inclusive plugins e temas que permitem a expansão de suas capacidades nativas. Algumas características que os tornam mais atraentes que um CMS são a **simplicidade**, a **velocidade** e o **custo**. Enquanto um CMS precisa de um servidor com alguma tecnologia de interpretação de linguagem back end e um banco de dados instalado, um gerenciador de sites estáticos precisa apenas de um servidor capaz de servir arquivos estáticos. Mesmo que haja alguma transformação nos arquivos servidos, o procedimento é muito mais rápido do que interpretar uma linguagem e consultar um banco de dados para depois servir o arquivo final. A estrutura de um gerenciador de sites estáticos é mais enxuta, o que torna o site mais fácil de manter e reduz custos uma vez que são necessárias menos tecnologias para mantê-la. Uma desvantagem em relação a um CMS é que conhecimentos em desenvolvimento front end são necessários para fazer a manutenção do site.

Existem várias tecnologias que geram sites estáticos. A [Cloud Cannon](https://learn.cloudcannon.com/){:target="_blank"} montou a lista a seguir com algumas das ferramentas disponíveis:

![tecnologias para criação de sites estáticos]({{ "/assets/images/blog/2018-01-01-sites-estaticos-com-jekyll-image-1.png" | absolute_url }})

Estas são apenas algumas. O site [Static Gen](https://www.staticgen.com/){:target="_blank"} lista outras dezenas dessas ferramentas. O que elas fazem em essência é compilar a estrutura em um conjunto de arquivos que pode ser transferida para algum servidor. Essa compilação se trata de transformar quaisquer linguagens de marcação, pré processamento e templates usadas em HTML e gerar os arquivos finais na estrutura de pastas que serão colocadas em produção. Embora o conteúdo final seja estático, os arquivos usados em desenvolvimento podem fazer uso de linguagens de template junto com a linguagem de marcação e de pré processadores de CSS. As linguagens de template adicionam estruturas que não são presentes no HTML tradicional como if else, loops, variáveis e outras formas de adicionar dinamismo ao processo de construção do arquivo final. Em um site estático, essas estruturas são úteis para criar páginas como blogs, por exemplo, em que a estrutura de código para cada post em uma página é idêntica. Essas ferramentas podem também construir um servidor local para visualização do site antes de colocá-lo em produção. A visualização é útil para antecipar potenciais bugs e o compilador acusa erros caso tenha surgido algum durante o processo de construção.

## Jekyll

Tomei familiaridade com gerenciadores de sites estáticos pelo [Jekyll](https://jekyllrb.com/){:target="_blank"}, uma ferramenta com integração nativa com o [GitHub Pages](https://pages.github.com/){:target="_blank"}. Vou usá-lo para explicar os conceitos por trás dessas ferramentas.

O Jekyll possui um arquivo de configuração chamado **_config.yml**. Nesse arquivo são colocadas variáveis que são podem ser referenciadas em qualquer página do site. As variáveis podem receber números, strings, booleanos e arrays. Essas variáveis são declaradas no formato **chave: valor**. Variáveis também podem receber escopo. Há escopos padrão para todo o site e para páginas específicas e novos escopos podem ser criados. Além de criadas no arquivo de configuração, variáveis podem ser declaradas dentro das páginas usando uma notação chamada de **Front Matter**. A ideia do Front Matter é ser uma porção da página contendo metadados. Enquanto uma estrutura pode fazer uso de variáveis por todo o site, cada página pode conter o seu valor dentro da seção de Front Matter. Um exemplo desse tipo de operação é selecionar o layout que irá compor a página criada. Suponha que o cabeçalho e o rodapé de uma página tenham sido criadas em seu próprio arquivo. Dentro de uma página "filha" é possível especificar a variável **layout** com o nome da página de template. O Jekyll irá buscar dentro da pasta de templates pelo nome especificado.

Essa ferramenta é bastante usada para criar blogs e parte da estrutura padrão reflete isso. Nas pastas **_draft** e **_posts** são colocados os posts de rascunho e os que serão publicados, respectivamente. A pasta **_includes** contém outros arquivos que podem ser importados para dentro de um documento. Essa pasta é útil para guardar partes do site que podem ser reaproveitadas como a estrutura de posts, paginação, links de compartilhamento em redes sociais e tudo mais que for igual entre as páginas. Com o uso da linguagem de templates, é possível passar informações para o arquivo a ser importado de tal forma que haja algum nível de dinamismo dentro da inclusão. Um exemplo é o compartilhamento de posts nas redes sociais. A estrutura e visual dos botões de compartilhamento é igual mas o link muda. Essa informação dinâmica pode ser incluída dentro de qualquer arquivo. Em **_layouts** são colocados templates de página ou do site, com seções inteiras que são idênticas em todas as páginas como o cabeçalho, rodapé ou barra lateral. Há uma pasta **_data** para incluir arquivos como JSON, CSV e outros que podem conter informações a serem colocadas no site. A pasta **_plugins** é uma das formas pela qual podem ser instalados plugins no site. Por fim, os arquivos são compilados e colocados na pasta **_site**, que contém as versões de produção dos arquivos. Qualquer outra pasta criada dentro do projeto é simplesmente copiada para dentro da pasta \_site no momento da compilação.

A linguagem de template padrão usada no Jekyll é a [Liquid](http://shopify.github.io/liquid/){:target="_blank"}, criada pela [Shopify](https://pt.shopify.com/){:target="_blank"}. De forma geral, há dois tipos de tags usadas em Liquid. Elas são **tags de saída** e **tags de operações**. Uma saída em Liquid é qualquer coisa impressa entre dois pares de chaves: **{% raw %}{{ variavel }}{% endraw %}**. As tags de saída ainda podem receber filtros. A saída é separada do filtro por uma barra vertical e podem ser aplicados filtros como todas as letras em maiúsculas ou cortar letras, para citar alguns: **{% raw %}{{ variavel \| upcase }}{% endraw %}**. Já a tag de operação é alguma operação lógica e é escrita com um par de chaves com um par de sinais de porcentagem dentro. A maioria dessas operações possuem início e fim declaradas: **{% raw %}{% if variavel %} {% endif %}{% endraw %}**. Além de if else e for, a operação include também é usada com esta sintaxe: **{% raw %}{% include arquivo.html param="valor" %}{% endraw %}**. A operação de inclusão de arquivos não possui tag de fechamento e a passagem de parâmetros é opcional.

Posts em Jekyll são escritos em [Markdown](https://daringfireball.net/projects/markdown/){:target="_blank"} por padrão. Um post em Jekyll precisa ter o nome de arquivo seguindo a convenção **ano-mês-dia-nome.md** ou **ano-mês-dia-nome.markdown** sendo ano com 4 dígitos e mês e dia com 2 dígitos. A extensão pode ser md ou markdown. Todo post também precisa ter o Front Matter em seu início:

\-\-\-

layout: post

title:  "Hello world!"

date:   2018-01-01 19:47:00

category: geral

\-\-\-

Qualquer coisa entre os dois conjuntos de três traços será compilado no momento de execução.

O Jekyll ainda conta com [temas](http://jekyllthemes.org/){:target="_blank"} e [plugins](https://jekyllrb.com/docs/plugins/){:target="_blank"} prontos para uso mantidos pela comunidade.

## GitHub Pages

O GitHub Pages é um servidor de arquivos estáticos hospedado no GitHub. Ele pode ser usado para hospedar sites e usa o Jekyll como gerenciador de sites estáticos. Não há custo para hospedar um site no GitHub Pages. Para um portfolio, um blog, ou qualquer outra aplicação que não exige dinamismo é simples de configurar e manter e já usa o Git como versionador. Para usar o GitHub pages basta criar um repositório com o nome do seu endereço no Git. O meu endereço, por exemplo, é henriquefreitassouza.github.io, então o nome do repositório será henriquefreitassouza.github.io. O caminho completo para o repositório será https://github.com/seuusuario/seuusuario.github.io. O meu, pegando novamente o exemplo, ficou https://github.com/henriquefreitassouza/henriquefreitassouza.github.io. Ao acessar o endereço https://seuusuario.github.io, o conteúdo do repositório será servido como um site.

Como o GitHub Pages já usa o Jekyll, basta clonar o repositório, criar os arquivos do Jekyll dentro da pasta e enviá-los para o GitHub uma vez que o desenvolvimento tenha sido finalizado. O conteúdo de \_site será automaticamente servido.

Para deixar ainda mais profissional, o repositório ainda pode ser referenciado por um nome de domínio. Se você possui um domínio e quiser configurá-lo para apontar para o repositório é bem simples. Nas configurações do repositório há uma opção chamada **domínio customizado** dentro do grupo de opções **GitHub Pages**. Basta colocar o nome do domínio e salvar que um arquivo CNAME será criado na raiz do projeto. O passo seguinte é configurar os servidores DNS com a empresa onde foi comprado o domínio. Se estiver usando o [registro.br](https://registro.br/){:target="_blank"}, basta selecionar o nome do domínio, clicar em **editar zona** e adicionar os endereços do GitHub com o nome do domínio e tipo **A**. Por fim, o subdomínio www pode ser configurado adicionando uma nova entrada do tipo CNAME com o nome www seguido pelo endereço do seu domínio. Os endereços que o GitHub fornece para configuração de DNS são **192.30.252.153** e **192.30.252.154**. Pode levar até 24 horas para que as alterações se propaguem.

Um detalhe importante sobre o GitHub Pages é que, qualquer site hospedado por lá é executado com uma configuração chamada de **\-\-safe**, o que impede a execução de plugins. Uma opção para contornar tal limitação é compilar os arquivos em sua máquina local e enviar os arquivos já compilados da \_site para o GitHub Pages.

Gerenciadores de sites estáticos funcionam seguindo este mesmo princípio: além do HTML, CSS e Javascript padrão, alguma linguagem de template é usada para estender a capacidade padrão do HTML e possivelmente alguma linguagem de pré processamento de CSS é usada com o mesmo fim para CSS. O compilador da ferramenta usada transforma os arquivos em suas versões finais e os coloca em uma pasta para produção. Hospedando no GitHub pages, o custo para manter a aplicação é apenas o tempo do desenvolvedor, custos com tecnologia são literalmente R$ 0,00. Se houver um domínio próprio, o custo será o do domínio, e apenas isso.

Curiosidade: este blog é construído com Jekyll e hospedado no GitHub pages :)

## Leitura complementar

Esse post teve como objetivo apenas introduzir o mundo dos gerenciadores de sites estáticos, não sendo, portanto, um tutorial. Para aprender mais sobre as ferramentas citadas, use as seguintes fontes:

- [Tutorial completo de Jekyll da Cloud Cannon](https://learn.cloudcannon.com/){:target="_blank"}
- [Como configurar o repositório no Github Pages](https://pages.github.com/){:target="_blank"}
- [Documentação do Jekyll](https://jekyllrb.com/){:target="_blank"}
- [Configurando domínio próprio do Registro.br no GitHub Pages](https://willianjusten.com.br/dominio-proprio-no-github-pages/){:target="_blank"}
- [O meu repositório de sites no GitHub como exemplo](https://github.com/henriquefreitassouza/henriquefreitassouza.github.io){:target="_blank"}

Bora criar sites estáticos!

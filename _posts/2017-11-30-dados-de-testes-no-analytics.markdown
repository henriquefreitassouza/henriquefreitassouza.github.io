---
layout: post
title:  'Lidando com diferentes números de sessões e usuários em ferramentas de teste e ferramentas de analytics'
date:   2017-11-30 08:39:00
categories: [Marketing, Desenvolvimento]
image: '/assets/images/blog/2017-11-30-dados-de-testes-no-analytics-featured.jpg'
image_credit: 'Henrique Freitas Souza'
---

O número de visitantes ou sessões que ferramentas de testes online mostram é diferente do número reportado em ferramentas de analytics, mesmo que o teste esteja rodando com 100% do tráfego. As vezes a diferença é tal que levanta dúvidas sobre qual o conjunto de números de acessos e conversões que devem ser considerados. Como então fazer com que essa discrepância seja a menor possível?

<!--more-->

No [último post]({{ absolute_url }}{% post_url 2017-11-29-estatistica-em-testes-para-nao-matematicos-parte-6 %}) da série sobre estatística para não matemáticos eu comentei brevemente sobre essas diferenças, que podem estar associadas a implementação dos scripts das ferramentas, seu tempo de carregamento ou mesmo na forma como a computação de visitantes únicos, sessões e eventos de conversão é feita. Há algumas formas de lidar com essa diferença mas a primeira coisa que deve ficar clara para o projetista de testes e também para quem consome esses dados é que [ferramentas de teste e ferramentas de analytics são coisas diferentes](https://support.abtasty.com/hc/en-us/articles/201747527-There-are-differences-in-data-between-AB-Tasty-and-my-analytics-tool){:target="\_blank"}. Dificilmente os números encontrados no painel da ferramenta de testes e os números da ferramenta de analytics serão 100% iguais. No entanto, ainda é necessário reportar os números e neste caso qual conjunto considerar?

## Diferenças entre os números no painel de testes e na ferramenta de analytics

Optar por visualizar os números apenas dentro do painel de testes é uma boa opção quando esses números não estão amarrados a outras métricas da empresa. Em outras palavras, quando a métrica que está sendo medida possui baixo nível de correlação com outras. Um exemplo de uma métrica que pode ter alta correlação com outras é o CTR em um elemento de página que passa os visitantes entre etapas de funil. Nesse caso a dificuldade é usar os números reportados no painel da ferramenta de testes para calcular a taxa de visitantes únicos ou a de sessões que passa por cada etapa do funil.

Falando de ferramentas de analytics, elas computam diversas métricas ligadas a comportamentos do tráfego dentro do produto. A primeira diferença em relação a ferramentas de teste se dá na duração dos cookies: o Google Analytics, por exemplo, instala cookies com duração de 30 minutos após inatividade, o que significa que visitantes inativos por mais de 30 minutos terão os cookies deletados de seus navegadores. Ferramentas de teste usam cookies com durações bem maiores e cada fabricante dá um tempo de duração padrão. A definição padrão de cookies pode ou não ser suficiente, dependerá do tipo de produto. Imagine que uma plataforma de vídeos pode não querer que a duração padrão de cookies seja 30 minutos de inatividade, pois pode ocorrer de seus visitantes assistírem a vídeos com duração superior a essa. Como pode não haver interação com a página durante esse período, o tempo decorrido durante a execução do vídeo é considerado como sendo de inatividade. A diferença no tempo de validade dos cookies pode fazer com que os mesmos visitantes sejam contados mais de uma vez em uma ferramenta e não na outra.

O tempo e o local de carregamento dos scripts das ferramentas de analytics e de testes também pode causar diferenças. Scripts referenciados no rodapé de uma página pecisam esperar a página toda carregar para então serem carregados. Se a página contém muitos elementos multimídia e/ou dinâmicos, o carregamento pode demorar. Outra situação perigosa está na forma assíncrona de carregamento dos scripts. Eles podem ser carregados de forma **síncrona** ou **assíncrona**. Carregamento síncrono significa que, quando o browser estiver fazendo a leitura da página a ser exibida e ela faz referência a documentos externos, como um script, o restante do carregamento da página será interrompido para que o arquivo externo possa ser incluído com o restante da página. O carregamento assíncrono faz com que os carregamentos dos arquivos externos e da página aconteçam simultaneamente. O que acontece no carregamento assíncrono em particular é que a página pode ter carregado e o documento externo ainda estar carregando. Se o visitante deixa a página ou o produto antes que a ferramenta possa carregar ele não é contabilizado. O teste neste caso não terá sequer iniciado. Em outros casos o teste pode iniciar depois que o visitante estiver interagindo com a página e neste caso a experiência de navegação será alterada se ele cair nas variações de tratamento, pois as alterações do teste serão aplicadas na frente dele.

## E o Google Optimize?

O [Google Optimize](https://www.google.com/analytics/optimize/){:target="\_blank"} é uma ferramenta para testes a/b, a/b/n, mvt e split criada pela Google. Por ser parte da suíte de produtos Google, possui integração nativa com o Google Analytics. Para criar testes com ela é necessário fornecer o ID de uma view do Google Analytics para que o Optimize alimente o relatório apropriado, que fica em Behavior > Experiments. Uma vez que o Optimize tenha permissão de acesso a view, os dados de testes estarão disponíveis na ferramenta. Mesmo o Optimize dá diferenças entre o Analytics e seu painel interno de relatórios. As diferenças são tanto entre o relatório de experimentos no Google Analytics e no painel da ferramenta quanto o relatório de experimentos no Google Analytics e os demais relatórios do próprio analytics. [A documentação](https://support.google.com/360suite/optimize/answer/6323229?hl=en){:target="\_blank"} diz que isso acontece por diferenças na forma como os cálculos acontecem entre as ferramentas e também por diferença no tempo de alimentação dos relatórios. Enquanto o Google Analytics recebe os dados do teste com frequência, o Optimize recebe cargas de dados do Analytics a cada 12 horas. A recomendação deles é sempre olhar para os dados do painel do Optimize para tomar decisões.

## O painel de eventos

Várias ferrramentas de testes possuem conectores com o Google Analytics que facilitam o envio de informações para a ferramenta mas possuem limitações similares as do Google Optimize. Uma forma que encontrei para ajudar na conciliação dos números foi usar o recurso de eventos. Ferramentas de analytics conseguem registrar eventos personalizados. Esses eventos podem ser configurados por desenvolvedores direto no front end da aplicação ou por uma equipe de marketing, caso uma ferramenta de gestão de tags esteja instalada. Um exemplo de tal ferramenta é o [Google Tag Manager](https://www.google.com/analytics/tag-manager/){:target="\_blank"} (GTM).

Eventos são ações que a empresa pode querer monitorar por ter algum valor para seu negócio. Exemplos de eventos são acessos a páginas específicas, cliques em botões, assistir a vídeos ou baixar arquivos. Uma vez monitorados, informações sobre os eventos são enviadas para a ferramenta de analytics. No caso do Google Analytics, um disparo de evento gera as seguintes informações:

- Category: identificador da categoria de eventos.
- Action: identificador da ação que disparou o evento. Exemplos podem ser play, click, download e etc.
- Label: uma etiqueta com informações adicionais sobre o evento, que o distingue de outros com a mesma ação e que estejam na mesma categoria.
- Value: um valor numérico associado ao evento. Pode ser um valor monetário ou algum número que quantifique a ação executada.

Esses atributos possuem uma relação de hierarquia, de forma que evento contém categorias, categorias contém ações, ações contém labels e labels contém valores.

Dada a introdução aos eventos, eles podem ser úteis para registrar acessos e eventos de conversão em um teste.

## Mapeamento de eventos de teste no Google Analytics

O workaround para o problema de diferença de números será através do registro de eventos na ferramenta de analytics em dois momentos: um quando o visitante acessa o produto e um quando o visitante realiza o evento de conversão. Os eventos possuirão praticamente as mesmas propriedades em Event, Action e Label. Value pode ou não ser usado dependendo da complexidade do teste. O que vai mudar é o Action, que vai assumir um valor quando um visitante for selecionado para participar do teste e outro quando o visitante executar o evento de conversão. Um diagrama da solução proposta se parece com este:

![diagrama de organização dos eventos no Google Analytics]({{ "/assets/images/blog/2017-11-30-dados-de-testes-no-analytics-image-1.jpg" | absolute_url }})

## Configuração da ferramenta de testes

Em geral, ferramentas de testes possuem tanto um editor de sites do tipo “drag n'drop” quanto um para inserção de código manual. Esses editores de código aceitam HTML, CSS e Javascript e em algumas ferramentas possuem dois níveis: um global e um local. O editor de scripts global injeta trechos de código no produto independente da variação configurada. Tanto o grupo de controle quanto os grupos de tratamentos recebem as alterações e o editor de scripts local injeta trechos de código apenas na variação do teste selecionada. O editor de scripts usado será o local, pois o código a ser injetado precisa ser alterado conforme a variação no teste.

Com o GTM instalado, basta chamar o método push do objeto dataLayer e enviar os dados para um evento que tenha sido registrado no GTM:

{% highlight javascript %}
  dataLayer.push({
    event: 'evento_no_gtm',
    category: 'categoria',
    action: 'acao',
    label: 'descricao'
  });
{% endhighlight %}

Esse atributo evento é especial do objeto dataLayer e referencia uma tag no GTM. Em uma instalação do Google Analytics sem o GTM será necessário mandar um hit do tipo evento:

{%highlight javascript %}
  ga('send', 'event', 'categoria', 'acao', 'descricao')
{% endhighlight %}

No caso do push com o dataLayer, será feito um disparo de uma tag de evento que enviará os dados para o Google Analytics. Dentro do editor de scripts local, cada variação vai receber um trecho de código como um dos exemplos, que deve ser disparado em dois momentos diferentes. Cada variação vai ter um identificador dentro do código. Os parâmetros serão:

- category: recomendo usar o nome ou um identificador do teste dentro da categoria.
- action: a ação terá duas opções, uma para acesso e outra para conversão. Action pode assumir 'acesso' ou 'conversão' por exemplo.
- label: guardará a variação do teste. Pode ser uma letra ou o nome da alteração induzida.

Category será igual em todas as chamadas ao código de disparo, label e action que mudarão conforme a variação do teste e se o visitante iniciou a participação no teste ou executou a ação que representa conversão. A segunda chamada ao código de disparo do evento deve ser feita somente após o evento de conversão ter sido disparado, nesse caso é necessário criar um trigger que escute esse evento:

{% highlight javascript %}
  window.onload = function() {
    var cta = document.getElementById('cta');
    cta.onlick = function() {
      // Se usar o GTM
      dataLayer.push({
        event: 'evento_no_gtm',
        category: 'categoria',
        action: 'acao',
        label: 'descricao'
      });

      // Se não usar o GTM
      ga('send', 'event', 'categoria', 'acao', 'descricao')
    }
  }
{% endhighlight %}

Sempre que puder dar preferência a javascript puro opte por ele, assim o teste não depende do carregamento de mais uma biblioteca (assumindo que você teria usado JQuery ou alguma biblioteca similar).

O uso de window.onload garante que o botão só será acessado após ter sido carregado. Pode acontecer de o trecho de código javascript carregar antes da página e ele tentar acessar elementos que ainda não foram carregados. O uso de DOMContentLoaded fica a cargo do desenvolvedor, lembrando que DOMContentLoaded [não possui suporte ao Internet Explorer 9 e versões anteriores](https://caniuse.com/#search=DOMContentLoaded){:target="\_blank"}.

Para a função de captura de evento poderia ter sido usada a addEventListener, a decisão pela função fica a cargo do desenvolvedor, lembrando que ela possui a mesma restrição de DOMContentLoaded quanto ao navegador Internet Explorer.

A configuração completa usando o dataLayer, um teste de exemplo cujo o clique em um botão representa o evento de conversão e um cenário em que o visitante caiu no grupo de controle fica:

{% highlight javascript %}
  // Código executado assim que o visitante é direcionado para uma das variações do teste
  window.onload = function() {
    // Se não usar GTM dá pra fazer com ga('send', 'event', 'teste_no_cta', 'acesso', 'grupo-controle')
    dataLayer.push({
      event: 'testes_tag', // Nome da tag no GTM
      category: 'teste_no_cta', // Nome do teste
      action: 'acesso', // Acesso a página do teste
      label: 'grupo-controle' // O visitante caiu no grupo de controle.
    });

    var btn = document.getElementById('cta');

    btn.onclick = function() {
      // Se não usar GTM dá pra fazer com ga('send', 'event', 'teste_no_cta', 'conversao', 'grupo-controle')
      dataLayer.push({
        event: 'testes_tag', // Nome da tag no GTM
        category: 'teste_no_cta', // Nome do teste
        action: 'conversao', // Conversão na página do teste
        label: 'grupo-controle' // O visitante caiu no grupo de controle.
      });
    }
  }
{% endhighlight %}

Navegue até o relatório de eventos em Behavior > Events > Top Events. Uma vez que o teste tenha iniciado, os eventos de acesso e conversão deverão ser registrados neste relatório. Veja a diferença entre as colunas de eventos e eventos únicos. Como o teste pode funcionar em mais de uma página ou os visitantes a recarregarem, acompanhe pelos eventos únicos, que não serão atualizados com múltiplos hits sendo enviados ao Google Analytics. Para comparar com usuários únicos (ou sessões), crie um relatório personalizado em Customization > Custom Reports incluíndo usuários únicos e eventos únicos, com quebra por categoria, ação e label.

![Configuração do relatório personalizado de eventos no Google Analytics]({{ "/assets/images/blog/2017-11-30-dados-de-testes-no-analytics-image-2.jpg" | absolute_url }})

Dessa forma é possível contabilizar acessos individuais e também por sessão dentro do Google Analytics.

![Relatório personalizado de eventos no Google Analytics]({{ "/assets/images/blog/2017-11-30-dados-de-testes-no-analytics-image-3.jpg" | absolute_url }})

Ao clicar na categoria do evento, deverão ser abertos as ações com o número de visitantes que participaram do teste e o número total de conversões. Ao clicar em uma das ações (acesso ou conversão) o relatório irá mostrar as variações do teste para acessos ou para conversões dependendo de qual ação tenha sido selecionada. Para ver as categorias, ações e labels em uma mesma tabela, basta usar a opção de tabela fixa no relatório personalizado. As opções de drilldown vão dar lugar as colunas que você deseja ter na tabela. Os números de usuários, sessões e eventos únicos deverão ficar próximos visto que as informações sobre testes só vão para o Google Analytics uma vez que o teste tenha iniciado.

---
layout: post
title:  'Páginas de agradecimento dinâmicas no RD Station'
date:   2019-02-10 21:37:00
categories: [Marketing, Desenvolvimento]
image: '/assets/images/blog/2019-02-10-paginas-de-agradecimento-dinamicas-rd-station-featured.jpg'
image_credit: 'Visual Hunt'
---

Você desenhou toda a sua estratégia de inbound marketing, definiu as metas para o canal, produziu os conteúdos ricos, determinou a lógica do Lead Score, construiu as páginas de captura com os campos necessários para seu negócio, criou os e-mails com oferta e entrega dos conteúdos, criou os fluxos de automação de entrega e colocou tudo pra rodar. Agora é só deixar acontecer, nutrir leads e gerar vendas, correto?

<!--more-->

Depende (a famosa resposta para os problemas do século XXI).

Aviso: caso queira ir direto para a mão na massa, pule para a seção “Criando páginas dinâmicas no RD Station”.

Se você operacionalizou uma estratégia de inbound tão perfeita que sua ferramenta de automação de marketing consegue determinar com 100% de exatidão que leads qualificados são de fato qualificados – leia-se: todo lead que foi qualificado e marcado como oportunidade vai resultar em uma venda – e ainda por cima ela é a prova de futuro – leia-se: o comportamento de consumidores não muda – então tá tudo certo :)

Agora, se você operacionalizou uma estratégia de inbound marketing e notou que 90% dos leads marcados como qualificados e depois transformados em oportunidade por um vendedor não se transformaram em venda, aí pode ser que tem alguma coisinha a melhorar. Chances são: eu, você e nossa querida comunidade de marqueteiros digitais estamos neste segundo grupo. Pense que até mesmo empresas que usam aprendizado de máquina no processo de qualificação de leads não garantem 100% de exatidão na qualificação, dado que tais sistemas são baseados em estatística inferencial. O desafio, em suma, é: **calibrar a definição de lead qualificado**.

Calibrar a definição de lead qualificado é uma tarefa que supostamente não tem fim. Com ou sem aprendizado de máquina. Por mais incrível que o fluxo de nutrição de leads esteja, por melhor que sejam os conteúdos, por mais personalizado que o fluxo seja, ele nunca vai acomodar todas as possibilidades de relacionamento entre pessoas e empresas. O que chamamos de lead não deixa de ser uma pessoa, com necessidades, desejos, experiências e contextos individuais. Estas diferenças fazem com que nem todo lead precise seguir o fluxo da forma como ele foi montado. Leads com pontuação baixa ainda serão clientes e outros, promissores de acordo com a ferramenta de automação de marketing, não, o que nos leva a pensar em formas de encontrar sinais de qualificação adicionais ao Lead Score. Uma boa forma de fazer isso é **criar gatilhos que facilitem a levantada de mão expontânea**, afinal, por quê apenas deduzir se um lead é qualificado se podemos perguntar pra ele, não é mesmo? Gatilhos podem ser colocados em qualquer lugar ao longo de toda a jornada inbound mas neste post vamos falar de um local específico: a página que simboliza a conclusão de uma transação no universo inbound, também chamada de **página de agradecimento**.

![Página de agradecimento de demonstração gratuita da Drip. Crédito: Chilipiper.]({{ "/assets/images/blog/2019-02-10-paginas-de-agradecimento-dinamicas-rd-station-image-1.png" | absolute_url }})

Página de agradecimento de demonstração gratuita da [Drip](https://www.drip.com/){:target="_blank"}. Crédito: [Chilipiper](https://www.chilipiper.com/blog/b2b-thank-you-pages/){:target="_blank"}.

## O potencial das páginas de agradecimento

Nutrir leva tempo, em tese. Cada negócio e cada produto tem suas particularidades e público alvo que vão determinar o tempo médio para compra. Sempre que pudermos antecipar este tempo, também em tese e sem mentir, esconder ou omitir informações, melhor. Páginas de agradecimento oferecem uma possibilidade de fazer esta antecipação e em um momento especial da jornada de compra: o momento pós transacional. É um momento comparável ao pós venda de um e-commerce e o prazer de ver que o processo de aquisição foi concluído ao ver a página de pedido finalizado. Em um e-commerce, esta página possui informações como o número do pedido, os dados informados durante a realização do pedido e o status da produção e entrega do que foi comprado. É possível imprimir o conteúdo da página, continuar fazendo compras e talvez até ver produtos similares que outras pessoas compraram e que podem ser do seu interesse. Em suma: é uma página visualizada com carinho (em tese, expressão que está se tornando de praxe neste post). De maneira similar, as páginas de agradecimento também representam a pós transação. Um lead deixou dados valiosos em campos de formulário em troca de algum material físico ou digital e tem instruções para acesso a sua recompensa na página de agradecimento. É neste momento que ele pode ser convidado a continuar o relacionamento com a empresa, enquanto está “visualizando a página com carinho”.

## Antes de começar a produzir páginas de agradecimento...

Ok, você se convenceu de que páginas de agradecimento têm papel importante em sua estratégia de entrega de conteúdos, [fez uma pesquisa na internet](https://duckduckgo.com/?q=successfull+thank+you+pages){:target="_blank"}, encontrou milhares de resultados com dicas para “construir páginas de agradecimento matadoras” e resolveu seguir algumas das dicas que encontrou que estão de acordo com as necessidades do seu negócio. Só tem um probleminha: lembra do título deste post? Caso tenha esquecido, ele se chama “páginas de agradecimento __dinâmicas__ no **RD Station**”. Se você usa o RD Station no seu dia a dia então deve saber que, até o momento da publicação deste post, o RD Station ainda não possui recursos que permitam dinamizar o conteúdo das landing pages. Como em qualquer landing page, você pode personalizar a aparência e o texto, mas não adicionar elementos dinâmicos usando o editor WYSIWYG. Você pode criar no RD Station uma página de agradecimento para cada landing page ou formulário que produzir ou pode criar uma mesma página de agradecimento para vários formulários. O problema com estas abordagens está no fato de que na primeira opção você terá que lidar com a manutenção de mais páginas conforme a oferta de conteúdo cresce – imagine ajustar diversos links quebrados caso alguma URL mude ou o conteúdo seja trocado – e na segunda opção você oferta a mesma coisa para todo mundo que preencheu o formulário demonstrando interesse no que você tem para oferecer, perdendo potenciais ações valiosas ou vendas que podem vir da personalização do conteúdo. Como resolver este impasse? A solução é similar a boa parte dos escritos neste blog: uma boa dose de código :)

## Criando páginas dinâmicas no RD Station

Vou mostrar o que considero ser a forma mais simples de colocar elementos dinâmicos nas páginas de agradecimento: escrever o nome da pessoa que preencheu o formulário no título da página de agradecimento. Para o exercício, vamos criar uma landing page do tipo página de captura com um formulário contendo apenas os campos nome e e-mail e uma outra landing page do tipo paǵina de agradecimento que vai mostrar o nome de quem preencheu o formulário. O mesmo exercício pode ser feito usando formulários e não landing pages mas você precisa se atentar as regras de inserção de scripts no local onde for inserir o formulário. Pegue como exemplo sites construídos em WordPress. O editor de posts e páginas do WordPress limita por padrão scripts inseridos dentro de tags <script> e </script> que forem colocados no modo editor de código. Para usar Javascript dentro do WordPress sem desabilitar a verificação de código na página (uma pŕatica que abre brechas de segurança), a documentação da ferramenta sugere que você [crie um arquivo de script separado, carregue o código dentro do functions.php do tema ou via plugin e chame o código por meio de funções](https://codex.wordpress.org/Using_Javascript){:target="_blank"}.

Descrito o desafio, vamos à prática.

O RD Station possui um recurso chamado **edição avançada** dentro da página de edição de landing pages. Ao abrir este editor você se depara com um popup e dentro dele três abas para inserção de código. A primeira aba serve para incluir CSS nas paǵinas e as outras duas para incluir Javascript. A segunda aba é para inclusão de Javascript entre as tags <head> e </head> e a terceira para incluir Javascript antes do fechamento da tag <body>. O local de inclusão do código é útil para manipular elementos do DOM no momento correto e para controlar o carregamento dos scripts com o mínimo de interferência na experiência de uso da página. Neste exemplo vamos usar Javascript para ler elementos do DOM então o ideal é colocar o código na última aba.

![Editor de landing page com popup de edição avançada aberto.]({{ "/assets/images/blog/2019-02-10-paginas-de-agradecimento-dinamicas-rd-station-image-2.jpeg" | absolute_url }})

Editor de landing page com popup de edição avançada aberto.

Vamos começar criando a página de captura. Use o editor para personalizar o formulário e o visual para as suas necessidades. Feita a “perfumaria”, vá em “opções avançadas” e submenu “edição avançada” (ou apenas “edição avançada” no editor beta disponível na data de publicação deste post). Com o editor de código aberto, acesse a aba “JavaScript em BODY” e escreva o seguinte trecho de código entre as tags <script> e </script>:

{% highlight javascript %}
$('#conversion-form').submit(function() {
    var nome = $("#name").val();
    $("input[name='redirect_to'").val($("input[name='redirect_to'").val() + "?nome=" + nome);
});
{% endhighlight %}

Fazendo a análise do código:

1. O RD Station carrega a biblioteca jQuery como dependência então podemos fazer uso dela (e de suas conveniências). Se você está usando formulários carregados em alguma outra página, tenha certeza de ter carregado a biblioteca jQuery antes de usar o código acima.
2. Estamos esperando por um evento de envio do formulário. O ID #conversion-form é dado pelo RD Station para o formulário de conversão, mas **apenas dentro de landing pages**. Se você estiver usando um formulário carregado em uma página o RD Station deve gerar o ID no padrão conversion-form-[NOME_DO_FORMULARIO]-[ID_DO_FORMULARIO], onde [NOME_DO_FORMULARIO] é o nome que você deu para o formulário gerado no RD Station e [ID_DO_FORMULARIO] é o identificador que o RD Station atribuiu a este formulário. No lugar de #conversion-form você irá usar o ID gerado pelo RD Station para identificar o formulário. Para encontrar esse identificador, acesse o inspetor de código do navegador que estiver usando (geralmente acessível pela tecla de atalho F12) e encontre o ID do formulário dentro da tag <form> uma vez que você tenha inserido o formulário na página de destino.
3. Criamos uma variável chamada “nome” que armazena o valor de um campo do formulário cujo ID é “nome”.
4. Reescrevemos o valor de um campo oculto dentro do formulário cujo atributo “name” é igual a “redirect_to”. O novo valor é igual ao valor anterior do campo acrescido do parâmetro “?nome=nome”, sendo “nome” após o sinal de igual aquela variável que foi criada no passo anterior. O campo “redirect_to” é um campo oculto presente em formulários do RD Station que armazena a página para a qual o formulário deve redirecionar após capturar dados. Este campo é preenchido quando, na criação de formulários ou landing pages no RD Station, você marca a opção “Redirecionamento de página” em “configurações”. Se você configurou o formulário para redirecionar para a página “http://henriquefreitas.com.br”, este é o valor que estará no campo “redirect_to”. O que este trecho de código faz é acrescentar parâmetros na URL de redirecionamento para serem capturados na página de agradecimento. O resultado pode ser, por exemplo, “http://henriquefreitas.com.br?nome=Henrique”. Este trecho de código é uma variação de um retirado da central de ajuda do RD Station com [dicas para edição avançada de landing pages](https://ajuda.rdstation.com.br/hc/pt-br/articles/115004821743-Dicas-de-Edição-Avançada-de-Landing-Page){:target="_blank"}.

Salve o trabalho clicando no botão “Aplicar” (ou “Salvar” dependendo de qual versão do editor você está usando) e avance para a etapa de configuração da landing page. Marque a caixa “Redirecionamento de página” e adicione o endereço da sua página de agradecimento. Ajuste as demais opções conforme a necessidade e publique a página.

![Redirecionamento de página habilitado e endereço da página de destino escrito no campo.]({{ "/assets/images/blog/2019-02-10-paginas-de-agradecimento-dinamicas-rd-station-image-3.jpeg" | absolute_url }})

Redirecionamento de página habilitado e endereço da página de destino escrito no campo.

Crie uma nova página do tipo “página de agradecimento” e faça os ajustes visuais conforme a necessidade. Publique a página e a acesse pela sua URL (a mesma que foi adicionada em “redirecionamento da página” na criação da landing page de captura). Precisamos descobrir qual o seletor necessário para selecionar o elemento da página que queremos tornar dinâmico com o nome da pessoa que preencheu o formulário. Podemos usar o título desta página, que possivelmente será uma tag do tipo <h1>. Use o inspetor de código para facilitar a busca. No modelo de landing page que usei neste exemplo, o texto estava dentro de uma tag <span> que por sua vez estava dentro de uma tag <h1> com o id “video-title”. Meu seletor ficou “**#video-title span**”.

![Elemento HTML que renderiza o título da página]({{ "/assets/images/blog/2019-02-10-paginas-de-agradecimento-dinamicas-rd-station-image-4.jpeg" | absolute_url }})

Encontrei o elemento HTML que renderiza o título da página. É um span que está dentro de um H1 com ID “video-title”. Para selecioná-lo usando CSS basta usar o seletor #video-title span.

Com o seletor em mãos, volte para a edição da landing page de agradecimento. No editor da página, acesse o menu “opções avançadas” e “edição avançada” (ou apenas “edição avançada” no editor beta que está disponível na data de publicação deste post). No editor de código, navegue até a aba “JavaScript em BODY” e cole o seguinte trecho de código dentro das tags <script> e </script>, alterando o seletor para o que você encontrou no inspetor de código:

{% highlight javascript %}

var endereco_da_pagina = window.location.href;
var url = new URL(addr);
var nome = url.searchParams.get('nome');
var titulo_da_pagina = document.querySelector('[SEU_SELETOR]'); // Trocar [SEU_SELETOR] pelo seletor encontrado na página de agradecimento.

if (nome != null && nome != 'null')
  titulo_da_pagina.innerHTML = 'Obrigado ' + nome + '!';
else
  titulo_da_pagina.innerHTML = 'Obrigado!'; // Tratamento opcional

window.history.pushState('', '', url.pathname); // Tratamento opcional

{% endhighlight %}

![Editor avançado habilitado com código de leitura da URL e alteração de elemento no DOM aplicado.]({{ "/assets/images/blog/2019-02-10-paginas-de-agradecimento-dinamicas-rd-station-image-5.jpeg" | absolute_url }})

Editor avançado habilitado com código de leitura da URL e alteração de elemento no DOM aplicado.

Vamos para a análise:

1. Criamos uma variável chamada endereco_da_pagina que armazena a URL em que o navegador está. Este endereço vai ser o da página de agradecimento e deve conter o parâmetro adicionado na página de captura. Se a página for acessada por outra forma, o parâmetro provavelmente não estará disponível.
2. Criamos uma variável chamada “url” que armazena uma instância da classe URL. Esta classe é acessível por meio de uma API criada em especificações mais recentes do desenvolvimento da linguagem Javascript, significando que seu suporte [não é consistente em todos os navegadores e dispositivos](https://caniuse.com/#search=URL){:target="_blank"}. Usei a API pois neste exercício não estamos preocupados com compatibilidade com dispositivos e navegadores mais antigos.
3. Usamos o método get de searchParams, objeto da classe URL, para buscar pelo parâmetro “nome” que foi criado com a landing page de captura e armazenamos o valor encontrado na busca dentro de uma variável chamada “nome”.
4. Criamos uma variável chamada “titulo_da_pagina” que armazena o texto do título da página de agradecimento. Repare que este código usa o seletor que encontramos na página de agradecimento ao publicá-la pela primeira vez. Coloque o seletor que você encontrou entre as aspas no local indicado. Repare também que estamos usando o método querySelector chamado pelo objeto document. Diferente da classe URL, este método [já pode ser usado com alguma segurança, embora não funcione em navegadores mais antigos](https://caniuse.com/#search=querySelector){:target="_blank"}.
5. Verificamos se o parâmetro existe na URL. Isso porque a página pode ser acessada de qualquer lugar ou o redirecionamento pode não acontecer conforme esperado, já que estamos usando Javascript para fazer o dinamismo. Caso o parâmetro exista, o título da página vai passar a ser “Obrigado, [NOME]!”, onde [NOME] é o nome que está no parâmetro da URL. Se o parâmetro não existir, o título da página será apenas “Obrigado!”. Você pode optar por nem especificar o que acontece se o parâmetro não for encontrado, já que no editor você deve ter escrito o título que quer que apareça. Este título será mostrado por padrão se não existir o “else” dentro do bloco “if”.
6. Por fim, usamos o método pushState do objeto history para reescrever a URL sem redirecionar a página. Este trecho serve apenas para tornar a URL amigável, sem os parâmetros no final dela e é totalmente opcional, a funcionalidade não é alterada se esta linha não existir. [Use este método com alguma cautela se precisar dar suporte a navegadores antigos](https://caniuse.com/#search=pushState){:target="_blank"}.

Publique a página e faça o teste! Primeiro acesse a URL e acrescente o parâmetro “?nome=Teste”. Ao recarregar a página com este parâmetro você deve ver a mensagem “Obrigado, Teste!”. Se deu tudo certo, faça outro teste, desta vez preenchendo o formulário na página de captura. Você deve ser redirecionado para a página de agradecimento recebendo a mensagem “Obrigado, [NOME]!”, sendo [NOME] o nome que você escreveu no campo “nome” do formulário.

![Exemplo de como a página deve ficar após os testes.]({{ "/assets/images/blog/2019-02-10-paginas-de-agradecimento-dinamicas-rd-station-image-6.jpeg" | absolute_url }})

Exemplo de como a página deve ficar após os testes.

## Melhoria contínua para aperfeiçoamento do funil

Este é um exemplo simples de como personalizar a página de agradecimento com base nas informações passadas pelo respondente do formulário mas há outras possibilidades. Podemos expandir este exemplo para passar, além do nome, o endereço do material que será entregue após o preenchimento do formulário, caso seja um material digital de consumo imediato como um ebook ou um webinar. O link pode ir em um parâmetro da URL e ser consumido na página de agradecimento para ser adicionado no botão de acesso ao conteúdo ou como link para materiais adicionais, que você pode usar para personalizar as ofertas relacionadas da página. O processo é o mesmo e o que muda são os seletores dos elementos que precisam ser alterados na página de agradecimento.

Com esta dica você consegue fazer alguns ajustes para personalizar ofertas nas páginas de agradecimento e ser mais assertivo na comunicação com seu público-alvo, conquistando mais conversões em sua métrica de sucesso que poderiam ter passado despercebidas pela simplicidade do Lead Score.

Bora otimizar!

import type { LandingData } from "./types";

/** Landing pages para campanhas (Google Ads e Meta Ads). Editáveis em /admin/landing-pages. */
export const SEED_LANDINGS: ({ slug: string; title: string } & LandingData)[] = [
  {
    slug: "abertura-de-empresa",
    title: "Abertura de empresa",
    seoTitle: "Abrir empresa no Rio de Janeiro com orientação contábil | Bruno Freitas",
    metaDescription: "Abra sua empresa com orientação sobre tipo societário, atividades, regime tributário e registros. Fale com um contador.",
    kicker: "Abertura de empresa",
    headline: "Abra sua empresa com *orientação contábil.*",
    subheadline: "Tipo de empresa, atividades, regime tributário e registros definidos com análise, antes de você começar a faturar.",
    problem: "As escolhas feitas na abertura acompanham a empresa por anos. Uma atividade mal registrada ou um regime escolhido sem análise costuma gerar alteração contratual, retrabalho e custos que poderiam ser evitados.",
    benefits: [
      { title: "Estrutura pensada para a sua atividade", text: "Orientação sobre natureza jurídica, CNAE e enquadramento antes do registro." },
      { title: "Etapas acompanhadas", text: "Você sabe o que já foi feito, o que falta e o que depende de você." },
      { title: "Primeiro ano organizado", text: "Calendário de obrigações e rotina contábil definidos desde o início." },
    ],
    included: [
      "Conversa inicial para entender o negócio",
      "Análise de tipo de empresa e regime tributário",
      "Registro do ato constitutivo e inscrição no CNPJ",
      "Inscrições municipais e estaduais aplicáveis",
      "Orientação sobre alvarás e licenças",
    ],
    steps: [
      { title: "Conte sobre o negócio", text: "Atividade, sócios, local de operação e expectativa de faturamento." },
      { title: "Receba a análise", text: "Apresentamos a estrutura recomendada e as alternativas." },
      { title: "Registro e início", text: "Cuidamos dos registros e entregamos a empresa pronta para operar." },
    ],
    faqs: [
      { q: "Quanto custa abrir uma empresa?", a: "Os honorários e as taxas oficiais dependem do tipo de empresa e da atividade. O valor é apresentado na proposta, depois de entendermos o seu caso." },
      { q: "Quanto tempo leva?", a: "Depende do tipo de empresa, do município e das licenças exigidas. Informamos uma estimativa na conversa inicial." },
      { q: "Atende fora do Rio de Janeiro?", a: "Grande parte do processo é digital. Avaliamos a viabilidade de atendimento para empresas de outras cidades." },
    ],
    ctaLabel: "Quero abrir minha empresa",
    serviceSlug: "abertura-de-empresas",
    whatsappMessage: "Olá! Gostaria de receber informações sobre abertura de empresa.",
    noindex: true,
  },
  {
    slug: "troca-de-contador",
    title: "Troca de contador",
    seoTitle: "Trocar de contador com segurança | Bruno Freitas Contabilidade",
    metaDescription: "Mude de contador sem interromper as obrigações da sua empresa. Transição organizada, com conferência da situação contábil e fiscal.",
    kicker: "Troca de contador",
    headline: "Trocar de contador pode ser *simples e organizado.*",
    subheadline: "Uma transição planejada, sem interromper as obrigações da empresa e com conferência da situação atual.",
    problem: "Falta de retorno, guias enviadas em cima do prazo e relatórios que ninguém explica são motivos comuns para trocar de contador. O receio da transição faz muitas empresas adiarem essa decisão.",
    benefits: [
      { title: "Transição planejada", text: "Cronograma combinado e comunicação com o escritório anterior." },
      { title: "Conferência da situação", text: "Revisão da situação contábil e fiscal antes de assumir a rotina." },
      { title: "Atendimento próximo", text: "Canal direto para dúvidas e explicação clara dos números." },
    ],
    included: [
      "Levantamento de documentos e acessos",
      "Conferência de obrigações entregues e pendentes",
      "Comunicação com o contador anterior",
      "Implantação da nova rotina de documentos",
      "Primeira reunião de alinhamento",
    ],
    steps: [
      { title: "Conversa inicial", text: "Entendemos o que não funciona hoje e o que você espera da contabilidade." },
      { title: "Proposta", text: "Escopo, rotina e honorários apresentados com clareza." },
      { title: "Transição", text: "Recebemos a documentação e assumimos a rotina com cronograma combinado." },
    ],
    faqs: [
      { q: "Preciso avisar o contador atual?", a: "Sim. Orientamos sobre a comunicação e o prazo previsto no contrato atual, e solicitamos a documentação necessária." },
      { q: "Posso trocar de contador no meio do ano?", a: "Sim. A transição pode acontecer em qualquer mês, com a documentação do período organizada." },
      { q: "E se houver pendências do contador anterior?", a: "A conferência inicial identifica pendências. Apresentamos o cenário e o plano para tratá-las." },
    ],
    ctaLabel: "Quero trocar de contador",
    serviceSlug: "contabilidade-para-empresas",
    whatsappMessage: "Olá! Estou pensando em trocar de contador e gostaria de conversar.",
    noindex: true,
  },
  {
    slug: "contabilidade-prestadores-de-servico",
    title: "Contabilidade para prestadores de serviço",
    seoTitle: "Contabilidade para prestadores de serviço | Bruno Freitas Contabilidade",
    metaDescription: "Contabilidade para profissionais e empresas prestadoras de serviço: enquadramento, notas fiscais, impostos e pró-labore com clareza.",
    kicker: "Prestadores de serviço",
    headline: "Contabilidade para quem *vive de prestar serviço.*",
    subheadline: "Enquadramento, emissão de notas, impostos e pró-labore organizados para profissionais e empresas de serviços.",
    problem: "Para quem presta serviço, o enquadramento e a forma de remunerar os sócios fazem diferença no resultado. Muitos profissionais formalizam a atuação sem entender como os tributos são calculados sobre o próprio faturamento.",
    benefits: [
      { title: "Enquadramento analisado", text: "Avaliação do regime e da atividade conforme a sua forma de atuação." },
      { title: "Notas fiscais sem dúvida", text: "Orientação para emitir notas com as informações tributárias corretas." },
      { title: "Retirada dos sócios", text: "Orientação sobre pró-labore e distribuição de lucros." },
    ],
    included: [
      "Apuração de tributos e envio de guias",
      "Orientação para emissão de notas fiscais de serviço",
      "Folha do pró-labore",
      "Contabilidade e demonstrações",
      "Atendimento para dúvidas do dia a dia",
    ],
    steps: [
      { title: "Entendimento", text: "Como você atua, para quem presta serviço e como fatura." },
      { title: "Análise", text: "Enquadramento e rotina tributária recomendados." },
      { title: "Acompanhamento", text: "Rotina mensal com guias, relatórios e canal direto." },
    ],
    faqs: [
      { q: "Sou profissional liberal. Vale a pena ter empresa?", a: "Depende da atividade, do faturamento e da forma de contratação dos seus clientes. A análise inicial compara as alternativas para o seu caso." },
      { q: "Atendem quem já tem empresa aberta?", a: "Sim. Podemos assumir a contabilidade de empresas já constituídas, com transição organizada." },
    ],
    ctaLabel: "Quero uma proposta",
    serviceSlug: "contabilidade-para-empresas",
    whatsappMessage: "Olá! Sou prestador de serviço e gostaria de conhecer a contabilidade para a minha empresa.",
    noindex: true,
  },
  {
    slug: "contabilidade-pequenas-empresas",
    title: "Contabilidade para pequenas empresas",
    seoTitle: "Contabilidade para pequenas empresas | Bruno Freitas Contabilidade",
    metaDescription: "Contabilidade para pequenas empresas com atendimento próximo, obrigações em dia e números explicados com clareza.",
    kicker: "Pequenas empresas",
    headline: "Números claros para a *pequena empresa decidir.*",
    subheadline: "Contabilidade, impostos e folha organizados, com explicação objetiva sobre o que os números mostram.",
    problem: "Na pequena empresa, o dono decide quase tudo, muitas vezes sem tempo para olhar os números. Sem informação organizada, fica difícil saber se o preço cobre os custos, quanto pode ser retirado e quando é possível investir.",
    benefits: [
      { title: "Obrigações em dia", text: "Tributos, folha e entregas organizados em um calendário." },
      { title: "Números explicados", text: "Relatórios com leitura objetiva para quem não é da área." },
      { title: "Contato direto", text: "Você fala com quem conhece a sua empresa." },
    ],
    included: [
      "Contabilidade e demonstrações",
      "Apuração de tributos e guias",
      "Folha de pagamento e pró-labore",
      "Relatórios gerenciais",
      "Reuniões de acompanhamento conforme o plano",
    ],
    steps: [
      { title: "Conversa inicial", text: "Uma primeira conversa para entender o seu caso." },
      { title: "Proposta", text: "Escopo e honorários definidos com clareza." },
      { title: "Rotina", text: "Implantação e acompanhamento mensal." },
    ],
    faqs: [
      { q: "Quais empresas vocês atendem?", a: "Pequenas empresas de serviços, comércio e outros segmentos, enquadradas no Simples Nacional, Lucro Presumido ou Lucro Real." },
      { q: "Como envio os documentos?", a: "A rotina de envio é definida na implantação, com preferência por meios digitais." },
    ],
    ctaLabel: "Quero uma proposta",
    serviceSlug: "contabilidade-para-empresas",
    whatsappMessage: "Olá! Tenho uma pequena empresa e gostaria de solicitar uma proposta contábil.",
    noindex: true,
  },
  {
    slug: "planejamento-tributario",
    title: "Planejamento tributário",
    seoTitle: "Planejamento tributário para empresas | Bruno Freitas Contabilidade",
    metaDescription: "Análise do regime e da estrutura da empresa para identificar alternativas previstas em lei. Planejamento tributário com clareza.",
    kicker: "Planejamento tributário",
    headline: "Estou no *regime certo?*",
    subheadline: "Uma análise técnica do seu enquadramento e das alternativas previstas na legislação para a sua empresa.",
    problem: "Faturamento, folha e atividades mudam com o tempo. O regime escolhido na abertura pode não ser mais o mais adequado, e só uma análise com os números reais mostra se vale a pena mudar.",
    benefits: [
      { title: "Comparação entre regimes", text: "Simulações com os números da empresa e premissas explícitas." },
      { title: "Dentro da lei", text: "Somente alternativas previstas na legislação." },
      { title: "Decisão no prazo", text: "Análise feita a tempo das janelas legais de opção." },
    ],
    included: [
      "Levantamento de faturamento, folha e custos",
      "Simulação entre regimes aplicáveis",
      "Revisão de atividades e tributação",
      "Relatório com cenários e recomendações",
      "Reunião de apresentação",
    ],
    steps: [
      { title: "Coleta", text: "Reunimos os números dos últimos períodos." },
      { title: "Simulação", text: "Comparamos os cenários possíveis." },
      { title: "Recomendação", text: "Apresentamos resultados, premissas e riscos." },
    ],
    faqs: [
      { q: "Vou pagar menos imposto?", a: "Não há garantia de redução. A análise mostra se existe alternativa legal mais adequada. Às vezes, a conclusão é que o regime atual já é o indicado." },
      { q: "Quando devo fazer a análise?", a: "Idealmente antes do início do ano-calendário, já que a opção de regime costuma ocorrer no começo do ano." },
    ],
    ctaLabel: "Quero uma análise",
    serviceSlug: "planejamento-tributario",
    whatsappMessage: "Olá! Tenho interesse em conhecer o serviço de planejamento tributário.",
    noindex: true,
  },
];

export const SEED_CATEGORIES = [
  { slug: "empreendedorismo", name: "Empreendedorismo", description: "Ideias e cuidados para quem está construindo um negócio." },
  { slug: "gestao-empresarial", name: "Gestão Empresarial", description: "Caixa, custos, margem e decisões com base em números." },
  { slug: "impostos-e-tributacao", name: "Impostos e Tributação", description: "Regimes tributários, impostos e mudanças na legislação." },
  { slug: "mei", name: "MEI", description: "Obrigações, limites e próximos passos do microempreendedor individual." },
  { slug: "abertura-de-empresas", name: "Abertura de Empresas", description: "O que considerar antes e durante a abertura do CNPJ." },
  { slug: "obrigacoes-contabeis", name: "Obrigações Contábeis", description: "Prazos, declarações e rotinas que toda empresa precisa cumprir." },
  { slug: "noticias-e-atualizacoes", name: "Notícias e Atualizações", description: "Mudanças relevantes para empresas e empreendedores." },
];

export const SEED_POSTS = [
  {
    slug: "como-escolher-regime-tributario",
    title: "Simples Nacional, Lucro Presumido ou Lucro Real: como escolher o regime tributário",
    excerpt:
      "O regime tributário define como a empresa calcula e paga seus tributos. Entenda as diferenças entre os três regimes e o que avaliar antes de escolher.",
    category: "impostos-e-tributacao",
    serviceSlug: "planejamento-tributario",
    coverImage: "/images/calculadora.jpg",
    coverAlt: "Calculadora e óculos sobre um caderno de anotações, em preto e branco",
    publishedAt: "2026-10-20T12:00:00.000Z",
    metaTitle: "Como escolher o regime tributário da empresa",
    metaDescription:
      "Simples Nacional, Lucro Presumido ou Lucro Real: entenda as diferenças entre os regimes tributários e o que avaliar antes de escolher.",
    content: `O regime tributário é o conjunto de regras que define **como a empresa calcula e paga seus tributos**. A escolha influencia o valor dos impostos, as obrigações que precisam ser entregues e até a forma de organizar a contabilidade.

Não existe um regime melhor para todas as empresas. Existe o regime mais adequado para a atividade, o faturamento e a estrutura de custos de cada negócio.

## Os três principais regimes

### Simples Nacional

O Simples Nacional reúne vários tributos em uma guia única, calculada sobre o faturamento. É voltado para micro e pequenas empresas que se enquadram nos limites e nas atividades permitidas pela legislação.

A simplicidade é a principal vantagem. Mas simples não significa necessariamente mais barato: dependendo da atividade e da folha de pagamento, outro regime pode ser mais adequado.

### Lucro Presumido

No Lucro Presumido, os tributos sobre o lucro são calculados a partir de um percentual de presunção definido em lei para cada tipo de atividade. A empresa não apura o lucro real para esse cálculo.

Costuma ser avaliado por empresas com margem de lucro maior do que a presumida pela legislação e que não podem ou não querem optar pelo Simples.

### Lucro Real

No Lucro Real, os tributos sobre o lucro são calculados com base no resultado contábil efetivo, com os ajustes previstos em lei. É obrigatório para algumas empresas e pode ser vantajoso para negócios com margens baixas ou prejuízo.

Exige uma contabilidade mais detalhada e controles mais rigorosos.

## O que avaliar antes de escolher

- **Atividade da empresa**: cada atividade tem regras e percentuais próprios.
- **Faturamento previsto**: há limites de faturamento para alguns regimes.
- **Folha de pagamento**: o peso da folha em relação ao faturamento pode mudar a conta.
- **Margem de lucro**: comparar a margem real com a presumida ajuda a decidir.
- **Clientes**: vender para empresas ou para consumidores finais pode influenciar a escolha.

## Quando revisar o regime

A opção pelo regime costuma ser feita no início do ano-calendário, conforme as regras de cada regime. Por isso, a análise deve ser feita com antecedência, de preferência nos últimos meses do ano.

Mudanças no faturamento, na equipe ou nas atividades são bons motivos para revisar o enquadramento.

## Em resumo

A escolha do regime tributário deve partir dos números reais da empresa, e não de regras gerais. Uma simulação comparativa, feita com dados atualizados, mostra qual alternativa é mais adequada dentro da lei.

Se quiser entender qual regime faz mais sentido para o seu negócio, conheça o serviço de [planejamento tributário](/servicos/planejamento-tributario).`,
  },
  {
    slug: "mei-quando-deixar-de-ser-microempreendedor",
    title: "MEI: sinais de que chegou a hora de deixar de ser microempreendedor individual",
    excerpt:
      "O MEI é uma ótima porta de entrada para a formalização, mas tem limites. Veja os sinais de que o negócio já precisa de outro enquadramento.",
    category: "mei",
    serviceSlug: "assessoria-contabil-mei",
    coverImage: "/images/travessia.jpg",
    coverAlt: "Pessoa de terno atravessando uma faixa de pedestres, em preto e branco",
    publishedAt: "2026-10-28T12:00:00.000Z",
    metaTitle: "MEI: quando deixar de ser microempreendedor individual",
    metaDescription:
      "Faturamento perto do limite, necessidade de sócios ou de mais funcionários: veja os sinais de que é hora de migrar do MEI para microempresa.",
    content: `O MEI (microempreendedor individual) simplificou a formalização de milhões de pequenos negócios no Brasil. Com uma contribuição mensal fixa e poucas obrigações, ele é uma boa porta de entrada para quem está começando.

Mas o MEI foi criado para negócios pequenos e tem regras específicas. Quando o negócio cresce, permanecer no MEI pode deixar de ser possível, ou de ser a melhor opção.

## Sinais de que é hora de migrar

### O faturamento está perto do limite

O MEI tem um limite anual de faturamento definido em lei. Ultrapassar esse limite leva ao desenquadramento, e, dependendo do valor excedido, a cobrança de tributos pelo novo regime pode ser retroativa.

Acompanhar o faturamento mês a mês ajuda a planejar a mudança com antecedência, em vez de descobrir o problema no fim do ano. Confira sempre o limite vigente, que pode ser alterado pela legislação.

### Você quer ter sócios

O MEI é individual. Se você pretende dividir o negócio com outra pessoa, é preciso migrar para outro tipo de empresa.

### A equipe precisa crescer

A legislação do MEI permite a contratação de apenas um empregado, com regras específicas de remuneração. Se o negócio precisa de mais pessoas, o MEI deixa de atender.

### A atividade não é permitida

Somente atividades específicas podem ser exercidas como MEI. Se você passou a oferecer um serviço ou produto que não está na lista permitida, é preciso rever o enquadramento.

### Você quer abrir filial ou participar de outra empresa

O MEI não pode ter filial nem participar como sócio ou titular de outra empresa.

## Como fazer a transição

A migração envolve o desenquadramento do MEI e a escolha de um novo tipo de empresa e regime tributário. Os pontos principais são:

1. Avaliar o momento certo da mudança, considerando o faturamento do ano.
2. Escolher o tipo de empresa e o regime tributário mais adequados.
3. Atualizar cadastros, inscrições e a forma de emissão de notas.
4. Organizar a nova rotina contábil e fiscal.

## Em resumo

Deixar de ser MEI é, na maioria das vezes, um sinal de crescimento. Planejar a transição evita cobranças inesperadas e ajuda o negócio a começar a nova fase organizado.

Se você é MEI e quer acompanhar o faturamento ou planejar a migração, conheça a [assessoria contábil para MEI](/servicos/assessoria-contabil-mei).`,
  },
  {
    slug: "checklist-para-abrir-empresa",
    title: "Checklist para abrir sua empresa com segurança",
    excerpt:
      "Antes de registrar o CNPJ, algumas decisões precisam estar claras. Use este checklist para organizar a abertura da sua empresa.",
    category: "abertura-de-empresas",
    serviceSlug: "abertura-de-empresas",
    coverImage: "/images/edificio.jpg",
    coverAlt: "Fachada de edifício comercial com janelas de vidro, em preto e branco",
    publishedAt: "2026-11-05T12:00:00.000Z",
    metaTitle: "Checklist para abrir empresa com segurança",
    metaDescription:
      "Atividade, tipo de empresa, regime tributário, endereço e licenças: o checklist do que definir antes de abrir sua empresa.",
    content: `Abrir uma empresa vai muito além de conseguir um CNPJ. As decisões tomadas nessa etapa definem como o negócio será tributado, quais obrigações terá e até como os sócios vão se relacionar.

Este checklist ajuda a organizar o que precisa estar claro antes do registro.

## 1. Defina o que a empresa vai fazer

Descreva com precisão as atividades que serão exercidas. Elas serão traduzidas em códigos (CNAE) que influenciam a tributação, as licenças exigidas e até a possibilidade de optar por determinados regimes.

- Quais produtos ou serviços serão oferecidos?
- A empresa vai vender para pessoas físicas, empresas ou ambos?
- Haverá atividades secundárias?

## 2. Escolha o tipo de empresa

O tipo de empresa (natureza jurídica) define quem são os donos, como respondem pelas dívidas e como a empresa é registrada. As opções mais comuns para pequenos negócios são a sociedade limitada, inclusive com um único sócio, e o MEI, para quem se enquadra nas regras.

## 3. Avalie o regime tributário

Simples Nacional, Lucro Presumido ou Lucro Real: a escolha depende da atividade, do faturamento esperado, da folha de pagamento e da margem. Fazer essa análise antes da abertura evita mudanças forçadas no futuro.

## 4. Verifique o endereço

Confirme se a atividade pode ser exercida no endereço escolhido, de acordo com as regras do município. Em alguns casos, é possível usar endereço residencial ou fiscal.

## 5. Organize os sócios

Se houver sócios, defina com antecedência:

- a participação de cada um no capital social;
- quem será o administrador;
- como serão feitas as retiradas (pró-labore e distribuição de lucros).

## 6. Levante as licenças necessárias

Algumas atividades exigem alvarás, licenças sanitárias, ambientais ou registros em conselhos profissionais. Verifique antes, para não atrasar o início das operações.

## 7. Planeje a rotina depois da abertura

Com o CNPJ em mãos, a empresa passa a ter obrigações mensais e anuais. Saiba desde o início:

- quais tributos serão pagos e quando;
- como emitir notas fiscais;
- quais documentos enviar para a contabilidade.

## Em resumo

Uma abertura bem planejada evita retrabalho, alterações contratuais e surpresas tributárias. Se quiser apoio em cada uma dessas etapas, conheça o serviço de [abertura de empresas](/servicos/abertura-de-empresas).`,
  },
];

export const PRIVACY_TEMPLATE = `Esta Política de Privacidade explica como {{razao_social}}, inscrita no CNPJ {{cnpj}} ("nós"), trata os dados pessoais coletados por meio deste site, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD).

## 1. Quais dados coletamos

Coletamos apenas os dados que você nos envia voluntariamente pelos formulários do site:

- nome, e-mail e telefone/WhatsApp;
- nome da empresa ou atividade, CNPJ (opcional), porte ou enquadramento e serviço de interesse;
- a mensagem que você escrever.

Também registramos, de forma associada ao seu envio, a página de origem e parâmetros de campanha (UTM), para entender como você chegou até nós.

Com o seu consentimento, utilizamos ferramentas de análise e de publicidade (como Google Analytics e Meta Pixel), que podem usar cookies para medir visitas e conversões. Você pode recusar esses cookies sem prejuízo da navegação.

## 2. Para que usamos os dados

- responder à sua solicitação de contato, orçamento ou análise inicial;
- elaborar e enviar propostas de serviços contábeis;
- melhorar o site e medir o desempenho de campanhas, quando autorizado.

Não vendemos nem alugamos dados pessoais.

## 3. Base legal

Tratamos os dados com base no seu consentimento e em procedimentos preliminares relacionados a contrato, a seu pedido (art. 7º, I e V, da LGPD).

## 4. Compartilhamento

Os dados podem ser processados por fornecedores que nos ajudam a operar o site e o atendimento (hospedagem, e-mail e sistema de gestão de contatos), sempre limitados às finalidades desta política.

## 5. Transferência internacional

Alguns desses fornecedores (por exemplo, hospedagem, e-mail, proteção do site e ferramentas de análise) podem armazenar ou processar dados em servidores fora do Brasil. Nesses casos, a transferência ocorre nos termos do art. 33 da LGPD, com fornecedores que adotam garantias contratuais e medidas de segurança compatíveis com a proteção exigida pela lei brasileira.

## 6. Por quanto tempo guardamos

Mantemos os dados pelo tempo necessário para atender à sua solicitação e cumprir obrigações legais. Você pode pedir a exclusão a qualquer momento.

## 7. Seus direitos

Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação dos dados e revogação do consentimento, entre outros direitos previstos no art. 18 da LGPD.

## 8. Cookies

Usamos um cookie essencial para registrar a sua escolha de consentimento. Cookies de análise e publicidade só são ativados se você aceitar no aviso exibido no site. Você pode alterar a escolha a qualquer momento pelo link "Preferências de cookies" no rodapé.

## 9. Contato

Para exercer seus direitos ou tirar dúvidas sobre esta política, fale com {{encarregado}} pelo e-mail {{email_privacidade}}.

Última atualização: {{data_atualizacao}}.`;

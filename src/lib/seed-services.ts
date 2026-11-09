import type { ServiceData } from "./types";

type SeedService = { slug: string; title: string } & ServiceData;

/**
 * Conteúdo inicial dos serviços. Tudo é editável no painel (/admin/servicos).
 * Os textos evitam promessas de resultado: nada de "redução garantida" ou "sem multas".
 */
export const SEED_SERVICES: SeedService[] = [
  {
    slug: "abertura-de-empresas",
    title: "Abertura de Empresas",
    icon: "rocket",
    short: "Orientação desde a escolha do tipo de empresa e do regime tributário até o CNPJ, inscrições e licenças.",
    seoTitle: "Abertura de empresa com orientação contábil | Bruno Freitas Contabilidade",
    metaDescription:
      "Abra sua empresa com orientação contábil: natureza jurídica, atividades (CNAE), regime tributário, CNPJ, inscrições e licenças, com acompanhamento em cada etapa.",
    headline: "Abra sua empresa com orientação contábil.",
    subheadline:
      "Decisões tomadas na abertura acompanham a empresa por anos. Começar com a estrutura certa evita retrabalho e surpresas no caminho.",
    problem:
      "Abrir uma empresa envolve escolhas que parecem burocráticas, mas têm impacto direto no dia a dia: o tipo de empresa, as atividades registradas, o regime tributário e as licenças necessárias. Quando essas definições são feitas sem orientação, é comum precisar alterar o contrato, mudar de enquadramento ou descobrir depois uma obrigação que não estava no planejamento.",
    benefits: [
      { title: "Estrutura adequada à atividade", text: "Orientação sobre natureza jurídica, atividades (CNAE) e enquadramento, de acordo com o que a empresa vai realmente fazer." },
      { title: "Processo acompanhado", text: "Você sabe em que etapa está cada registro e o que falta para a empresa começar a operar." },
      { title: "Início organizado", text: "A empresa já nasce com rotina contábil e fiscal definida, e você entende quais são as obrigações do primeiro ano." },
    ],
    included: [
      "Reunião inicial para entender o negócio e o modelo de operação",
      "Orientação sobre tipo de empresa e natureza jurídica",
      "Análise das atividades (CNAE) e do regime tributário mais adequado ao cenário apresentado",
      "Elaboração e registro do ato constitutivo na Junta Comercial ou cartório competente",
      "Inscrição no CNPJ e cadastros municipais e estaduais, quando aplicáveis",
      "Orientação sobre alvarás e licenças exigidos para a atividade",
      "Apresentação do calendário de obrigações iniciais",
    ],
    audience: [
      "Quem vai abrir o primeiro negócio",
      "Profissionais autônomos que querem formalizar a atuação como empresa",
      "MEIs que precisam migrar para outro tipo de empresa",
      "Sócios que vão iniciar uma nova operação",
    ],
    steps: [
      { title: "Conversa inicial", text: "Entendemos a atividade, os sócios, a previsão de faturamento e onde a empresa vai operar." },
      { title: "Definição da estrutura", text: "Apresentamos as alternativas de tipo de empresa e regime tributário, com prós e contras." },
      { title: "Registros", text: "Cuidamos dos atos de registro e das inscrições necessárias, mantendo você informado." },
      { title: "Início das atividades", text: "Entregamos a documentação e organizamos a rotina contábil e fiscal da nova empresa." },
    ],
    faqs: [
      { q: "Quanto tempo leva para abrir uma empresa?", a: "O prazo depende do tipo de empresa, da cidade e das licenças exigidas para a atividade. Na conversa inicial, apresentamos uma estimativa para o seu caso." },
      { q: "Preciso ter um endereço comercial?", a: "Depende da atividade e das regras do município. Em muitos casos é possível usar endereço residencial ou fiscal; verificamos a viabilidade antes do registro." },
      { q: "Já sou MEI. Posso transformar em outro tipo de empresa?", a: "Sim. Existe o procedimento de desenquadramento e transformação. Avaliamos o momento adequado e as obrigações envolvidas." },
      { q: "Como escolher o regime tributário?", a: "A escolha considera atividade, faturamento estimado, folha de pagamento e margem. Fazemos essa análise com você antes da abertura." },
    ],
    whatsappMessage: "Olá! Gostaria de receber informações sobre abertura de empresa.",
  },
  {
    slug: "contabilidade-para-empresas",
    title: "Contabilidade para Empresas",
    icon: "building",
    short: "Escrituração, demonstrações e relatórios contábeis com acompanhamento próximo e explicação clara dos números.",
    seoTitle: "Contabilidade para empresas | Bruno Freitas Contabilidade",
    metaDescription:
      "Contabilidade completa para empresas: escrituração, balancetes, demonstrações contábeis e relatórios gerenciais explicados com clareza.",
    headline: "Conte com suporte contábil para as decisões da sua empresa.",
    subheadline:
      "Uma contabilidade em dia e bem explicada é a base para entender a saúde do negócio e planejar os próximos passos.",
    problem:
      "Muitas empresas recebem guias e relatórios todo mês, mas não sabem dizer se o negócio está realmente lucrando, quanto pode ser retirado pelos sócios ou se há algo fora do lugar. A contabilidade vira apenas uma obrigação, quando poderia ser uma fonte de informação para decidir.",
    benefits: [
      { title: "Números confiáveis", text: "Escrituração organizada e conciliada, que reflete a realidade da empresa." },
      { title: "Relatórios compreensíveis", text: "Demonstrações acompanhadas de explicação objetiva sobre o que os números mostram." },
      { title: "Base para decisões", text: "Informações para avaliar preços, custos, retirada dos sócios e investimentos." },
    ],
    included: [
      "Escrituração contábil e conciliação das contas",
      "Balancetes periódicos",
      "Balanço patrimonial e demonstração do resultado (DRE)",
      "Entrega das obrigações acessórias contábeis aplicáveis",
      "Orientação sobre distribuição de lucros e pró-labore",
      "Reuniões de acompanhamento conforme o plano contratado",
    ],
    audience: [
      "Empresas do Simples Nacional, Lucro Presumido ou Lucro Real",
      "Prestadores de serviço, comércio e pequenas indústrias",
      "Empresas que querem trocar de contador",
      "Sócios que desejam entender melhor os números do negócio",
    ],
    steps: [
      { title: "Diagnóstico", text: "Levantamos a situação atual da contabilidade e dos documentos da empresa." },
      { title: "Proposta", text: "Definimos o escopo dos serviços e a rotina de envio de documentos." },
      { title: "Implantação", text: "Organizamos a transição e os acessos necessários, com cronograma combinado." },
      { title: "Acompanhamento", text: "Rotina mensal com entregas, relatórios e canal direto para dúvidas." },
    ],
    faqs: [
      { q: "Como funciona a troca de contador?", a: "Solicitamos a documentação ao escritório anterior, conferimos a situação contábil e fiscal e fazemos a transição com um cronograma combinado, sem interromper as obrigações da empresa." },
      { q: "Que documentos preciso enviar todo mês?", a: "Normalmente extratos bancários, notas fiscais, comprovantes de despesas e informações de folha. A lista exata é definida na implantação." },
      { q: "Vou receber relatórios?", a: "Sim. A periodicidade e o formato dos relatórios fazem parte da proposta e são combinados com você." },
    ],
    whatsappMessage: "Olá! Gostaria de saber mais sobre os serviços de contabilidade para a minha empresa.",
  },
  {
    slug: "planejamento-tributario",
    title: "Planejamento Tributário",
    icon: "chart-pie",
    short: "Análise do enquadramento e das alternativas previstas na legislação para que a empresa pague os tributos de forma correta e consciente.",
    seoTitle: "Planejamento tributário para empresas | Bruno Freitas Contabilidade",
    metaDescription:
      "Planejamento tributário dentro da lei: análise de regime, atividades e estrutura da empresa para identificar alternativas legais e reduzir riscos fiscais.",
    headline: "Planejamento tributário com análise técnica e dentro da lei.",
    subheadline:
      "Entenda quanto sua empresa paga de tributos, por que paga e quais alternativas a legislação permite para a sua realidade.",
    problem:
      "Um enquadramento escolhido sem análise, atividades mal classificadas ou uma estrutura societária inadequada podem fazer a empresa pagar tributos de forma ineficiente ou ficar exposta a riscos. Sem uma análise periódica, mudanças no faturamento, na folha ou na legislação passam despercebidas.",
    benefits: [
      { title: "Clareza sobre a carga tributária", text: "Você entende como os tributos são calculados e quanto representam no resultado." },
      { title: "Alternativas legais comparadas", text: "Simulações entre regimes e cenários previstos na legislação, com premissas explícitas." },
      { title: "Decisões com menos risco", text: "Recomendações fundamentadas, sem atalhos que possam gerar autuações no futuro." },
    ],
    included: [
      "Levantamento de faturamento, folha, custos e atividades",
      "Simulação comparativa entre regimes tributários aplicáveis",
      "Revisão da classificação das atividades e da tributação dos itens vendidos",
      "Relatório com cenários, premissas e recomendações",
      "Reunião de apresentação dos resultados",
      "Acompanhamento das mudanças relevantes na legislação",
    ],
    audience: [
      "Empresas que vão escolher ou revisar o regime tributário",
      "Negócios que cresceram e mudaram de perfil de faturamento",
      "Empresas com dúvidas sobre a carga tributária atual",
      "Sócios que planejam reorganizar a estrutura da empresa",
    ],
    steps: [
      { title: "Coleta de dados", text: "Reunimos informações financeiras, fiscais e de folha dos últimos períodos." },
      { title: "Análise e simulações", text: "Comparamos os cenários possíveis com base na legislação vigente." },
      { title: "Apresentação", text: "Explicamos os resultados, as premissas e os riscos de cada alternativa." },
      { title: "Implementação", text: "Apoiamos as mudanças aprovadas, respeitando prazos legais." },
    ],
    faqs: [
      { q: "O planejamento tributário garante que vou pagar menos imposto?", a: "Não há garantia de redução. O planejamento identifica se existem alternativas legais mais adequadas para a sua empresa. Em alguns casos, a conclusão é que o enquadramento atual já é o mais indicado." },
      { q: "Quando posso mudar de regime tributário?", a: "A legislação define períodos específicos para a opção ou alteração de regime, em geral no início do ano-calendário. Por isso, a análise deve ser feita com antecedência." },
      { q: "Planejamento tributário é o mesmo que sonegação?", a: "Não. Planejamento tributário usa apenas alternativas previstas em lei. Qualquer prática que oculte receitas ou simule operações é ilegal e não faz parte do nosso trabalho." },
    ],
    whatsappMessage: "Olá! Tenho interesse em conhecer o serviço de planejamento tributário.",
  },
  {
    slug: "gestao-fiscal-e-tributaria",
    title: "Gestão Fiscal e Tributária",
    icon: "receipt",
    short: "Apuração de tributos, emissão de guias e entrega das obrigações acessórias dentro dos prazos.",
    seoTitle: "Gestão fiscal e tributária para empresas | Bruno Freitas Contabilidade",
    metaDescription:
      "Apuração de impostos, guias, obrigações acessórias e orientação sobre notas fiscais. Tenha mais clareza sobre as obrigações fiscais do seu negócio.",
    headline: "Tenha mais clareza sobre as obrigações fiscais do seu negócio.",
    subheadline: "Tributos apurados, guias enviadas com antecedência e obrigações entregues dentro dos prazos legais.",
    problem:
      "As obrigações fiscais mudam conforme o regime, a atividade e a cidade da empresa. Perder um prazo ou apurar um tributo de forma incorreta pode gerar multas, juros e pendências que dificultam a emissão de certidões e a participação em licitações ou financiamentos.",
    benefits: [
      { title: "Calendário sob controle", text: "Você sabe o que vence, quando vence e quanto vai pagar, com antecedência." },
      { title: "Apuração conferida", text: "Tributos calculados a partir dos documentos fiscais e conferidos antes do envio das guias." },
      { title: "Orientação na emissão de notas", text: "Apoio para emitir notas fiscais com as informações tributárias corretas." },
    ],
    included: [
      "Apuração dos tributos federais, estaduais e municipais aplicáveis",
      "Envio das guias de pagamento",
      "Entrega das obrigações acessórias fiscais",
      "Orientação sobre emissão de notas fiscais",
      "Acompanhamento de certidões negativas",
      "Atendimento a dúvidas sobre operações específicas",
    ],
    audience: [
      "Prestadores de serviço",
      "Comércio e e-commerce",
      "Empresas do Simples Nacional e do Lucro Presumido",
      "Empresas com dificuldade em acompanhar prazos fiscais",
    ],
    steps: [
      { title: "Mapeamento", text: "Identificamos as obrigações fiscais da empresa conforme atividade, regime e localização." },
      { title: "Rotina de documentos", text: "Definimos como e quando os documentos fiscais serão enviados." },
      { title: "Apuração e guias", text: "Apuramos os tributos e enviamos as guias dentro do calendário combinado." },
      { title: "Entregas e relatório", text: "Transmitimos as obrigações e informamos o que foi entregue." },
    ],
    faqs: [
      { q: "Vocês emitem as notas fiscais da empresa?", a: "A emissão é normalmente feita pela própria empresa, no sistema da prefeitura ou estado. Orientamos a configuração e as informações tributárias corretas." },
      { q: "Tenho pendências fiscais antigas. Vocês ajudam?", a: "Sim. Esse caso é tratado no serviço de Regularização de Empresas, com levantamento das pendências e plano de ação." },
      { q: "Com que antecedência recebo as guias?", a: "O prazo de envio é definido na proposta, considerando o calendário de vencimentos e o envio dos documentos pela empresa." },
    ],
    whatsappMessage: "Olá! Gostaria de saber mais sobre o serviço de gestão fiscal e tributária.",
  },
  {
    slug: "departamento-pessoal",
    title: "Departamento Pessoal e Folha de Pagamento",
    icon: "users",
    short: "Admissões, folha mensal, férias, rescisões e eSocial, com orientação sobre a legislação trabalhista.",
    seoTitle: "Departamento pessoal e folha de pagamento | Bruno Freitas Contabilidade",
    metaDescription:
      "Folha de pagamento, admissões, férias, 13º, rescisões, eSocial e encargos trabalhistas com orientação clara para a sua empresa.",
    headline: "Folha de pagamento e rotinas trabalhistas organizadas.",
    subheadline: "Cuidamos das rotinas do departamento pessoal para que você foque na gestão da equipe.",
    problem:
      "Admitir, pagar e desligar funcionários envolve cálculos, prazos e informações enviadas ao eSocial. Erros na folha afetam a relação com a equipe e podem gerar passivos trabalhistas e previdenciários.",
    benefits: [
      { title: "Folha em dia", text: "Cálculo mensal da folha, encargos e guias, com conferência antes do fechamento." },
      { title: "Orientação nas decisões", text: "Apoio em contratações, jornadas, férias e desligamentos conforme a legislação." },
      { title: "Informações consistentes", text: "Eventos enviados ao eSocial de forma organizada e no prazo." },
    ],
    included: [
      "Admissões e registro de funcionários",
      "Cálculo da folha de pagamento e do pró-labore",
      "Férias, 13º salário e rescisões",
      "Apuração de encargos (INSS, FGTS e IRRF) e envio de guias",
      "Envio de eventos ao eSocial e demais obrigações trabalhistas",
      "Orientação sobre convenção coletiva e rotinas de pessoal",
    ],
    audience: [
      "Empresas que vão contratar o primeiro funcionário",
      "Empresas com equipe em crescimento",
      "Negócios que querem terceirizar o departamento pessoal",
    ],
    steps: [
      { title: "Levantamento", text: "Conhecemos a equipe, os contratos e a convenção coletiva aplicável." },
      { title: "Implantação", text: "Cadastramos funcionários e definimos o calendário de fechamento da folha." },
      { title: "Rotina mensal", text: "Recebemos as variáveis do mês, calculamos e enviamos folha e guias para aprovação." },
    ],
    faqs: [
      { q: "Vocês atendem empresas com poucos funcionários?", a: "Sim. O serviço é dimensionado conforme o número de colaboradores e as rotinas da empresa." },
      { q: "Como envio as informações do mês (faltas, horas extras)?", a: "Definimos na implantação um modelo e uma data-limite para o envio das variáveis da folha." },
      { q: "Também cuidam do pró-labore dos sócios?", a: "Sim. O pró-labore é calculado junto com a folha, com os encargos correspondentes." },
    ],
    whatsappMessage: "Olá! Gostaria de saber mais sobre o serviço de departamento pessoal e folha de pagamento.",
  },
  {
    slug: "regularizacao-de-empresas",
    title: "Regularização de Empresas",
    icon: "shield-check",
    short: "Levantamento de pendências fiscais, cadastrais e contábeis e plano de ação para colocar a empresa em ordem.",
    seoTitle: "Regularização de empresas e pendências fiscais | Bruno Freitas Contabilidade",
    metaDescription:
      "Levantamento de pendências fiscais, cadastrais e contábeis, orientação sobre parcelamentos e plano de ação para regularizar sua empresa.",
    headline: "Coloque a sua empresa em ordem, com um plano claro.",
    subheadline: "Identificamos as pendências, explicamos o que cada uma significa e organizamos os próximos passos.",
    problem:
      "Declarações não entregues, tributos em atraso, CNPJ inapto ou contabilidade desatualizada impedem a emissão de certidões, travam financiamentos e podem gerar cobranças crescentes. Muitas vezes o empresário nem sabe exatamente o tamanho do problema.",
    benefits: [
      { title: "Visão completa", text: "Um levantamento das pendências nos órgãos competentes, organizado por prioridade." },
      { title: "Plano de ação", text: "Caminhos possíveis para cada pendência, incluindo parcelamentos previstos em lei, quando aplicáveis." },
      { title: "Acompanhamento", text: "Execução das etapas combinadas e atualização sobre a situação da empresa." },
    ],
    included: [
      "Consulta de situação cadastral e fiscal nos órgãos competentes",
      "Levantamento de declarações e obrigações pendentes",
      "Orientação sobre parcelamentos e programas de regularização disponíveis",
      "Entrega de obrigações em atraso",
      "Atualização da contabilidade, quando necessário",
      "Relatório da situação antes e depois do trabalho",
    ],
    audience: [
      "Empresas com declarações ou tributos em atraso",
      "Empresas com CNPJ inapto ou suspenso",
      "MEIs com pendências de DAS ou declaração anual",
      "Empresas que precisam de certidões para contratos ou crédito",
    ],
    steps: [
      { title: "Levantamento", text: "Consultamos a situação da empresa e reunimos as pendências." },
      { title: "Diagnóstico", text: "Apresentamos o cenário e as alternativas para cada pendência." },
      { title: "Execução", text: "Entregamos obrigações e encaminhamos as soluções aprovadas." },
      { title: "Manutenção", text: "Indicamos a rotina necessária para que a empresa permaneça regular." },
    ],
    faqs: [
      { q: "É possível parcelar dívidas da empresa?", a: "Existem modalidades de parcelamento previstas em lei, que variam conforme o órgão e o tipo de débito. Avaliamos quais se aplicam ao seu caso." },
      { q: "Quanto tempo leva a regularização?", a: "Depende da quantidade e do tipo de pendências. O prazo estimado é apresentado após o levantamento." },
      { q: "Minha empresa está parada. Preciso regularizar mesmo assim?", a: "Empresas sem movimento continuam com obrigações a cumprir. Avaliamos se o melhor caminho é regularizar e manter ou encerrar a empresa." },
    ],
    whatsappMessage: "Olá! Preciso de ajuda para regularizar a minha empresa.",
  },
  {
    slug: "assessoria-contabil-mei",
    title: "Assessoria Contábil para MEI",
    icon: "store",
    short: "Apoio ao microempreendedor individual nas obrigações do dia a dia e na hora de crescer além do MEI.",
    seoTitle: "Assessoria contábil para MEI | Bruno Freitas Contabilidade",
    metaDescription:
      "Assessoria para MEI: DAS, declaração anual, controle de faturamento, emissão de notas e orientação para migrar para microempresa no momento certo.",
    headline: "Seu MEI organizado, e preparado para crescer.",
    subheadline: "Acompanhe o faturamento, cumpra as obrigações e saiba a hora certa de dar o próximo passo.",
    problem:
      "O MEI é simples, mas não é isento de obrigações. Atrasos no DAS, declaração anual esquecida e faturamento acima do limite são situações comuns, e podem gerar cobranças e o desenquadramento sem planejamento.",
    benefits: [
      { title: "Obrigações em dia", text: "Lembretes e apoio para DAS mensal e declaração anual." },
      { title: "Controle do limite", text: "Acompanhamento do faturamento em relação ao limite anual vigente." },
      { title: "Transição planejada", text: "Orientação para migrar para microempresa no momento adequado." },
    ],
    included: [
      "Orientação sobre o DAS mensal",
      "Declaração anual do MEI (DASN-SIMEI)",
      "Acompanhamento do faturamento",
      "Orientação para emissão de notas fiscais",
      "Regularização de pendências do MEI",
      "Análise de migração para microempresa",
    ],
    audience: [
      "Microempreendedores individuais",
      "MEIs que estão perto do limite de faturamento",
      "MEIs com pendências de DAS ou declaração",
      "Quem quer abrir um MEI e tem dúvidas se é o enquadramento certo",
    ],
    steps: [
      { title: "Conversa inicial", text: "Entendemos a atividade e a situação atual do MEI." },
      { title: "Verificação", text: "Consultamos pendências e o histórico de faturamento." },
      { title: "Acompanhamento", text: "Organizamos a rotina de obrigações e o controle do faturamento." },
    ],
    faqs: [
      { q: "MEI precisa de contador?", a: "A lei não obriga o MEI a ter contador, mas a assessoria ajuda a evitar pendências, acompanhar o limite de faturamento e planejar o crescimento." },
      { q: "O que acontece se eu faturar acima do limite do MEI?", a: "O MEI pode ser desenquadrado e passar a recolher tributos em outro regime, inclusive de forma retroativa, dependendo do quanto o limite foi ultrapassado. Por isso é importante acompanhar o faturamento." },
      { q: "Posso ter funcionário sendo MEI?", a: "A legislação permite a contratação de um empregado, com regras específicas de remuneração. Orientamos as obrigações envolvidas." },
    ],
    whatsappMessage: "Olá! Sou MEI e gostaria de saber mais sobre a assessoria contábil.",
  },
  {
    slug: "consultoria-empresarial",
    title: "Consultoria Empresarial",
    icon: "compass",
    short: "Leitura dos números, indicadores e apoio às decisões de preço, investimento, expansão e organização societária.",
    seoTitle: "Consultoria empresarial e contábil | Bruno Freitas Contabilidade",
    metaDescription:
      "Consultoria empresarial com base nos números da empresa: indicadores, fluxo de caixa, formação de preço e apoio às decisões de crescimento.",
    headline: "Decisões de negócio apoiadas em números.",
    subheadline: "Transformamos as informações contábeis e financeiras em leitura prática para quem precisa decidir.",
    problem:
      "Muitos empresários tomam decisões importantes — contratar, investir, abrir uma filial, mudar preços — sem uma leitura clara de margem, caixa e capacidade de pagamento. A informação existe, mas não está organizada para apoiar a decisão.",
    benefits: [
      { title: "Indicadores relevantes", text: "Acompanhamento de margem, ponto de equilíbrio, caixa e outros indicadores do seu negócio." },
      { title: "Análise de cenários", text: "Simulações para apoiar decisões de investimento, preço e expansão." },
      { title: "Visão de longo prazo", text: "Apoio ao planejamento e à organização societária da empresa." },
    ],
    included: [
      "Análise de demonstrações e indicadores",
      "Apoio à organização do fluxo de caixa",
      "Estudo de formação de preço",
      "Análise de viabilidade de projetos e investimentos",
      "Orientação sobre estrutura societária",
      "Reuniões periódicas de acompanhamento",
    ],
    audience: [
      "Empresas em fase de crescimento",
      "Sócios que precisam de apoio para decisões estratégicas",
      "Negócios com dificuldade de entender margem e caixa",
    ],
    steps: [
      { title: "Entendimento", text: "Conversamos sobre objetivos, desafios e o momento da empresa." },
      { title: "Análise", text: "Organizamos e analisamos as informações contábeis e financeiras." },
      { title: "Recomendações", text: "Apresentamos a leitura dos números e as alternativas para cada decisão." },
      { title: "Acompanhamento", text: "Revisitamos os indicadores e ajustamos o plano periodicamente." },
    ],
    faqs: [
      { q: "A consultoria é contratada separadamente da contabilidade?", a: "Pode ser contratada como serviço avulso ou em conjunto com a contabilidade. O formato é definido na proposta." },
      { q: "Preciso ser cliente de contabilidade para contratar?", a: "Não necessariamente. Avaliamos as informações disponíveis da empresa e definimos o escopo possível." },
    ],
    whatsappMessage: "Olá! Tenho interesse em consultoria empresarial para a minha empresa.",
  },
];

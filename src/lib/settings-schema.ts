import { PRIVACY_TEMPLATE } from "./seed-content";

/**
 * Esquema dos conteúdos editáveis do site.
 * Cada grupo vira uma tela no painel (/admin/conteudo/<grupo>) e tem valores padrão.
 * Campos vazios aparecem no site como "A definir" enquanto o modo de configuração estiver ativo.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "image"
  | "url"
  | "email"
  | "boolean"
  | "list"
  | "items"
  | "icon"
  | "number"
  | "select"
  | "datetime";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  /** Para type "items": subcampos de cada item. */
  fields?: Field[];
  maxLength?: number;
  /** Limite recomendado (ex.: SEO), exibido como contador. */
  recommended?: number;
  required?: boolean;
  options?: { value: string; label: string }[];
};

export type Group = {
  key: string;
  title: string;
  description: string;
  /** Apenas administradores podem editar (integrações, por exemplo). */
  adminOnly?: boolean;
  /** Nunca é enviado ao navegador nem lido pelas páginas públicas como um todo. */
  private?: boolean;
  fields: Field[];
  defaults: Record<string, unknown>;
};

const benefitFields: Field[] = [
  { name: "icon", label: "Ícone", type: "icon" },
  { name: "title", label: "Título", type: "text" },
  { name: "text", label: "Texto", type: "textarea" },
];

const stepFields: Field[] = [
  { name: "title", label: "Título", type: "text" },
  { name: "text", label: "Texto", type: "textarea" },
];

export const GROUPS: Group[] = [
  {
    key: "geral",
    title: "Identidade e dados legais",
    description: "Nome, assinatura, CRC e dados exibidos no rodapé.",
    fields: [
      { name: "siteName", label: "Nome do escritório", type: "text" },
      { name: "tagline", label: "Assinatura (rodapé)", type: "text" },
      { name: "legalName", label: "Razão social", type: "text", help: "Usada no rodapé e na Política de Privacidade." },
      { name: "cnpj", label: "CNPJ", type: "text" },
      { name: "professional", label: "Nome e categoria na assinatura", type: "text", help: "Linha da assinatura completa, conforme o manual da marca." },
      { name: "crc", label: "Registro profissional (CRC)", type: "text", help: "Aparece na assinatura, no rodapé e nos dados estruturados. Somente registro confirmado." },
      { name: "officeCrc", label: "Registro CRC da organização contábil (se houver)", type: "text", help: "Preencha apenas se o escritório possuir registro próprio como pessoa jurídica." },
      { name: "ogImage", label: "Imagem padrão de compartilhamento (1200×630)", type: "image" },
      {
        name: "showPlaceholders",
        label: "Modo de configuração (mostrar marcações \"A definir\" no site)",
        type: "boolean",
        help: "Desative antes de divulgar o site. Campos vazios passam a ficar ocultos.",
      },
    ],
    defaults: {
      siteName: "Bruno Freitas Contabilidade",
      tagline: "Contabilidade estratégica para empresas que querem crescer.",
      legalName: "",
      cnpj: "",
      professional: "Contador",
      crc: "CRC RJ-141105/O-6",
      officeCrc: "",
      ogImage: "",
      showPlaceholders: true,
    },
  },
  {
    key: "contato",
    title: "Contato e localização",
    description: "WhatsApp, e-mail, endereço, horário e mapa. Também alimenta o SEO local.",
    fields: [
      { name: "whatsapp", label: "Número do WhatsApp (com DDI e DDD, só números)", type: "text", placeholder: "5511999999999", help: "Ex.: 55 + DDD + número. Enquanto vazio, os botões de WhatsApp levam para a página de contato." },
      { name: "phoneDisplay", label: "Telefone exibido", type: "text", placeholder: "(11) 99999-9999" },
      { name: "email", label: "E-mail profissional", type: "email" },
      { name: "address", label: "Endereço (rua, número, complemento)", type: "text" },
      { name: "district", label: "Bairro", type: "text" },
      { name: "city", label: "Cidade", type: "text" },
      { name: "state", label: "Estado (UF)", type: "text", maxLength: 2 },
      { name: "zip", label: "CEP", type: "text" },
      { name: "hours", label: "Horário de atendimento", type: "text", placeholder: "Segunda a sexta, das 8h às 18h" },
      { name: "serviceArea", label: "Região atendida (SEO local)", type: "text", placeholder: "Ex.: São Paulo e região metropolitana, e atendimento online em todo o Brasil" },
      { name: "showAddress", label: "Exibir endereço publicamente", type: "boolean" },
      { name: "mapsEmbedUrl", label: "Link de incorporação do Google Maps", type: "url", help: "No Google Maps: Compartilhar → Incorporar um mapa → copie apenas o endereço que está em src=\"...\"." },
    ],
    defaults: {
      whatsapp: "5521987491091",
      phoneDisplay: "(21) 98749-1091",
      email: "contato@freitasmonteiro.com.br",
      address: "",
      district: "",
      city: "Rio de Janeiro",
      state: "RJ",
      zip: "",
      hours: "",
      serviceArea: "",
      showAddress: false,
      mapsEmbedUrl: "",
    },
  },
  {
    key: "redes",
    title: "Redes sociais",
    description: "Cole somente os endereços de perfis que existem. Campos vazios não aparecem no site.",
    fields: [
      { name: "instagram", label: "Instagram", type: "url", placeholder: "https://www.instagram.com/..." },
      { name: "facebook", label: "Facebook", type: "url" },
      { name: "linkedin", label: "LinkedIn", type: "url" },
      { name: "youtube", label: "YouTube", type: "url" },
      { name: "tiktok", label: "TikTok", type: "url" },
      { name: "showInHeader", label: "Mostrar ícones também no cabeçalho (computador)", type: "boolean" },
    ],
    defaults: { instagram: "https://www.instagram.com/brunofreitas.cont/", facebook: "", linkedin: "", youtube: "", tiktok: "", showInHeader: false },
  },
  {
    key: "whatsapp",
    title: "Mensagens do WhatsApp",
    description: "Texto que já chega digitado no WhatsApp, conforme a página de origem do clique. Mensagens de cada serviço e landing page são editadas nas próprias telas.",
    fields: [
      { name: "home", label: "Página inicial e botão flutuante", type: "textarea" },
      { name: "sobre", label: "Sobre nós", type: "textarea" },
      { name: "servicos", label: "Lista de serviços", type: "textarea" },
      { name: "contato", label: "Contato comercial", type: "textarea" },
      { name: "orcamento", label: "Orçamento", type: "textarea" },
      { name: "diagnostico", label: "Diagnóstico contábil", type: "textarea" },
      { name: "blog", label: "Blog e artigos", type: "textarea" },
      { name: "floatLabel", label: "Texto acessível do botão flutuante", type: "text" },
    ],
    defaults: {
      home: "Olá! Conheci a Bruno Freitas Contabilidade pelo site e gostaria de saber mais sobre os serviços.",
      sobre: "Olá! Conheci a Bruno Freitas Contabilidade pelo site e gostaria de conversar com um contador.",
      servicos: "Olá! Gostaria de saber qual serviço contábil é o mais adequado para a minha empresa.",
      contato: "Olá! Gostaria de solicitar uma proposta contábil.",
      orcamento: "Olá! Gostaria de solicitar uma proposta contábil.",
      diagnostico: "Olá! Gostaria de solicitar uma análise inicial da contabilidade da minha empresa.",
      blog: "Olá! Li um artigo no site da Bruno Freitas Contabilidade e gostaria de tirar uma dúvida.",
      floatLabel: "Conversar no WhatsApp",
    },
  },
  {
    key: "home",
    title: "Página inicial",
    description: "Textos e imagens de todas as seções da home.",
    fields: [
      { name: "heroTitle", label: "Título principal", type: "textarea", help: "Coloque entre *asteriscos* a palavra de ênfase: ela aparece em itálico, como pede o manual da marca. Vale para todos os títulos." },
      { name: "heroSubtitle", label: "Subtítulo", type: "textarea" },
      { name: "heroPrimaryCta", label: "Botão principal (WhatsApp)", type: "text" },
      { name: "heroSecondaryCta", label: "Botão secundário (serviços)", type: "text" },
      { name: "heroImage", label: "Foto do hero (opcional)", type: "image", help: "Sem foto, o site exibe a composição gráfica da marca. Recomendado: retrato profissional vertical (4:5)." },
      { name: "heroImageAlt", label: "Descrição da foto do hero", type: "text" },
      { name: "benefitsTitle", label: "Benefícios — título", type: "textarea" },
      { name: "benefitsIntro", label: "Benefícios — introdução", type: "textarea" },
      { name: "benefits", label: "Benefícios", type: "items", fields: benefitFields },
      { name: "servicesTitle", label: "Serviços — título", type: "text" },
      { name: "servicesIntro", label: "Serviços — introdução", type: "textarea" },
      { name: "whyTitle", label: "Diferenciais — título", type: "textarea" },
      { name: "whyIntro", label: "Diferenciais — introdução", type: "textarea" },
      { name: "whyItems", label: "Diferenciais", type: "items", fields: stepFields },
      { name: "stepsTitle", label: "Como funciona — título", type: "text" },
      { name: "steps", label: "Etapas", type: "items", fields: stepFields },
      { name: "stepsCta", label: "Como funciona — botão", type: "text" },
      { name: "testimonialsTitle", label: "Depoimentos — título", type: "text" },
      { name: "blogTitle", label: "Blog — título", type: "text" },
      { name: "finalTitle", label: "Chamada final — título", type: "textarea" },
      { name: "finalText", label: "Chamada final — texto", type: "textarea" },
      { name: "finalCta", label: "Chamada final — botão", type: "text" },
    ],
    defaults: {
      heroTitle: "Contabilidade estratégica para o seu negócio *crescer.*",
      heroSubtitle:
        "Mais do que cuidar de números, ajudamos sua empresa a tomar decisões inteligentes, organizar suas obrigações e crescer com segurança.",
      heroPrimaryCta: "Quero falar com um contador",
      heroSecondaryCta: "Conhecer nossos serviços",
      heroImage: "",
      heroImageAlt: "",
      benefitsTitle: "Seu negócio merece muito mais que uma *contabilidade tradicional.*",
      benefitsIntro:
        "Contabilidade não precisa ser uma caixa-preta. Você acompanha o que está sendo feito, entende os números e decide com mais segurança.",
      benefits: [
        { icon: "users", title: "Atendimento próximo e personalizado", text: "Você fala com quem conhece a sua empresa. Cada orientação parte da sua realidade, não de um pacote padrão." },
        { icon: "folder-check", title: "Organização e segurança contábil", text: "Rotinas, prazos e documentos organizados para que a empresa cumpra suas obrigações com tranquilidade." },
        { icon: "chart-pie", title: "Planejamento tributário dentro da lei", text: "Análise do enquadramento e das alternativas previstas na legislação para a sua atividade." },
        { icon: "store", title: "Soluções para empreendedores e empresas", text: "Do MEI que está crescendo à empresa que precisa de uma contabilidade mais completa." },
        { icon: "laptop", title: "Tecnologia e praticidade", text: "Envio de documentos e comunicação por canais digitais, com menos papel e menos deslocamento." },
        { icon: "chart", title: "Informações para decisões estratégicas", text: "Relatórios explicados em linguagem clara para apoiar preço, investimento, contratação e expansão." },
      ],
      servicesTitle: "Nossos *serviços.*",
      servicesIntro: "Soluções contábeis para cada fase da empresa — da abertura à gestão do dia a dia.",
      whyTitle: "Por que escolher a *Bruno Freitas Contabilidade?*",
      whyIntro:
        "Você não precisa entender de contabilidade. Precisa de alguém que entenda e explique com clareza o que importa para o seu negócio.",
      whyItems: [
        { title: "Proximidade", text: "Um contato direto com quem acompanha a sua empresa, sem filas de atendimento genéricas." },
        { title: "Clareza", text: "Explicações objetivas sobre impostos, prazos e relatórios, sem jargão desnecessário." },
        { title: "Organização", text: "Calendário de obrigações, documentos e rotinas acompanhados de forma estruturada." },
        { title: "Compromisso", text: "Prazos combinados com transparência e comunicação ativa quando algo precisa da sua atenção." },
        { title: "Atendimento consultivo", text: "Além de entregar obrigações, olhamos para os números com você para apoiar as próximas decisões." },
      ],
      stepsTitle: "Como funciona nosso *atendimento?*",
      steps: [
        { title: "Entre em contato", text: "Conte sobre sua empresa e suas necessidades pelo WhatsApp ou pelo formulário." },
        { title: "Receba uma análise inicial", text: "Nossa equipe identifica os serviços adequados para a sua situação." },
        { title: "Conheça nossa proposta", text: "Receba uma solução personalizada para o seu negócio, com escopo claro." },
      ],
      stepsCta: "Solicitar atendimento",
      testimonialsTitle: "O que dizem nossos *clientes.*",
      blogTitle: "Conteúdo para *empreendedores.*",
      finalTitle: "Seu negócio pode crescer com mais *organização e segurança.*",
      finalText: "Converse com a Bruno Freitas Contabilidade e descubra como podemos ajudar sua empresa.",
      finalCta: "Falar com um especialista",
    },
  },
  {
    key: "sobre",
    title: "Sobre nós",
    description: "História, apresentação de Bruno Freitas, missão, visão, valores e equipe. Use apenas informações verdadeiras e verificadas.",
    fields: [
      { name: "title", label: "Título da página", type: "textarea" },
      { name: "intro", label: "Introdução", type: "textarea" },
      { name: "positioningTitle", label: "Posicionamento — título", type: "text" },
      { name: "positioningText", label: "Posicionamento — texto", type: "textarea" },
      { name: "principles", label: "Princípios", type: "items", fields: stepFields },
      { name: "history", label: "História do escritório", type: "markdown", help: "Conte como e por que o escritório surgiu. Não é preciso citar números." },
      { name: "bioName", label: "Nome", type: "text" },
      { name: "bioRole", label: "Cargo / formação", type: "text", placeholder: "Ex.: Contador, sócio-fundador" },
      { name: "bio", label: "Apresentação de Bruno Freitas", type: "markdown" },
      { name: "photo", label: "Foto profissional", type: "image" },
      { name: "photoAlt", label: "Descrição da foto", type: "text" },
      { name: "mission", label: "Missão", type: "textarea" },
      { name: "vision", label: "Visão", type: "textarea" },
      { name: "values", label: "Valores", type: "items", fields: stepFields },
      { name: "philosophy", label: "Filosofia de atendimento", type: "markdown" },
      {
        name: "team",
        label: "Equipe e qualificações verificadas",
        type: "items",
        fields: [
          { name: "name", label: "Nome", type: "text" },
          { name: "role", label: "Função", type: "text" },
          { name: "qualification", label: "Qualificação verificada (formação, CRC)", type: "text" },
          { name: "photo", label: "Foto", type: "image" },
        ],
      },
    ],
    defaults: {
      title: "Bruno Freitas Contabilidade — contabilidade com *visão de futuro.*",
      intro:
        "Um escritório de contabilidade que une rigor técnico, proximidade e linguagem clara para que empreendedores tomem decisões com mais segurança.",
      positioningTitle: "Números claros *para decidir.*",
      positioningText:
        "Contabilidade e gestão financeira para empresas e organizações que querem enxergar os próprios números. A marca não vende imposto pago em dia: mostra para onde o dinheiro vai.",
      principles: [
        { title: "Clareza", text: "Dizer o essencial com poucas palavras e mostrar o número que importa." },
        { title: "Discrição", text: "Informar sem prometer. A sobriedade é parte da credibilidade." },
        { title: "Precisão", text: "Linhas, colunas e alinhamento de livro-caixa. Nada fora do lugar." },
      ],
      history: "",
      bioName: "Bruno Freitas",
      bioRole: "Contador · CRC RJ-141105/O-6",
      bio: "",
      photo: "",
      photoAlt: "Bruno Freitas, contador",
      mission: "",
      vision: "",
      values: [],
      philosophy:
        "Acreditamos que uma boa contabilidade começa por ouvir. Antes de propor qualquer serviço, buscamos entender o momento da empresa, a rotina de quem empreende e os objetivos para os próximos anos.\n\nA partir disso, organizamos as obrigações, explicamos os números com clareza e mantemos uma comunicação próxima, para que o cliente saiba o que está sendo feito e por quê.",
      team: [],
    },
  },
  {
    key: "seo",
    title: "SEO das páginas",
    description: "Metatítulo (até ~60 caracteres) e metadescrição (até ~155) de cada página fixa. Serviços, artigos e landing pages têm SEO próprio nas respectivas telas.",
    fields: [
      { name: "homeTitle", label: "Home — metatítulo", type: "text", recommended: 60 },
      { name: "homeDescription", label: "Home — metadescrição", type: "textarea", recommended: 155 },
      { name: "sobreTitle", label: "Sobre — metatítulo", type: "text", recommended: 60 },
      { name: "sobreDescription", label: "Sobre — metadescrição", type: "textarea", recommended: 155 },
      { name: "servicosTitle", label: "Serviços — metatítulo", type: "text", recommended: 60 },
      { name: "servicosDescription", label: "Serviços — metadescrição", type: "textarea", recommended: 155 },
      { name: "blogTitle", label: "Blog — metatítulo", type: "text", recommended: 60 },
      { name: "blogDescription", label: "Blog — metadescrição", type: "textarea", recommended: 155 },
      { name: "contatoTitle", label: "Contato — metatítulo", type: "text", recommended: 60 },
      { name: "contatoDescription", label: "Contato — metadescrição", type: "textarea", recommended: 155 },
      { name: "orcamentoTitle", label: "Orçamento — metatítulo", type: "text", recommended: 60 },
      { name: "orcamentoDescription", label: "Orçamento — metadescrição", type: "textarea", recommended: 155 },
      { name: "diagnosticoTitle", label: "Diagnóstico — metatítulo", type: "text", recommended: 60 },
      { name: "diagnosticoDescription", label: "Diagnóstico — metadescrição", type: "textarea", recommended: 155 },
    ],
    defaults: {
      homeTitle: "Bruno Freitas Contabilidade | Contabilidade estratégica para empresas",
      homeDescription:
        "Contabilidade consultiva para empreendedores e empresas: abertura, gestão fiscal, folha de pagamento, planejamento tributário e MEI. Fale com um contador.",
      sobreTitle: "Sobre nós | Bruno Freitas Contabilidade",
      sobreDescription: "Conheça a Bruno Freitas Contabilidade: atendimento próximo, clareza e organização para empresas que querem crescer.",
      servicosTitle: "Serviços contábeis para empresas e MEI | Bruno Freitas Contabilidade",
      servicosDescription:
        "Abertura de empresas, contabilidade empresarial, planejamento tributário, gestão fiscal, departamento pessoal, regularização, MEI e consultoria.",
      blogTitle: "Blog contábil | Bruno Freitas Contabilidade",
      blogDescription: "Artigos sobre impostos, MEI, abertura de empresas, gestão e obrigações contábeis, explicados em linguagem simples.",
      contatoTitle: "Contato | Bruno Freitas Contabilidade",
      contatoDescription: "Fale com a Bruno Freitas Contabilidade pelo WhatsApp, e-mail ou formulário e solicite uma proposta para sua empresa.",
      orcamentoTitle: "Solicitar orçamento de contabilidade | Bruno Freitas Contabilidade",
      orcamentoDescription: "Peça uma proposta de serviços contábeis para a sua empresa. Conte sua necessidade e receba retorno da nossa equipe.",
      diagnosticoTitle: "Diagnóstico contábil inicial | Bruno Freitas Contabilidade",
      diagnosticoDescription: "Solicite uma análise inicial da contabilidade da sua empresa e descubra pontos de organização e melhoria.",
    },
  },
  {
    key: "privacidade",
    title: "Política de Privacidade",
    description: "Texto da política (Markdown). Termos entre chaves duplas são substituídos pelos dados cadastrados. Revise com assessoria jurídica antes de publicar.",
    fields: [
      { name: "dpoName", label: "Encarregado de dados (nome)", type: "text" },
      { name: "dpoEmail", label: "E-mail para assuntos de privacidade", type: "email" },
      { name: "updatedAt", label: "Data da última atualização", type: "text", placeholder: "09/11/2026" },
      { name: "content", label: "Texto da política", type: "markdown" },
    ],
    defaults: { dpoName: "", dpoEmail: "contato@freitasmonteiro.com.br", updatedAt: "", content: PRIVACY_TEMPLATE },
  },
  {
    key: "integracoes",
    title: "Integrações e rastreamento",
    description: "Google Analytics 4, Search Console, Meta Pixel, e-mail de leads e webhook para CRM. Os scripts de rastreamento só carregam após o consentimento do visitante.",
    adminOnly: true,
    private: true,
    fields: [
      { name: "ga4Id", label: "ID de medição do Google Analytics 4", type: "text", placeholder: "G-XXXXXXXXXX" },
      { name: "gscVerification", label: "Código de verificação do Google Search Console", type: "text", help: "Somente o valor do atributo content da meta tag google-site-verification." },
      { name: "metaPixelId", label: "ID do Meta Pixel (opcional)", type: "text" },
      { name: "leadEmailTo", label: "E-mail que recebe os leads", type: "email", help: "Requer o envio de e-mail configurado na hospedagem (RESEND_API_KEY ou SMTP_*)." },
      { name: "webhookUrl", label: "Webhook de CRM / automação (opcional)", type: "url", help: "Cada lead é enviado em JSON (POST) para este endereço. Compatível com Make, Zapier, n8n, RD Station via integração, etc." },
      { name: "webhookSecret", label: "Segredo do webhook (opcional)", type: "text", help: "Enviado no cabeçalho X-Webhook-Secret para o destino validar a origem." },
    ],
    defaults: { ga4Id: "", gscVerification: "", metaPixelId: "", leadEmailTo: "bruno@freitasmonteiro.com.br", webhookUrl: "", webhookSecret: "" },
  },
];

export const GROUP_MAP = Object.fromEntries(GROUPS.map((g) => [g.key, g])) as Record<string, Group>;

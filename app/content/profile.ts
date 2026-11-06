// Conteúdo profissional centralizado. Fonte: currículo atualizado (nov/2026)
// e decisões registradas na direção criativa. Não incluir dados não confirmados.

export const profile = {
  name: "Mariana Barbalho",
  firstName: "Mariana",
  lastName: "Barbalho",
  role: "Analista de Dados",
  area: "Business Intelligence & Analytics",
  location: "São Paulo · Brasil",
  url: "https://maribarbalho.github.io/",
  summary:
    "Analista de Dados com experiência em meios de pagamento e serviços financeiros. Atuo de ponta a ponta, da extração e do tratamento dos dados à geração de insights, com dashboards, KPIs, ETL e automações que apoiam a tomada de decisão.",
  // Ferramentas e competências, agrupadas por área (faixa animada do Hero).
  stack: [
    { group: "Dados", items: ["SQL", "Python", "Power BI", "DAX", "Power Query", "Databricks"] },
    {
      group: "BI",
      items: ["Modelagem dimensional", "Esquema estrela", "KPIs", "Dashboards", "Storytelling com dados"],
    },
    { group: "Cloud & IA", items: ["AWS", "Azure", "Google Cloud", "Artificial Intelligence"] },
    { group: "Colaboração", items: ["Git", "GitHub", "GitLab", "Jira", "Confluence", "Scrum", "Kanban"] },
  ],
  contact: {
    email: "mariana_barbalho222@hotmail.com",
    linkedin: "https://www.linkedin.com/in/mariana-barbalho-619254202",
  },
  education: [
    { title: "Pós-graduação em Data Analytics", institution: "FIAP", year: 2025 },
    {
      title: "Análise e Desenvolvimento de Sistemas",
      institution: "Universidade São Judas Tadeu",
      year: 2023,
    },
  ],
} as const;

// Seção Sobre. Trechos entre {chaves} recebem o acento serifado.
export const about = {
  manifesto:
    "Começo pela {pergunta de negócio}. Depois vêm os dados: extraídos, tratados e modelados até responderem com clareza. O resultado é um indicador confiável, um dashboard que se lê de relance e uma análise que vira {decisão}.",
  trajectory:
    "Minha trajetória passa pela área comercial do agronegócio, na Corteva, pelo mercado financeiro, no Ouribank, e por meios de pagamento, na Cielo, onde também atuei próxima aos times de tecnologia, na Plataforma do Desenvolvedor. Essa combinação me dá repertório de negócio e base técnica para conduzir a análise de ponta a ponta.",
  pillars: [
    {
      n: "01",
      title: "Extrair",
      text: "Consultas SQL em bases relacionais, data warehouse e APIs. Os dados certos, da fonte certa.",
      tools: ["SQL", "Redshift", "APIs", "Python"],
    },
    {
      n: "02",
      title: "Modelar",
      text: "Tratamento e ETL, modelagem dimensional e medidas que mantêm os números consistentes em qualquer filtro.",
      tools: ["Power Query", "DAX", "Pandas", "Modelagem"],
    },
    {
      n: "03",
      title: "Comunicar",
      text: "Dashboards, KPIs e storytelling para que o indicador seja entendido e vire ação.",
      tools: ["Power BI", "Streamlit", "Plotly", "KPIs"],
    },
  ],
} as const;

export const navigation = [
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Formação", href: "#formacao" },
  { label: "Contato", href: "#contato" },
] as const;

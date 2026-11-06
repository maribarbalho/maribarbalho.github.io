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
  stack: ["SQL", "Python", "Power BI", "DAX", "Power Query", "AWS"],
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

export const navigation = [
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Formação", href: "#formacao" },
  { label: "Contato", href: "#contato" },
] as const;

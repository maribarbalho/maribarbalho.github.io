// Experiência profissional. Fontes: currículo (nov/2026) e decisões registradas
// na direção criativa (cargo da Cielo, tecnologias do portfólio anterior).

export type Job = {
  company: string;
  sector: string;
  role: string;
  start: string;
  end: string;
  /** Ano exibido no contador grande (desktop). */
  years: string;
  highlights: string[];
  tools: string[];
};

export const experience: Job[] = [
  {
    company: "Cielo",
    sector: "Meios de pagamento",
    role: "Analista de Dados",
    start: "fev 2025",
    end: "out 2026",
    years: "2025—26",
    highlights: [
      "Desenvolvimento de dashboards e análises de dados para apoio estratégico às equipes de tecnologia.",
      "Suporte e resolução de chamados da Plataforma do Desenvolvedor (Spotify Backstage), entendendo as necessidades de outros times.",
      "Evolução de soluções de backend, criação de templates e versionamento de código, em colaboração com times multidisciplinares.",
    ],
    tools: ["Power BI", "Databricks", "Python", "SQL", "Terraform", "AWS", "Azure", "Git"],
  },
  {
    company: "Ouribank",
    sector: "Serviços financeiros",
    role: "Analista de Dados",
    start: "mar 2024",
    end: "jan 2025",
    years: "2024—25",
    highlights: [
      "Extração e manipulação de informações das bases de dados com SQL.",
      "Desenvolvimento de dashboards para acompanhamento de operações e processos.",
      "Mapeamento, validação e documentação de métricas, além de análise exploratória de dados.",
    ],
    tools: ["SQL", "Redshift", "Power BI", "Excel", "SharePoint", "Dataiku"],
  },
  {
    company: "Corteva Agriscience",
    sector: "Agronegócio",
    role: "Estagiária · Área Comercial",
    start: "ago 2022",
    end: "dez 2023",
    years: "2022—23",
    highlights: [
      "Criação e atualização de dashboards e extração de relatórios para a área comercial.",
      "Acompanhamento de metas e do status do faturamento.",
      "Transferência de produtos e análise de dados de apoio às atividades do time.",
    ],
    tools: ["Power BI", "QlikView", "SAP", "Excel", "Canva"],
  },
];

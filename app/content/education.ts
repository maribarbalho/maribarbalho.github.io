// Formação e certificações. Fontes: currículo (nov/2026) e cursos do portfólio
// anterior confirmados pela Mariana (CyberSecurity, IA FIAP, Power Apps, HTML/CSS).
// Cursos sem carga horária confirmada ficam sem `hours`.

export type Degree = { level: string; title: string; institution: string; year?: string };
export type Course = { title: string; institution: string; hours?: number };

export const degrees: Degree[] = [
  { level: "Pós-graduação", title: "Data Analytics", institution: "FIAP", year: "2025" },
  {
    level: "Graduação",
    title: "Análise e Desenvolvimento de Sistemas",
    institution: "Universidade São Judas Tadeu",
    year: "2023",
  },
  {
    level: "Técnico",
    title: "Administração",
    institution: "Etec Prefeito Braz Paschoalin",
  },
];

export const courseGroups: { group: string; courses: Course[] }[] = [
  {
    group: "Dados & BI",
    courses: [
      { title: "Power BI", institution: "Senai", hours: 40 },
      { title: "Power BI e Análise de Dados com IA", institution: "Senai", hours: 40 },
      { title: "Implementação em Big Data", institution: "Senai", hours: 40 },
      { title: "Análise de Dados com Python Pandas", institution: "Universidade São Judas Tadeu", hours: 20 },
      { title: "Excel Avançado", institution: "Clarify", hours: 48 },
    ],
  },
  {
    group: "Programação",
    courses: [
      { title: "Programação em Python", institution: "Senai", hours: 60 },
      { title: "Python para Data Science", institution: "Senai", hours: 60 },
      { title: "Lógica de Programação", institution: "Senai", hours: 14 },
      { title: "HTML e CSS", institution: "Origamid" },
    ],
  },
  {
    group: "IA, Cloud & Segurança",
    courses: [
      { title: "Programação em IA Generativa", institution: "Senai", hours: 40 },
      { title: "Inteligência Artificial", institution: "FIAP" },
      { title: "Implantação de Serviços em Nuvem (AWS)", institution: "Senai", hours: 40 },
      { title: "CyberSecurity", institution: "Senai" },
    ],
  },
  {
    group: "Produto & Gestão",
    courses: [
      { title: "Design UX e UI", institution: "Senai", hours: 40 },
      { title: "Técnicas Avançadas do Scrum", institution: "LinkedIn Learning", hours: 3 },
      { title: "Marketing Digital com IA", institution: "Senai", hours: 30 },
      { title: "Power Apps", institution: "Hashtag Treinamentos" },
    ],
  },
];

export const languages = [{ name: "Inglês", level: "Intermediário" }];

// Projetos do portfólio. Fontes: READMEs dos repositórios, telas dos
// relatórios públicos do Power BI e o portfólio anterior.
// Regra: não inventar resultados. O que ainda não está documentado
// fica em `pending`, exibido no site como placeholder identificado.
//
// Este arquivo não importa imagens (é lido também pelo react-router.config.ts).
// As capturas ficam em app/assets/projects/<chave>-{800,1600}.webp.

export type Shot = { key: string; caption: string };
export type Kpi = { value: string; label: string };

export type Project = {
  slug: string;
  title: string;
  category: string;
  year?: string;
  tools: string[];
  /** Frase curta para o card. */
  teaser: string;
  /** Captura de capa (chave da imagem) ou null quando ainda não há captura. */
  cover: string | null;
  links: { powerbi?: string; github?: string; demo?: string };
  context?: string;
  questions?: string[];
  method?: string[];
  kpis?: { items: Kpi[]; note: string };
  shots?: Shot[];
  insights?: string[];
  challenges?: { title: string; text: string }[];
  /** Blocos ainda sem documentação, exibidos como placeholder. */
  pending?: string[];
  disclaimer?: string;
};

// Ordem de exibição no site (a ordem do array abaixo não importa).
const ORDER = [
  "logistics-performance-analytics",
  "dashboard-vendas-power-bi",
  "operacoes-de-credito",
  "analise-obesidade",
  "dashboard-rh",
  "dashboard-vendas-streamlit",
];

const all: Project[] = [
  {
    slug: "logistics-performance-analytics",
    title: "Logistics Performance Analytics",
    category: "Business Intelligence · Logística",
    tools: ["Power BI", "Power Query (M)", "DAX", "Modelagem dimensional"],
    teaser:
      "Dados de entregas, frota, produtos e atendimento integrados em um relatório de sete páginas para encontrar gargalos operacionais.",
    cover: "logistics-executiva",
    links: {
      powerbi:
        "https://app.powerbi.com/view?r=eyJrIjoiNDI4MjMzNGQtMTk0Mi00NjM4LWE2NzktNjdlYzI3NzYxMjMyIiwidCI6IjY1OWNlMmI4LTA3MTQtNDE5OC04YzM4LWRjOWI2MGFhYmI1NyJ9",
      github: "https://github.com/maribarbalho/logistics-performance-analytics",
    },
    context:
      "Em uma operação logística, informações sobre entregas, parceiros, veículos, custos, produtos e reclamações ficam espalhadas em várias fontes. O desafio foi organizar esses dados, construir indicadores consistentes e criar uma experiência de análise que ajudasse a identificar gargalos.",
    questions: [
      "Onde estão os principais atrasos e quais transportadoras merecem atenção?",
      "Como se distribuem os custos de abastecimento e manutenção da frota?",
      "Quais produtos e categorias concentram mais movimentações ou devoluções?",
      "Por que os clientes procuram o atendimento e como isso se relaciona com as avaliações?",
    ],
    method: [
      "Integração de fontes em CSV, Excel, JSON e XML.",
      "ETL no Power Query: tipagem, deduplicação, padronização e correção de escala dos valores monetários.",
      "Modelo dimensional com fatos e dimensões, com atenção a relacionamentos e granularidade.",
      "Medidas em DAX para taxas, médias, contagens distintas e contexto de filtro.",
      "Sete páginas: Home, Visão Executiva, Performance de Entregas, Rastreamento, Transportadoras & Frota, Produtos e Experiência do Cliente.",
    ],
    kpis: {
      items: [
        { value: "5.500", label: "Entregas únicas" },
        { value: "55,0%", label: "Pontualidade das entregas concluídas" },
        { value: "R$ 27,50 mi", label: "Frete total" },
        { value: "900", label: "Chamados de atendimento" },
        { value: "49,1%", label: "Taxa de avaliação do atendimento" },
        { value: "−46,4", label: "NPS dos atendimentos avaliados" },
      ],
      note: "Base simulada para fins de portfólio. A pontualidade considera 4.922 entregas concluídas e avaliáveis; o NPS considera apenas chamados com nota.",
    },
    shots: [
      { key: "logistics-executiva", caption: "Visão Executiva" },
      { key: "logistics-entregas", caption: "Performance de Entregas" },
      { key: "logistics-rastreamento", caption: "Rastreamento" },
      { key: "logistics-home", caption: "Home e navegação" },
    ],
    challenges: [
      {
        title: "Deduplicação e qualidade dos fretes",
        text: "A base de entregas tinha registros duplicados e diferenças de representação decimal. O tratamento no Power Query resultou em 5.500 entregas únicas e corrigiu a escala dos valores.",
      },
      {
        title: "Geolocalização do rastreamento",
        text: "As coordenadas foram convertidas para números decimais, e pontos geograficamente suspeitos foram sinalizados, preservando o dado original.",
      },
      {
        title: "Duplicidade gerada por JSON aninhado",
        text: "A expansão das interações do SAC repetia linhas e inflava a contagem de avaliações. A medida passou a contar IDs distintos com avaliação não nula.",
      },
    ],
    disclaimer: "Projeto educacional e de portfólio. Todos os dados, empresas e valores são fictícios.",
  },
  {
    slug: "dashboard-vendas-power-bi",
    title: "Visão Geral de Vendas",
    category: "Business Intelligence · Comercial",
    tools: ["Power BI", "DAX"],
    teaser:
      "Faturamento, volume, ticket médio e itens vendidos por período, grupo de produtos, gerente e equipe de vendas.",
    cover: "vendas",
    links: {
      powerbi:
        "https://app.powerbi.com/view?r=eyJrIjoiNzc2YzE3NWItY2NmZi00Y2MyLTk5OGYtMDE3MzQ3MmRlM2RhIiwidCI6Ijg5NmI3ZjkyLTgyZDItNDc3Ny1hYTQwLThiNjEyZWY2MWJmNCJ9",
    },
    method: [
      "Indicadores de faturamento, quantidade de vendas, ticket médio e itens vendidos.",
      "Filtros por ano, mês, grupo de produtos e canal da equipe de vendas (atacadistas, varejo e web).",
      "Matriz hierárquica por gerente e vendedor e comparativo de ticket médio por grupo de produtos.",
    ],
    shots: [{ key: "vendas", caption: "Visão geral de vendas" }],
    pending: ["Contexto e problema de negócio", "Origem dos dados", "Principais insights"],
  },
  {
    slug: "dashboard-rh",
    title: "Dashboard de RH",
    category: "People Analytics · Python",
    tools: ["Python", "Pandas", "Streamlit", "Plotly"],
    teaser:
      "Aplicação interativa sobre a força de trabalho: quem trabalha, quem saiu, quanto se paga e como a equipe está distribuída.",
    cover: null,
    links: { github: "https://github.com/maribarbalho/dashboard-rh" },
    context:
      "Análise da força de trabalho de uma empresa a partir de uma planilha de funcionários, tratada em Pandas antes de virar indicadores e gráficos interativos.",
    method: [
      "Conversão de datas e cálculo de idade, tempo de casa e status (ativo ou desligado).",
      "Extração de cidade e estado a partir do endereço com expressões regulares.",
      "Três abas: Overview (indicadores), Gráficos e Dados Tratados, com download em CSV.",
      "Mapa por estado, ativos x desligados, média salarial e tempo de casa por área, distribuição por gênero e nível e contratações por ano.",
    ],
    pending: ["Capturas de tela da aplicação", "Principais insights"],
  },
  {
    slug: "operacoes-de-credito",
    title: "Operações de Crédito",
    category: "Business Intelligence · Crédito",
    tools: ["Power BI", "DAX"],
    teaser:
      "Volume e quantidade de empréstimos por mês, linha de crédito, filial e cidade, com ticket médio e lojas ativas.",
    cover: "credito",
    links: {
      powerbi:
        "https://app.powerbi.com/view?r=eyJrIjoiM2UyZjBiMjctYmUyMS00YmUyLTg0YWEtMjRlMTJiODU1YTFkIiwidCI6Ijg5NmI3ZjkyLTgyZDItNDc3Ny1hYTQwLThiNjEyZWY2MWJmNCJ9",
    },
    method: [
      "Indicadores de valor emprestado, ticket médio, quantidade de empréstimos e lojas ativas.",
      "Evolução mensal de valor e quantidade, participação por linha de crédito (consignado, pessoal, cartão, adiantamento de IR) e ranking por filial.",
      "Mapa da quantidade de empréstimos por cidade e filtros por ano, mês e filial.",
    ],
    shots: [{ key: "credito", caption: "Painel de empréstimos" }],
    pending: ["Contexto e problema de negócio", "Origem dos dados", "Principais insights"],
  },
  {
    slug: "analise-obesidade",
    title: "Fatores Associados à Obesidade",
    category: "Analytics · Saúde",
    tools: ["Power BI"],
    teaser:
      "Análise de hábitos alimentares, estilo de vida e meio de transporte para apoiar decisões de uma equipe de saúde.",
    cover: "obesidade-overview",
    links: {
      powerbi:
        "https://app.powerbi.com/view?r=eyJrIjoiZTZjMmQ3NWEtY2IwZC00M2QyLWI0OGItMTczMTk0NTc2ZGNjIiwidCI6Ijg5NmI3ZjkyLTgyZDItNDc3Ny1hYTQwLThiNjEyZWY2MWJmNCJ9",
    },
    context:
      "Painel que relaciona hábitos alimentares e comportamentais ao peso, para identificar pontos críticos de intervenção médica e educacional.",
    insights: [
      "Mais de 80% dos participantes não têm histórico familiar de obesidade, o que sugere forte influência dos hábitos de vida.",
      "Quem consome alimentos calóricos com frequência apresenta peso maior.",
      "A prática regular de atividade física está associada a menor peso médio.",
      "Quem se locomove a pé ou de bicicleta apresentou peso médio até 16 kg menor do que quem usa carro ou moto.",
    ],
    shots: [
      { key: "obesidade-overview", caption: "Overview" },
      { key: "obesidade-habitos", caption: "Hábitos alimentares" },
      { key: "obesidade-insights", caption: "Principais insights" },
    ],
    pending: ["Origem dos dados", "Metodologia da análise"],
  },
  {
    slug: "dashboard-vendas-streamlit",
    title: "Vendas via API",
    category: "Analytics · Python",
    tools: ["Python", "Pandas", "Streamlit", "Plotly", "Requests"],
    teaser:
      "Dashboard alimentado por uma API: receita e quantidade por estado, mês, categoria e vendedor, com filtros e exportação.",
    cover: null,
    links: { github: "https://github.com/maribarbalho/dashboard_vendas" },
    context:
      "Aplicação que consome dados de vendas de uma API pública fictícia e oferece duas visões: um dashboard de desempenho e uma área de dados brutos para explorar e exportar.",
    method: [
      "Consumo da API com Requests e tratamento em Pandas.",
      "Filtros por região, ano e vendedores; receita e quantidade por estado, mês, categoria e vendedor.",
      "Área de dados brutos com filtros avançados, seleção de colunas e exportação em CSV.",
    ],
    pending: ["Capturas de tela da aplicação", "Principais insights"],
  },
];

export const projects: Project[] = ORDER.map((slug) => {
  const p = all.find((x) => x.slug === slug);
  if (!p) throw new Error(`Projeto "${slug}" listado em ORDER não existe.`);
  return p;
});

export const projectSlugs = projects.map((p) => p.slug);

export const getProject = (slug: string | undefined) => projects.find((p) => p.slug === slug);

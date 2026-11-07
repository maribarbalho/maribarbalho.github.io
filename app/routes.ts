import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("projetos/:slug", "routes/project.tsx"),
] satisfies RouteConfig;

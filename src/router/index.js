import { createRouter, createWebHashHistory } from "vue-router";
import InicioView from "@/views/InicioView.vue";
import FilmesView from "@/views/FilmesView.vue";

// A tabela de rotas: para cada URL, que view mostrar
const routes = [
  { path: "/", name: "inicio", component: InicioView },
  { path: "/filmes", name: "filmes", component: FilmesView },

  // Rota dinâmica: /filme/550, /filme/27205...
  {
    path: "/filme/:id",
    name: "filme",
    component: () => import("@/views/FilmeView.vue"),
  },
  {
    path: "/favoritos",
    name: "favoritos",
    component: () => import("@/views/FavoritosView.vue"),
  },

  // Apanha-tudo (404): fica sempre no fim
  {
    path: "/:caminho(.*)*",
    name: "nao-encontrada",
    component: () => import("@/views/NaoEncontradaView.vue"),
  },
];

export default createRouter({
  // Hash history: funciona no GitHub Pages sem o "F5 que dá 404"
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  // Ao mudar de página, volta ao topo
  scrollBehavior() {
    return { top: 0 };
  },
});
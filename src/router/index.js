import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

import Home from "@/views/Home";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ranks',
    name: 'RaceRank',
    component: () => import(/* webpackChunkName: "rr" */ '../views/RaceRank.vue')
  },
  {
    path: '/distn',
    name: 'Percentages',
    component: () => import(/* webpackChunkName: "dt" */ '../views/Percentages.vue')
  },
  {
    path: '/calcs',
    name: 'Calcs',
    component: () => import(/* webpackChunkName: "cl" */ '../views/Calcs.vue')
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "pf" */ '../views/Profile.vue')
  }
  ]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
import Vue from 'vue';
import VueRouter from 'vue-router';
import Books from "../views/Books";
import Book from "../views/Book";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Books',
    component: Books
  },
  {
    path: "/book/:id",
    name: "Book",
    component: Book
  }
];

const router = new VueRouter({
  mode: 'history',
  base: '/reader',
  routes
})

export default router

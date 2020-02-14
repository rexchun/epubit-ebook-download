<template>
  <div>
    <ul>
      <li v-for="book in books.data" :key="book.name">
        <router-link :to="`/book/${book.id}`">{{book.name}}</router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import { getBooksDir } from "../services/api";
export default {
  data() {
    return {
      books: {
        data: []
      }
    };
  },
  mounted() {
    this.loadBooks();
  },
  methods: {
    loadBooks() {
      getBooksDir().then(books => (this.books.data = books));
    }
  }
};
</script>
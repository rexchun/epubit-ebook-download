<template>
  <div class="books-list">
    <h3>书籍列表</h3>
    <ol>
      <book-item v-for="book in books.data" :key="book.id" :book-id="book.id" />
    </ol>
  </div>
</template>
<script>
import { getBooksDir } from "../services/api";
import BookItem from "../components/BookItem";
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
  },
  components: {
    "book-item": BookItem
  }
};
</script>
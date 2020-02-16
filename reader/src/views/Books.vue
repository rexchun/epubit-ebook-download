<template>
  <div class="books-list">
    <template v-if="books.recent.length">
      <h3>最近阅读</h3>
      <ol>
        <book-item v-for="book in books.recent" :key="book.bookId" :book-id="book.bookId" />
      </ol>
    </template>
    <h3>书籍列表</h3>
    <ol>
      <book-item v-for="book in books.data" :key="book.id" :book-id="book.id" />
    </ol>
  </div>
</template>
<script>
import { getBooksDir, getRecentBooks } from "../services/api";
import BookItem from "../components/BookItem";
export default {
  data() {
    return {
      books: {
        data: [],
        recent: []
      }
    };
  },
  mounted() {
    this.loadBooks();
    this.loadRecentBooks();
  },
  methods: {
    loadBooks() {
      getBooksDir().then(books => (this.books.data = books));
    },
    loadRecentBooks() {
      getRecentBooks().then(data => (this.books.recent = data));
    }
  },
  components: {
    "book-item": BookItem
  }
};
</script>
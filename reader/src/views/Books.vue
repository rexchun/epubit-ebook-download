<template>
  <div class="books-list">
    <template v-if="books.recent.length">
      <h3>最近阅读</h3>
      <div class="input-group input-group-sm" style="width: 120px; margin-left: 1em;">
        <div class="input-group-addon">显示数量</div>
        <input type="number" placeholder="数量" class="form-control" v-model="vm.recentBooksCount" />
      </div>
      <ol>
        <li v-for="book in books.recent" :key="book.bookId">
          <book-item :book-id="book.bookId" />
          ( {{book.chapterName}} )
        </li>
      </ol>
    </template>
    <h3>书籍列表</h3>
    <ol>
      <li v-for="book in books.data" :key="book.id">
        <book-item :book-id="book.id" />
      </li>
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
      },
      vm: {
        recentBooksCount: localStorage.getItem("/books/recent-count") || 5
      }
    };
  },
  mounted() {
    this.loadBooks();
  },
  methods: {
    loadBooks() {
      getBooksDir().then(books => (this.books.data = books));
    },
    loadRecentBooks() {
      getRecentBooks(this.vm.recentBooksCount).then(
        data => (this.books.recent = data)
      );
    }
  },
  watch: {
    "vm.recentBooksCount": {
      handler() {
        this.loadRecentBooks();
        localStorage.setItem("/books/recent-count", this.vm.recentBooksCount);
      },
      immediate: true
    }
  },
  components: {
    "book-item": BookItem
  }
};
</script>
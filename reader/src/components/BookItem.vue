<template>
  <li>
    <router-link :to="`/book/${bookId}`">{{book.ubookName || bookId}} - {{book.nickName}}</router-link>
  </li>
</template>
<script>
import { getBookInfo } from "../services/api";
export default {
  props: {
    bookId: {
      required: true
    }
  },
  data() {
    return { book: {} };
  },
  mounted() {
    getBookInfo(this.bookId).then(response => {
      if (response && response.data && response.data.ubookName) {
        this.book = response.data;
      }
    });
  }
};
</script>
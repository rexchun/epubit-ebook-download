<template>
  <div>
    <content-item v-for="item in data.contents" :content="item" :key="item.id" />
  </div>
</template>
<script>
import { getChapterContent } from "../services/api";
import ContentItem from "./ContentItem";
export default {
  props: {
    bookId: {
      required: true
    },
    category: {
      required: true
    }
  },
  data() {
    return {
      data: {
        contents: []
      }
    };
  },
  methods: {
    loadContent() {
      getChapterContent(this.bookId, this.category.id).then(
        response => (this.data.contents = response.data.contents)
      );
    }
  },
  watch: {
    "category.id": {
      handler() {
        this.loadContent();
      },
      immediate: true
    }
  },
  components: {
    "content-item": ContentItem
  }
};
</script>
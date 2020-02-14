<template>
  <!-- 章节内容 -->
  <div>
    <content-item v-for="item in data.contents" :content="item" :key="item.id" />
  </div>
</template>
<script>
import { getChapterContent } from "../services/api";
import ContentItem from "./ContentItem";
import { SharedInfo } from "../services/store";
export default {
  props: {
    bookId: {
      required: true
    }
  },
  data() {
    return {
      data: {
        contents: []
      },
      shared: SharedInfo
    };
  },
  methods: {
    loadContent() {
      getChapterContent(this.bookId, this.shared.category.selected.id).then(
        response => (this.data.contents = response.data.contents)
      );
    }
  },
  watch: {
    "shared.category.selected.id": {
      handler(newVal) {
        if (newVal) {
          this.loadContent();
        }
      },
      immediate: true
    }
  },
  components: {
    "content-item": ContentItem
  }
};
</script>
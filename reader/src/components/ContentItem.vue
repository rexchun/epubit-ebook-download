<template>
  <div>
    <div v-if="content.type === 'singleImg'">
      <img
        v-for="img in content.showUrls"
        :key="img.key"
        :src="`${booksRootDir}${content.projectId}/res/${img.key}`"
      />
    </div>
    <div v-if="content.type === 'editor'" v-html="content.editingContent"></div>
  </div>
</template>
<script>
import { BOOKS_ROOT_DIR } from "../services/api";
export default {
  props: {
    content: {
      required: true
    }
  },
  data() {
    return {
      booksRootDir: BOOKS_ROOT_DIR
    };
  }
};
</script>
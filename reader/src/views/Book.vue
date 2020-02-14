<template>
  <div class="container-fluid">
    <div class="col-sm-3">
      <ul class="book-category overscroll" :style="`height: ${styles.winHeight}px`">
        <table-contents
          v-for="category in data.categoryTree"
          :category="category"
          :key="category.id"
        />
      </ul>
    </div>
    <div class="col-sm-9 overscroll" :style="`height: ${styles.winHeight}px`">
      <chapter-content
        v-if="shared.category.selected"
        :book-id="bookId"
        :key="shared.category.selected.id"
      />
    </div>
  </div>
</template>
<script>
import { getBookCategoryTree } from "../services/api";
import TableContents from "../components/TableContents";
import ChapterContent from "../components/ChapterContent";
import { SharedInfo } from "../services/store";

export default {
  data() {
    return {
      bookId: this.$route.params.id,
      data: {
        categoryTree: []
      },
      styles: {
        winHeight: window.innerHeight
      },
      shared: SharedInfo
    };
  },
  mounted() {
    this.loadCategoryTree();
  },
  methods: {
    loadCategoryTree() {
      getBookCategoryTree(this.bookId).then(response => {
        response.data.forEach(item => this.attachData(item));
        this.data.categoryTree = response.data;
      });
    },
    setHeight() {
      window.addEventListener("resize", () => {
        this.styles.winHeight = window.innerHeight - 10;
      });
    },
    attachData(tree) {
      if (tree && tree.id) {
        tree.selected = false;
        if (tree.children && tree.children.length) {
          tree.children.forEach(child => this.attachData(child));
        }
      }
    }
  },
  components: {
    "table-contents": TableContents,
    "chapter-content": ChapterContent
  }
};
</script>
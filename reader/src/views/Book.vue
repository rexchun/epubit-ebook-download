<template>
  <div class="container-fluid">
    <div class="col-sm-3">
      <ul class="book-category overscroll" :style="`height: ${styles.winHeight}px`">
        <category
          v-for="category in data.categoryTree"
          :category="category"
          :key="category.id"
          @select-category="onSelectCategory"
        />
      </ul>
    </div>
    <div class="col-sm-9 overscroll" :style="`height: ${styles.winHeight}px`">
      <chapter-content
        v-if="data.selectedCategory"
        :book-id="bookId"
        :category="data.selectedCategory"
        :key="data.selectedCategory.id"
      />
    </div>
  </div>
</template>
<script>
import { getBookCategoryTree } from "../services/api";
import Category from "../components/Category";
import ChapterContent from "../components/ChapterContent";

export default {
  data() {
    return {
      bookId: this.$route.params.id,
      data: {
        categoryTree: [],
        selectedCategory: null
      },
      styles: {
        winHeight: window.innerHeight
      }
    };
  },
  mounted() {
    this.loadCategoryTree();
  },
  methods: {
    loadCategoryTree() {
      getBookCategoryTree(this.bookId).then(
        response => (this.data.categoryTree = response.data)
      );
    },
    onSelectCategory(category) {
      this.data.selectedCategory = category;
    },
    setHeight() {
      window.addEventListener("resize", () => {
        this.styles.winHeight = window.innerHeight - 10;
      });
    }
  },
  components: {
    category: Category,
    "chapter-content": ChapterContent
  }
};
</script>
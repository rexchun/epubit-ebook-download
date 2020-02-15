<template>
  <div class="container-fluid">
    <div class="functions">
      <ul>
        <li>
          <router-link to="/" class="btn btn-xs btn-primary" @click="toggleToC">首页</router-link>
        </li>
        <li>
          <button class="btn btn-xs btn-primary" @click="toggleToC">目录</button>
        </li>
        <li>
          <button class="btn btn-xs btn-primary" @click="prevChapter">上一节</button>
        </li>
        <li>
          <button class="btn btn-xs btn-primary" @click="nextChapter">下一节</button>
        </li>
      </ul>
    </div>
    <div
      class="table-of-contencts overscroll"
      :style="`height: ${styles.winHeight - 30}px`"
      v-show="shared.category.showToC"
    >
      <ul class="book-category">
        <table-contents
          v-for="category in data.categoryTree"
          :category="category"
          :key="category.id"
        />
      </ul>
    </div>
    <div class="col-sm-12 chapter-content" @click="toggleToC(false)">
      <chapter-content
        v-if="shared.category.selected"
        :book-id="bookId"
        :key="shared.category.selected.id"
      />
    </div>
  </div>
</template>
<script>
import { getBookCategoryTree, iterableTree } from "../services/api";
import TableContents from "../components/TableContents";
import ChapterContent from "../components/ChapterContent";
import { SharedInfo } from "../services/store";

export default {
  data() {
    return {
      bookId: this.$route.params.id,
      data: {
        categoryTree: [],
        flattedCategory: []
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
        this.data.flattedCategory = [];
        iterableTree({ children: response.data }, item => {
          item.selected = false;
          this.data.flattedCategory.push(item);
        });
        this.data.categoryTree = response.data;
        this.shared.category.selected = this.data.categoryTree[0];
      });
    },
    setHeight() {
      window.addEventListener("resize", () => {
        this.styles.winHeight = window.innerHeight - 10;
      });
    },
    toggleToC(val) {
      if (typeof val === "boolean") {
        this.shared.category.showToC = val;
      } else {
        this.shared.category.showToC = !this.shared.category.showToC;
      }
    },
    prevChapter() {
      let current = this.shared.category.selected;
      const index = this.data.flattedCategory.indexOf(current);
      if (index <= 1) {
        return;
      }
      this.shared.category.selected = this.data.flattedCategory[index - 1];
    },
    nextChapter() {
      let current = this.shared.category.selected;
      const index = this.data.flattedCategory.indexOf(current);
      if (index === this.data.flattedCategory.length) {
        return;
      }
      this.shared.category.selected = this.data.flattedCategory[index + 1];
    }
  },
  components: {
    "table-contents": TableContents,
    "chapter-content": ChapterContent
  }
};
</script>
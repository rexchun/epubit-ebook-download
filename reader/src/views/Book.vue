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
      :style="`max-height: ${styles.winHeight - 30}px`"
      v-show="shared.category.showToC"
    >
      <ul class="book-category">
        <table-contents
          v-for="category in data.categoryRootTree.children"
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
        categoryRootTree: {
          children: []
        },
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
        this.data.categoryRootTree.children = response.data;
        this.initReadProgress();
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
      this.saveReadProgress(this.shared.category.selected.id);
    },
    nextChapter() {
      let current = this.shared.category.selected;
      const index = this.data.flattedCategory.indexOf(current);
      if (index === this.data.flattedCategory.length) {
        return;
      }
      this.shared.category.selected = this.data.flattedCategory[index + 1];
      this.saveReadProgress(this.shared.category.selected.id);
    },
    initReadProgress() {
      const localData = JSON.parse(localStorage.getItem(this.bookId) || "{}");
      if (!localData.progress) {
        this.shared.category.selected = this.data.categoryRootTree.children[0];
        return;
      }
      iterableTree(this.data.categoryRootTree, item => {
        if (item.id === localData.progress) {
          this.shared.category.selected = item;
        }
      });
    },
    saveReadProgress(id) {
      localStorage.setItem(
        this.bookId,
        JSON.stringify({
          progress: id
        })
      );
    }
  },
  components: {
    "table-contents": TableContents,
    "chapter-content": ChapterContent
  }
};
</script>
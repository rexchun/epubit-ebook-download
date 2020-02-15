<template>
  <!-- 目录 -->
  <li :data-index="category.index" :class="{selected: shared.category.selected.id === category.id}">
    <div @click="toggleExpand(category)">{{category.name}}</div>
    <ul v-if="category.children.length" v-show="status.expand">
      <table-contents
        v-for="child in category.children"
        :category="child"
        :key="child.id"
      />
    </ul>
  </li>
</template>
<script>
import { SharedInfo } from "../services/store";
export default {
  name: "table-contents",
  props: {
    category: {
      required: true
    }
  },
  data() {
    return {
      status: {
        expand: false
      },
      shared: SharedInfo
    };
  },
  methods: {
    toggleExpand(category) {
      this.status.expand = !this.status.expand;
      this.onSelectCategory(category);
    },
    onSelectCategory(category) {
      this.shared.category.selected = category;
    }
  }
};
</script>
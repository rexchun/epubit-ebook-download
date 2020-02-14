<template>
  <li :data-index="category.index">
    <div @click="toggleExpand(category)">{{category.name}}</div>
    <ul
      v-if="category.children.length"
      v-show="status.expand"
    ><category v-for="child in category.children" :category="child" :key="child.id" @select-category="onSelectCategory" /></ul>
  </li>
</template>
<script>
export default {
  name: "category",
  props: {
    category: {
      required: true
    }
  },
  data() {
    return {
      status: {
        expand: false
      }
    };
  },
  methods: {
    toggleExpand(category) {
      this.status.expand = !this.status.expand;
      this.onSelectCategory(category);
    },
    onSelectCategory(category) {
      this.$emit("select-category", category);
    }
  },
  components: {}
};
</script>
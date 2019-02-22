<template>
  <Canvas></Canvas>
</template>

<script>
import Canvas from "@/components/Canvas";

export default {
  name: "Home",
  components: {
    Canvas
  },
  mounted() {
    document.title = this.$store.state.layout.layout_name
      ? this.$store.state.layout.layout_name + " - Table Manager V2"
      : "Table Manager V2";
  }
};
</script>

<style scoped></style>

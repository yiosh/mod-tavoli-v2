<template>
  <v-layout>
    <v-toolbar dark color="#424242">
      <v-toolbar-title>Canvas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="handleClick('create-table')">
        <i class="fas fa-plus-circle icon-margin"></i>
        Add New Table
      </v-btn>
      <v-divider vertical></v-divider>

      <v-btn flat @click="handleClick('edit-table')">
        <i class="far fa-edit icon-margin"></i>
        Edit Table
      </v-btn>
    </v-toolbar>
    <CreateTableForm></CreateTableForm>
    <EditTableForm></EditTableForm>
  </v-layout>
</template>

<script>
import CreateTableForm from "./CreateTableForm";
import EditTableForm from "./EditTableForm";
import { EventBus } from "../event-bus.js";

export default {
  name: "Toolbar",
  components: {
    CreateTableForm,
    EditTableForm
  },
  methods: {
    handleClick(payload) {
      switch (payload) {
        case "create-table":
          EventBus.$emit("create-table-select");
          break;
        case "edit-table":
          EventBus.$emit("edit-table-select");
          break;
      }
    }
  },
  created() {
    EventBus.$on("table-select", group => {
      let guests = this.$store.state.guests;
      let id = group.attrs.table.id;

      this.guests = _.filter(guests, element => {
        return element.table_id == id;
      });
    });
  }
};
</script>

<style scoped>
.icon-margin {
  margin-right: 0.4em;
}
</style>

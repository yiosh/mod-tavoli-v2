<template>
  <v-layout>
    <v-toolbar dark color="#424242">
      <v-toolbar-title>{{ layoutName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="handleClick('create-table')">
        <i class="fas fa-plus-circle icon-margin"></i>
        Aggiungi Tavolo
      </v-btn>
      <v-divider v-if="selectedGroup != null" vertical></v-divider>

      <v-btn
        v-if="selectedGroup != null"
        flat
        ref="edit-table"
        @click="handleClick('edit-table')"
      >
        <i class="far fa-edit icon-margin"></i>
        Modifica Tavolo
      </v-btn>
    </v-toolbar>
    <CreateTableForm></CreateTableForm>
    <EditTableForm></EditTableForm>
    <v-snackbar v-model="snackbar" top color="warning" :timeout="6000">
      {{ snackbarMessage }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
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
  data: () => ({
    selectedGroup: null,
    snackbar: false,
    snackbarMessage: null
  }),
  computed: {
    layoutName() {
      return this.$store.state.layout.name;
    }
  },
  methods: {
    handleClick(payload) {
      switch (payload) {
        case "create-table":
          EventBus.$emit("create-table-select");
          break;
        case "edit-table":
          if (this.selectedGroup) {
            EventBus.$emit("edit-table-select");
          } else {
            this.snackbarMessage = "Please select a table to edit";
            this.snackbar = true;
          }
          break;
      }
    }
  },
  created() {
    EventBus.$on("table-select", group => {
      this.selectedGroup = group;
    });

    EventBus.$on("table-unselect", () => {
      this.selectedGroup = null;
    });

    EventBus.$on("edit-table-dblclick", () => {
      EventBus.$emit("edit-table-select");
    });
  }
};
</script>

<style scoped>
.icon-margin {
  margin-right: 0.4em;
}
</style>

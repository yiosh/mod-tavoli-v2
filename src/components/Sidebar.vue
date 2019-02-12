<template>
  <v-layout column wrap>
    <CreateTableForm></CreateTableForm>
    <v-spacer></v-spacer>
    <TableSelector></TableSelector>
  </v-layout>
</template>

<script>
import CreateTableForm from "./CreateTableForm";
import TableSelector from "./TableSelector";

export default {
  name: "Sidebar",
  components: {
    CreateTableForm,
    TableSelector
  }
};
</script>

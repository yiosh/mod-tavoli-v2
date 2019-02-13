<template>
  <v-layout column wrap>
    <CreateTableForm></CreateTableForm>
    <v-spacer></v-spacer>
    <GuestList></GuestList>
    <PrintCanvas></PrintCanvas>
    <TableSelector></TableSelector>
  </v-layout>
</template>

<script>
import CreateTableForm from "./CreateTableForm";
import TableSelector from "./TableSelector";
import GuestList from "./GuestList";
import PrintCanvas from "./PrintCanvas";

export default {
  name: "Sidebar",
  components: {
    CreateTableForm,
    TableSelector,
    GuestList,
    PrintCanvas
  }
};
</script>

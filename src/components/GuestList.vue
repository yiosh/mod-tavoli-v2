<template>
  <v-layout row justify-center>
    <v-dialog :value="dialog">
      <v-btn slot="activator" color="primary" dark>Open Guest List</v-btn>
      <v-card>
        <v-card-title>Guest List</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-data-table :headers="headers" :items="guests">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.nome }}</td>
              <td>{{ props.item.cognome }}</td>
              <td>{{ props.item.peoples }}</td>
              <td>{{ props.item.baby }}</td>
              <td>{{ props.item.chairs_only }}</td>
              <td>{{ props.item.high_chair }}</td>
              <td>{{ props.item.note_intolleranze }}</td>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="dialog = false"
            >Close</v-btn
          >
          <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { EventBus } from "../event-bus.js";
import _ from "lodash";

export default {
  name: "GuestList",
  data() {
    return {
      dialog: false,
      dialogm1: "",
      headers: [
        { text: "Nome", value: "nome" },
        { text: "Cognome", value: "cognome" },
        { text: "People", value: "peoples" },
        { text: "Babies", value: "baby" },
        { text: "Chairs", value: "chairs_only" },
        { text: "Highchairs", value: "high_chair" },
        { text: "Note", value: "note_intolleranze" }
      ],
      guests: []
    };
  },
  computed: {
    // dialog() {
    //   return this.$store.getters.GET_DIALOG;
    // }
  },
  methods: {},
  created() {
    EventBus.$on("table-select", id => {
      let guests = this.$store.state.guests;

      this.guests = _.filter(guests, element => {
        return element.table_id == id;
      });
    });
  }
};
</script>

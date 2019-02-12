<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Condivision Cloud/</span>
        <span class="font-weight-light">{{ layout.name }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>-->
    </v-toolbar>

    <v-content>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 md9 justify-center>
            <Canvas></Canvas>
          </v-flex>

          <v-spacer></v-spacer>

          <v-flex xs12 md3>
            <Sidebar></Sidebar>
            <GuestList></GuestList>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import GuestList from "./components/GuestList";
import axios from "axios";
import { mapState } from "vuex";
import { EventBus } from "./event-bus.js";

export default {
  name: "App",
  components: {
    Canvas,
    Sidebar,
    GuestList
  },
  data: () => ({
    title: null
    // dialog: false
  }),
  computed: mapState(["layout"]),
  methods: {
    // dialogClick() {
    //   EventBus.$emit("button-click", !this.dialog);
    // },
    fetchLayout() {
      axios
        .get(
          "https://demo.condivision.cloud/fl_api/tables-v1/?get_tables_board&token=1&board_id=2"
        )
        .then(response => {
          this.$store.dispatch("SET_LAYOUT", response.data.dati[0]);
          // handle success

          console.log(response);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    fetchGuests() {
      axios
        .get(
          "https://demo.condivision.cloud/fl_api/tables-v1/?get_guests&token=1&table_id=2"
        )
        .then(response => {
          this.$store.dispatch("SET_GUESTS", response.data.dati);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }
  },
  created() {
    this.fetchLayout();
    this.fetchGuests();
  }
};
</script>

<style scoped></style>

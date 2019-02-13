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
      <!-- <v-container fluid fill-height grid-list-md> -->
      <div class="main-container">
        <v-layout row wrap>
          <v-flex xs12 sm8 md8 lg8>
            <Canvas></Canvas>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12 sm4 md4 lg4>
            <Sidebar></Sidebar>

            <!-- <v-btn @click="printCanvas">Print</v-btn> -->
          </v-flex>
        </v-layout>
      </div>
      <!-- </v-container> -->
    </v-content>
  </v-app>
</template>

<script>
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import { mapState } from "vuex";
import { EventBus } from "./event-bus.js";

export default {
  name: "App",
  components: {
    Canvas,
    Sidebar
  },
  data: () => ({
    title: null
    // dialog: false
  }),
  computed: mapState(["layout"]),
  methods: {
    downloadURI(uri, name) {
      let link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    printCanvas() {
      let dataURL = this.$store.state.stage.toDataURL({ pixelRatio: 3 });
      this.downloadURI(dataURL, "stage.png");
    },
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

<style scoped>
.main-container {
  display: grid;
  margin: 1em;
}
</style>

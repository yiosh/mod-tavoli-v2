<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Condivision Cloud/</span>
        <span class="font-weight-light">{{ layout.name }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <!-- <v-container fluid fill-height grid-list-md> -->
      <div class="main-container">
        <v-layout row wrap justify-center>
          <v-flex xs12 align-self-center>
            <Canvas></Canvas>
          </v-flex>
        </v-layout>
      </div>
      <!-- </v-container> -->
    </v-content>
    <Sidebar></Sidebar>
  </v-app>
</template>

<script>
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import { EventBus } from "./event-bus.js";
import axios from "axios";

export default {
  name: "App",
  components: {
    Canvas,
    Sidebar
  },
  data: () => ({
    title: null
  }),
  methods: {
    handleDrawer() {
      EventBus.$emit("handle-drawer");
    },
    fetchLayout() {
      axios
        .get(
          "https://demo.condivision.cloud/fl_api/tables-v1/?get_tables_board&token=1&board_id=2"
        )
        .then(response => {
          // handle success
          this.$store.dispatch("SET_LAYOUT", response.data.dati[0]);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    fetchTableTypes() {
      axios
        .get(
          "https://demo.condivision.cloud/fl_api/tables-v1/?get_table_types&token=1"
        )
        .then(response => {
          let tableTypes = [];
          for (let index = 1; index < response.data.dati.length; index++) {
            tableTypes.push(response.data.dati[index]);
          }
          EventBus.$emit("fetch-table-types", tableTypes);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    fetchTables() {
      axios
        .get(
          "https://demo.condivision.cloud/fl_api/tables-v1/?get_tables&token=1&board_id=2"
        )
        .then(response => {
          this.$store.dispatch("SET_TABLES_FETCHED", response.data.dati);
          EventBus.$emit("fetch-tables");
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    fetchGuests() {
      axios
        .get(
          "https://demo.condivision.cloud/fl_api/tables-v1/?get_guests&token=1&table_id=1"
        )
        .then(response => {
          // handle success
          this.$store.dispatch("SET_GUESTS", response.data.dati);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }
  },
  computed: {
    layout() {
      return this.$store.state.layout;
    }
  },
  created() {
    this.fetchLayout();
    this.fetchTableTypes();
    this.fetchTables();
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

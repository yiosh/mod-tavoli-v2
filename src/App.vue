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
        <v-layout row wrap justify-center align-content-center>
          <v-flex xs4 align-self-center>
            <v-progress-linear
              v-if="loadingVal != 100"
              background-color="success lighten-3"
              color="success lighten-1"
              :value="loadingVal"
            ></v-progress-linear>
          </v-flex>
          <v-flex xs12 align-self-center>
            <Canvas v-show="loadingVal == 100"></Canvas>
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
    title: null,
    loading: true,
    loadingVal: 0
  }),
  methods: {
    handleDrawer() {
      EventBus.$emit("handle-drawer");
    },
    fetchLayout(layoutId) {
      axios
        .get(
          `https://demo.condivision.cloud/fl_api/tables-v1/?get_tables_board&token=1&board_id=${layoutId}`
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
          console.log("table types", tableTypes);
          this.$store.dispatch("SET_TABLE_TYPES_FETCHED", tableTypes);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    fetchTables(layoutId) {
      axios
        .get(
          `https://demo.condivision.cloud/fl_api/tables-v1/?get_tables&token=1&board_id=${layoutId}`
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
    },
    getQueryVariable(variable) {
      let query = window.location.search.substring(1);
      let vars = query.split("&");
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    }
  },
  computed: {
    layout() {
      return this.$store.state.layout;
    }
  },
  created() {
    const layoutId = this.getQueryVariable("layout_id");
    if (!layoutId) {
      alert('Please add a "layout_id paramenter!"');
    } else {
      this.fetchLayout(layoutId);
      this.fetchTableTypes();
      this.fetchTables(layoutId);
      this.fetchGuests();

      EventBus.$on("loading", percent => {
        this.loadingVal = percent;
      });

      if (this.loadingVal == 100) {
        this.loading = false;
      }
      // this.loading = false;
    }
  }
};
</script>

<style scoped>
.main-container {
  display: grid;
  margin: 1em;
}
</style>

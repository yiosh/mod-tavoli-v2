<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout fill-height>
        <v-flex class="text-xs-center" align-self-center>
          <v-progress-circular
            v-show="loading == true"
            align-self-center
            style="margin: auto"
            :size="70"
            :width="7"
            color="blue"
            indeterminate
          ></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
    <template>
      <v-toolbar v-show="loading == false" app>
        <v-toolbar-title class="headline text-uppercase">
          <span>Condivision Cloud Beta</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-content v-show="loading == false">
        <!-- <v-container fluid fill-height grid-list-md> -->
        <div class="main-container">
          <v-layout row wrap justify-center align-content-center>
            <v-flex v-if="loading" class="progress-circle"></v-flex>
            <v-flex xs12 align-self-center>
              <Canvas></Canvas>
            </v-flex>
          </v-layout>
        </div>
        <!-- </v-container> -->
      </v-content>
      <Sidebar v-show="loading == false"></Sidebar>
    </template>
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
    loading: true
  }),
  methods: {
    handleDrawer() {
      EventBus.$emit("handle-drawer");
    },
    fetchLayout(layoutId) {
      axios
        .get(
          `https://${
            this.$store.state.hostname
          }/fl_api/tables-v1/?get_tables_board&token=1&board_id=${layoutId}`
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
          `https://${
            this.$store.state.hostname
          }/fl_api/tables-v1/?get_table_types&token=1`
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
          `https://${
            this.$store.state.hostname
          }/fl_api/tables-v1/?get_tables&token=1&board_id=${layoutId}`
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
          `https://${
            this.$store.state.hostname
          }/fl_api/tables-v1/?get_guests&token=1&table_id=1`
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
  mounted() {},
  created() {
    const layoutId = this.getQueryVariable("layout_id");
    const orientation = this.$store.state.layout.orientation;

    if (!layoutId) {
      alert('Please add a "layout_id paramenter!"');
    } else {
      if (orientation == 1) {
        this.$store.dispatch("CHANGE_ORIENTATION", {
          width: 1200,
          height: 792
        });
      }
      this.fetchLayout(layoutId);
      this.fetchTableTypes();
      this.fetchTables(layoutId);
      this.fetchGuests();
    }

    EventBus.$on("loading-done", () => {
      this.loading = false;
    });
  }
};
</script>

<style scoped>
.main-container {
  display: grid;
  margin: 1em;
}

.progress-circle {
  flex: none;
}
</style>

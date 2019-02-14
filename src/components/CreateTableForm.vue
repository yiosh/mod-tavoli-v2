<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>Crea tavolo</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon @click="dialog = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-toolbar>

        <v-form
          @submit.prevent="
            createTable(
              createTableForm.text,
              createTableForm.number,
              Number(createTableForm.size),
              createTableForm.type
            )
          "
        >
          <v-container>
            <v-layout>
              <v-flex xs12 sm6 class="py-2">
                <p>Type</p>
                <v-btn-toggle v-model="createTableForm.type">
                  <v-btn
                    v-for="tableType in tableTypes"
                    flat
                    :value="tableTypeParser(tableType.id)"
                    :key="tableType.id"
                    >{{ tableType.label }}</v-btn
                  >
                </v-btn-toggle>
              </v-flex>
            </v-layout>

            <v-layout>
              <v-flex xs12 sm6 class="py-2">
                <p>Size</p>
                <v-btn-toggle v-model="createTableForm.size">
                  <v-btn flat value="25">Picolo</v-btn>
                  <v-btn flat value="50">Mediano</v-btn>
                  <v-btn flat value="75">Grande</v-btn>
                </v-btn-toggle>
              </v-flex>
            </v-layout>

            <v-layout>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="createTableForm.text"
                  label="Nome"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6>
                <v-text-field
                  v-model="createTableForm.number"
                  label="Numero"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider></v-divider>
          <v-container>
            <v-layout justify-end>
              <v-flex xs12>
                <v-btn type="submit" dark color="green">Crea</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { EventBus } from "../event-bus.js";

export default {
  name: "CreateTableForm",
  data: () => ({
    dialog: false,
    // Default values
    createTableForm: {
      type: "circle",
      size: "25",
      text: "",
      number: ""
    },
    tableTypes: []
  }),
  methods: {
    // Parses from table id into Konva shape
    tableTypeParser(id) {
      let type;
      switch (id) {
        case "2":
          type = "circle";
          break;

        case "3":
          type = "square";
          break;

        case "4":
          type = "rectangle";
          break;

        case "5":
          type = "ellipse";
          break;
      }
      return type;
    },
    // Create table using tableTypes array and user input
    createTable(
      name,
      number = "",
      size,
      type,
      id = this.$store.getters.GET_GROUPS_LENGTH,
      x = 100,
      y = 100
    ) {
      let uID =
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9);
      let groupName = "g" + uID;
      let tableName = "g" + uID + "-tbl";
      let textName = name ? name : "g" + uID + "-txt";
      let table = {};
      let textConfig = {
        name: textName,
        text: name + number,
        fontSize: 20,
        fontFamily: "Calibri",
        fill: "black",
        stroke: "black",
        padding: size,
        strokeWidth: 1
      };

      switch (type) {
        case "circle":
          table = {
            id,
            type,
            textConfig,
            tableConfig: {
              name: tableName,
              radius: size,
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        case "square":
          table = {
            id,
            type,
            textConfig,
            tableConfig: {
              name: tableName,
              width: size * 2,
              height: size * 2,
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        case "rectangle":
          table = {
            id,
            type,
            textConfig,
            tableConfig: {
              name: tableName,
              width: size * 2,
              height: size * 3,
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        case "ellipse":
          table = {
            id: id ? id : null,
            type,
            textConfig,
            tableConfig: {
              name: tableName,
              radius: {
                x: size * 2,
                y: size
              },
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        default:
          break;
      }

      let group = {
        name: groupName,
        x,
        y,
        rotation: 0,
        width: 100,
        height: 100,
        draggable: true,
        table
      };
      // Add new group to the store
      this.$store.dispatch("ADD_NEW_TABLE", group);
    }
  },
  created() {
    EventBus.$on("fetch-table-types", payload => {
      this.tableTypes = payload;
    });

    EventBus.$on("fetch-tables", () => {
      let tablesFetched = this.$store.getters.GET_TABLES_FETCHED;
      console.log(tablesFetched.length);
      tablesFetched.forEach(payload => {
        this.createTable(
          payload.table_name,
          Number(payload.table_number),
          Number(payload.size),
          this.tableTypeParser(payload.type_id),
          payload.id,
          Number(payload.x),
          Number(payload.y)
        );
      });
    });

    EventBus.$on("create-table-select", () => {
      this.dialog = true;
    });
  }
};
</script>

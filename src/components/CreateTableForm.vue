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
              createTableForm.type,
              groupsLength,
              100,
              100,
              Number(createTableForm.angolare),
              true
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
                  <v-btn flat value="30">Picolo</v-btn>
                  <v-btn flat value="60">Mediano</v-btn>
                  <v-btn flat value="90">Grande</v-btn>
                </v-btn-toggle>
              </v-flex>
            </v-layout>

            <v-layout>
              <v-flex xs12 sm6 class="py-2">
                <p>Angolare</p>
                <v-btn-toggle v-model="createTableForm.angolare">
                  <v-btn flat value="0">0°</v-btn>
                  <v-btn flat value="45">45°</v-btn>
                  <v-btn flat value="90">90°</v-btn>
                  <v-btn flat value="135">135°</v-btn>
                  <v-btn flat value="180">180°</v-btn>
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
import axios from "axios";

export default {
  name: "CreateTableForm",
  data: () => ({
    dialog: false,
    // Default values
    createTableForm: {
      type: "circle",
      size: "30",
      angolare: "0",
      text: "",
      number: ""
    },
    tableTypes: []
  }),
  computed: {
    groupsLength() {
      return this.$store.getters.GET_GROUPS_LENGTH;
    }
  },
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
    tableTypeDeparser(type) {
      let id;
      switch (type) {
        case "circle":
          id = "2";
          break;

        case "square":
          id = "3";
          break;

        case "rectangle":
          id = "4";
          break;

        case "ellipse":
          id = "5";
          break;
      }
      return id;
    },
    // Create table using tableTypes array and user input
    createTable(
      name,
      number = "",
      size,
      // scaleX,
      // scaleY,
      type,
      id,
      x = 100,
      y = 100,
      angolare = 0,
      n = false
    ) {
      let uID =
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9);
      let tableGroup;
      let groupName = "g" + uID;
      let tableName = "g" + uID + "-tbl";
      let textName = name ? name : "g" + uID + "-txt";
      let table = {};
      let textConfig = {
        name: textName,
        number,
        text: name + (number == 0 ? "" : number),
        fontSize: 20,
        fontFamily: "Calibri",
        fill: "black",
        stroke: "black",
        padding: 25,
        strokeWidth: 1
      };

      switch (type) {
        case "circle":
          table = {
            id: id ? id : null,
            type,
            textConfig,
            tableConfig: {
              name: tableName,
              radius: size,
              // scaleX,
              // scaleY,
              rotation: angolare,
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        case "square":
          table = {
            id: id ? id : null,
            type,
            textConfig,
            tableConfig: {
              name: tableName,
              width: size,
              height: size,
              // scaleX,
              // scaleY,
              rotation: angolare,
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        case "rectangle":
          table = {
            id: id ? id : null,
            type,
            textConfig,
            tableConfig: {
              name: tableName,
              width: size * 2,
              height: size,
              // scaleX,
              // scaleY,
              rotation: angolare,
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        case "ellipse":
          table = {
            id: id ? id : null,
            type: type,
            textConfig,
            tableConfig: {
              name: tableName,
              radius: {
                x: size,
                y: size * 2
              },
              // scaleX: n ? scaleX * 2 : scaleX,
              // scaleY,
              rotation: angolare,
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

      const details = {
        layout_id: this.$store.state.layout.id,
        type_id: this.tableTypeDeparser(type),
        table_name: name,
        table_number: number,
        table_group: tableGroup ? tableGroup : 0,

        x,
        y,
        angolare
      };

      if (n) {
        axios
          .get(
            `https://demo.condivision.cloud/fl_api/tables-v1/?insert_table&token=1&layout_id=${
              details.layout_id
            }&type_id=${details.type_id}&table_name=${
              details.table_name
            }&table_number=${details.table_number}&table_group=${
              details.table_group
            }&size=${size}&x=${details.x}&y=${details.y}&angolare=${
              details.angolare
            }`
          )
          .then(function(response) {
            console.log("Response", response);
            group.table.id = response.data.id;
            console.log("New group", group);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      // Add new group to the store
      this.$store.dispatch("ADD_NEW_TABLE", group);
      this.dialog = false;
    }
  },
  created() {
    EventBus.$on("fetch-table-types", payload => {
      this.tableTypes = payload;
    });

    EventBus.$on("fetch-tables", () => {
      let tablesFetched = this.$store.getters.GET_TABLES_FETCHED;
      console.log("tables", tablesFetched);
      tablesFetched.forEach(payload => {
        this.createTable(
          payload.table_name,
          Number(payload.table_number),
          Number(payload.size),
          // Number(payload.scale_x),
          // Number(payload.scale_y),
          this.tableTypeParser(payload.type_id),
          payload.id,
          Number(payload.x),
          Number(payload.y),
          Number(payload.angolare)
        );
      });
    });

    EventBus.$on("create-table-select", () => {
      this.dialog = true;
    });
  }
};
</script>

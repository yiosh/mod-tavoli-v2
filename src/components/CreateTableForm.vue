<template>
  <v-flex>
    <v-card>
      <v-toolbar dark>
        <v-toolbar-title>Crea tavolo</v-toolbar-title>
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
  </v-flex>
</template>

<script>
import axios from "axios";

export default {
  name: "CreateTableForm",
  data: () => ({
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
    fetchTableTypes() {
      axios
        .get(
          "https://demo.condivision.cloud/fl_api/tables-v1/?get_table_types&token=1"
        )
        .then(response => {
          for (let index = 1; index < response.data.dati.length; index++) {
            this.tableTypes.push(response.data.dati[index]);
          }
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
          console.log("Tables", response.data.dati);
          response.data.dati.forEach(element => {
            this.createTable(
              element.table_name,
              Number(element.table_number),
              Number(element.size),
              this.tableTypeParser(element.type_id),
              element.id,
              Number(element.x),
              Number(element.y)
            );
          });
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    // Create table using tableTypes array and user input
    createTable(
      name,
      number = "",
      size,
      type,
      id = this.$store.getters.GET_GROUPS_LENGTH + 1,
      x = 100,
      y = 100
    ) {
      // let id = this.$store.getters.GET_GROUPS_LENGTH;
      let groupName = "g" + id;
      let tableName = "g" + id + "-tbl";
      let textName = name ? name : "g" + id + "-txt";
      // let size;
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
            id,
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
    this.fetchTableTypes();
    this.fetchTables();
  }
};
</script>

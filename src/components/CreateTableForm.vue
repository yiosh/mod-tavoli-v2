<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-toolbar flat color="#424242" dark>
          <v-toolbar-title>Aggiungi Tavolo</v-toolbar-title>
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
              1,
              1,
              createTableForm.type,
              groupsLength,
              100,
              100,
              Number(createTableForm.angolare),
              true
            )
          "
          v-model="valid"
        >
          <v-container>
            <v-layout>
              <v-flex xs12 sm6 class="py-2">
                <p>Tipo</p>
                <v-btn-toggle v-model="createTableForm.type" mandatory>
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
              <v-flex xs12 sm6 md6 class="py-2">
                <p>Dimensione</p>
                <v-btn-toggle v-model="createTableForm.size" mandatory>
                  <v-btn flat :value="Number(30)">Piccolo</v-btn>
                  <v-btn flat :value="Number(60)">Medio</v-btn>
                  <v-btn flat :value="Number(90)">Grande</v-btn>
                </v-btn-toggle>
              </v-flex>
            </v-layout>

            <v-layout>
              <v-flex xs12 sm3 md4 class="py-2">
                <p>Scala X</p>
                <v-slider
                  v-model="createTableForm.scaleX"
                  step="0.1"
                  min="1"
                  max="5"
                ></v-slider>
              </v-flex>
              <v-flex xs12 sm3 md2 class="py-2">
                <v-text-field
                  suffix="°"
                  type="number"
                  v-model="createTableForm.scaleX"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md4 class="py-2">
                <p>Scala Y</p>
                <v-slider
                  v-model="createTableForm.scaleY"
                  step="0.1"
                  min="1"
                  max="5"
                ></v-slider>
              </v-flex>
              <v-flex xs12 sm3 md2 class="py-2">
                <v-text-field
                  suffix="°"
                  type="number"
                  v-model="createTableForm.scaleY"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout>
              <v-flex xs12 sm6 md6 class="py-2">
                <p>Angolare</p>
                <v-btn-toggle v-model="createTableForm.angolare" mandatory>
                  <v-btn flat :value="Number(0)">0°</v-btn>
                  <v-btn flat :value="Number(45)">45°</v-btn>
                  <v-btn flat :value="Number(90)">90°</v-btn>
                  <v-btn flat :value="Number(180)">180°</v-btn>
                  <v-btn flat :value="customAngolareVal">Costum</v-btn>
                </v-btn-toggle>
              </v-flex>
              <v-flex xs12 sm6 md2 class="py-2">
                <v-text-field
                  suffix="°"
                  type="number"
                  v-model="createTableForm.angolare"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="createTableForm.text"
                  label="Nome"
                  :rules="nameRules"
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
                <v-btn :disabled="!valid" type="submit" dark color="green"
                  >Crea</v-btn
                >
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
    valid: true,
    // Default values
    createTableForm: {
      type: "circle",
      size: 30,
      scaleX: 1,
      scaleY: 1,
      angolare: 0,
      text: "",
      number: 0
    },
    nameRules: [v => !!v || "Nome is required"]
  }),
  computed: {
    groupsLength() {
      return this.$store.getters.groupsLength;
    },
    tableTypes() {
      return this.$store.state.tableTypes;
    },
    customAngolareVal() {
      return this.createTableForm.angolare == 0 ||
        this.createTableForm.angolare == 45 ||
        this.createTableForm.angolare == 90 ||
        this.createTableForm.angolare == 180
        ? 91
        : this.createTableForm.angolare;
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
      scaleX = 1,
      scaleY = 1,
      type,
      id,
      x = 100,
      y = 100,
      angolare = 0,
      n = false,
      tableGuests = []
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
      let guestCounterName = "gc" + uID;
      let table = {};
      let textConfig = {
        name: textName,
        number,
        text: name + (number == 0 ? "" : number),
        fontSize: 18,
        fontFamily: "Poppins",
        fontStyle: "bold",
        fill: "black",
        align: "center",
        verticalAlign: "middle",
        padding: 5
      };

      let ellipseTextConfig = {
        name: textName,
        number,
        text: name + (number == 0 ? "" : number),
        fontSize: 18,
        fontFamily: "Poppins",
        fontStyle: "bold",
        fill: "black",
        verticalAlign: "middle",
        rotation: angolare,
        offsetY: size / 4,
        offsetX: size / 4
      };

      let counters = {
        people: 0,
        babies: 0,
        chairs: 0,
        highchairs: 0
      };

      if (tableGuests.length > 0) {
        tableGuests.forEach(guest => {
          if (Number(guest.people) > 0) {
            counters.people += Number(guest.people);
          }
          if (Number(guest.baby) > 0) {
            counters.babies += Number(guest.baby);
          }
          if (Number(guest.chairs_only) > 0) {
            counters.chairs += Number(guest.chairs_only);
          }
          if (Number(guest.high_chair) > 0) {
            counters.highchairs += Number(guest.high_chair);
          }
        });
      }

      let counterText = "";

      if (counters.people > 0) {
        counterText += "P" + counters.people;
      }

      if (counters.babies > 0) {
        counterText += " B" + counters.babies;
      }

      if (counters.chairs > 0) {
        counterText += " S" + counters.chairs;
      }

      if (counters.highchairs > 0) {
        counterText += " XS" + counters.highchairs;
      }

      let guestCounters = {
        name: guestCounterName,
        text: counterText,
        fontSize: 12,
        fontFamily: "Poppins",
        fontStyle: "bold",
        fill: "black",
        align: "center",
        verticalAlign: "middle",
        rotation: angolare,
        offsetY: (size / 4) * -1,
        offsetX: (size / 4) * 2
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
              scaleX,
              scaleY,
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
              scaleX,
              scaleY,
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
              scaleX,
              scaleY,
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
            textConfig: ellipseTextConfig,
            tableConfig: {
              name: tableName,
              radiusX: size * 2,
              radiusY: size,
              scaleX,
              scaleY,
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
        guestCounters,
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
            `https://${
              this.$store.state.hostname
            }/fl_api/tables-v1/?insert_table&token=1&layout_id=${
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
            group.table.id = response.data.id;
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      // Add new group to the store
      this.$store.dispatch("addTable", group);
      this.dialog = false;
    },
    getTableTypes() {}
  },
  created() {
    EventBus.$on("fetch-done", () => {
      let tablesFetched = this.$store.state.tablesFetched;
      let tablesFetchedLength = tablesFetched.length;
      let guests = this.$store.state.guests;
      let tableGuests = [];
      if (tablesFetchedLength > 0) {
        tablesFetched.forEach(payload => {
          tableGuests = guests.filter(guest => {
            return guest.table_id == payload.id;
          });
          this.createTable(
            payload.table_name,
            Number(payload.table_number),
            Number(payload.size),
            Number(payload.scale_x),
            Number(payload.scale_y),
            this.tableTypeParser(payload.type_id),
            payload.id,
            Number(payload.x),
            Number(payload.y),
            Number(payload.angolare),
            false,
            tableGuests
          );
        });
      }
    });

    EventBus.$on("create-table-select", () => {
      this.dialog = true;
    });
  }
};
</script>

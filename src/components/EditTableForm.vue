<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>Modifica Tavolo</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon @click="dialog = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-toolbar>

        <v-form v-model="valid" @submit.prevent="save">
          <v-container>
            <v-layout>
              <v-flex xs12 sm6 class="py-2">
                <p>Tipo</p>
                <v-btn-toggle v-model="editedItem.type">
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
                <v-btn-toggle v-model="editedItem.size">
                  <v-btn flat :value="Number(30)">Piccolo</v-btn>
                  <v-btn flat :value="Number(60)">Medio</v-btn>
                  <v-btn flat :value="Number(90)">Grande</v-btn>
                </v-btn-toggle>
              </v-flex>
              <v-flex xs12 sm6 md5 class="py-2">
                <p>Angolare</p>
                <v-slider
                  min="0"
                  max="360"
                  v-model="editedItem.angolare"
                ></v-slider>
              </v-flex>
              <v-flex xs12 sm6 md1 class="py-2">
                <v-text-field
                  suffix="°"
                  v-model="editedItem.angolare"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout>
              <v-flex xs12 md6>
                <v-text-field
                  :rules="nameRules"
                  v-model="editedItem.text"
                  label="Nome"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6>
                <v-text-field
                  v-model="editedItem.number"
                  label="Numero"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider></v-divider>
          <v-container>
            <v-layout justify-end>
              <v-flex xs12>
                <v-btn @click="remove" dark color="error">Elimina</v-btn>
                <v-btn :disabled="!valid" type="submit" dark color="green"
                  >Salva</v-btn
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
  name: "EditTableForm",
  data: () => ({
    valid: true,
    layer: null,
    dialog: false,
    // Default values
    editedItem: {
      id: "",
      type: "circle",
      size: 30,
      angolare: 0,
      text: "",
      number: ""
    },
    defaultItem: {
      id: "",
      type: "circle",
      size: 30,
      angolare: 0,
      text: "",
      number: ""
    },
    // tableTypes: [],
    angolareRules: [
      v => !!v || "Angolare is required",
      v => v <= 360 || "Angolare must be less than 360°"
    ],
    nameRules: [v => !!v || "Nome is required"]
  }),
  computed: {
    groupsLength() {
      return this.$store.getters.GET_GROUPS_LENGTH;
    },
    tableTypes() {
      return this.$store.getters.GET_TABLE_TYPES;
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
    fetchSelectedTable(group) {
      const table = group.attrs.table;
      let size;

      if (table.type == "circle") {
        size = table.tableConfig.radius;
      }
      if (table.type == "square" || table.type == "rectangle") {
        size = table.tableConfig.height;
      }
      if (table.type == "ellipse") {
        size = table.tableConfig.radius.x;
      }

      console.log("Group", group);

      let item = {
        id: table.id,
        type: table.type,
        size: Number(size),
        angolare: Number(table.tableConfig.rotation),
        text: table.textConfig.name,
        number: table.textConfig.number
      };
      this.editedItem = Object.assign({}, item);
    },
    save() {
      this.$store.dispatch("EDIT_TABLE", this.editedItem);
      axios
        .get(
          `https://demo.condivision.cloud/fl_api/tables-v1/?update_table&token=1&layout_id=${
            this.$store.state.layout.id
          }&table_id=${this.editedItem.id}&type_id=${this.tableTypeDeparser(
            this.editedItem.type
          )}&table_name=${this.editedItem.text}&table_number=${
            this.editedItem.number
          }&size=${this.editedItem.size}&angolare=${this.editedItem.angolare}`
        )
        .then(function(response) {
          console.log("Response", response);
        })
        .catch(function(error) {
          console.log(error);
        });
      // this.$store.state.layer.draw();
      this.dialog = false;
    },
    remove() {
      let answer = confirm("You sure you want to remove this table?");
      console.log("Confirm", answer);
      if (confirm) {
        this.$store.dispatch("REMOVE_TABLE", this.editedItem.id);
        axios
          .get(
            `https://demo.condivision.cloud/fl_api/tables-v1/?delete_table&token=1&layout_id=${
              this.$store.state.layout.id
            }&table_id=${this.editedItem.id}`
          )
          .then(function(response) {
            console.log("Response", response);
          })
          .catch(function(error) {
            console.log(error);
          });
      }

      this.dialog = false;
    }
  },
  mounted() {
    this.layer = this.$store.state.layer;
  },
  created() {
    EventBus.$on("table-select", group => {
      this.fetchSelectedTable(group);
    });

    EventBus.$on("edit-table-select", () => {
      this.dialog = true;
    });
  }
};
</script>

<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog">
      <v-card>
        <v-toolbar dark color="#424242">
          <v-toolbar-title>Guest List</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon @click="dialog = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="guestDialog" max-width="500px">
              <v-btn slot="activator" color="primary" dark class="mb-2">
                {{ formTitle }}
              </v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">Add New Guest</span>
                </v-card-title>

                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md6>
                        <v-text-field
                          v-model="editedItem.nome"
                          label="Nome"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                        <v-text-field
                          v-model="editedItem.cognome"
                          label="Cognome"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md3>
                        <v-text-field
                          v-model="editedItem.peoples"
                          label="People"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md3>
                        <v-text-field
                          v-model="editedItem.baby"
                          label="Babies"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md3>
                        <v-text-field
                          v-model="editedItem.chairs_only"
                          label="Chairs"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md3>
                        <v-text-field
                          v-model="editedItem.high_chair"
                          label="Highchair"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          v-model="editedItem.note_intolleranze"
                          label="Note"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-data-table :headers="headers" :items="guests">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.nome }}</td>
              <td>{{ props.item.cognome }}</td>
              <td>{{ props.item.peoples }}</td>
              <td>{{ props.item.baby }}</td>
              <td>{{ props.item.chairs_only }}</td>
              <td>{{ props.item.high_chair }}</td>
              <td>{{ props.item.note_intolleranze }}</td>
              <td>
                <v-icon small class="mr-2" @click="editItem(props.item)"
                  >edit</v-icon
                >
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </template>
            <!-- <template slot="no-data"
              >There are no guests in this table</template
            >-->
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="dialog = false"
            >Close</v-btn
          >
          <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" top color="warning" :timeout="6000"
      >You need to select a table to open its guest list
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import axios from "axios";
import { EventBus } from "../event-bus.js";
import _ from "lodash";

export default {
  name: "GuestList",
  data() {
    return {
      snackbar: false,
      dialog: false,
      guestDialog: false,
      dialogm1: "",
      headers: [
        { text: "Nome", value: "nome" },
        { text: "Cognome", value: "cognome" },
        { text: "People", value: "peoples" },
        { text: "Babies", value: "baby" },
        { text: "Chairs", value: "chairs_only" },
        { text: "Highchairs", value: "high_chair" },
        { text: "Note", value: "note_intolleranze" },
        { text: "Actions", value: "nome", sortable: false }
      ],
      guests: [],
      editedIndex: -1,
      editedItem: {
        nome: "",
        cognome: "",
        peoples: 0,
        baby: 0,
        chairs_only: 0,
        high_chair: 0,
        note_intolleranze: ""
      },
      defaultItem: {
        nome: "",
        cognome: "",
        peoples: 0,
        baby: 0,
        chairs_only: 0,
        high_chair: 0,
        note_intolleranze: ""
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add New Guest" : "Edit Guest";
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.guests.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.guestDialog = true;
    },

    deleteItem(item) {
      const index = this.guests.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.guests.splice(index, 1);
    },

    close() {
      this.guestDialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.guests[this.editedIndex], this.editedItem);
      } else {
        this.guests.push(this.editedItem);
      }
      this.close();
    }
  },
  created() {
    EventBus.$on("table-select", group => {
      let guests = this.$store.state.guests;
      let id = group.attrs.table.id;

      this.guests = _.filter(guests, element => {
        return element.table_id == id;
      });
    });

    EventBus.$on("guest-list-select", () => {
      if (this.$store.state.selectedGroup != null) {
        this.dialog = true;
      } else {
        this.snackbar = true;
      }
    });
  }
};
</script>

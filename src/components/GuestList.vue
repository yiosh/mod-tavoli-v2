<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog">
      <v-card>
        <v-toolbar flat dark color="#424242">
          <v-toolbar-title>Elenco degli Ospiti</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon @click="dialog = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="guestDialog" max-width="500px">
              <v-btn slot="activator" color="primary" dark class="mb-2"
                >Crea Nuovo Ospite</v-btn
              >
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
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
                          label="Persone"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md3>
                        <v-text-field
                          v-model="editedItem.baby"
                          label="Bambini"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md3>
                        <v-text-field
                          v-model="editedItem.chairs_only"
                          label="Sedie"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md3>
                        <v-text-field
                          v-model="editedItem.high_chair"
                          label="Seggiolone"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          v-model="editedItem.note_intolleranze"
                          label="Nota"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="close"
                    >Chiudi</v-btn
                  >
                  <v-btn color="blue darken-1" flat @click="save">Salva</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-data-table
            :headers="headers"
            :items="guests"
            rows-per-page-text="Righe per pagina"
            :rows-per-page-items="[5, 10, 25, { text: 'Tutti', value: -1 }]"
            no-data-text="Non ci sono ospiti in questo tavolo"
          >
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
                <v-icon small @click="deleteGuest(props.item)">delete</v-icon>
              </td>
            </template>
            <!-- <template slot="no-data"
              >Non ci sono ospiti in questo tavolo</template
            >-->
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="dialog = false"
            >Chiudi</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" top color="warning" :timeout="6000"
      >Devi selezionare un tavolo per aprire la sua lista degli ospiti
      <v-btn dark flat @click="snackbar = false">Chiudi</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import { EventBus } from "../event-bus.js";
import _ from "lodash";
import TMService from "@/services/TMService.js";

export default {
  name: "GuestList",
  data() {
    return {
      tableId: null,
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
        { text: "Azioni", value: "nome", sortable: false }
      ],
      guests: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        nome: "",
        cognome: "",
        peoples: 0,
        baby: 0,
        chairs_only: 0,
        high_chair: 0,
        note_intolleranze: ""
      },
      defaultItem: {
        id: null,
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
      return this.editedIndex === -1 ? "Crea Nuovo Ospite" : "Modifica Ospite";
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.guests.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.guestDialog = true;
    },
    deleteGuest(guest) {
      const index = this.guests.indexOf(guest);

      confirm(
        `Sei sicuro di voler eliminare a ${guest.nome} ${guest.cognome}?`
      ) &&
        // Create a New Guest
        TMService.deleteGuest(guest.id)
          .then(response => {
            console.log("Response", response);
            this.guests.splice(index, 1);
          })
          .catch(function(error) {
            console.log(error);
          });
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
        // Update existing guest
        let itemToEdit = this.editedItem;
        TMService.updateGuest(itemToEdit)
          .then(response => {
            console.log("AJAX Response: ", response.data);
            let index = _.findIndex(this.guests, guest => {
              return guest.id == itemToEdit.id;
            });
            Object.assign(this.guests[index], itemToEdit);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        // Create a New Guest
        let $this = this;
        let itemToEdit = this.editedItem;
        TMService.createGuest($this.tableId, itemToEdit)
          .then(response => {
            itemToEdit.id = response.data.id;
            $this.guests.push(itemToEdit);
          })
          .catch(error => {
            console.log(error);
          });
      }
      this.close();
    }
  },
  created() {
    EventBus.$on("table-select", group => {
      let id = group.attrs.table.id;
      this.tableId = id;
      // if (this.guests.length == 0) {
      this.$store.dispatch("FETCH_GUESTS", id);
      // }
    });

    EventBus.$on("guests-fetched", () => {
      this.guests = _.filter(this.$store.state.guests, guest => {
        return guest.table_id == this.tableId;
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

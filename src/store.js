import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
import TMService from "@/services/TMService";
import { EventBus } from "./event-bus.js";
import NProgress from "nprogress";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hostname:
      location.hostname === "localhost"
        ? "demo.condivision.cloud"
        : location.hostname,
    selectedGroup: null,
    counter: 0,
    loading: true,
    layout: {
      ambiente_id: "",
      created_at: "",
      evento_id: "",
      id: "",
      layout_name: "",
      orientation: "",
      sede_id: "",
      updated_at: ""
    },
    tablesFetched: [],
    tableTypes: [],
    stage: null,
    layer: null,
    guests: [],
    createTableForm: {
      type: "circle",
      size: "small",
      text: "",
      number: ""
    },
    configKonva: {
      width: 1200,
      height: 792
    },
    sizes: [
      {
        title: "Small",
        value: "small"
      },
      {
        title: "Medium",
        value: "medium"
      },
      {
        title: "Large",
        value: "large"
      }
    ],
    groups: []
  },
  mutations: {
    SET_LAYOUT(state, payload) {
      state.layout = Object.assign({}, payload);
      console.log("Layout", state.layout);
      if (state.counter == 0) {
        NProgress.start();
      }
    },
    SET_STAGE(state, payload) {
      state.stage = payload;
    },
    SET_LAYER(state, payload) {
      state.layer = payload;
    },
    GET_GUESTS(state, payload) {
      if (payload.length > 0) {
        payload.forEach(guest => {
          state.guests.push(guest);
        });
      }
      EventBus.$emit("fetch-done");
    },
    GET_TABLES(state, payload) {
      state.tablesFetched = payload;
    },
    FETCH_TABLE_TYPES(state, payload) {
      state.tableTypes = payload;
    },
    ADD_TABLE(state, payload) {
      state.groups.push(payload);
      state.counter++;
      if (state.counter == state.tablesFetched.length) {
        NProgress.done();
        state.loading = false;
      }
    },
    DELETE_TABLE(state, payload) {
      let indexToRemove = _.findIndex(state.groups, group => {
        return group.table.id == payload;
      });
      console.log("Index", indexToRemove);
      state.groups.splice(indexToRemove, 1);
    },
    UPDATE_TABLE(state, payload) {
      let indexToEdit = _.findIndex(state.groups, group => {
        return group.table.id == payload.id;
      });
      const groupToEdit = _.find(state.groups, group => {
        return group.table.id == payload.id;
      });

      console.log("Edit", groupToEdit);

      const tableToEdit = groupToEdit.table;
      if (payload.type == "circle") {
        state.groups[indexToEdit].table.tableConfig.radius = payload.size;
      }

      if (payload.type == "square") {
        state.groups[indexToEdit].table.tableConfig.height = payload.size;
        state.groups[indexToEdit].table.tableConfig.width = payload.size;
      }

      if (payload.type == "rectangle") {
        state.groups[indexToEdit].table.tableConfig.height = payload.size;
        state.groups[indexToEdit].table.tableConfig.width = payload.size * 2;
      }

      if (payload.type == "ellipse") {
        state.groups[indexToEdit].table.tableConfig.radiusX = payload.size * 2;
        state.groups[indexToEdit].table.tableConfig.radiusY = payload.size;
      }

      console.log("tableToEdit", tableToEdit);
      console.log("tableConfig", state.groups[indexToEdit].table.tableConfig);

      tableToEdit.tableConfig.scaleX = payload.scaleX;
      tableToEdit.tableConfig.scaleY = payload.scaleY;
      tableToEdit.type = payload.type;
      tableToEdit.tableConfig.rotation = Number(payload.angolare);
      tableToEdit.textConfig.name = payload.text;
      tableToEdit.textConfig.rotation = Number(payload.angolare);
      tableToEdit.textConfig.number = payload.number;
      tableToEdit.textConfig.text =
        payload.text + (payload.number == 0 ? "" : payload.number);
    },
    SELECT_GROUP(state, payload) {
      state.selectedGroup = payload;
    },
    SET_ORIENTATION(state, payload) {
      state.configKonva.width = payload.width;
      state.configKonva.height = payload.height;
    },
    ADD_GUEST(state, newGuest) {
      state.guests.push(newGuest);
    },
    UPDATE_GUEST(state, updatedGuest) {
      let index = state.guests.findIndex(guest => {
        return guest.id == updatedGuest.id;
      });
      Object.assign(state.guests[index], updatedGuest);
    }
  },
  actions: {
    setStage(state, payload) {
      state.commit("SET_STAGE", payload);
    },
    setLayer(state, payload) {
      state.commit("SET_LAYER", payload);
    },
    getTables({ commit, dispatch }, layoutId) {
      TMService.getTables(layoutId)
        .then(response => {
          // handle success
          console.log("Tables Fetched:", response.data.dati);
          commit("GET_TABLES", response.data.dati);
        })
        .then(() => {
          dispatch("getGuests", layoutId);
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .finally(() => {});
    },
    fetchTableTypes({ commit }) {
      TMService.fetchTableTypes()
        .then(response => {
          // handle success
          let tableTypes = [];
          for (let index = 1; index < response.data.dati.length; index++) {
            tableTypes.push(response.data.dati[index]);
          }
          commit("FETCH_TABLE_TYPES", tableTypes);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    addTable(state, payload) {
      state.commit("ADD_TABLE", payload);
    },
    deleteTable(state, payload) {
      state.commit("DELETE_TABLE", payload);
    },
    updateTable(state, payload) {
      state.commit("UPDATE_TABLE", payload);
    },
    selectGroup(state, payload) {
      state.commit("SELECT_GROUP", payload);
    },
    setOrientation(state, payload) {
      state.commit("SET_ORIENTATION", payload);
    },
    setLayout({ commit }, layoutId) {
      TMService.fetchLayout(layoutId)
        .then(response => {
          // handle success
          commit("SET_LAYOUT", response.data.dati[0]);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    getGuests({ commit }, layoutId) {
      TMService.getGuests(layoutId)
        .then(response => {
          // handle success
          console.log("guests", response.data.dati);

          commit("GET_GUESTS", response.data.dati);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    addGuest({ commit, state }, { tableId, guest }) {
      const layoutId = state.layoutId;
      TMService.addGuest(layoutId, tableId, guest)
        .then(response => {
          const newGuest = response.data.id;
          commit("ADD_GUEST", newGuest);
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateGuest({ commit }, guest) {
      TMService.updateGuest(guest)
        .then(response => {
          const updatedGuest = response.data.dati[0];
          console.log("AJAX Response: ", response.data);
          commit("UPDATE_GUEST", updatedGuest);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  getters: {
    groupsLength(state) {
      return state.groups.length;
    },
    guests: state => tableId => {
      return state.guests.filter(guest => guest.table_id === tableId);
    },
    guestTotals(state) {
      const guests = state.guests;
      let guestTotals = {
        people: 0,
        babies: 0,
        chairs: 0,
        highchairs: 0
      };

      guests.forEach(guest => {
        if (Number(guest.people) > 0) {
          guestTotals.people += Number(guest.people);
        }
        if (Number(guest.baby) > 0) {
          guestTotals.babies += Number(guest.baby);
        }
        if (Number(guest.chairs_only) > 0) {
          guestTotals.chairs += Number(guest.chairs_only);
        }
        if (Number(guest.high_chair) > 0) {
          guestTotals.highchairs += Number(guest.high_chair);
        }
      });

      return guestTotals;
    }
  }
});

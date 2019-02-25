import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
import TMService from "@/services/TMService";
import { EventBus } from "./event-bus.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hostname:
      window.location.hostname === "localhost"
        ? "demo.condivision.cloud"
        : window.location.hostname,
    selectedGroup: null,
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
    },
    SET_STAGE(state, payload) {
      state.stage = payload;
    },
    SET_LAYER(state, payload) {
      state.layer = payload;
    },
    FETCH_GUESTS(state, payload) {
      if (payload.length > 0) {
        payload.forEach(guest => {
          state.guests.push(guest);
        });
      }
      EventBus.$emit("guests-fetched");
      // state.guests = payload;
    },
    SET_TABLES_FETCHED(state, payload) {
      state.tablesFetched = payload;
      EventBus.$emit("fetch-tables");
    },
    SET_TABLE_TYPES_FETCHED(state, payload) {
      state.tableTypes = payload;
    },
    ADD_NEW_TABLE(state, payload) {
      state.groups.push(payload);
      console.log("ADD_NEW_TABLE", payload);
    },
    REMOVE_TABLE(state, payload) {
      let indexToRemove = _.findIndex(state.groups, group => {
        return group.table.id == payload;
      });
      console.log("Index", indexToRemove);
      state.groups.splice(indexToRemove, 1);
    },
    EDIT_TABLE(state, payload) {
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
        // state.groups[indexToEdit].table.tableConfig.scaleX = 2;
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
        state.groups[indexToEdit].table.tableConfig.radiusX = payload.size;
        state.groups[indexToEdit].table.tableConfig.radiusY = payload.size * 2;
      }

      console.log("tableToEdit", tableToEdit);
      console.log("tableConfig", state.groups[indexToEdit].table.tableConfig);

      tableToEdit.tableConfig.scaleX = payload.scaleX;
      tableToEdit.tableConfig.scaleY = payload.scaleY;
      tableToEdit.type = payload.type;
      tableToEdit.tableConfig.rotation = Number(payload.angolare);
      tableToEdit.textConfig.name = payload.text;
      tableToEdit.textConfig.number = payload.number;
      tableToEdit.textConfig.text = payload.text + payload.number;
    },
    CHANGE_DIALOG(state, payload) {
      state.dialog = payload;
    },
    CHANGE_SELECTED_GROUP(state, payload) {
      state.selectedGroup = payload;
    },
    CHANGE_GROUP(state, payload) {
      state.selectedGroup = payload;
    },
    CHANGE_ORIENTATION(state, payload) {
      state.configKonva.width = payload.width;
      state.configKonva.height = payload.height;
    }
  },
  actions: {
    SET_STAGE(state, payload) {
      state.commit("SET_STAGE", payload);
    },
    SET_LAYER(state, payload) {
      state.commit("SET_LAYER", payload);
    },
    SET_TABLES_FETCHED({ commit }, layoutId) {
      TMService.getTables(layoutId)
        .then(response => {
          // handle success
          console.log("tables", response);
          commit("SET_TABLES_FETCHED", response.data.dati);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
      // state.commit("SET_TABLES_FETCHED", payload);
    },
    SET_TABLE_TYPES_FETCHED({ commit }) {
      TMService.fetchTableTypes()
        .then(response => {
          // handle success
          let tableTypes = [];
          for (let index = 1; index < response.data.dati.length; index++) {
            tableTypes.push(response.data.dati[index]);
          }
          commit("SET_TABLE_TYPES_FETCHED", tableTypes);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    SET_GUESTS(state, payload) {
      state.commit("SET_GUESTS", payload);
    },
    ADD_NEW_TABLE(state, payload) {
      state.commit("ADD_NEW_TABLE", payload);
    },
    REMOVE_TABLE(state, payload) {
      state.commit("REMOVE_TABLE", payload);
    },
    EDIT_TABLE(state, payload) {
      state.commit("EDIT_TABLE", payload);
    },
    CHANGE_DIALOG(state, payload) {
      state.commit("CHANGE_DIALOG", payload);
    },
    CHANGE_SELECTED_GROUP(state, payload) {
      state.commit("CHANGE_SELECTED_GROUP", payload);
    },
    CHANGE_GROUP(state, payload) {
      state.commit("CHANGE_TABLE", payload);
    },
    CHANGE_ORIENTATION(state, payload) {
      state.commit("CHANGE_ORIENTATION", payload);
    },
    FETCH_LAYOUT({ commit }, layoutId) {
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
    FETCH_GUESTS({ commit }, tableId) {
      TMService.fetchGuests(tableId)
        .then(response => {
          // handle success
          console.log("guests", response.data.dati);

          commit("FETCH_GUESTS", response.data.dati);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }
  },
  getters: {
    GET_GROUPS(state) {
      return state.groups;
    },
    GET_LAYER(state) {
      return state.layer;
    },
    GET_TABLE_TYPES(state) {
      return state.tableTypes;
    },
    GET_TABLES_FETCHED(state) {
      return state.tablesFetched;
    },

    GET_CONFIG(state) {
      return state.configKonva;
    },
    GET_GROUPS_LENGTH(state) {
      return state.groups.length;
    },
    GET_CREATE_TABLE_FORM(state) {
      return state.createTableForm;
    },
    GET_DIALOG(state) {
      return state.dialog;
    },
    GET_SELECTED_GROUP(state) {
      return state.selectedGroup;
    },
    GET_LAYOUT_ID(state) {
      return state.layout.id;
    },
    GET_HOSTNAME(state) {
      return state.hostname;
    },
    GET_KONVA_CONFIG(state) {
      return state.configKonva;
    }
  }
});

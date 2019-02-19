import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedGroup: null,
    layout: {
      id: null,
      name: null,
      orientation: null,
      sedeId: null,
      ambienteId: null,
      eventoId: null,
      updatedAt: null,
      createdAt: null
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
      state.layout.id = payload.id;
      state.layout.name = payload.layout_name;
      state.layout.orientation = payload.orientation;
      state.layout.sedeId = payload.sede_id;
      state.layout.ambienteId = payload.ambiente_id;
      state.layout.eventoId = payload.evento_id;
      state.layout.updatedAt = payload.updated_at;
      state.layout.createdAt = payload.created_at;
    },
    SET_STAGE(state, payload) {
      state.stage = payload;
    },
    SET_LAYER(state, payload) {
      state.layer = payload;
    },
    SET_GUESTS(state, payload) {
      state.guests = payload;
    },
    SET_TABLES_FETCHED(state, payload) {
      state.tablesFetched = payload;
    },
    SET_TABLE_TYPES_FETCHED(state, payload) {
      state.tableTypes = payload;
    },
    ADD_NEW_TABLE(state, payload) {
      state.groups.push(payload);
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
        state.groups[indexToEdit].table.tableConfig.radius.x = payload.size * 2;
        state.groups[indexToEdit].table.tableConfig.radius.y = payload.size;
      }

      console.log("tableToEdit", tableToEdit);
      console.log("tableConfig", state.groups[indexToEdit].table.tableConfig);

      tableToEdit.type = payload.type;
      tableToEdit.tableConfig.rotation = payload.angolare;
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
    }
  },
  actions: {
    SET_LAYOUT(state, payload) {
      state.commit("SET_LAYOUT", payload);
    },
    SET_STAGE(state, payload) {
      state.commit("SET_STAGE", payload);
    },
    SET_LAYER(state, payload) {
      state.commit("SET_LAYER", payload);
    },
    SET_TABLES_FETCHED(state, payload) {
      state.commit("SET_TABLES_FETCHED", payload);
    },
    SET_TABLE_TYPES_FETCHED(state, payload) {
      state.commit("SET_TABLE_TYPES_FETCHED", payload);
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
    }
  }
});

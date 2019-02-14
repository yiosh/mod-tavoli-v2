import Vue from "vue";
import Vuex from "vuex";

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
    ADD_NEW_TABLE(state, payload) {
      state.groups.push(payload);
    },
    CHANGE_DIALOG(state, payload) {
      state.dialog = payload;
    },
    CHANGE_SELECTED_GROUP(state, payload) {
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
    SET_GUESTS(state, payload) {
      state.commit("SET_GUESTS", payload);
    },
    ADD_NEW_TABLE(state, payload) {
      state.commit("ADD_NEW_TABLE", payload);
    },
    CHANGE_DIALOG(state, payload) {
      state.commit("CHANGE_DIALOG", payload);
    },
    CHANGE_SELECTED_GROUP(state, payload) {
      state.commit("CHANGE_SELECTED_GROUP", payload);
    }
  },
  getters: {
    GET_GROUPS(state) {
      return state.groups;
    },
    GET_LAYER(state) {
      return state.layer;
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
    }
  }
});

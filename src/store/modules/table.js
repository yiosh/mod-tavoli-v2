import TMService from "@/services/TMService";
import _findIndex from "lodash/findIndex";
import _find from "lodash/find";

export const namespaced = true;

export const state = {
  groups: [],
  tablesFetched: [],
  tableTypes: [],
  createTableForm: {
    type: "circle",
    size: "small",
    text: "",
    number: ""
  },
  counter: 0
};

export const mutations = {
  GET_TABLES(state, payload) {
    state.tablesFetched = payload;
  },
  FETCH_TABLE_TYPES(state, payload) {
    state.tableTypes = payload;
  },
  DELETE_TABLE(state, payload) {
    let indexToRemove = _findIndex(state.groups, group => {
      return group.table.id == payload;
    });
    state.groups.splice(indexToRemove, 1);
  },
  ADD_TABLE(state, payload) {
    state.groups.push(payload);
    state.counter++;
  },
  UPDATE_TABLE(state, payload) {
    // console.log("payload", payload);
    // let indexToEdit = _findIndex(state.groups, group => {
    //   return group.table.id == payload.id;
    // });
    const groupToEdit = _find(state.groups, group => {
      return group.table.id == payload.id;
    });

    const tableToEdit = groupToEdit.table;
    if (payload.typeId == "2") {
      tableToEdit.tableConfig.radius = payload.size;
    }

    if (payload.typeId == "3") {
      tableToEdit.tableConfig.height = payload.size;
      tableToEdit.tableConfig.width = payload.size;
    }

    if (payload.typeId == "4") {
      tableToEdit.tableConfig.height = payload.size;
      tableToEdit.tableConfig.width = payload.size * 2;
    }

    if (payload.typeId == "5") {
      tableToEdit.tableConfig.radiusX = payload.size * 2;
      tableToEdit.tableConfig.radiusY = payload.size;
    }

    let type;
    switch (payload.typeId) {
      case 2:
        type = "circle";
        break;

      case 3:
        type = "square";
        break;

      case 4:
        type = "rectangle";
        break;

      case 5:
        type = "ellipse";
        break;
    }

    tableToEdit.tableConfig.scaleX = payload.scaleX;
    tableToEdit.tableConfig.scaleY = payload.scaleY;
    tableToEdit.type = type;
    tableToEdit.textConfig.name = payload.tableName;
    tableToEdit.textConfig.rotation = Number(payload.angolare);
    tableToEdit.textConfig.number = payload.tableNumber;
    tableToEdit.textConfig.text =
      payload.tableName + (payload.tableNumber == 0 ? "" : payload.tableNumber);
    tableToEdit.textConfig.nomeCliente = payload.nomeCliente;
  }
};

export const actions = {
  getTables({ commit, dispatch }, layoutId) {
    TMService.getTables(layoutId)
      .then(response => {
        // handle success
        commit("GET_TABLES", response.data.dati);
        return layoutId;
      })
      .then(layoutId => {
        dispatch("guest/getGuests", layoutId, { root: true });
      })
      .catch(error => {
        // handle error
        const notification = {
          type: "error",
          multiLine: true,
          message:
            "Si è verificato un problema durante il recupero dei tavoli: " +
            error.message
        };
        dispatch("notification/add", notification, { root: true });
      });
  },
  fetchTableTypes({ commit, dispatch }) {
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
        const notification = {
          type: "error",
          multiLine: true,
          message:
            "Si è verificato un problema durante il recupero dei tipi di tabella: " +
            error.message
        };
        dispatch("notification/add", notification, { root: true });
      });
  },
  addTable({ commit, dispatch }, payload) {
    if (payload.isNew === true) {
      TMService.addTable(payload.details)
        .then(function(response) {
          payload.group.table.id = response.data.id;

          const notification = {
            type: "success",
            message: "Tavolo aggiunto!"
          };
          dispatch("notification/add", notification, { root: true });
        })
        .catch(function(error) {
          const notification = {
            type: "success",
            message:
              "Si è verificato un problema durante l'aggiunta del tavolo: " +
              error.message
          };
          dispatch("notification/add", notification, { root: true });
        });
    }
    commit("ADD_TABLE", payload.group);
    if (state.counter == state.tablesFetched.length) {
      dispatch("endProgress", null, { root: true });
    }
  },
  deleteTable({ state, commit, dispatch }, table) {
    TMService.deleteTable({ layoutId: table.layoutId, tableId: table.id })
      .then(() => {
        commit("DELETE_TABLE", table.id);
        const notification = {
          type: "success",
          message: "Tavolo rimosso!"
        };
        dispatch("notification/add", notification, { root: true });
      })
      .catch(function(error) {
        const notification = {
          type: "error",
          multiLine: true,
          message:
            "Si è verificato un problema durante l'eliminazione del tavolo: " +
            error.message
        };
        dispatch("notification/add", notification, { root: true });
      });
  },
  updateTable({ commit, dispatch, rootState }, updatedTable) {
    TMService.updateTable(updatedTable)
      .then(() => {
        commit("UPDATE_TABLE", updatedTable);
        const notification = {
          type: "success",
          message: "Tavolo aggiornato!"
        };
        return dispatch("notification/add", notification, { root: true });
      })
      .then(() => {
        rootState.stage.draw();
      })
      .catch(function(error) {
        const notification = {
          type: "error",
          multiLine: true,
          message:
            "Si è verificato un problema durante l'aggiornamento del tavolo: " +
            error.message
        };
        dispatch("notification/add", notification, { root: true });
      });
  }
};

export const getters = {
  groupsLength(state) {
    return state.groups.length;
  }
};

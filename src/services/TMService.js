import axios from "axios";

let hostname =
  location.hostname == "localhost"
    ? "demo.condivision.cloud"
    : location.hostname;

const apiClient = axios.create({
  baseURL: location.protocol + "//" + hostname,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  fetchLayout(layoutId) {
    return apiClient.get(
      "/fl_api/tables-v1/?get_tables_board&token=1&board_id=" + layoutId
    );
  },
  fetchTableTypes() {
    return apiClient.get("/fl_api/tables-v1/?get_table_types&token=1=");
  },
  getTables(layoutId) {
    return apiClient.get(
      "/fl_api/tables-v1/?get_tables&token=1&board_id=" + layoutId
    );
  }
};

import axios from "axios";

const apiClient = axios.create({
  baseURL: location.protocol + "//" + location.hostname,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  async fetchLayout(layoutId) {
    try {
      const response = await apiClient.get(
        "/fl_api/tables-v1/?get_tables_board&token=1&board_id=" + layoutId
      );
      // handle success
      this.$store.dispatch("SET_LAYOUT", response.data.dati[0]);
    } catch (error) {
      // handle error
      console.log(error);
    }
  }
};

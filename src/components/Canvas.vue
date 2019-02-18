<template>
  <v-card width="1200" style="margin: auto">
    <Toolbar></Toolbar>
    <v-stage
      class="grid"
      @click="stageClick"
      ref="stage"
      :config="this.$store.getters.GET_CONFIG"
    >
      <v-layer ref="layer">
        <v-group
          :ref="group.name"
          @click="tableSelect(group.name)"
          @dragend="moveTable"
          v-for="group in this.$store.getters.GET_GROUPS"
          :config="group"
          :key="group.name"
        >
          <v-circle
            v-if="group.table.type === 'circle'"
            :ref="group.table.tableConfig.name"
            @click="tableSelect(group.name)"
            @transformend="handleTableTransform"
            :config="group.table.tableConfig"
          ></v-circle>
          <v-rect
            v-if="
              group.table.type === 'square' || group.table.type === 'rectangle'
            "
            @click="tableSelect(group.name)"
            :ref="group.table.tableConfig.name"
            :config="group.table.tableConfig"
          ></v-rect>
          <v-ellipse
            v-if="group.table.type === 'ellipse'"
            @click="tableSelect(group.name)"
            :ref="group.table.tableConfig.name"
            :config="group.table.tableConfig"
          ></v-ellipse>
          <v-text
            :ref="group.table.textConfig.name"
            :config="group.table.textConfig"
          ></v-text>
        </v-group>
      </v-layer>
    </v-stage>
  </v-card>
</template>

<script>
import axios from "axios";
import Toolbar from "./Toolbar";
import { EventBus } from "../event-bus.js";
import _ from "lodash";

export default {
  name: "Canvas",
  components: {
    Toolbar
  },
  data: () => ({
    dialog: false
  }),
  methods: {
    log(e) {
      console.log(e);
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
    moveTable(e) {
      let group = e.target.attrs;
      let table = group.table;
      let layout_id = this.$store.getters.GET_LAYOUT_ID;
      console.log("Tabl moved", table);
      console.log("Group moved", group);

      axios
        .get(
          `https://demo.condivision.cloud/fl_api/tables-v1/?move_table&token=1&table_id=${
            table.id
          }&layout_id=${layout_id}&x=${group.x}&y=${group.y}`
        )
        .then(function(response) {
          console.log("Response", response);
        })
        .catch(function(error) {
          console.log(error);
        });
      // console.log(table);
    },
    handleTableTransform(e) {
      let table = e.target.attrs;
      console.log("Table trans", table);
    },
    stageClick(e) {
      let stage = this.$store.state.stage;
      // if click on empty area - remove all transformers
      if (e.target === stage) {
        if (this.$store.getters.GET_SELECTED_GROUP != null) {
          this.$store.dispatch("CHANGE_SELECTED_GROUP", null);
          stage.find("Transformer").destroy();
          stage.draw();
          EventBus.$emit("table-unselect");
          return;
        }
      }
    },
    tableSelect(group) {
      let stage = this.$store.state.stage;
      let groupEl = stage.find("." + group)[0];
      console.log("Select", groupEl);
      if (this.$store.getters.GET_SELECTED_GROUP != groupEl.attrs) {
        console.log("Target", groupEl);
        let name = "." + String(group) + "-tbl";
        stage.find("Transformer").destroy();
        // create new transformer
        var tr = new window.Konva.Transformer({
          rotateEnabled: false,
          resizeEnabled: false
        });

        let layer = this.$refs.layer.getStage(tr);
        tr.attachTo(stage.find(name)[0]);
        groupEl.add(tr);
        layer.add(groupEl);
        layer.draw();

        this.$store.dispatch("CHANGE_SELECTED_GROUP", groupEl.attrs);
        EventBus.$emit("table-select", groupEl);
      }
    }
  },
  mounted() {
    this.$store.dispatch("SET_STAGE", this.$refs.stage.getStage());
    this.$store.dispatch("SET_LAYER", this.$refs.layer);
  }
};
</script>

<style scoped>
.grid {
  background-image: url(../assets/grid.png);
}
</style>

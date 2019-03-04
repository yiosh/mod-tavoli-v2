<template>
  <v-card
    class="cnv-canvas elevation-2"
    :class="{
      horizontal: orientation == 0,
      vertical: orientation == 1
    }"
    style="margin: auto"
  >
    <Toolbar></Toolbar>
    <v-stage
      :class="{ grid: this.$store.state.layout.orientation == 0 }"
      @click="stageClick"
      ref="stage"
      :config="stageConfig"
    >
      <v-layer ref="layer">
        <v-group
          :ref="group.name"
          @click="tableSelect(group.name)"
          @dragend="moveTable"
          v-for="group in groups"
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
          <v-text
            :ref="group.guestCounters.name"
            :config="group.guestCounters"
          ></v-text>
        </v-group>
        <v-text ref="totaleCounter" :config="guestTotals"></v-text>
      </v-layer>
    </v-stage>
    <v-divider></v-divider>
  </v-card>
</template>

<script>
import axios from "axios";
import Toolbar from "./Toolbar";
import { EventBus } from "../event-bus.js";

export default {
  name: "Canvas",
  components: {
    Toolbar
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    hostname() {
      return this.$store.state.hostname;
    },
    orientation() {
      return this.$store.state.layout.orientation;
    },
    stageConfig() {
      return this.$store.state.configKonva;
    },
    groups() {
      return this.$store.state.groups;
    },
    guestTotals() {
      let guestTotals = this.$store.getters.guestTotals;
      let totalText = "TOTALE:\n";
      totalText += "Persone: " + guestTotals.people + ",";
      totalText += " Bambini: " + guestTotals.babies + ",";
      totalText += " Sedie: " + guestTotals.chairs + ",";
      totalText += " Seggiolone: " + guestTotals.highchairs;

      let total = {
        name: "totaleCounter",
        text: totalText,
        fontSize: 18,
        fontFamily: "Poppins",
        fontStyle: "bold",
        fill: "black",
        width: 600,
        x: 14,
        y: 750
      };
      return total;
    }
  },
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
      let layout_id = this.$store.state.layout.id;

      axios
        .get(
          `https://${
            this.hostname
          }/fl_api/tables-v1/?move_table&token=1&table_id=${
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
        if (this.$store.state.selectedGroup != null) {
          this.$store.dispatch("selectGroup", null);
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
      console.log("Target", groupEl);
      if (this.$store.state.selectedGroup != groupEl.attrs) {
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

        this.$store.dispatch("selectGroup", groupEl.attrs);
        EventBus.$emit("table-select", groupEl);
      }
    }
  },
  mounted() {
    this.$store.dispatch("setStage", this.$refs.stage.getStage());
    this.$store.dispatch("setLayer", this.$refs.layer);
  }
};
</script>

<style scoped>
.grid {
  background-image: url(../assets/grid.png);
}

.vertical {
  width: 792px;
  height: 1200px;
}

.horizontal {
  width: 1200px;
}

.cnv-canvas {
  border-radius: 0.5em;
}
</style>

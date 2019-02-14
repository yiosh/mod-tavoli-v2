<template>
  <v-card width="1200" style="margin: auto">
    <v-toolbar dark color="#424242">
      <v-toolbar-title>Canvas</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-stage
      @click="stageClick"
      ref="stage"
      :config="this.$store.getters.GET_CONFIG"
    >
      <v-layer ref="layer">
        <v-group
          :ref="group.name"
          @click="tableSelect(group.name)"
          @dragstart="draglog"
          @dragend="draglog"
          v-for="group in this.$store.getters.GET_GROUPS"
          :config="group"
          :key="group.name"
        >
          <v-circle
            v-if="group.table.type === 'circle'"
            @click="log"
            :ref="group.table.tableConfig.name"
            :config="group.table.tableConfig"
          ></v-circle>
          <v-rect
            v-if="
              group.table.type === 'square' || group.table.type === 'rectangle'
            "
            @click="log"
            :ref="group.table.tableConfig.name"
            :config="group.table.tableConfig"
          ></v-rect>
          <v-ellipse
            v-if="group.table.type === 'ellipse'"
            @click="log"
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
import { EventBus } from "../event-bus.js";

export default {
  name: "Canvas",
  data: () => ({
    dialog: false
  }),
  methods: {
    log(e) {
      console.log(e);
    },
    draglog(e) {
      console.log(e);
    },
    stageClick(e) {
      let stage = this.$store.state.stage;
      // if click on empty area - remove all transformers
      if (e.target === stage) {
        if (this.$store.getters.GET_SELECTED_GROUP != null) {
          this.$store.dispatch("CHANGE_SELECTED_GROUP", null);
          stage.find("Transformer").destroy();
          stage.draw();
          return;
        }
      }
    },
    tableSelect(group) {
      let stage = this.$store.state.stage;
      let groupEl = stage.find("." + group)[0];
      if (this.$store.getters.GET_SELECTED_GROUP != groupEl.attrs) {
        console.log("Target", group);
        let name = "." + String(group) + "-tbl";
        stage.find("Transformer").destroy();
        // create new transformer
        var tr = new window.Konva.Transformer();
        let layer = this.$refs.layer.getStage(tr);

        tr.attachTo(stage.find(name)[0]);
        groupEl.add(tr);
        layer.add(groupEl);
        layer.draw();

        this.$store.dispatch("CHANGE_SELECTED_GROUP", groupEl.attrs);
        EventBus.$emit("table-select", groupEl.attrs.table.id);
      }
    }
  },
  mounted() {
    this.$store.dispatch("SET_STAGE", this.$refs.stage.getStage());
    this.$store.dispatch("SET_LAYER", this.$refs.layer);
  }
};
</script>

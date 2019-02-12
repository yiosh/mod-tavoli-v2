<template>
  <v-card width="1200">
    <v-toolbar dark>
      <v-toolbar-title>Canvas</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-stage @click="stageClick" ref="stage" :config="config">
      <v-layer ref="layer">
        <v-group
          :ref="group.name"
          @click="tableSelect(group.name)"
          @dragstart="draglog"
          @dragend="draglog"
          v-for="group in groups"
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
import _ from "lodash";
import { EventBus } from "../event-bus.js";

export default {
  name: "Canvas",
  // props: { groups: Array, config: Object },
  data: () => ({
    dialog: false
    // groups: this.$store.getters.GET_GROUPS,
    // config: this.$store.getters.GET_CONFIG,
    // storeState: store.state
  }),
  computed: {
    groups() {
      return this.$store.getters.GET_GROUPS;
    },
    config() {
      return this.$store.getters.GET_CONFIG;
    }
  },
  methods: {
    log(e) {
      console.log(e);
    },
    draglog(e) {
      console.log(e);
    },
    // handleDblClick(group) {
    //   let selectedGroup = _.find(this.groups, element => {
    //     return element.name == group.name;
    //   });
    //   console.log("Group S", selectedGroup.table.id);
    //   EventBus.$emit("table-dblclick", selectedGroup.table.id, !this.dialog);
    // },
    stageClick(e) {
      let stage = this.$store.state.stage;
      // if click on empty area - remove all transformers
      if (e.target === stage) {
        this.$store.dispatch("CHANGE_SELECTED_GROUP", null);
        stage.find("Transformer").destroy();
        stage.draw();
        return;
      }
    },
    tableSelect(group) {
      let stage = this.$store.state.stage;
      let name = "." + String(group) + "-tbl";
      stage.find("Transformer").destroy();
      // create new transformer
      var tr = new window.Konva.Transformer();
      let layer = this.$refs.layer.getStage(tr);
      let groupEl = stage.find("." + group)[0];
      tr.attachTo(stage.find(name)[0]); // no idea what to do here ...
      groupEl.add(tr);
      layer.add(groupEl);
      layer.draw();
      this.$store.dispatch("CHANGE_SELECTED_GROUP", groupEl.attrs);
      EventBus.$emit("table-select", groupEl.attrs.table.id);
    }
  },
  mounted() {
    this.$store.dispatch("SET_STAGE", this.$refs.stage.getStage());
    this.$store.dispatch("SET_LAYER", this.$refs.layer);
  }
};
</script>

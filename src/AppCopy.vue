<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 md9>
            <v-card width="1200">
              <v-toolbar dark>
                <v-toolbar-title>Canvas</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-menu offset-y nudge-left="10" nudge-bottom="10">
                  <v-btn slot="activator" icon>
                    <v-icon class="far fa-circle"></v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile
                      v-for="(size, index) in sizes"
                      :key="index"
                      @click="createCircle(size.value)"
                    >
                      <v-list-tile-action>
                        <v-icon
                          :size="size.value"
                          class="far fa-circle"
                        ></v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>{{ size.title }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>

                <v-menu offset-y nudge-left="10" nudge-bottom="10">
                  <v-btn slot="activator" icon>
                    <v-icon class="far fa-square"></v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile
                      v-for="(size, index) in sizes"
                      :key="index"
                      @click
                    >
                      <v-list-tile-action>
                        <v-icon
                          :size="size.value"
                          class="far fa-square"
                        ></v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>{{ size.title }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-toolbar>
              <v-stage @click="stageClick" ref="stage" :config="configKonva">
                <v-layer ref="layer">
                  <v-group ref="group" @click="groupClick" :config="group[0]">
                    <v-circle
                      :ref="group[0].tables[0].name"
                      :config="group[0].tables[0]"
                    ></v-circle>
                    <v-circle
                      :ref="group[0].tables[1].name"
                      :config="group[0].tables[1]"
                    ></v-circle>
                  </v-group>
                  <template v-for="circle in circles">
                    <v-circle
                      @click="circleClick"
                      :ref="circle.config.name"
                      :config="circle.config"
                      :key="circle.config.name"
                    ></v-circle>
                  </template>
                </v-layer>
              </v-stage>
            </v-card>
          </v-flex>
          <!-- <v-spacer></v-spacer> -->
          <v-flex xs12 md3>
            <v-card>
              <v-toolbar dark>
                <v-toolbar-title>Tables</v-toolbar-title>
              </v-toolbar>

              <v-list>
                <v-list-tile
                  :id="circle.config.name"
                  v-for="circle in circles"
                  :key="circle.config.name"
                  @click="circleSelect(circle.config.name)"
                >
                  <v-list-tile-action>
                    <!-- <v-btn icon> -->
                    <v-icon>home</v-icon>
                    <!-- </v-btn> -->
                  </v-list-tile-action>

                  <v-list-tile-title>{{ circle.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data() {
    return {
      configKonva: {
        width: 1200,
        height: 792
      },
      stage: null,
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
      group: [
        {
          name: "g1",
          x: 413.72478260927284,
          y: 298.64102304950075,
          scaleX: 1.9212671059341182,
          scaleY: 3.082911768398856,
          rotation: 54.553455263245624,
          width: 100,
          height: 100,
          visible: true,
          draggable: true,
          tables: [
            {
              name: "g1-c1",
              radius: 70,
              fill: "purple",
              scaleX: 0.5,
              scaleY: 0.5,
              rotation: 40,
              stroke: "black",
              strokeWidth: 4
            },
            {
              name: "g1-c2",
              radius: 40,
              fill: "orange",
              scaleX: 0.5,
              scaleY: 0.5,
              rotation: 40,
              stroke: "black",
              strokeWidth: 4
            }
          ]
        }
      ],
      circles: [
        {
          id: 0,
          title: "Circle1",
          config: {
            name: "c1",
            x: 100,
            y: 100,
            radius: 70,
            fill: "red",
            scaleX: 0.5,
            scaleY: 0.5,
            rotation: 40,
            stroke: "black",
            strokeWidth: 4,
            draggable: true
          }
        },
        {
          id: 1,
          title: "Circle2",
          config: {
            name: "c2",
            x: 300,
            y: 300,
            radius: 70,
            fill: "blue",
            stroke: "black",
            strokeWidth: 4
          }
        },
        {
          id: 2,
          title: "Circle3",
          config: {
            name: "c3",
            x: 500,
            y: 300,
            radius: 70,
            fill: "green",
            stroke: "black",
            strokeWidth: 4
          }
        }
      ]
    };
  },
  mounted() {
    this.stage = this.$refs.stage.getStage();
  },
  computed: {
    x() {
      return this.group[0].x;
    }
  },
  methods: {
    stageClick(e) {
      let stage = this.$refs.stage.getStage();
      // if click on empty area - remove all transformers
      if (e.target === stage) {
        stage.find("Transformer").destroy();
        stage.draw();
        return;
      }
    },
    circleClick(e) {
      console.log("Target", e.target);
      // let stage = this.$refs.stage.getStage();
      this.stage.find("Transformer").destroy();
      // create new transformer
      var tr = new window.Konva.Transformer();
      let layer = this.$refs.layer.getStage(tr);
      tr.attachTo(e.target); // no idea what to do here ...
      layer.add(tr);
      layer.draw();
    },
    groupClick(e) {
      console.log(e);
      let c = "." + "g1";
      // let stage = this.$refs.stage.getStage();
      // console.log(stage.find(c)[0]);
      this.stage.find("Transformer").destroy();
      // create new transformer
      var tr = new window.Konva.Transformer();
      let layer = this.$refs.layer.getStage();
      let group = this.stage.find(".g1")[0];
      tr.attachTo(group); // no idea what to do here ...
      // group.add(tr);
      layer.add(tr);
      layer.draw();
    },
    circleSelect(circle) {
      let c = "." + String(circle);
      let stage = this.$refs.stage.getStage();
      console.log(stage.find(c)[0]);
      stage.find("Transformer").destroy();
      // create new transformer
      var tr = new window.Konva.Transformer();
      let layer = this.$refs.layer.getStage(tr);
      tr.attachTo(stage.find(c)[0]); // no idea what to do here ...
      layer.add(tr);
      layer.draw();
    },
    groupCircleSelect(circle) {
      let c = "." + String(circle);
      let stage = this.$refs.stage.getStage();
      // console.log(stage.find(c)[0]);
      stage.find("Transformer").destroy();
      // create new transformer
      var tr = new window.Konva.Transformer();
      let layer = this.$refs.layer.getStage(tr);
      let group = stage.find(".g1");
      tr.attachTo(stage.find(c)[0]); // no idea what to do here ...
      group.add(tr);
      layer.add(group);
      layer.draw();
    },
    createCircle(size) {
      let sizeVal;
      switch (size) {
        case "small":
          sizeVal = 0.5;
          break;
        case "medium":
          sizeVal = 1;
          break;
        case "large":
          sizeVal = 1.5;
          break;
        default:
          break;
      }
      let circle = {
        id: this.circles.length,
        title: "Circle" + (this.circles.length + 1),
        config: {
          name: "c" + (this.circles.length + 1),
          x: 50,
          y: 50,
          scaleX: sizeVal,
          scaleY: sizeVal,
          radius: 70,
          fill: "white",
          stroke: "black",
          strokeWidth: 4,
          draggable: true
        }
      };
      this.circles.push(circle);
    },
    createSquare(size) {
      let sizeVal;
      switch (size) {
        case "small":
          sizeVal = 0.5;
          break;
        case "medium":
          sizeVal = 1;
          break;
        case "large":
          sizeVal = 1.5;
          break;
        default:
          break;
      }
      let circle = {
        id: this.circles.length,
        title: "Circle" + (this.circles.length + 1),
        config: {
          name: "c" + (this.circles.length + 1),
          x: 50,
          y: 50,
          scaleX: sizeVal,
          scaleY: sizeVal,
          radius: 70,
          fill: "white",
          stroke: "black",
          strokeWidth: 4,
          draggable: true
        }
      };
      this.circles.push(circle);
    }
  }
};
</script>

<style scoped>
.test {
  width: 100%;
  height: 100%;
}
</style>

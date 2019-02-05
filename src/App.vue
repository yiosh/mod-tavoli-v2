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
          <v-flex xs12 md9 justify-center>
            <v-card width="1200">
              <v-toolbar dark>
                <v-toolbar-title>Canvas</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-stage @click="stageClick" ref="stage" :config="configKonva">
                <v-layer ref="layer">
                  <v-group
                    :ref="group.name"
                    @click="tableSelect(group.name)"
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
                        group.table.type === 'square' ||
                          group.table.type === 'rectangle'
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
          </v-flex>
          <!-- <v-spacer></v-spacer> -->
          <v-flex xs12 md3>
            <v-layout column wrap>
              <v-flex>
                <v-card>
                  <v-toolbar dark>
                    <v-toolbar-title>Crea tavolo</v-toolbar-title>
                  </v-toolbar>

                  <v-form @submit.prevent="createTable">
                    <v-container>
                      <v-layout>
                        <v-flex xs12 sm6 class="py-2">
                          <p>Type</p>
                          <v-btn-toggle v-model="createTableForm.type">
                            <v-btn flat value="circle">Tondo</v-btn>
                            <v-btn flat value="square">Quadrato</v-btn>
                            <v-btn flat value="rectangle">Rettangolare</v-btn>
                            <v-btn flat value="ellipse">Ovale</v-btn>
                          </v-btn-toggle>
                        </v-flex>
                      </v-layout>

                      <v-layout>
                        <v-flex xs12 sm6 class="py-2">
                          <p>Size</p>
                          <v-btn-toggle v-model="createTableForm.size">
                            <v-btn flat value="small">Picolo</v-btn>
                            <v-btn flat value="medium">Mediano</v-btn>
                            <v-btn flat value="large">Grande</v-btn>
                          </v-btn-toggle>
                        </v-flex>
                      </v-layout>

                      <v-layout>
                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="createTableForm.text"
                            label="Nome"
                            required
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="createTableForm.number"
                            label="Numero"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <v-divider></v-divider>
                    <v-container>
                      <v-layout justify-end>
                        <v-flex xs12>
                          <v-btn type="submit" dark color="green">Crea</v-btn>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-form>
                </v-card>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex>
                <v-card>
                  <v-toolbar dark>
                    <v-toolbar-title>Tables</v-toolbar-title>
                  </v-toolbar>

                  <v-list>
                    <v-list-tile
                      :id="group.name"
                      v-for="group in groups"
                      :key="group.name"
                      @click="tableSelect(group.name)"
                    >
                      <v-list-tile-action>
                        <v-icon class="fas fa-table"></v-icon>
                      </v-list-tile-action>

                      <v-list-tile-title>{{
                        group.table.textConfig.text
                      }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
            </v-layout>
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
      groups: [
        {
          name: "g0",
          x: 100,
          y: 100,
          rotation: 0,
          width: 100,
          height: 100,
          draggable: true,
          table: {
            id: 0,
            type: "circle",
            textConfig: {
              name: "g0-txt",
              text: "Simple Text",
              fontSize: 20,
              fontFamily: "Calibri",
              fill: "black",
              stroke: "black",
              padding: 50,
              strokeWidth: 1
            },
            tableConfig: {
              name: "g0-tbl",
              radius: 50,
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
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
    log(e) {
      console.log(e);
    },
    stageClick(e) {
      let stage = this.$refs.stage.getStage();
      // if click on empty area - remove all transformers
      if (e.target === stage) {
        stage.find("Transformer").destroy();
        stage.draw();
        return;
      }
    },
    tableSelect(group) {
      let name = "." + String(group) + "-tbl";
      this.stage.find("Transformer").destroy();
      // create new transformer
      var tr = new window.Konva.Transformer();
      let layer = this.$refs.layer.getStage(tr);
      let groupEl = this.stage.find("." + group)[0];
      tr.attachTo(this.stage.find(name)[0]); // no idea what to do here ...
      groupEl.add(tr);
      layer.add(groupEl);
      layer.draw();
    },
    createTable() {
      let index = this.groups.length;
      let groupName = "g" + index;
      let tableName = "g" + index + "-tbl";
      let textName = "g" + index + "-txt";
      let size;
      let table = {};
      let textConfig = {
        name: textName,
        text: this.createTableForm.text + this.createTableForm.number,
        fontSize: 20,
        fontFamily: "Calibri",
        fill: "black",
        stroke: "black",
        padding: size,
        strokeWidth: 1
      };

      switch (this.createTableForm.size) {
        case "small":
          size = 25;
          break;
        case "medium":
          size = 50;
          break;
        case "large":
          size = 75;
          break;
        default:
          break;
      }

      switch (this.createTableForm.type) {
        case "circle":
          table = {
            id: index,
            type: this.createTableForm.type,
            textConfig,
            tableConfig: {
              name: tableName,
              radius: size,
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        case "square":
          table = {
            id: index,
            type: this.createTableForm.type,
            textConfig,
            tableConfig: {
              name: tableName,
              width: size * 2,
              height: size * 2,
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        case "rectangle":
          table = {
            id: index,
            type: this.createTableForm.type,
            textConfig,
            tableConfig: {
              name: tableName,
              width: size * 2,
              height: size * 3,
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        case "ellipse":
          table = {
            id: index,
            type: this.createTableForm.type,
            textConfig,
            tableConfig: {
              name: tableName,
              radius: {
                x: size * 2,
                y: size
              },
              fill: "white",
              stroke: "black",
              strokeWidth: 2
            }
          };
          break;
        default:
          break;
      }

      let group = {
        name: groupName,
        x: 100,
        y: 100,
        rotation: 0,
        width: 100,
        height: 100,
        draggable: true,
        table
      };
      console.log("group", group);
      this.groups.push(group);
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

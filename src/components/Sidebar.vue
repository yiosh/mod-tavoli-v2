<template>
  <v-layout column wrap>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      hide-overlay
      right
      app
      dark
      :mini-variant="mini"
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar @click.stop="mini = !mini">
            <v-list-tile-avatar>
              <img src="../assets/condivision.jpeg" />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>Condivision Cloud</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon @click.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click="handleDialog(item.title)"
        >
          <v-list-tile-action>
            <v-tooltip left slot="activator">
              <v-icon slot="activator">{{ item.icon }}</v-icon>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <GuestList></GuestList>
    <PrintCanvas></PrintCanvas>
    <!-- <TableSelector></TableSelector> -->
  </v-layout>
</template>

<script>
import TableSelector from "./TableSelector";
import GuestList from "./GuestList";
import PrintCanvas from "./PrintCanvas";
import { EventBus } from "../event-bus.js";

export default {
  name: "Sidebar",
  components: {
    TableSelector,
    GuestList,
    PrintCanvas
  },
  data: () => ({
    drawer: true,
    items: [
      // { title: "Create Table", icon: "add_box" },
      { title: "Guest List", icon: "people" },
      { title: "Preview", icon: "print" }
    ],
    mini: true,
    right: null
  }),
  methods: {
    handleDialog(element) {
      switch (element) {
        case "Guest List":
          EventBus.$emit("guest-list-select");
          break;
        case "Preview":
          EventBus.$emit("preview-select");
          break;
      }
    }
  },
  created() {
    EventBus.$on("handle-drawer", () => {
      this.drawer = !this.drawer;
    });
  }
};
</script>

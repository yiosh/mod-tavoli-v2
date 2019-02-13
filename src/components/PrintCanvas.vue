<template>
  <v-layout row justify-center>
    <v-dialog max-width="1250" v-model="dialog">
      <v-btn slot="activator" @click="previewCanvas()" color="primary" dark
        >Preview</v-btn
      >
      <v-card>
        <!-- <v-card-title>Guest List</v-card-title> -->
        <v-divider></v-divider>
        <v-card-text style="padding:0">
          <iframe :src="src" frameborder="0"></iframe>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="dialog = false"
            >Close</v-btn
          >
          <v-btn dark color="blue darken-1" @click="PrintImage(src)"
            >Print</v-btn
          >
          <v-btn color="success" @click="downloadCanvas">Download</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import _ from "lodash";

export default {
  name: "GuestList",
  data() {
    return {
      src: null,
      dialog: false
    };
  },
  methods: {
    previewCanvas() {
      let dataURL = this.$store.state.stage.toDataURL({ pixelRatio: 1 });
      this.src = dataURL;
    },
    downloadURI(uri, name) {
      let link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    downloadCanvas() {
      this.downloadURI(this.src, "stage.png");
      this.dialog = false;
    },
    ImagetoPrint(source) {
      return (
        "<html><head><script>function step1(){\n" +
        "setTimeout('step2()', 10);}\n" +
        "function step2(){window.print();window.close()}\n" +
        "</scri" +
        "pt></head><body onload='step1()'>\n" +
        "<img src='" +
        source +
        "' /></body></html>"
      );
    },
    PrintImage(source) {
      let pwa = window.open("", "_new");
      pwa.document.open();
      pwa.document.write(this.ImagetoPrint(source));
      pwa.document.close();
    }
  }
};
</script>

<style scoped>
iframe {
  height: 80vh;
  width: 100%;
}
</style>

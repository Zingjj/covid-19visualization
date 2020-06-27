<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />-->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <TotalNumBar :data="interNationalData" />
  </div>
</template>

<script>
// @ is an alias to /src
import TotalNumBar from "@/components/TotalNumBar.vue";
import InterNationalData from "../../static/DXYArea.json";
export default {
  name: "home",
  data() {
    return {
      interNationalData: Array
    };
  },
  components: {
    TotalNumBar
  },
  created: function() {
    // created函数中的this指向当前vm实例
    this.getInternationalData();
  },
  methods: {
    getInternationalData() {
      this.interNationalData = InterNationalData.results;
      console.log(this.interNationalData);
    }
  }
};
</script>

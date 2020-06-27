<template>
  <div>
    <TotalNumBar :data="domesticData" />
    <h1>国内数据</h1>
  </div>
</template>
<script>
import TotalNumBar from "@/components/TotalNumBar.vue";
// import axios from "axios";
import DomesticData from "../../static/DXYOverall.json";
export default {
  name: "China",
  data() {
    return {
      domesticData: ""
    };
  },
  components: {
    TotalNumBar
  },
  created: function() {
    // created函数中的this指向当前vm实例
    this.getDomesticData();
  },
  methods: {
    getDomesticData() {
      this.domesticData = DomesticData.results;
      console.log(this.domesticData);
    }
  }
};
</script>
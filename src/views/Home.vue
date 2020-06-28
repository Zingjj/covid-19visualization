<template>
  <!-- <img alt="Vue logo" src="../assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />-->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  <el-container>
    <el-header>
      <TotalNumBar :data="interNationalData" />
    </el-header>
    <el-main>国际数据</el-main>
    <el-footer>
      <Footer />
    </el-footer>
  </el-container>
</template>

<script>
// @ is an alias to /src
import TotalNumBar from "@/components/TotalNumBar.vue";
import InterNationalData from "../../static/DXYOverall.json";
import Footer from "@/components/Footer.vue";
export default {
  name: "home",
  data() {
    return {
      interNationalData: Object
    };
  },
  components: {
    TotalNumBar,
    Footer
  },
  created: function() {
    // created函数中的this指向当前vm实例
    this.getInternationalData();
  },
  methods: {
    getInternationalData() {
      this.interNationalData = InterNationalData.results[0].globalStatistics;
      console.log(this.interNationalData);
    }
  }
};
</script>

<style>
body > .el-container {
  margin-bottom: 40px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
}
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  height: auto !important;
  /* line-height: 60px; */
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}
</style>

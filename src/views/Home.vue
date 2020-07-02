<template>
  <!-- <img alt="Vue logo" src="../assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />-->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  <el-container>
    <el-header>
      <TotalNumBar :data="interNationalData" />
    </el-header>
    <el-main>
      <el-row :gutter="10">
        <el-col :span="15">
          <div class="grid-content bg-purple" style="height:600px"></div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple-light" style="height:600px"></div>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <Footer />
    </el-footer>
  </el-container>
</template>

<script>
// @ is an alias to /src
import TotalNumBar from "@/components/TotalNumBar.vue";
import InterNationalData from "../../static/DXYOverall.json";
// import CountryCode from "../../static/CountryCode.csv";
import Footer from "@/components/Footer.vue";
import axios from "axios";
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
  mounted() {
    // CountryCode
    this.csvToJSON();
  },
  methods: {
    getInternationalData() {
      this.interNationalData = InterNationalData.results[0].globalStatistics;
      console.log(this.interNationalData);
    },
    csvToJSON() {
      // var lines = csv.split("\n");

      // var result = [];

      // var headers = lines[0].split(",");

      // for (var i = 1; i < lines.length; i++) {
      //   var obj = {};
      //   var currentline = lines[i].split(",");

      //   for (var j = 0; j < headers.length; j++) {
      //     obj[headers[j]] = currentline[j];
      //   }

      //   result.push(obj);
      // }
      // console.log(JSON.stringify(result));

      //return result; //JavaScript object
      // return JSON.stringify(result);
      axios.get("../../static/CountryCode.csv").then(res => {
        console.log(res.data);
      });
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

<template>
  <!-- <img alt="Vue logo" src="../assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />-->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  <el-container>
    <el-header>
      <TotalNumBar :data="interNationalData" />
    </el-header>
    <el-main>
      <!-- <el-row :gutter="10">
        <el-col :span="15">
          <div class="grid-content bg-purple" style="height:600px">
            <div class="myEchart" style="width:100%;height:100%"></div>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple-light" style="height:600px"></div>
        </el-col>
      </el-row>-->
      <!-- <div id="myEchart" style="height:550px;width:100%"></div> -->
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
  mounted() {
    // CountryCode
    // this.getCountryCode();
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
  height: 600px;
  width: 100%;
  background: url("../assets/bg.jpg");
  background-size: cover;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}
</style>

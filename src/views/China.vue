<template>
  <el-container>
    <el-header>
      <TotalNumBar :data="domesticData" />
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <div id="provinceTotalBar" :style="{width: '500px', height: '1000px'}"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light"></div>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <Footer />
    </el-footer>
  </el-container>
</template>
<script>
import TotalNumBar from "@/components/TotalNumBar.vue";
import DomesticData from "../../static/DXYOverall.json";
import Footer from "@/components/Footer.vue";
// import axios from "axios";
import TimeSeriesData from "../../static/Wuhan-2019-nCoV.json";
// static\Wuhan-2019-nCoV.json
// import
export default {
  name: "China",
  data() {
    return {
      domesticData: Object,
      provinceData: Array,
      provinceTimeSeriesConfirmedData: Map,
      provinceTimeSeriesCuredData: Map,
      provinceTimeSeriesDeadData: Map,
      provinceCodeSortByConfirmed: Array,
      provinceNameSortByConfirmed: Array,
      confirmedSorted: Array,
      curedSorted: Array,
      deadSorted: Array,
      provinceCode: {
        110000: "北京",
        120000: "天津",
        310000: "上海",
        500000: "重庆",
        130000: "河北",
        410000: "河南",
        530000: "云南",
        210000: "辽宁",
        230000: "黑龙江",
        430000: "湖南",
        340000: "安徽",
        370000: "山东",
        650000: "新疆",
        320000: "江苏",
        330000: "浙江",
        360000: "江西",
        420000: "湖北",
        450000: "广西",
        620000: "甘肃",
        140000: "山西",
        150000: "内蒙古",
        610000: "陕西",
        220000: "吉林",
        350000: "福建",
        520000: "贵州",
        440000: "广东",
        630000: "青海",
        540000: "西藏",
        510000: "四川",
        640000: "宁夏",
        460000: "海南",
        820000: "澳门",
        810000: "香港",
        710000: "台湾"
      }
    };
  },
  components: {
    TotalNumBar,
    Footer
  },
  mounted() {
    this.drawProvinceTotalVBar();
  },
  created: function() {
    // created函数中的this指向当前vm实例
    this.getDomesticData();
    this.getDataByProvince();
    this.getTimeSeriesConfirmedData();
    this.getTimeSeriesCuredData();
    this.getTimeSeriesDeadData();
    this.sortMapData(this.provinceTimeSeriesConfirmedData);
  },
  methods: {
    getDomesticData() {
      this.domesticData = DomesticData.results[0];
      console.log(this.domesticData);
    },
    /**
     * 整理全国各省份数据
     */
    getDataByProvince() {
      this.provinceData = new Array();
      TimeSeriesData.forEach(element => {
        if (element.country === "中国" && element.city === null) {
          this.provinceData.push(element);
        }
      });
    },
    /**
     * 获取全国各省份累计确诊数据
     */
    getTimeSeriesConfirmedData() {
      // console.log(TimeSeriesData);
      let tmpMap1 = new Map(); //存储confirmed数据
      // domesticTimeSeriesData为map类型，其中key为provinceCode，value为confirmed
      this.provinceData.forEach(item => {
        // 不存在该省份编码的确诊信息
        if (tmpMap1.get(item.provinceCode) === undefined) {
          tmpMap1.set(item.provinceCode, item.confirmed);
        }
        // 已存在该省份编码的确诊数量信息
        if (item.confirmed > tmpMap1.get(item.provinceCode)) {
          // 更新省份确诊信息
          tmpMap1.delete(item.provinceCode);
          tmpMap1.set(item.provinceCode, item.confirmed);
        }
      });
      // console.log(this.provinceData);
      console.log(tmpMap1);
      this.provinceTimeSeriesConfirmedData = tmpMap1;
    },
    /**
     * 获取全国各省份累计治愈数据
     */
    getTimeSeriesCuredData() {
      let tmpMap1 = new Map(); //存储cured数据
      // domesticTimeSeriesData为map类型，其中key为provinceCode，value为cured
      this.provinceData.forEach(item => {
        // 不存在该省份编码的确诊信息
        if (tmpMap1.get(item.provinceCode) === undefined) {
          tmpMap1.set(item.provinceCode, item.cured);
        }
        // 已存在该省份编码的确诊数量信息
        if (item.cured > tmpMap1.get(item.provinceCode)) {
          // 更新省份确诊信息
          tmpMap1.delete(item.provinceCode);
          tmpMap1.set(item.provinceCode, item.cured);
        }
      });
      // console.log(this.provinceData);
      console.log(tmpMap1);
      this.provinceTimeSeriesCuredData = tmpMap1;
    },
    /**
     * 获取全国各省份累计死亡数据
     */
    getTimeSeriesDeadData() {
      let tmpMap1 = new Map(); //存储cured数据
      // domesticTimeSeriesData为map类型，其中key为provinceCode，value为cured
      this.provinceData.forEach(item => {
        // 不存在该省份编码的确诊信息
        if (tmpMap1.get(item.provinceCode) === undefined) {
          tmpMap1.set(item.provinceCode, item.dead);
        }
        // 已存在该省份编码的确诊数量信息
        if (item.dead > tmpMap1.get(item.provinceCode)) {
          // 更新省份确诊信息
          tmpMap1.delete(item.provinceCode);
          tmpMap1.set(item.provinceCode, item.dead);
        }
      });
      // console.log(this.provinceData);
      console.log(tmpMap1);
      this.provinceTimeSeriesDeadData = tmpMap1;
    },
    /**
     * Map排序
     */
    sortMapData(mapData) {
      // 先将map数据转换为array类型
      var arrObj = Array.from(mapData);
      arrObj.sort(function(a, b) {
        return a[1] - b[1];
      });
      // console.log(arrObj);
      this.provinceCodeSortByConfirmed = new Array();
      this.provinceNameSortByConfirmed = new Array();
      this.confirmedSorted = new Array();
      this.curedSorted = new Array();
      this.deadSorted = new Array();
      arrObj.pop(); //将最后一项的全国数据移除
      arrObj.forEach(item => {
        this.provinceCodeSortByConfirmed.push(item[0]);
        this.provinceNameSortByConfirmed.push(this.provinceCode[item[0]]);
        this.confirmedSorted.push(item[1]);
        // 获取provinceCode为item[0]的省份的cured数据
        this.curedSorted.push(this.provinceTimeSeriesCuredData.get(item[0]));
        this.deadSorted.push(this.provinceTimeSeriesDeadData.get(item[0]));
      });
      console.log(this.provinceCodeSortByConfirmed);
      console.log(this.provinceNameSortByConfirmed);
      console.log(this.confirmedSorted);
      console.log(this.curedSorted);
      console.log(this.deadSorted);
    },
    /**
     * 绘制省份累计确诊、治愈、死亡数柱状图
     */
    drawProvinceTotalVBar() {
      console.log("绘制");

      let myChart = this.$echarts.init(
        document.getElementById("provinceTotalBar")
      );
      // // 绘制柱状图
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["累计确诊", "累计治愈", "累计死亡"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: this.provinceNameSortByConfirmed
        },
        series: [
          {
            name: "累计确诊",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideLeft"
            },
            data: this.confirmedSorted
          },
          {
            name: "累计治愈",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideLeft"
            },
            data: this.curedSorted
          },
          {
            name: "累计死亡",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideLeft"
            },
            data: this.deadSorted
          }
        ]
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
  height: auto !important;
}
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  height: auto !important;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}
</style>

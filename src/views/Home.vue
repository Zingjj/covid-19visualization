<template>
  <!-- <img alt="Vue logo" src="../assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />-->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  <el-container>
    <el-header>
      <TotalNumBar :data="interNationalData" />
    </el-header>
    <el-main>
      <el-tabs tab-position="right" style="height:600px;width:100%;">
        <el-tab-pane label="疾病地图" style="width:100%">
          <el-tag effect="plain">全球新冠肺炎疾病热力图</el-tag>
          <el-row>
            <el-col :span="18">
              <div id="diseaseMap" style="height:550px;width:900px;"></div>
            </el-col>
            <el-col :span="6">
              <div id="diseasePie" style="height:550px;width:290px;"></div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane
          label="柱状图"
          style="height:550px;width:1150px;overflow-y:auto;overflow-x:hidden;"
        >
          <el-tag effect="plain">全球各国累计确诊、累计治愈、累计死亡柱状图</el-tag>
          <div id="countryTotalBar" style="height:5000px;width:1100px"></div>
        </el-tab-pane>
      </el-tabs>
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
import TimeSeriesData from "../../static/Wuhan-2019-nCoV.json";
import CountryCode from "../../static/CountryCode.json";
export default {
  name: "home",
  data() {
    return {
      interNationalData: Object,
      countryData: [],
      countryTimeSeriesConfirmedData: Map,
      countryTimeSeriesConfirmedDataForMap: Map,
      countryTimeSeriesCuredData: Map,
      countryTimeSeriesDeadData: Map,
      countryNameChSortByConfirmed: [],
      countryNameEnSortByConfirmed: [],
      confirmedSorted: [],
      curedSorted: [],
      deadSorted: [],
      totalMapConfirmedData: [],
      countryCode: [],
      curedRate: [],
      deadRate: []
    };
  },
  components: {
    TotalNumBar,
    Footer
  },
  mounted() {
    // CountryCode
    // this.getCountryCode();
    this.drawProvinceTotalBar();
    this.drawMap();
  },
  created: function() {
    // created函数中的this指向当前vm实例
    this.getInternationalData();
    this.getDataByCountry();
    this.getTimeSeriesConfirmedData();
    this.getTimeSeriesCuredData();
    this.getTimeSeriesDeadData();
    this.getBarDataReady(this.countryTimeSeriesConfirmedData);
    this.getMapDataReady();
  },

  methods: {
    /**
     * 整理各国countryCode
     */
    // getCountryCode() {
    //   CountryCode.forEach(item => {});
    // },
    getInternationalData() {
      this.interNationalData = InterNationalData.results[0].globalStatistics;
      // console.log(this.interNationalData);
    },
    /**
     * 整理全球各国数据
     */
    getDataByCountry() {
      TimeSeriesData.forEach(element => {
        if (element.province === null) {
          this.countryData.push(element);
        }
      });
      // console.log(this.countryData);
    },
    /**
     * 获取全球累计确诊数据
     */
    getTimeSeriesConfirmedData() {
      // console.log(TimeSeriesData);
      let tmpMap1 = new Map(); //存储confirmed数据
      let tmpMap2 = new Map(); //存储confirmed数据
      // domesticTimeSeriesData为map类型，其中key为provinceCode，value为confirmed
      this.countryData.forEach(item => {
        // 不存在该国家编码的确诊信息
        if (tmpMap1.get(item.country) === undefined) {
          tmpMap1.set(item.country, item.confirmed);
        }
        // 已存在该省份编码的确诊数量信息
        if (item.confirmed > tmpMap1.get(item.country)) {
          // 更新省份确诊信息
          tmpMap1.delete(item.country);
          tmpMap1.set(item.country, item.confirmed);
        }
      });
      // console.log(this.countryData);
      // console.log(tmpMap1);
      // 存储全球数据
      this.countryTimeSeriesConfirmedData = tmpMap1;
      // 筛选出国家数据
      this.countryData.forEach(item => {
        if (item.countryCode !== null) {
          // 不存在该国家编码的确诊信息
          if (tmpMap2.get(item.country) === undefined) {
            tmpMap2.set(item.country, item.confirmed);
          }
          // 已存在该省份编码的确诊数量信息
          if (item.confirmed > tmpMap2.get(item.country)) {
            // 更新省份确诊信息
            tmpMap2.delete(item.country);
            tmpMap2.set(item.country, item.confirmed);
          }
        }
      });
      // console.log(tmpMap2);
      this.countryTimeSeriesConfirmedDataForMap = tmpMap2;
    },
    /**
     * 获取全球各国累计治愈数据
     */
    getTimeSeriesCuredData() {
      let tmpMap1 = new Map(); //存储cured数据
      // domesticTimeSeriesData为map类型，其中key为provinceCode，value为cured
      this.countryData.forEach(item => {
        // 不存在该省份编码的确诊信息
        if (tmpMap1.get(item.country) === undefined) {
          tmpMap1.set(item.country, item.cured);
        }
        // 已存在该省份编码的确诊数量信息
        if (item.cured > tmpMap1.get(item.country)) {
          // 更新省份确诊信息
          tmpMap1.delete(item.country);
          tmpMap1.set(item.country, item.cured);
        }
      });
      // console.log(this.countryData);
      // console.log(tmpMap1);
      this.countryTimeSeriesCuredData = tmpMap1;
    },
    /**
     * 获取全球各国累计死亡数据
     */
    getTimeSeriesDeadData() {
      let tmpMap1 = new Map(); //存储cured数据
      // domesticTimeSeriesData为map类型，其中key为provinceCode，value为cured
      this.countryData.forEach(item => {
        // 不存在该省份编码的确诊信息
        if (tmpMap1.get(item.country) === undefined) {
          tmpMap1.set(item.country, item.dead);
        }
        // 已存在该省份编码的确诊数量信息
        if (item.dead > tmpMap1.get(item.country)) {
          // 更新省份确诊信息
          tmpMap1.delete(item.country);
          tmpMap1.set(item.country, item.dead);
        }
      });
      // console.log(this.countryData);
      // console.log(tmpMap1);
      this.countryTimeSeriesDeadData = tmpMap1;
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
      return arrObj;
    },
    /**
     * 准备好柱状图数据
     */
    getBarDataReady(mapData) {
      var arr = this.sortMapData(mapData);
      // this.confirmedSorted = new Array();
      // this.curedSorted = new Array();
      // this.deadSorted = new Array();
      // var arrExceptWuhan = new Array();
      // 深拷贝
      // arr.forEach(item => {
      //   if (item[0] != "420000") {
      //     arrExceptWuhan.push(item);
      //   }
      // });
      this.completeBarData(arr);
    },
    /**
     * 在CountryCode中查找对应的国家的英文名
     */
    // getCountryNameEn(nameCh) {
    //   CountryCode.forEach(item => {
    //     if (item.name === nameCh) {
    //       // console.log(item.name);
    //       // console.log(nameCh);
    //       // console.log(item.name_en);

    //       return item.name_en;
    //     }
    //   });
    // },
    /**
     * 拼接柱状图数据
     */
    completeBarData(arrObj) {
      arrObj.forEach(item => {
        this.countryNameChSortByConfirmed.push(item[0]);
        this.confirmedSorted.push(item[1]);
        // 获取provinceCode为item[0]的省份的cured数据
        this.curedSorted.push(this.countryTimeSeriesCuredData.get(item[0]));
        this.curedRate.push(
          this.countryTimeSeriesCuredData.get(item[0]) / item[1]
        );
        this.deadSorted.push(this.countryTimeSeriesDeadData.get(item[0]));
        this.deadRate.push(
          this.countryTimeSeriesDeadData.get(item[0]) / item[1]
        );
      });
    },
    drawProvinceTotalBar() {
      // console.log("绘制");
      let myChart1 = this.$echarts.init(
        document.getElementById("countryTotalBar")
      );

      // 绘制柱状图
      myChart1.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["累计确诊", "累计治愈", "累计死亡", "治愈率", "死亡率"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        // xAxis: {
        //   type: "value"
        // },
        xAxis: [
          {
            type: "value",
            scale: true,
            name: "人数",
            max: 5000000,
            min: 0
            // boundaryGap: [0.2, 0.2]
          },
          {
            type: "value",
            scale: true,
            name: "比例",
            max: 1,
            min: 0
            // boundaryGap: [0.2, 0.2]
          }
        ],
        yAxis: {
          type: "category",
          data: this.countryNameChSortByConfirmed
        },
        series: [
          {
            name: "累计确诊",
            type: "bar",
            stack: "总量",
            xAxisIndex: 0,
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
            xAxisIndex: 0,
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
            xAxisIndex: 0,
            label: {
              show: true,
              position: "insideLeft"
            },
            data: this.deadSorted
          },
          {
            name: "治愈率",
            type: "line",
            xAxisIndex: 1,
            label: {
              show: true,
              position: "insideLeft"
            },
            data: this.curedRate
          },
          {
            name: "死亡率",
            type: "line",
            xAxisIndex: 1,
            data: this.deadRate
          }
        ]
      });
    },
    /**
     * 准备地图数据
     */
    getMapDataReady() {
      var arrObj = new Array();
      // let that = this;
      this.countryTimeSeriesConfirmedDataForMap.forEach((value, key) => {
        var tmpObj = { name: String, value: 0 };
        CountryCode.forEach(item => {
          if (item.name === key) {
            tmpObj.name = item.name_en;
            return;
          }
        });
        // tmpObj.name = that.getCountryNameEn(key);
        tmpObj.value = value;
        arrObj.push(tmpObj);
      });
      this.totalMapConfirmedData = arrObj;
      // console.log(arrObj);
    },
    drawMap() {
      let mapChart = this.$echarts.init(document.getElementById("diseaseMap"));
      let pieChart = this.$echarts.init(document.getElementById("diseasePie"));
      let that = this;
      mapChart.setOption({
        tooltip: {
          formatter: function(params) {
            var info =
              '<p style="font-size:15px">' +
              params.name +
              '</p><p style="font-size:14px">' +
              "累计确诊人数：" +
              params.value +
              "</p>";
            return info;
          }
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        //左侧小导航图标
        visualMap: {
          min: 0,
          max: 2000000,
          text: ["High", "Low"],
          realtime: false,
          calculable: true,
          inRange: {
            color: ["LightSalmon", "Coral", "OrangeRed"]
          }
        },
        series: [
          {
            name: "全球确诊热力图",
            type: "map",
            mapType: "world",
            zoom: 1.2,
            roam: true,
            label: {
              normal: {
                show: false //显示省份标签
              },
              emphasis: {
                show: true //对应的鼠标悬浮效果
              }
            },
            data: this.totalMapConfirmedData
          }
        ]
      });
      mapChart.on("click", function(event) {
        // console.log(event);
        // event.data.name是该地英文名称
        // 需要从CountryCode中找到对应中文名
        // 然后在this.countryTimeSeriesCuredData中找到对应治愈数据
        // 在this.countryTimeSeriesDeadData中找到对应死亡数据
        var tmpStr = "";
        CountryCode.forEach(item => {
          if (item.name_en === event.data.name) {
            tmpStr = item.name;
            return;
          }
        });
        var curedNum = that.countryTimeSeriesCuredData.get(tmpStr);
        var deadNum = that.countryTimeSeriesDeadData.get(tmpStr);
        pieChart = that.$echarts.init(document.getElementById("diseasePie"));
        pieChart.setOption({
          title: {
            text: tmpStr,
            left: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            // orient: 'vertical',
            // top: 'middle',
            bottom: 10,
            left: "center",
            data: ["死亡", "治愈", "已确诊"]
          },
          series: [
            {
              type: "pie",
              radius: "40%",
              center: ["50%", "50%"],
              selectedMode: "single",
              data: [
                { value: deadNum, name: "死亡" },
                { value: curedNum, name: "治愈" },
                { value: event.data.value - deadNum - curedNum, name: "已确诊" }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        });

        // var xAxisInfo = event.axesInfo[0];
        // if (xAxisInfo) {
        //     var dimension = xAxisInfo.value + 1;
        //     mapChart.setOption({
        //         series: {
        //             id: 'pie',
        //             label: {
        //                 formatter: '{b}: {@[' + dimension + ']} ({d}%)'
        //             },
        //             encode: {
        //                 value: dimension,
        //                 tooltip: dimension
        //             }
        //         }
        //     });
        // }
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
  height: auto;
  width: 100%;
  background-color: #e9eef3;
  background-size: cover;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}
</style>

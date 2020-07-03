<template>
  <el-container>
    <el-header>
      <TotalNumBar :data="domesticData" />
    </el-header>
    <el-main>
      <el-row :gutter="10">
        <el-col :span="15">
          <el-row>
            <div class="grid-content bg-purple" style="height:370px">
              <div id="diseaseMap" style="height:350px;width:440px;float:left;margin-top:10px"></div>
              <!--  type="border-card" -->
              <el-tabs style="width:350px;float:left">
                <el-tab-pane label="全国数据" style="height:300px;overflow-y:auto;overflow-x:hidden;">
                  <div id="provinceTotalBar" :style="{width: '320px', height: '1000px'}"></div>
                </el-tab-pane>
                <el-tab-pane label="除湖北外" style="height:300px;overflow-y:auto;overflow-x:hidden;">
                  <div id="otherAreaBar" :style="{width: '320px', height: '1000px'}"></div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-row>
          <el-row>
            <div class="grid-content bg-purple" style="height:340px">
              <el-col :span="15">
                <el-tag effect="plain" class="timeLineTag">
                  <span style="font-size:14px">全国每日确诊人数变化曲线</span>
                </el-tag>
                <div id="timeSeriesLine_QG" :style="{width: '530px', height: '300px'}"></div>
              </el-col>
              <el-col :span="9">
                <el-card class="box-card" style="height:340px;overflow-y:auto;overflow-x:hidden;">
                  <div slot="header" class="clearfix">
                    <span>全国每日确诊人数变化数据</span>
                  </div>
                  <div
                    v-for="(item,index) in lineSeriesConfirmedData_QG"
                    :key="index"
                    class="text item"
                  >{{item[0] + "：" +item[1]}}</div>
                </el-card>
              </el-col>
            </div>
          </el-row>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple-light">
            <el-tabs tab-position="right" style="height: 740px;">
              <el-tab-pane label="全国">
                <el-tag effect="plain">
                  <span style="font-size:14px">全国新增确诊人数日历热力图</span>
                </el-tag>
                <div id="calenderHeatmap_QG" :style="{width: '430px', height: '700px'}"></div>
              </el-tab-pane>
              <el-tab-pane label="湖北省">
                <el-tag effect="plain">
                  <span style="font-size:14px">湖北省新增确诊人数日历热力图</span>
                </el-tag>
                <div id="calenderHeatmap_Hubei" :style="{width: '430px', height: '700px'}"></div>
              </el-tab-pane>
            </el-tabs>
          </div>
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
      // 以下为含湖北数据
      provinceCodeSortByConfirmed: [],
      provinceNameSortByConfirmed: [],
      confirmedSorted: [],
      curedSorted: [],
      deadSorted: [],
      // 以下为不含湖北数据
      provinceCodeSortByConfirmed_xHB: [],
      provinceNameSortByConfirmed_xHB: [],
      confirmedSorted_xHB: [],
      curedSorted_xHB: [],
      deadSorted_xHB: [],
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
      },
      totalMapConfirmedData: Array,
      HubeiTimeSeriesData: Array,
      QGTimeSeriesData: [],
      calendarData2019_Hubei: [],
      calendarData2020_Hubei: [],
      lineSeriesConfirmedData_QG: [],
      calendarData2019_QG: [],
      calendarData2020_QG: []
    };
  },
  components: {
    TotalNumBar,
    Footer
  },
  mounted() {
    this.drawProvinceTotalBar();
    this.drawMap();
    this.drawCalendarHeatmap_Hubei();
    this.drawCalendarHeatmap_QG();
    this.drawTimeSeriesLine_QG();
  },
  created: function() {
    // created函数中的this指向当前vm实例
    this.getDomesticData();
    this.getDataByProvince();
    this.getTimeSeriesConfirmedData();
    this.getTimeSeriesCuredData();
    this.getTimeSeriesDeadData();
    this.getBarDataReady(this.provinceTimeSeriesConfirmedData);
    this.getMapDataReady();
    this.getCalendarHeatmapData_Hubei();
    this.getCalHeatmapDataReady_Hubei();
    this.getTimeSeriesData_QG();
    this.getCalHeatmapDataReady_QG();
    this.getTimeSeriesData_QG();
    this.getTimeSeriesLineDataReady_QG();
  },
  methods: {
    getDomesticData() {
      this.domesticData = DomesticData.results[0];
      // console.log(this.domesticData);
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
      // console.log(tmpMap1);
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
      // console.log(tmpMap1);
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
      // console.log(tmpMap1);
      this.provinceTimeSeriesDeadData = tmpMap1;
    },
    /**
     * 选择呈现数据
     */
    // selectShowData(val) {
    //   //显示全国数据
    //   console.log(val);

    //   if (this.area === "total") {
    //     this.sortMapData(this.provinceTimeSeriesConfirmedData);
    //     this.drawProvinceTotalBar();
    //   }
    //   if (this.area === "otherArea") {
    //     let tmpMap = this.provinceTimeSeriesConfirmedData;
    //     console.log(tmpMap.delete("420000"));

    //     this.sortMapData(tmpMap.delete("420000"));
    //     this.drawProvinceTotalBar();
    //   }
    // },
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
     * 拼接柱状图1数据
     */
    completeMapData_1(arrObj) {
      arrObj.forEach(item => {
        this.provinceCodeSortByConfirmed.push(item[0]);
        this.provinceNameSortByConfirmed.push(this.provinceCode[item[0]]);
        this.confirmedSorted.push(item[1]);
        // 获取provinceCode为item[0]的省份的cured数据
        this.curedSorted.push(this.provinceTimeSeriesCuredData.get(item[0]));
        this.deadSorted.push(this.provinceTimeSeriesDeadData.get(item[0]));
      });
    },
    /**
     * 拼接柱状图2数据
     */
    completeMapData_2(arrObj) {
      arrObj.forEach(item => {
        this.provinceCodeSortByConfirmed_xHB.push(item[0]);
        this.provinceNameSortByConfirmed_xHB.push(this.provinceCode[item[0]]);
        this.confirmedSorted_xHB.push(item[1]);
        // 获取provinceCode为item[0]的省份的cured数据
        this.curedSorted_xHB.push(
          this.provinceTimeSeriesCuredData.get(item[0])
        );
        this.deadSorted_xHB.push(this.provinceTimeSeriesDeadData.get(item[0]));
      });
    },
    /**
     * 准备好柱状图数据
     */
    getBarDataReady(mapData) {
      var arr = this.sortMapData(mapData);
      // this.provinceCodeSortByConfirmed = new Array();
      // this.provinceNameSortByConfirmed = new Array();
      // this.confirmedSorted = new Array();
      // this.curedSorted = new Array();
      // this.deadSorted = new Array();
      // this.provinceCodeSortByConfirmed_xHB = new Array();
      // this.provinceNameSortByConfirmed_xHB = new Array();
      // this.confirmedSorted_xHB = new Array();
      // this.curedSorted_xHB = new Array();
      // this.deadSorted_xHB = new Array();
      arr.pop(); //将最后一项的全国数据移除
      var arrExceptWuhan = new Array();
      // 深拷贝
      arr.forEach(item => {
        if (item[0] != "420000") {
          arrExceptWuhan.push(item);
        }
      });
      this.completeMapData_1(arr);
      this.completeMapData_2(arrExceptWuhan);
    },
    /**
     * 绘制省份累计确诊、治愈、死亡数柱状图
     */
    drawProvinceTotalBar() {
      // console.log("绘制");
      let myChart1 = this.$echarts.init(
        document.getElementById("provinceTotalBar")
      );
      let myChart2 = this.$echarts.init(
        document.getElementById("otherAreaBar")
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
      myChart2.setOption({
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
          data: this.provinceNameSortByConfirmed_xHB
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
            data: this.confirmedSorted_xHB
          },
          {
            name: "累计治愈",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideLeft"
            },
            data: this.curedSorted_xHB
          },
          {
            name: "累计死亡",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideLeft"
            },
            data: this.deadSorted_xHB
          }
        ]
      });
    },
    /**
     * 准备地图数据
     */
    getMapDataReady() {
      var arrObj = new Array();
      var tmpMap = new Map();
      this.provinceTimeSeriesConfirmedData.forEach((value, key) => {
        tmpMap.set(key, value);
      });
      tmpMap.delete(null);
      // console.log(tmpMap);

      tmpMap.forEach((value, key) => {
        var tmpObj = { name: "", value: 0 };
        if (key !== null) {
          tmpObj.name = this.provinceCode[key];
          tmpObj.value = value;
        }
        arrObj.push(tmpObj);
      });
      this.totalMapConfirmedData = arrObj;
      // console.log(arrObj);
    },
    drawMap() {
      let mapChart = this.$echarts.init(document.getElementById("diseaseMap"));
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
          show: true,
          x: "left",
          y: "bottom",
          splitList: [
            { start: 1800, end: 100000 },
            { start: 1500, end: 1800 },
            { start: 1200, end: 1500 },
            { start: 900, end: 1200 },
            { start: 600, end: 900 },
            { start: 300, end: 600 },
            { start: 0, end: 300 }
          ],
          color: [
            "#FF0000",
            "#5475f5",
            "#9feaa5",
            "#85daef",
            "#74e2ca",
            "#e6ac53",
            "#9fb5ea"
          ]
        },
        series: [
          {
            name: "国内确诊热力图",
            type: "map",
            mapType: "china",
            zoom: 1.2,
            roam: true,
            label: {
              normal: {
                show: true //显示省份标签
              },
              emphasis: {
                show: true //对应的鼠标悬浮效果
              }
            },
            data: this.totalMapConfirmedData
          }
        ]
      });
    },
    /**
     * 获取湖北的每日数据,需要在调用过getDataByProvince()方法后才能调用该方法
     */
    getCalendarHeatmapData_Hubei() {
      var HubeiData = new Array();
      HubeiData.push({
        city: null,
        cityCode: null,
        confirmed: 0,
        country: "中国",
        countryCode: "CN",
        cured: 0,
        date: "2019-11-30",
        dead: 0,
        province: "湖北省",
        provinceCode: "420000",
        suspected: 0
      });
      this.provinceData.forEach(item => {
        if (item.provinceCode === "420000") {
          HubeiData.push(item);
        }
      });
      // console.log(HubeiData);
      this.HubeiTimeSeriesData = HubeiData;
    },
    /**
     * 获取国内每日数据,需要在调用过getDataByProvince()方法后才能调用该方法
     */
    getTimeSeriesData_QG() {
      var QGData = new Array();
      QGData.push({
        city: null,
        cityCode: null,
        confirmed: 0,
        country: "中国",
        countryCode: "CN",
        cured: 0,
        date: "2019-11-30",
        dead: 0,
        province: null,
        provinceCode: null,
        suspected: 0
      });
      this.provinceData.forEach(item => {
        if (item.provinceCode === null) {
          QGData.push(item);
        }
      });
      // console.log(QGData);
      this.QGTimeSeriesData = QGData;
    },
    /**
     * 湖北日历热力图数据准备
     */
    getCalHeatmapDataReady_Hubei() {
      var arr_2019 = [];
      var arr_2020 = [];
      // console.log(arr);
      // reduce的第一次迭代是从数组第二项开始
      // 第一次迭代中prev是第一项,cur是数组第二项
      this.HubeiTimeSeriesData.reduce((prev, cur) => {
        var curDate = new Date(cur.date);
        // console.log(curDate.getFullYear());

        if (curDate.getFullYear() == 2019) {
          arr_2019.push([
            this.$echarts.format.formatTime("yyyy-MM-dd", cur.date),
            cur.confirmed - prev.confirmed
          ]);
        }
        if (curDate.getFullYear() == 2020) {
          arr_2020.push([
            this.$echarts.format.formatTime("yyyy-MM-dd", cur.date),
            cur.confirmed - prev.confirmed
          ]);
        }
        return cur;
      });
      this.calendarData2019_Hubei = arr_2019;
      this.calendarData2020_Hubei = arr_2020;
    },
    /**
     * 绘制2019和2020湖北省确诊人数的日历热力图
     */
    drawCalendarHeatmap_Hubei() {
      let mapChart = this.$echarts.init(
        document.getElementById("calenderHeatmap_Hubei")
      );
      let that = this;
      mapChart.setOption({
        tooltip: {
          position: "left",
          formatter: function(p) {
            var format = that.$echarts.format.formatTime(
              "yyyy-MM-dd",
              p.data[0]
            );
            // console.log(p);

            return format + ": " + p.data[1];
          }
        },
        visualMap: {
          min: 0,
          max: 6000,
          calculable: true,
          orient: "vertical",
          left: 10,
          top: "center"
        },

        calendar: [
          {
            right: 210,
            cellSize: [15, "auto"],
            bottom: 50,
            orient: "vertical",
            range: "2019",
            dayLabel: {
              margin: 5
            }
          },
          {
            left: 260,
            cellSize: [15, "auto"],
            bottom: 50,
            orient: "vertical",
            range: "2020",
            dayLabel: {
              margin: 5
            }
          }
        ],

        series: [
          {
            type: "heatmap",
            coordinateSystem: "calendar",
            calendarIndex: 0,
            data: this.calendarData2019_Hubei
          },
          {
            type: "heatmap",
            coordinateSystem: "calendar",
            calendarIndex: 1,
            data: this.calendarData2020_Hubei
          }
        ]
      });
    },
    /**
     * 全国日历热力图数据准备
     */
    getCalHeatmapDataReady_QG() {
      var arr_2019 = [];
      var arr_2020 = [];
      // console.log(arr);
      // reduce的第一次迭代是从数组第二项开始
      // 第一次迭代中prev是第一项,cur是数组第二项
      this.QGTimeSeriesData.reduce((prev, cur) => {
        var curDate = new Date(cur.date);
        // console.log(curDate.getFullYear());

        if (curDate.getFullYear() == 2019) {
          arr_2019.push([
            this.$echarts.format.formatTime("yyyy-MM-dd", cur.date),
            cur.confirmed - prev.confirmed
          ]);
        }
        if (curDate.getFullYear() == 2020) {
          arr_2020.push([
            this.$echarts.format.formatTime("yyyy-MM-dd", cur.date),
            cur.confirmed - prev.confirmed
          ]);
        }
        return cur;
      });
      this.calendarData2019_QG = arr_2019;
      this.calendarData2020_QG = arr_2020;
    },
    /**
     * 绘制2019和2020全国确诊人数的日历热力图
     */
    drawCalendarHeatmap_QG() {
      let mapChart = this.$echarts.init(
        document.getElementById("calenderHeatmap_QG")
      );
      let that = this;
      mapChart.setOption({
        tooltip: {
          position: "left",
          formatter: function(p) {
            var format = that.$echarts.format.formatTime(
              "yyyy-MM-dd",
              p.data[0]
            );
            // console.log(p);

            return format + ": " + p.data[1];
          }
        },
        visualMap: {
          min: 0,
          max: 6000,
          calculable: true,
          orient: "vertical",
          left: 10,
          top: "center"
        },

        calendar: [
          {
            right: 210,
            cellSize: [15, "auto"],
            bottom: 50,
            orient: "vertical",
            range: "2019",
            dayLabel: {
              margin: 5
            }
          },
          {
            left: 260,
            cellSize: [15, "auto"],
            bottom: 50,
            orient: "vertical",
            range: "2020",
            dayLabel: {
              margin: 5
            }
          }
        ],

        series: [
          {
            type: "heatmap",
            coordinateSystem: "calendar",
            calendarIndex: 0,
            data: this.calendarData2019_QG
          },
          {
            type: "heatmap",
            coordinateSystem: "calendar",
            calendarIndex: 1,
            data: this.calendarData2020_QG
          }
        ]
      });
    },
    /**
     * 全国折线数据准备
     */
    getTimeSeriesLineDataReady_QG() {
      var arr = [];
      this.QGTimeSeriesData.forEach(item => {
        arr.push([
          this.$echarts.format.formatTime("yyyy-MM-dd", item.date),
          item.confirmed
        ]);
      });
      // console.log(arr);

      this.lineSeriesConfirmedData_QG = arr;
    },
    /**
     * 绘制全国每日确诊人数变化曲线
     */
    drawTimeSeriesLine_QG() {
      let mapChart = this.$echarts.init(
        document.getElementById("timeSeriesLine_QG")
      );
      // let that = this;
      mapChart.setOption({
        // title: {
        //   text: "全国每日确诊人数变化趋势",
        //   left: "60"
        // },
        tooltip: {
          trigger: "axis",
          // formatter: function (params) {
          //     params = params[0];
          //     var date = new Date(params.name);
          //     return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
          // },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: true
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: true
          }
        },
        series: [
          {
            name: "全国每日确诊人数增长数据",
            type: "line",
            showSymbol: false,
            lineStyle: {
              color: "#000080"
            },
            hoverAnimation: false,
            data: this.lineSeriesConfirmedData_QG
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
<style scoped>
.timeLineTag {
  margin-top: 10px;
}
.text {
  font-size: 14px;
  text-align: left;
}

.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>

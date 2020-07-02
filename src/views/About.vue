<template>
  <div class="about">
    <el-container>
      <el-header>
        <TotalNumBar :data="domesticData" />
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
        <div id="myEchart" style="height:550px;width:100%"></div>
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import TotalNumBar from "@/components/TotalNumBar.vue";
import DomesticData from "../../static/DXYOverall.json";
import Footer from "@/components/Footer.vue";
import TimeSeriesData from "../../static/Wuhan-2019-nCoV.json";
// import axios from "axios";
export default {
  name: "about",
  components: {
    TotalNumBar,
    Footer
  },
  data() {
    return {
      domesticData: Object,
      cityData: [],
      cityTimeSeriesConfirmedData: Map
    };
  },
  created: function() {
    // created函数中的this指向当前vm实例
    this.getDomesticData();
    this.getDataByProvince();
    this.getTimeSeriesConfirmedCityData();
    this.get3DMapDataReady();
  },
  mounted() {
    this.draw3DMap_World();
  },
  methods: {
    getDomesticData() {
      this.domesticData = DomesticData.results[0];
      // console.log(this.domesticData);
    },
    /**
     * 整理全国各地级市数据
     */
    getDataByProvince() {
      // this.cityData = new Array();
      TimeSeriesData.forEach(element => {
        if (element.country === "中国" && element.cityCode !== null) {
          this.cityData.push(element);
        }
      });
      // console.log(this.provinceData);
    },
    getTimeSeriesConfirmedCityData() {
      let tmpMap1 = new Map(); //存储confirmed数据
      this.cityData.forEach(item => {
        // 不存在该省份编码的确诊信息
        if (tmpMap1.get(item.cityCode) === undefined) {
          tmpMap1.set(item.cityCode, item.confirmed);
        }
        // 已存在该省份编码的确诊数量信息
        if (item.confirmed > tmpMap1.get(item.cityCode)) {
          // 更新省份确诊信息
          tmpMap1.delete(item.cityCode);
          tmpMap1.set(item.cityCode, item.confirmed);
        }
      });
      console.log(tmpMap1);

      this.cityTimeSeriesConfirmedData = tmpMap1;
    },
    /**
     * 判断数字串中是否含字母
     */
    judgeCharactersInNum(str) {
      for (var i in str) {
        var asc = str.charCodeAt(i);
        if ((asc >= 65 && asc <= 90) || (asc >= 97 && asc <= 122)) {
          return true;
        }
      }
      return false;
    },
    /**
     * 判断是否为境外输入病例
     */
    judgeIsOutputCase(str) {
      if (
        str.charAt(str.length - 2) === "y" &&
        (str.charAt(str.length - 1) === "0" ||
          str.charAt(str.length - 1) === "1")
      ) {
        console.log(str.charAt(str.length - 2));

        return true;
      } else {
        return false;
      }
    },
    /**
     * 判断是否为未公布来源病例
     */
    judgeIsUnknownCase(str) {
      if (
        str.charAt(str.length - 1) === "x" &&
        str.charAt(str.length - 2) === "x"
      ) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 准备地图数据
     */
    get3DMapDataReady() {
      // var arrObj = new Array();
      // 用于存放常规数据，不包含境外输入、未知来源、军团等地的数据
      var tmpMap_normal = new Map();
      var tmpMap_special = new Map();
      var tmpMap_outCase = new Map();
      var tmpMap_unknownCase = new Map();
      this.cityTimeSeriesConfirmedData.forEach((value, key) => {
        if (!this.judgeCharactersInNum(key)) {
          tmpMap_normal.set(key, value);
        } else {
          tmpMap_special.set(key, value);
        }
      });
      console.log(tmpMap_normal);
      console.log(tmpMap_special);

      // 处理特殊数据，分离出境外输入和未知来源的数据
      tmpMap_special.forEach((value, key) => {
        // 境外输入病例
        if (this.judgeIsOutputCase(key)) {
          tmpMap_outCase.set(key, value);
        }
        // 未公布来源病例
        if (this.judgeIsUnknownCase(key)) {
          tmpMap_unknownCase.set(key, value);
        }
      });
      console.log(tmpMap_outCase);
      console.log(tmpMap_unknownCase);

      // tmpMap.forEach((value, key) => {
      //   var tmpObj = { name: "", value: 0 };
      //   if (key !== null) {
      //     tmpObj.name = this.provinceCode[key];
      //     tmpObj.value = value;
      //   }
      //   arrObj.push(tmpObj);
      // });
      // this.totalMapConfirmedData = arrObj;
      // console.log(arrObj);
    },
    draw3DMap_World() {
      let mapChart = this.$echarts.init(document.getElementById("myEchart"));
      mapChart.setOption({
        backgroundColor: "rgba(0,0,0,0)", //canvas的背景颜色
        environment: "@/assets/bg.jgp", //背景星空图
        geo3D: {
          //地图的具体参数
          map: "china", //地图范围
          shading: "lambert", //光照带来的明暗
          light: {
            // 光照相关的设置。在 shading 为 'color' 的时候无效。
            main: {
              //场景主光源的设置
              intensity: 3, //主光源的强度
              shadow: true, //主光源是否投射阴影
              shadowQuality: "high", //阴影的质量
              alpha: 30, //主光源绕 x 轴偏离的角度
              beta: 190 //主光源绕 y 轴偏离的角度
            },
            ambient: {
              //全局的环境光设置。
              intensity: 0 //环境光的强度
            }
          },
          viewControl: {
            //用于鼠标的旋转，缩放等视角控制
            distance: 50, //默认视角距离主体的距离
            panMouseButton: "left", //平移操作使用的鼠标按键
            rotateMouseButton: "right", //旋转操作使用的鼠标按键
            alpha: 50 // 让canvas在x轴有一定的倾斜角度
          },
          // groundPlane: {
          //   show: true,
          //   color: "#999"
          // },
          postEffect: {
            //为画面添加高光，景深，环境光遮蔽（SSAO），调色等效果
            enable: true, //是否开启
            SSAO: {
              //环境光遮蔽
              radius: 1, //环境光遮蔽的采样半径。半径越大效果越自然
              intensity: 1, //环境光遮蔽的强度
              enable: true
            }
          },
          temporalSuperSampling: {
            //分帧超采样。在开启 postEffect 后，WebGL 默认的 MSAA 会无法使用,分帧超采样用来解决锯齿的问题
            enable: true
          },
          itemStyle: {
            //三维图形的视觉属性
            color: "#2355ac",
            borderWidth: 1,
            borderColor: "#000"
          },
          //左侧小导航图标
          visualMap: {
            max: 40,
            calculable: true,
            realtime: false,
            inRange: {
              color: [
                "#313695",
                "#4575b4",
                "#74add1",
                "#abd9e9",
                "#e0f3f8",
                "#ffffbf",
                "#fee090",
                "#fdae61",
                "#f46d43",
                "#d73027",
                "#a50026"
              ]
            },
            outOfRange: {
              colorAlpha: 0
            }
          }
          // regionHeight: 1 //区域的高度
        }
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
<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <div class="grid-content bg-purple">
        <div class="title">累计确诊</div>
        <div class="number" style="color: rgb(209, 46, 46);">{{data.confirmedCount}}</div>
        <div v-if="data.confirmedIncr!==undefined&&data.confirmedIncr!==null">
          <span class="subTitle">较昨天</span>
          <span class="incrNum" style="color: rgb(209, 46, 46);">+{{data.confirmedIncr}}</span>
          <!-- <span class="incrNum" style="color: rgb(209, 46, 46);">+5</span> -->
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple-light">
        <div class="title">当前确诊</div>
        <div class="number" style="color: rgb(209, 46, 46);">{{data.currentConfirmedCount}}</div>
        <div v-if="data.currentConfirmedIncr!==undefined&&data.currentConfirmedIncr!==null">
          <span class="subTitle">较昨天</span>
          <span class="incrNum" style="color: rgb(209, 46, 46);">
            <template v-if="data.currentConfirmedIncr>=0">+</template>
            {{data.currentConfirmedIncr}}
            <!-- 3 -->
          </span>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple">
        <div class="title">死亡人数</div>
        <div class="number" style="color: rgb(78, 71, 71);">{{data.deadCount}}</div>
        <div v-if="data.deadIncr!==undefined&&data.deadIncr!==null">
          <span class="subTitle">较昨天</span>
          <span class="incrNum" style="color: rgb(78, 71, 71);">+{{data.deadIncr}}</span>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple">
        <div class="title">累计治愈</div>
        <div class="number" style="color: rgb(103, 230, 44);">{{data.curedCount}}</div>

        <div v-if="data.curedIncr!==undefined&&data.curedIncr!==null">
          <span class="subTitle">较昨天</span>
          <span class="incrNum" style="color: rgb(103, 230, 44);">+{{data.curedIncr}}</span>
        </div>
      </div>
    </el-col>
    <!-- curedCount -->
  </el-row>
</template>
<script>
export default {
  name: "TotalNumBar",
  props: {
    data: Object
  }
};
</script>
<style>
/* &符号时sass的语法，代表上一级选择器，实际编译成css相当于 */
/* .el-row:last-child{} */
/* .el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
} */
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

<style scoped>
.title {
  font-size: 17px;
  font-weight: 1000;
}
.subTitle {
  font-size: 14px;
  font-weight: 1000;
}
.number {
  font-size: 25px;
  font-weight: 1000;
}
.incrNum {
  font-size: 13px;
  /* color: rgb(209, 46, 46); */
  font-weight: 1000;
}
</style>
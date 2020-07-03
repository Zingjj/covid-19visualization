<template>
  <div class="navMenu">
    <template v-for="navMenu in navMenus">
      <!-- 最后一级菜单 -->
      <el-menu-item
        v-if="!navMenu.childs && navMenu.entity"
        :key="navMenu.entity.id"
        :data="navMenu"
        :index="navMenu.entity.name"
      >
        <i :class="navMenu.entity.icon"></i>
        <span slot="title">{{ navMenu.entity.alias }}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu
        v-if="navMenu.childs && snavMenu.entity"
        :key="navMenu.entity.id"
        :data="navMenu"
        :index="navMenu.entity.name"
      >
        <template slot="title">
          <i :class="navMenu.entity.icon"></i>
          <span>{{ navMenu.entity.alias }}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :navMenus="navMenu.childs"></NavMenu>
      </el-submenu>
    </template>
    <div class="freshDataTime">数据更新于：{{curDate}}</div>
  </div>
</template>

<script>
export default {
  name: "NavMenu",
  props: ["navMenus"],
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      curDate: ""
    };
  },
  created() {
    var date = new Date();
    date.setTime(date.getTime());
    this.curDate =
      date.getFullYear() +
      "年" +
      (date.getMonth() + 1) +
      "月" +
      date.getDate() +
      "日";
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style>
.freshDataTime {
  margin-top: 18px;
  /* margin-left: 50px; */
  width: 200px;
  color: #ffffff;
  float: right;
}
</style>
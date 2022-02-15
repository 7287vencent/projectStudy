<template>
  <div class="App" :class="[`theme-${theme}`]">
    <div>
      <el-row>
        <el-button type="primary">主要按钮</el-button>
      </el-row>
    </div>
    <el-dropdown class="username" trigger="click">
      <span class="el-dropdown-link" style="min-width: 30px"
        >修改主题颜色
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="gotoHome">首页</el-dropdown-item>
        <el-dropdown-item @click.native="changeTheme('red')"
          >红色</el-dropdown-item
        >
        <el-dropdown-item @click.native="changeTheme('green')"
          >绿色</el-dropdown-item
        >
        <el-dropdown-item @click.native="changeTheme('blue')"
          >蓝色</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <el-button @click="changeTheme('red')">红色</el-button>
    <el-button @click="changeTheme('green')">绿色</el-button>
    <el-button @click="changeTheme('blue')">蓝色</el-button>

    <div class="box"></div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      theme: "",
    };
  },
  methods: {
    changeTheme(theme) {
      this.theme = theme;
      this.changeColor();
    },
    changeColor: function () {
      let color = {
        green: "#0c7f42",
        blue: "#2C83DB",
        red: "#EF4944",
      };
      document.documentElement.style.setProperty(
        "--main-color",
        color[this.theme]
      );
    },
  },
};
</script>

<style lang="scss">
.App {
  color: red;
  .box {
    width: 300px;
    height: 300px;
    background: $main-color;
  }
}

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover,
.el-select-dropdown .el-select-dropdown__item.selected {
  color: $main-color;
}
</style>

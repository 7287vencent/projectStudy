<template>
  <div class="App">
    <h2>hello world</h2>
    <div>
      <router-link to="/Home">Home</router-link>
      <router-link to="/List">List</router-link>
    </div>
    <div>
      <router-view></router-view>
    </div>
    <div>
      <p>{{ getCount }}</p>
      <button @click="mutationAdd(1)">同步+1</button>
      <button @click="actionAdd(2)">异步两秒+2</button>

      <el-row>
        <el-button>默认按钮</el-button>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
  name: 'App',
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['getCount']),
  },
  methods: {
    ...mapActions(
      // ['add'] // ? 将 `this.add()` 映射为 `this.$store.dispatch('add')`
      {
        actionAdd: 'add', // ? 将 `this.actionAdd()` 映射为 `this.$store.dispatch('add')`
      }
    ),
    ...mapMutations({
      mutationAdd: 'add', // ? 将 `this.mutationAdd()` 映射为 `this.$store.commit('add')`
    }),
  },
};
</script>

<style lang="scss">
.App {
  color: red;
}
</style>

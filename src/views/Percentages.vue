<template>
  <h2>Stats Counts</h2>
  <h3 style="display: block;width: 100%;text-align: center">TOTAL MINTED ON IMX: {{ total }}</h3>
  <div>&nbsp;</div>
      <div style="display: flex;flex-wrap: wrap">
        <div v-for="(data, field) in stats" :key="field">
          <h3 style="display:block;width: 100%;text-align: center">{{ field }}</h3>
          <ul>
            <li v-for="(value, key) in data" :key="key">{{key}}: {{value}} ({{ ((value/total)*100).toFixed(2) }}%)</li>
          </ul>
      </div>
    </div>
</template>

<script>
import {glxStore} from "@/store";

export default {
  name: "Percentages",
  computed:{
    stats(){
      return glxStore.state.stats
    },
    total()
    {
      return glxStore.state.total
    }
  },
}
</script>

<style scoped>

</style>
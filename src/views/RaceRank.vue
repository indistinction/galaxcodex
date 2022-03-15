<template>
<div v-for="(glxs, race) in raceList" :key="race+'r'">
  <h2>{{race}}</h2>
  <ol>
    <li v-for="glx in glxs.slice(0,raceEnd[race])" :key="'gr'+glx.token_id" @click="$router.push('/profile/'+glx.token_id)">
      <span style="cursor: pointer">{{ glx.metadata["Title"] ? `${glx.metadata["Race"]} ${glx.metadata["Title"]} #${glx.token_id}` : glx.name }} ({{ (glx["Rarity"]+1-minrare).toFixed() }})</span>
    </li>
    <li v-if="raceEnd[race] <glxs.length"><span @click="raceEnd[race] += 20" style="cursor: pointer;color: #0a8888">(show more...)</span></li>
  </ol>
</div>
</template>

<script>
import {glxStore} from "@/store";

export default {
  name: "RaceRank",
  computed:{
    minrare(){
      return glxStore.state.minRare
    }
  },
  data(){
    return{
      raceList:{},
      raceEnd: {}
    }
  },
  async mounted(){
    if(glxStore.state.total === 0) {
      this.$emit('think', "Calculating rankings...")
      await glxStore.update()
      this.$emit('think')
    }

    let race

    // Deep clone
    let sortedGalaxL = JSON.parse(JSON.stringify(glxStore.state.glxList))
    sortedGalaxL.sort((a, b) => (a.Rarity < b.Rarity) ? 1 : -1)

    for(let i=0;i < sortedGalaxL.length;i++){
      if (sortedGalaxL[i].metadata && sortedGalaxL[i].metadata["Race"]){
        race = sortedGalaxL[i].metadata["Race"]
        // eslint-disable-next-line no-prototype-builtins
        if(this.raceList.hasOwnProperty(race)){
          this.raceList[race].push(sortedGalaxL[i])
        } else {
          this.raceList[race] = [sortedGalaxL[i]]
          this.raceEnd[race] = 20
        }
      }
    }

  }
}
</script>

<style scoped>

</style>
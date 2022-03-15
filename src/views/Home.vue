<template>
  <div>
    <div v-if="collapsed">
      <button @click="collapsed=false" class="btn">Show filters</button>
    </div>
    <div v-else>
      <button @click="collapsed=true" class="btn">Hide filters</button>
      <div class="filterbar">
        <div v-for="(opts, attr) in stats" :key="'a'+attr" class="filter">
          {{attr}}<br>
          <select :ref="'select'+attr" @change="setFilter(attr, filters[attr])" v-model="filters[attr]">
            <option>(all)</option>
            <option v-for="(count, name) in opts" :key="'o'+name">{{name}}</option>
          </select>
        </div>
      </div>
      <div class="no-mobile" style="display: flex; justify-content: space-around; width:100%">
        <div>GalaxiatorID: <div class="input-box" style="padding: 0 6px;">#
          <input type="text" @keyup="setFilter('glxId', glxidFilter)"  v-model="glxidFilter" placeholder="id no." style="width:50px"/>
          <span style="cursor:pointer; font-weight: bold;font-size: 16pt;" @click="glxidFilter='';setFilter('glxId', '')"> &times; &nbsp;</span>
        </div>
        </div>
        <div>
          Owner account:
          <div class="input-box">
            <input type="text" @keyup="setFilter('owner', owner)"  v-model="owner" placeholder="0x..." style="width:280px;margin: 0 0 0 6px;"/>
            <span style="cursor:pointer; font-weight: bold;font-size: 16pt;" @click="owner='';setFilter('owner', '')"> &times; &nbsp;</span>
            <button class="end-btn" @click="user ? null : $emit('meuser');owner=user;setFilter('owner', owner)">(me)</button>
          </div>
        </div>
      </div>
      <div class="mobile" style="">
        <div>GalaxiatorID: <div class="input-box" style="padding: 0 6px;">#
          <input type="text" @keyup="setFilter('glxId', glxidFilter)"  v-model="glxidFilter" placeholder="id no." style="width:50px"/>
          <span style="cursor:pointer; font-weight: bold;font-size: 16pt;" @click="glxidFilter='';setFilter('glxId', '')"> &times; &nbsp;</span>
        </div>
        </div>
        <div>
          Owner account:
          <div class="input-box">
            <input type="text" @keyup="setFilter('owner', owner)"  v-model="owner" placeholder="0x..."  style="width:280px;margin: 0 0 0 6px;"/>
            <span style="cursor:pointer; font-weight: bold;font-size: 16pt;" @click="owner='';setFilter('owner', '')"> &times; &nbsp;</span>
          </div>
        </div>
      </div>
      <button @click="clearFilters" class="btn">Clear filters</button>
    </div>



    <div v-if="filtered.length === 0" style="font-style: italic;text-align: center">
    Cannot find any Galaxiators that meet these criteria.<br>Clear filters and try again?
  </div>
  <div v-else id="galax-container">
    <div class="one-galax" v-for="glx in filtered" :key="'g'+glx.token_id" @click="$router.push('/profile/'+glx.token_id)">
      <img class="minestar" v-if="glx.user === user" src="/star.png"/>
      <img class="saleboard" v-if="glx.metadata['For Sale'] === 'Yes'" src="/forsale.png"/>
      <img :src="glx.image_url" class="glx-img">
      <strong style="display: block;width: 100%;text-align: center;">
        {{ glx.metadata["Title"] ? `${glx.metadata["Race"]} ${glx.metadata["Title"]} #${glx.token_id}` : glx.name }}<br>
        <small>
          Rarity: {{ (glx["Rarity"]+1-minrare).toFixed() }}
          <span v-if="glx.metadata['For Sale'] === 'Yes'" v-html="' | ' + glx.price" />
        </small>
      </strong>
      <br>
    </div>
  </div>
  <button @click="showMore(false)" class="btn">Show more...</button>
  <button @click="showMore(true)" class="btn">Show all!</button>
  </div>
</template>

<script>
import {filterStore, glxStore} from "@/store";

export default {
  name: "Home",
  emits: ['meuser', 'think'],
  props: ['user'],
  computed:{
    galaxl(){
      return glxStore.state.glxList
    },
    stats(){
      return glxStore.state.stats
    },
    minrare(){
      return glxStore.state.minRare
    },
    total()
    {
      return glxStore.state.total
    },
    ready(){
      return !!glxStore.state.glxObject[this.$route.params["id"]]
    },
    filtered(){
      return filterStore.state.filtered
    }
  },
  data(){
    return{
      collapsed: true,
      glxidFilter:"",
      owner: "",
      filters:{},
      end: 24
    }
  },
  methods: {
    setFilter(filter, value){
      filterStore.setFilter(filter, value)
    },
    clearFilters(){
      filterStore.clearFilters()
    },
    showMore(all){
      filterStore.showMore(all)
    }
  },
  async mounted() {
    if(glxStore.state.total === 0) {
      this.$emit('think', "Establishing satellite<br> uplink...")
      await glxStore.update()
      this.$emit('think')
    }
    this.filters = filterStore.state.filters
  }
}
</script>

<style scoped>

</style>
<template>
  <div v-if="ready">
    <div>
      <div>
        <a href="javascript:void(0);" @click="$router.push('/')" style="text-decoration: none;color: #00ffff;font-weight: bold">&lt; back</a>
      </div>

      <div style="display: flex;
    flex-wrap: wrap;justify-content:space-around;">
        <div class="profile-box" style="width:40%;">
          <h2>
            {{ glx.metadata["Title"] ? `${glx.metadata["Race"]} ${glx.metadata["Title"]} #${glx.token_id}` : glx.name }}
            <img style="width:80px;display: inline" v-if="glx.metadata['For Sale'] === 'Yes'" src="/forsale.png"/>
          </h2>
          <div>&nbsp;</div><img :src="glx.image_url" style="width: 100%; max-width:360px; border-radius: 5px;"/>
        </div>

        <div class="profile-box" style="max-width:50%;">
          <h2><small>Rarity score: {{ (glx["Rarity"]+1-minRare).toFixed() }} | GlxDays held: {{ glxDays }}</small></h2>
          <ul>
            <li v-for="(value, attr) in glx.metadata" :key="'p'+attr">{{attr}}: {{value}} ({{ ((stats[attr][value]/total)*100).toFixed(2) }}%)</li>
          </ul>
        </div>

      </div>
      <button
          v-if="user && glx.metadata['For Sale'] === 'Yes' && glx['user'] !== user"
          class="btn buy-btn no-mobile"
          @click="$emit('buy', glx.token_id)"
          v-html="'Buy for ' + glx['price']"
      />
      <button v-else-if="user && glx.metadata['For Sale'] === 'No' && glx['user'] === user"
              class="btn buy-btn no-mobile"
              @click="$emit('sell', glx.token_id)"
      >Sell {{ glx.metadata["Title"] ? `${glx.metadata["Race"]} ${glx.metadata["Title"]} #${glx.token_id}` : glx.name }}</button>
      <button
          v-else-if="user && glx.metadata['For Sale'] === 'Yes' && glx['user'] === user"
          class="btn buy-btn no-mobile"
          @click="$emit('cancel', glx.token_id)"
      >Cancel sell order</button>
      <button
          v-else-if="glx.metadata['For Sale'] === 'Yes' || glx['user'] === user"
          class="btn buy-btn no-mobile"
          @click="$emit('login')"
      >Connect to ImmutableX to manage sales</button>
    </div>
  </div>
</template>

<script>
import {glxStore} from "@/store";

export default {
  name: "Profile",
  props: ["user"],
  emits: ['buy', 'sell', 'cancel', 'login', 'think'],
  computed:{
    glx(){
      return glxStore.state.glxObject[this.$route.params["id"]]
    },
    stats(){
      return glxStore.state.stats
    },
    minRare(){
      return glxStore.state.minRare
    },
    total()
    {
      return glxStore.state.total
    },
    ready(){
      return !!glxStore.state.glxObject[this.$route.params["id"]]
    }
  },
  data(){
    return {
      glxDays: "calculating..."
    }
  },
  methods: {
  async docalcs() {
    let tmpDate1, tmpDate2, today
    let cardObj, cardObjJson
    let lastTransfer, lastTransferJson
    let lastTrade, lastTradeJson

    cardObj = await fetch("https://api.x.immutable.com/v1/assets/0x6c82e53cbbd8a6afaf9663d58547cfc1a43be7aa/" + this.$route.params["id"])
    cardObjJson = await cardObj.json()
    if (cardObjJson.metadata) {
      tmpDate1 = new Date(cardObjJson.created_at)
    } // TODO else error checking
    lastTrade = await fetch("https://api.x.immutable.com/v1/orders?sell_token_address=0x6c82e53cbbd8a6afaf9663d58547cfc1a43be7aa&page_size=1&status=filled&order_by=updated_timestamp&direction=desc&sell_token_id=" + this.selected)
    lastTradeJson = await lastTrade.json()
    if (lastTradeJson.result.length > 0) {
      tmpDate2 = new Date(lastTradeJson.result[0]["updated_timestamp"])
      if (tmpDate2 > tmpDate1) {
        tmpDate1 = tmpDate2
      }
    }
    lastTransfer = await fetch("https://api.x.immutable.com/v1/transfers?token_address=0x6c82e53cbbd8a6afaf9663d58547cfc1a43be7aa&page_size=1&status=success&direction=desc&token_id=" + this.selected)
    lastTransferJson = await lastTransfer.json()
    if (lastTransferJson.result.length > 0) {
      tmpDate2 = new Date(lastTransferJson.result[0]["updated_timestamp"])
      if (tmpDate2 > tmpDate1) {
        tmpDate1 = tmpDate2
      }
    }

    tmpDate1.setDate(tmpDate1.getDate() + 1)
    tmpDate1.setHours(0, 0, 0)
    today = new Date()
    today.setHours(0, 0, 0)
    this.glxDays = Math.max(0, Math.round((today - tmpDate1) / 86400000))
    this.initialized = true
  }
  },
  async mounted(){
    if(glxStore.state.total === 0){
      this.$emit('think', "Calling Galaxiator's grandmother<br> for profile information...")
      await glxStore.update()
      this.$emit('think')
    }
    if(this.glxDays === "calculating..."){
      await this.docalcs()
    }
  }
}
</script>

<style scoped>

</style>
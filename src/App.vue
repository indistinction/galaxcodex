<template>
  <div id="thinking" v-if="thinking || hiding">
    <div v-if="thinking">
      <img src="/logo.webp" class="flash">
      <div v-html="thinkingmsg" />
    </div>
  </div>
  <div id="home">
    <div>
      <img src="/logo.webp">
      <h1>Galaxiators Codex</h1>
      <button class="btn top-btn no-mobile" @click="logout" v-if="user">Disconnect<br>{{`${user.slice(0,4)}...${user.slice(-4)}`}}</button>
      <button class="btn top-btn no-mobile" @click="connectImx" v-else>Connect<br>Wallet</button>
    </div>
    <div id="content">

      <div class="button-bar">
        <button style="margin: 0 8px" @click="$router.push('/')" class="btn">List and Filter</button>
        <button style="margin: 0 8px" @click="$router.push('/distn')" class="btn">Attribute Stats Summary</button>
        <button style="margin: 0 8px" @click="$router.push('/ranks')" class="btn">Race Rankings</button>
        <button style="margin: 0 8px" @click="$router.push('/calcs')" class="btn">Rarity Calculations</button>
      </div>

      <!-- TODO Sort functions -->

      <p style="font-style: italic">All data is pulled direct from ImmutableX - so any errors in categories or values come from there.
        Refresh the page to see any new mints. You may get an error until new tokens are fully minted.
      </p>
      <p style="color: #00ffff;width:100%;font-size: 18pt;text-align: center"><strong>Rarity</strong>: higher = more rare, less common</p>


      <RouterView
        @buy="buy"
        @sell="sell"
        @cancel="cancel"
        @login="connectImx"
        @meuser="meUser"
        @think="toggleThinking"
        :user="user"
      />
    </div>
  </div>
  <div id="flash-container">
    <div class="flash-box" v-for="(msg, id) in flash" :key="msg+id">
      {{ msg }}
    </div>
  </div>
</template>

<script>
import { Link } from '@imtbl/imx-sdk';
import {glxStore} from "@/store";

export default {
  name: 'App',
  data(){
    return{
      thinking:false,
      thinkingmsg: "Accessing Galaxiators <br> satellite mainframe...",
      galaxContract: "0x6c82e53cbbd8a6afaf9663d58547cfc1a43be7aa",
      imx: null,
      link: null,
      galaxO: {},
      galaxL:[],
      filtered: [],
      stats:{},
      flash:{},
      total:0,
      summary: false,
      hiding: false,
      end: 24,
      profile: false,
      selected: 0,
      minRare : 9999,
      owner: "",
      glxidFilter: "",
      user: "",
      ordersO: {},
      coins:{},
      ready: false
    }
  },
  methods:{
    toggleThinking(msg){
      this.thinking = !this.thinking
      if(this.thinking){
        this.thinkingmsg = msg
      } else {
        this.thinkingmsg = ""
      }
    },
    setThinkingNote(msg){
      this.thinkingmsg = msg
    },
    trn(glxId, toAddress){
      this.link.transfer([{
        tokenId: glxId,
        type:"ERC721",
        tokenAddress: "0x6c82e53cbbd8a6afaf9663d58547cfc1a43be7aa",
        toAddress:toAddress}])
    },
    flashMsg(msg){
      const id = Date.now()
      this.flash[id] = msg
      setTimeout(() => this.deleteMsg(id), 2500)
    },
    deleteMsg(id){
      delete this.flash[id]
    },
    async connectImx(){
      let {address} = await this.link.setup({});
      this.user = address
      localStorage.setItem('IMX_ADDRESS', address);
    },
    logout(){
      localStorage.removeItem('IMX_ADDRESS');
      this.user=""
    },
    async meUser(){
      if(!this.user){
        await this.connectImx()
      }
    },
    async buy(glxId){
      if(!this.link){
        await this.connectImx()
      }
      this.link.buy({ orderIds: [glxStore.state.orders[glxId]['order_id']] }).then(()=>{
        this.flashMsg('Buy successful!')
        glxStore.update()
      }).catch(()=>{
        this.flashMsg('Error completing purchase')
      })
    },
    sell(glxId){
      this.link.sell({
        tokenId: glxId,
        tokenAddress: this.galaxContract,
      }).then(()=>{
        this.flashMsg('Sell order successfully submitted')
        glxStore.update()
      }).catch(()=>{
        this.flashMsg('Error posting sell order')
      })
    },
    async cancel(glxId){
      if(!this.link){
        await this.connectImx()
      }
      this.link.cancel({ orderId: glxStore.state.orders[glxId]['order_id'] }).then(()=>{
        this.flashMsg('Order cancelled')
        glxStore.update()
      }).catch(()=>{
        this.flashMsg('Error cancelling order')
      })
    }
  },
  mounted(){
    this.user = localStorage.getItem('IMX_ADDRESS')
    this.link = new Link('https://link.x.immutable.com')
    console.log("Logged in as " + this.user)
  }
}
</script>



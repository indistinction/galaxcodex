import { reactive } from 'vue'
import {ImmutableXClient, Link} from "@imtbl/imx-sdk";
import BigNumber from "bignumber.js";

export const filterStore = {

  state: reactive({
    filtered: [],
    filters:{},
    end:24,
    ownerFilter: "",
    glxIdFilter:""
  }),
  clearFilters(){
    const attrs = Object.keys(glxStore.state.stats)
    for(let i=0;i<attrs.length;i++){
      this.state.filters[attrs[i]] = "(all)"
    }
    this.state.ownerFilter= ""
    this.state.glxIdFilter= ""
    this.state.end=24
    this.updateFiltered()
  },
  updateFiltered() {
    if (this.state.glxIdFilter) {
      if (glxStore.state.glxObject[this.state.glxIdFilter]) {
        this.state.filtered = [glxStore.state.glxObject[this.state.glxIdFilter]]
      } else {
        this.state.filtered = []
      }
    } else {
      let listToFilter = glxStore.state.glxList
      if (this.state.ownerFilter) {
        listToFilter = listToFilter.filter(glx => glx.user.toLowerCase().includes(this.state.ownerFilter.toLowerCase()));
      }
      const attrs = Object.keys(glxStore.state.stats)
      for (let i = 0; i < attrs.length; i++) {
        if (this.state.filters[attrs[i]] !== "(all)") {
          listToFilter = listToFilter.filter(glx => (glx.metadata && glx.metadata[attrs[i]] && glx.metadata[attrs[i]] === this.state.filters[attrs[i]]));
        }
      }
      if(this.state.end > 0){
        this.state.filtered = listToFilter.slice(0, this.state.end)
      } else {
        this.state.filtered = listToFilter
      }
    }
  },
  setFilter(attr, value){
    if(attr==="glxId"){
      this.state.glxIdFilter = value
    } else if(attr==="owner"){
      this.state.ownerFilter = value
    } else {
      this.state.filters[attr]=value
    }
    this.updateFiltered()
  },
  showMore(all) {
    if(all){
      this.state.end = 0
    } else {
      this.state.end += 24
    }
    this.updateFiltered()
  }
}


export const glxStore = {

  state: reactive({
    glxList: [],
    glxObject: {},
    coins:{},
    orders:{},
    stats:{},
    total:0,
    minRare: 9999
  }),

  async update(){
    const imxClient = await ImmutableXClient.build({publicApiUrl: 'https://api.x.immutable.com/v1'});
    console.info("Updating store...")
    // Just so we don't lose 'this' Vue component reference in this shower of shit
    const self = this

    self.link = new Link('https://link.x.immutable.com')

    let galaxArray = []
    let assetRequest
    let assetCursor

    console.info("IMX client initialized")

    do {
      try{
        assetRequest = await imxClient.getAssets({
          status: 'imx',
          collection: "0x6c82e53cbbd8a6afaf9663d58547cfc1a43be7aa",
          cursor: assetCursor
        })
      } catch (err) {
        console.error("Error getting IMX list.")
        console.error(err)
      }
      galaxArray = galaxArray.concat(assetRequest.result)
      assetCursor = assetRequest.cursor
    } while (assetCursor)

    console.info("Galaxiators downloaded")

    const coinReq = await fetch("https://api.x.immutable.com/v1/tokens")
    const coinsJson = await coinReq.json()

    for (let i=0;i < coinsJson.result.length;i++){
      if(coinsJson.result[i].token_address){
        self.state.coins[coinsJson.result[i].token_address] = coinsJson.result[i]
      } else {
        self.state.coins["ETH"] = coinsJson.result[i]
      }
    }

    let marketArray = []
    let marketRequest
    let marketCursor

    console.info("Getting market orders")

    do {
      try{
        marketRequest = await imxClient.getOrders({
          status: 'active',
          sell_token_address: "0x6c82e53cbbd8a6afaf9663d58547cfc1a43be7aa",
          cursor: marketCursor
        })
      } catch (err) {
        console.error("Error getting market order list.")
        console.error(err)
      }
      marketArray = marketArray.concat(marketRequest.result)
      marketCursor = marketRequest.cursor
    } while (marketCursor)

    let ordersList = []
    for(let i=0;i<marketArray.length;i++){
      self.state.orders[marketArray[i]["sell"]["data"]["token_id"]] = marketArray[i]
      ordersList.push(marketArray[i]["sell"]["data"]["token_id"])
    }

    console.info("Processing market orders")

    let metadata, keys
    for(let i=0;i<galaxArray.length;i++){
      // eslint-disable-next-line no-prototype-builtins
      if(galaxArray[i].hasOwnProperty("metadata") && galaxArray[i].metadata) {
        if(ordersList.indexOf(galaxArray[i]["token_id"]) >= 0){
          galaxArray[i]["metadata"]["For Sale"] = "Yes"
          let divisor
          if (self.state.orders[galaxArray[i]["token_id"]]["buy"]["type"] === "ETH"){
            divisor = BigNumber('1e18')
            galaxArray[i]["price"] = `<img src="https://design-system.immutable.com/currency_icons/currency--eth.svg" class="priceimg" alt="Ethereum">${(BigNumber(self.state.orders[galaxArray[i]["token_id"]]["buy"]["data"]["quantity"]["_hex"]).div(divisor)).toFixed(5)}`
          } else if (self.state.orders[galaxArray[i]["token_id"]]["buy"]["type"] === "ERC20") {
            divisor = BigNumber('1e'+self.state.coins[self.state.orders[galaxArray[i]["token_id"]]["buy"]["data"]["token_address"]]["decimals"])
            galaxArray[i]["price"] = `<img src="${self.state.coins[self.state.orders[galaxArray[i]["token_id"]]["buy"]["data"]["token_address"]]["image_url"]}" class="priceimg" alt="${self.state.coins[self.state.orders[galaxArray[i]["token_id"]]["buy"]["data"]["token_address"]]["name"]}"> ${(BigNumber(self.state.orders[galaxArray[i]["token_id"]]["buy"]["data"]["quantity"]["_hex"]).div(divisor)).toFixed(5)}`
          }
        } else {
          galaxArray[i]["metadata"]["For Sale"] = "No"
        }
        self.state.glxObject[galaxArray[i]["token_id"]] = galaxArray[i]
        metadata = galaxArray[i].metadata
        delete metadata.image
        delete metadata.description
        delete metadata.name
        keys = Object.keys(metadata)
        for(let j=0;j<keys.length;j++){
          let key = keys[j]
          let value = metadata[keys[j]]

          // eslint-disable-next-line no-prototype-builtins
          if(self.state.stats.hasOwnProperty(key)){
            // eslint-disable-next-line no-prototype-builtins
            if(self.state.stats[key].hasOwnProperty(value)){
              self.state.stats[key][value]++
            } else {
              self.state.stats[key][value] = 1
            }
          } else {
            let element = {}
            element[value] = 1
            self.state.stats[key] = element
          }
        }
      } else {
        console.error("Error parsing IMX metadata for Token #"+JSON.stringify(galaxArray[i].token_id))
      }
    }
    delete self.state.stats["attributes"]
    self.state.total = galaxArray.length

    console.info("Data parsed, calculating rarities")

    // Calculate rarity score and add to array
    let glx, rarity, statsList
    for(let i=0;i<galaxArray.length;i++){
      glx = galaxArray[i]
      rarity = 0
      statsList = Object.keys(self.state.stats)
      for(let j=0;j<statsList.length;j++){
        // eslint-disable-next-line no-prototype-builtins
        if(statsList[j] !== "Race" && statsList[j] !== "Title" && statsList[j] !== "For Sale" && glx.metadata.hasOwnProperty(statsList[j])){
          rarity += (1 - (self.state.stats[statsList[j]][glx.metadata[statsList[j]]]/self.state.total))
        }
      }
      // eslint-disable-next-line no-prototype-builtins
      if (glx.metadata.hasOwnProperty("Title")){
        rarity *= 1.75
      }
      rarity *=10
      galaxArray[i]["Rarity"] = rarity
      self.state.glxObject[galaxArray[i]["token_id"]]["Rarity"] = rarity
      if(rarity > 0){
        self.state.minRare = Math.min(self.state.minRare, rarity)
      }
    }
    self.state.glxList = galaxArray
    filterStore.clearFilters()
  }
}


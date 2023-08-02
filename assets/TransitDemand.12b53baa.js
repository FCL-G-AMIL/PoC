import{d as m,n as p,o as M,g as d,C as R,m as T}from"./index.1d7144b8.js";import{l as P,p as k,b as $}from"./turf.es.943b3175.js";import{c as j}from"./index.7080a99e.js";import{c as A}from"./index.0d83a8f9.js";import{P as F}from"./papaparse.min.61fc48be.js";import{b as O}from"./index.d10190c4.js";import{C as E}from"./CollapsiblePanel.c7402232.js";import{H as z}from"./HTTPFileSystem.33aea9ff.js";import{W as S}from"./NewXmlFetcher.worker.f84d66d6.js";import{D as I}from"./DrawingTool.dcd0790f.js";import{Z as H}from"./ZoomButtons.6b3cc4d8.js";import{W as N}from"./GzipFetcher.worker.6a400caf.js";import"./layer.0cd20467.js";import"./text-layer.c8c59efd.js";import"./path-layer.4a6bc071.js";var W=m({name:"LeftDataPanel",props:{title:String},data:()=>({isHidden:!1,isLeaving:!1}),methods:{toggleHidePanel(){this.isHidden?this.isHidden=!this.isHidden:(this.isLeaving=!0,setTimeout(()=>{this.isHidden=!0,this.isLeaving=!1},300))}}}),B=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{attrs:{id:"datapanel"}},[e("div",{staticClass:"content-area",class:{"is-hidden":t.isHidden,bye:t.isLeaving}},[t.title?e("div",{staticClass:"info-header"},[e("h3",{staticStyle:{padding:"0.5rem 3rem","font-size":"1rem","font-weight":"normal",color:"white"}},[t._v(t._s(t.title))])]):t._e(),e("div",{staticClass:"top-area"},[t._t("default")],2)]),e("div",{staticClass:"restore-button",class:{"add-margin":!t.isHidden}},[e("button",{staticClass:"button is-small hide-button",on:{click:t.toggleHidePanel}},[t.isHidden?t._e():e("i",{staticClass:"fa fa-arrow-left"}),t.isHidden?e("i",{staticClass:"fa fa-arrow-right"}):t._e()])])])},X=[];const w={};var V=p(W,B,X,!1,Y,"17992f6c",null,null);function Y(t){for(let s in w)this[s]=w[s]}var G=function(){return V.exports}();function b(){return new Worker("/assets/TransitSupplyHelper.worker.9658062d.js",{type:"module"})}var q=m({name:"LegendBox",props:{rows:{type:Array,required:!0}}}),J=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"legend-container"},[e("p",{staticClass:"control-label"},[t._v("Legend")]),t._l(t.rows,function(i){return e("div",{key:i[0],staticClass:"legend-item"},[e("div",{staticClass:"legend-col-1",style:{"background-color":i[0]}}),e("span",{staticClass:"legend-col-2"},[t._v(t._s(i[1]))])])})],2)},K=[];const L={};var U=p(q,J,K,!1,Z,"27fc5701",null,null);function Z(t){for(let s in L)this[s]=L[s]}var Q=function(){return U.exports}();const tt={messages:{en:{metrics:"Metrics",viewer:"Transit Network"},de:{metrics:"Metrics",viewer:"\xD6V Netzwerk"}}},et="EPSG:31468",D=10,st=m({name:"TransitViewer",i18n:tt,components:{CollapsiblePanel:E,LeftDataPanel:G,LegendBox:Q,DrawingTool:I,ZoomButtons:H},props:{root:{type:String,required:!0},subfolder:{type:String,required:!0},yamlConfig:String,config:{type:Object},thumbnail:Boolean},data:()=>{const t=[{field:"departures",name_en:"Departures",name_de:"Abfahrten"}];return{mapPopup:new M.exports.Popup({closeButton:!1,closeOnClick:!1}),buttonColors:["#5E8AAE","#BF7230","#269367","#9C439C"],metrics:t,activeMetric:t[0].field,vizDetails:{transitSchedule:"",network:"",demand:"",projection:"",title:"",description:""},myState:{subfolder:"",yamlConfig:"",thumbnail:!0},isDarkMode:d.state.isDarkMode,isMapMoving:!1,loadingText:"MATSim Transit Inspector",mymap:null,mapID:`map-id-${Math.floor(1e12*Math.random())}`,projection:et,routesOnLink:[],selectedRoute:{},stopMarkers:[],_attachedRouteLayers:[],_departures:{},_linkData:null,_mapExtentXYXY:null,_maximum:-1/0,_network:{},_routeData:{},_stopFacilities:{},_transitLines:{},_roadFetcher:{},_transitFetcher:{},_transitHelper:{},_transitLinks:null,_geoTransitLinks:null,resolvers:{},resolverId:0,xmlWorker:null,cfDemand:null,cfDemandLink:null,hoverWait:!1}},computed:{fileApi(){return new z(this.fileSystem,d)},fileSystem(){const t=this.$store.state.svnProjects.filter(s=>s.slug===this.root);if(t.length===0)throw console.log("no such project"),Error;return t[0]},legendRows(){return[["#a03919","Rail"],["#448","Bus"]]}},watch:{"$store.state.resizeEvents"(){this.mymap&&this.mymap.resize()},"$store.state.viewState"({bearing:t,longitude:s,latitude:e,zoom:i,pitch:r}){if(!this.mymap||this.isMapMoving){this.isMapMoving=!1;return}!i||(this.mymap.off("move",this.handleMapMotion),this.mymap.jumpTo({bearing:t,zoom:i,center:[s,e],pitch:r}),this.mymap.on("move",this.handleMapMotion),this.stopMarkers.length>0&&this.showTransitStops())},"$store.state.colorScheme"(){this.isDarkMode=this.$store.state.colorScheme===R.DarkMode,this.mymap&&(this.removeAttachedRoutes(),this.mymap.setStyle(d.getters.mapStyle),this.mymap.on("style.load",()=>{this._geoTransitLinks&&this.addTransitToMap(this._geoTransitLinks),this.highlightAllAttachedRoutes(),this.selectedRoute&&this.showTransitRoute(this.selectedRoute.id)}))}},methods:{async getVizDetails(){var s,e;if(this.config)return this.vizDetails=Object.assign({},this.config),!0;if(((s=this.myState.yamlConfig)==null?void 0:s.endsWith("yaml"))||((e=this.myState.yamlConfig)==null?void 0:e.endsWith("yml")))return this.loadYamlConfig();const t=this.myState.yamlConfig.substring(0,15+this.myState.yamlConfig.indexOf("transitSchedule"));return this.vizDetails={transitSchedule:this.myState.yamlConfig,network:"",title:t,description:"",demand:"",projection:""},this.$emit("title",t),!0},async prepareView(){var i;const{files:t}=await this.fileApi.getDirectory(this.myState.subfolder);let s=(i=this.vizDetails.network)!=null?i:this.myState.yamlConfig.replaceAll("transitSchedule","network");if(t.indexOf(s)==-1){const r=t.filter(a=>a.endsWith("network.xml.gz"));r.length?s=r[0]:(this.loadingText="No road network found.",s="")}let e=[];this.myState.yamlConfig.indexOf("output_transitSchedule")>-1&&(e=t.filter(r=>r.endsWith("pt_stop2stop_departures.csv.gz"))),this.vizDetails.network=s,e.length&&(this.vizDetails.demand=e[0])},async guessProjection(t){var n,l,c,f,g,y,_,v;if(this.vizDetails.projection)return this.vizDetails.projection;if((n=this.config)!=null&&n.projection)return this.config.projection;if(((g=(f=(c=(l=t==null?void 0:t.roadXML)==null?void 0:l.network)==null?void 0:c.attributes)==null?void 0:f.attribute)==null?void 0:g.name)==="coordinateReferenceSystem")return(v=(_=(y=t==null?void 0:t.roadXML)==null?void 0:y.network)==null?void 0:_.attributes)==null?void 0:v.attribute["#text"];const s=`${this.root}/${this.subfolder}`,e=/EPSG:.\d/,{files:i}=await this.fileApi.getDirectory(this.myState.subfolder),r=i.filter(h=>h.indexOf(".output_config.xml")>-1||h.indexOf(".output_config_reduced.xml")>-1);if(r.length&&this.fileSystem)for(const h of r)try{return(await this.fetchXML({worker:null,slug:this.fileSystem.slug,filePath:this.myState.subfolder+"/"+h})).config.module.filter(u=>u.$name==="global")[0].param.filter(u=>u.$name==="coordinateSystem")[0].$value}catch{console.warn("Failed parsing",h)}let a=prompt("Need coordinate EPSG number:","")||"";if(!a)return"";if(isNaN(parseInt(a,10))&&!e.test(a))return this.guessProjection(t);a.startsWith("EPSG:")||(a="EPSG:"+a);const o=a;return localStorage.setItem(s,JSON.stringify({networkProjection:o})),o},async loadYamlConfig(){const t=this.myState.yamlConfig.indexOf("/")>-1?this.myState.yamlConfig:this.myState.subfolder+"/"+this.myState.yamlConfig;try{const e=await this.fileApi.getFileText(t);this.vizDetails=O.parse(e)}catch(e){const i=e;if(this.fileSystem&&this.fileSystem.needPassword&&i.status===401)this.$store.commit("requestLogin",this.fileSystem.slug);else{const r="Could not load "+t;this.$store.commit("error",r),this.loadingText=r}return!1}const s=this.vizDetails.title?this.vizDetails.title:"Transit Ridership";return this.$emit("title",s),this.projection=this.vizDetails.projection,!0},isMobile(){const t=window,s=document,e=s.documentElement,i=s.getElementsByTagName("body")[0],r=t.innerWidth||e.clientWidth||i.clientWidth;return t.innerHeight||e.clientHeight||i.clientHeight,r<640},setupMap(){try{this.mymap=new T.Map({bearing:0,container:this.mapID,logoPosition:"bottom-left",style:d.getters.mapStyle,pitch:0});const t=localStorage.getItem(this.$route.fullPath+"-bounds");if(t)try{const s=JSON.parse(t),e=this.isMobile()?0:1,i={top:50*e,bottom:50*e,right:50*e,left:50*e};this.mymap.fitBounds(s,{animate:!1,padding:i})}catch{}this.mymap.on("load",this.mapIsReady),this.mymap.on("move",this.handleMapMotion),this.mymap.on("click",this.handleEmptyClick),this.mymap.keyboard.disable()}catch(t){console.error(""+t)}},handleClickedMetric(t){console.log("transit metric:",t.field),this.activeMetric=t.field;let s=3;switch(t.field){case"departures":s=["max",2,["*",.03,["get","departures"]]];break;case"pax":s=["max",2,["*",.003,["get","pax"]]];break;case"loadfac":s=["max",2,["*",200,["get","loadfac"]]];break}this.mymap.setPaintProperty("transit-link","line-width",s)},handleMapMotion(){const t={longitude:this.mymap.getCenter().lng,latitude:this.mymap.getCenter().lat,bearing:this.mymap.getBearing(),zoom:this.mymap.getZoom(),pitch:this.mymap.getPitch()};this.isMapMoving||this.$store.commit("setMapCamera",t),this.isMapMoving=!0,this.stopMarkers.length>0&&this.showTransitStops()},handleEmptyClick(t){this.removeStopMarkers(),this.removeSelectedRoute(),this.removeAttachedRoutes(),this.routesOnLink=[]},showRouteDetails(t){!t&&!this.selectedRoute||(console.log({routeID:t}),t?this.showTransitRoute(t):this.showTransitRoute(this.selectedRoute.id),this.showTransitStops())},async mapIsReady(){const t=await this.loadNetworks(),s=await this.guessProjection(t);this.vizDetails.projection=s,this.projection=this.vizDetails.projection,console.log(s),t&&this.processInputs(t)},setupKeyListeners(){window.addEventListener("keyup",t=>{t.keyCode===27&&this.pressedEscape()}),window.addEventListener("keydown",t=>{t.keyCode===38&&this.pressedArrowKey(-1),t.keyCode===40&&this.pressedArrowKey(1)})},fetchXML(t){let s=t.worker;s.onmessage=r=>{const{resolve:a,reject:o}=this.resolvers[r.data.id];s.terminate(),r.data.error&&o(r.data.error),a(r.data.xml)};const e=this.resolverId++;return s.postMessage({id:e,fileSystem:this.fileSystem,filePath:t.filePath,options:t.options}),new Promise((r,a)=>{this.resolvers[e]={resolve:r,reject:a}})},async loadNetworks(){try{if(!this.fileSystem||!this.vizDetails.network||!this.vizDetails.transitSchedule)return;this.loadingText="Loading networks...";const t=this.fetchXML({worker:this._roadFetcher,slug:this.fileSystem.slug,filePath:this.myState.subfolder+"/"+this.vizDetails.network,options:{attributeNamePrefix:""}}),s=this.fetchXML({worker:this._transitFetcher,slug:this.fileSystem.slug,filePath:this.myState.subfolder+"/"+this.vizDetails.transitSchedule,options:{attributeNamePrefix:"",alwaysArray:["transitSchedule.transitLine.transitRoute","transitSchedule.transitLine.transitRoute.departures.departure"]}}),e=await Promise.all([t,s]);return{roadXML:e[0],transitXML:e[1],ridership:[]}}catch(t){return console.error("TRANSIT:",t),this.loadingText=""+t,d.commit("error","Transit: "+t),null}},loadDemandData(t){return new Promise((e,i)=>{t||e([]),this.loadingText="Loading demand...";const r=new N;r.onmessage=a=>{this.loadingText="Processing demand...";const o=new TextDecoder("utf-8").decode(a.data);r.terminate(),F.parse(o,{header:!0,skipEmptyLines:!0,dynamicTyping:!0,worker:!0,complete:n=>{e(this.processDemand(n))}})},r.postMessage({filePath:this.myState.subfolder+"/"+t,fileSystem:this.fileSystem})})},processDemand(t){this.loadingText="Processing demand data...",console.log("BUILD crossfilter"),this.cfDemand=A(t.data),this.cfDemandLink=this.cfDemand.dimension(a=>a.linkIdsSincePreviousStop),console.log("COUNTING RIDERSHIP");const s={},e=this.cfDemandLink.group();e.reduceSum(a=>a.passengersAtArrival).all().map(a=>{s[a.key]=a.value});const i={};e.reduceSum(a=>a.totalVehicleCapacity).all().map(a=>{i[a.key]=a.value});for(const a of this._transitLinks.features)a.properties.pax=s[a.properties.id],a.properties.cap=i[a.properties.id],a.properties.loadfac=Math.round(1e3*s[a.properties.id]/i[a.properties.id])/1e3;return this.metrics=this.metrics.concat([{field:"pax",name_en:"Passengers",name_de:"Passagiere"},{field:"loadfac",name_en:"Load Factor",name_de:"Auslastung"}]),this.mymap.getSource("transit-source").setData(this._transitLinks),this.loadingText="",[]},async processInputs(t){this.loadingText="Preparing...",this._transitHelper=new b,this._transitHelper.onmessage=async s=>{this.receivedProcessedTransit(s)},this._transitHelper.postMessage({xml:t,projection:this.projection})},async receivedProcessedTransit(t){if(t.data.status){this.loadingText=t.data.status;return}if(t.data.error){console.error(t.data.error),this.$store.commit("error",t.data.error);return}const{network:s,routeData:e,stopFacilities:i,transitLines:r,mapExtent:a}=t.data;this._network=s,this._routeData=e,this._stopFacilities=i,this._transitLines=r,this._mapExtentXYXY=a,this._transitHelper.terminate(),this.loadingText="Summarizing departures...",await this.processDepartures(),this._transitLinks=await this.constructDepartureFrequencyGeoJson(),this.addTransitToMap(this._transitLinks),this.handleClickedMetric({field:"departures"}),localStorage.setItem(this.$route.fullPath+"-bounds",JSON.stringify(this._mapExtentXYXY)),this.mymap.fitBounds(this._mapExtentXYXY,{animate:!1}),this.vizDetails.demand&&await this.loadDemandData(this.vizDetails.demand),this.loadingText=""},async processDepartures(){this.loadingText="Processing departures...";for(const t in this._transitLines)if(this._transitLines.hasOwnProperty(t)){const s=this._transitLines[t];for(const e of s.transitRoutes)for(const i of e.route)i in this._departures||(this._departures[i]={total:0,routes:new Set}),this._departures[i].total+=e.departures,this._departures[i].routes.add(e.id),this._maximum=Math.max(this._maximum,this._departures[i].total)}},addTransitToMap(t){this._geoTransitLinks=t,this.mymap.addSource("transit-source",{data:t,type:"geojson"}),this.mymap.addLayer({id:"transit-link",source:"transit-source",type:"line",paint:{"line-opacity":1,"line-width":1,"line-color":["get","color"]}}),this.mymap.on("click","transit-link",s=>{this.clickedOnTransitLink(s)}),this.mymap.on("mousemove","transit-link",s=>{this.mymap.getCanvas().style.cursor=s?"pointer":"grab",this.hoveredOnElement(s)}),this.mymap.on("mouseleave","transit-link",()=>{this.mymap.getCanvas().style.cursor="grab",this.mapPopup.remove()})},hoveredOnElement(t){const s=t.features[0].properties;let e='<div class="map-popup">';for(const i of this.metrics){let r=this.$i18n.locale=="de"?i.name_de:i.name_en;r=r.replaceAll(" ","&nbsp;"),isNaN(s[i.field])||(e+=`
          <div style="display: flex">
            <div>${r}:&nbsp;&nbsp;</div>
            <b style="margin-left: auto; text-align: right">${s[i.field]}</b>
          </div>`)}e+="<div>",this.mapPopup.setLngLat(t.lngLat).setHTML(e).addTo(this.mymap)},async constructDepartureFrequencyGeoJson(){const t=[];for(const s in this._departures)if(this._departures.hasOwnProperty(s)){const e=this._network.links[s];if(!e)continue;const i=[[this._network.nodes[e.from].x,this._network.nodes[e.from].y],[this._network.nodes[e.to].x,this._network.nodes[e.to].y]],r=this._departures[s].total,a=.25+.75*(r-1)/this._maximum,o=Math.floor(D*a);let n=!0;for(const c of this._departures[s].routes)this._routeData[c].transportMode==="bus"&&(n=!1);let l={type:"Feature",geometry:{type:"LineString",coordinates:i},properties:{color:n?"#a03919":it[o],colorBin:o,departures:r,id:s,isRail:n,from:e.from,to:e.to}};l=this.offsetLineByMeters(l,15),t.push(l)}return t.sort(function(s,e){return s.isRail&&!e.isRail?-1:e.isRail&&!s.isRail?1:0}),{type:"FeatureCollection",features:t}},offsetLineByMeters(t,s){try{return P(t,s,{units:"meters"})}catch{}return t},removeStopMarkers(){this.stopMarkers=[]},async showTransitStops(){this.removeStopMarkers();const t=this.selectedRoute,s=this.mymap.getBearing();let e;for(const[i,r]of t.routeProfile.entries()){const a=[this._stopFacilities[r.refId].x,this._stopFacilities[r.refId].y];if(i<t.routeProfile.length-1){const l=k([a[0],a[1]]),c=k([this._stopFacilities[t.routeProfile[i+1].refId].x,this._stopFacilities[t.routeProfile[i+1].refId].y]);e=$(l,c)-s}const o=this.mymap.project([a[0],a[1]]),n={i,bearing:e,xy:{x:Math.floor(o.x),y:Math.floor(o.y)}};this.stopMarkers.push(n)}},showTransitRoute(t){if(!t)return;const s=this._routeData[t];this.selectedRoute=s;const e=this.mymap.getSource("selected-route-data");e?e.setData(s.geojson):this.mymap.addSource("selected-route-data",{data:s.geojson,type:"geojson"}),this.mymap.getLayer("selected-route")||this.mymap.addLayer({id:"selected-route",source:"selected-route-data",type:"line",paint:{"line-opacity":1,"line-width":5,"line-color":"#097c43"}})},removeSelectedRoute(){if(this.selectedRoute){try{this.mymap.removeLayer("selected-route")}catch{}this.selectedRoute=null}},clickedOnTransitLink(t){this.removeStopMarkers(),this.removeSelectedRoute();const s=t.features[0].properties,e=this._departures[s.id].routes;this.calculatePassengerVolumes(s.id);const i=[];for(const r of e)i.push(this._routeData[r]);i.sort(function(r,a){return r.departures>a.departures?-1:1}),this.routesOnLink=i,this.highlightAllAttachedRoutes(),i.length>0&&this.showRouteDetails(i[0].id)},calculatePassengerVolumes(t){if(!this.cfDemandLink||!this.cfDemand)return;this.cfDemandLink.filter(t);const s=this.cfDemand.allFiltered();let e=0;s.map(i=>{e=e+i.passengersBoarding+i.passengersAtArrival-i.passengersAlighting})},removeAttachedRoutes(){for(const t of this._attachedRouteLayers)try{this.mymap.removeLayer("route-"+t),this.mymap.removeSource("source-route-"+t)}catch{}this._attachedRouteLayers=[]},highlightAllAttachedRoutes(){this.removeAttachedRoutes();for(const t of this.routesOnLink)this.mymap.addSource("source-route-"+t.id,{data:t.geojson,type:"geojson"}),this.mymap.addLayer({id:"route-"+t.id,source:"source-route-"+t.id,type:"line",paint:{"line-opacity":.7,"line-width":8,"line-color":"#ccff33"}}),this._attachedRouteLayers.push(t.id)},pressedEscape(){this.removeSelectedRoute(),this.removeStopMarkers(),this.removeAttachedRoutes(),this.selectedRoute=null,this.routesOnLink=[]},pressedArrowKey(t){if(!this.selectedRoute)return;let s=this.routesOnLink.indexOf(this.selectedRoute);s=s+t,!(s<0||s>=this.routesOnLink.length)&&this.showRouteDetails(this.routesOnLink[s].id)},clearData(){var t;this._attachedRouteLayers=[],this._departures={},this._mapExtentXYXY=[180,90,-180,-90],this._maximum=0,this._network={nodes:{},links:{}},this._routeData={},this._stopFacilities={},this._transitLinks=null,this._transitLines={},this.selectedRoute=null,this.cfDemand=null,(t=this.cfDemandLink)==null||t.dispose(),this.resolvers={},this.routesOnLink=[],this.selectedRoute={},this.stopMarkers=[],this._linkData=null,this._geoTransitLinks=null}},async mounted(){var s;this.$store.commit("setFullScreen",!this.thumbnail),this.clearData(),this._roadFetcher=new S,this._transitFetcher=new S,this._transitHelper=new b,this.myState.subfolder=this.subfolder,this.myState.yamlConfig=(s=this.yamlConfig)!=null?s:"",this.myState.thumbnail=this.thumbnail,await this.getVizDetails()&&(this.thumbnail||(await this.prepareView(),this.setupMap()))},beforeDestroy(){this.mymap&&this.mymap.remove(),this.clearData(),this.xmlWorker&&this.xmlWorker.terminate(),this._roadFetcher&&this._roadFetcher.terminate(),this._transitFetcher&&this._transitFetcher.terminate(),this._transitHelper&&this._transitHelper.terminate(),this.$store.commit("setFullScreen",!1)}}),it=j({colormap:"viridis",nshades:D});var rt=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"transit-viz",class:{"hide-thumbnail":!t.thumbnail}},[e("div",{staticClass:"map-container",class:{"hide-thumbnail":!t.thumbnail}},[e("div",{staticClass:"map-styles",attrs:{id:t.mapID}},t._l(t.stopMarkers,function(i){return e("div",{key:i.i,staticClass:"stop-marker",style:{transform:"translate(-50%,-50%) rotate("+i.bearing+"deg)",left:i.xy.x+"px",top:i.xy.y+"px"}})}),0),t.thumbnail?t._e():e("legend-box",{staticClass:"legend",attrs:{rows:t.legendRows}})],1),t.thumbnail?t._e():e("zoom-buttons"),t.thumbnail?t._e():e("collapsible-panel",{staticClass:"left-side",attrs:{darkMode:t.isDarkMode,locked:!0,direction:"left"}},[e("div",{staticClass:"panel-items"},[t.routesOnLink.length>0?e("div",{staticClass:"route-list"},t._l(t.routesOnLink,function(i){return e("div",{key:i.uniqueRouteID,staticClass:"route",class:{highlightedRoute:t.selectedRoute&&i.id===t.selectedRoute.id},on:{click:function(r){return t.showRouteDetails(i.id)}}},[e("div",{staticClass:"route-title"},[t._v(t._s(i.id))]),e("div",{staticClass:"detailed-route-data"},[e("div",{staticClass:"col"},[e("p",[e("b",[t._v(t._s(i.departures)+" departures")])]),e("p",[t._v("First: "+t._s(i.firstDeparture))]),e("p",[t._v("Last: "+t._s(i.lastDeparture))])]),i.passengersAtArrival?e("div",{staticClass:"col"},[e("p",[e("b",[t._v(t._s(i.passengersAtArrival)+" passengers")])]),e("p",[t._v(t._s(i.totalVehicleCapacity)+" capacity")])]):t._e()])])}),0):t._e()])]),t.thumbnail?t._e():e("div",{staticClass:"control-panel",class:{"is-dashboard":t.config!==void 0}},[e("div",{staticClass:"panel-item"},[e("p",{staticClass:"control-label"},[t._v(t._s(t.$t("metrics"))+":")]),e("div",{staticClass:"metric-buttons"},t._l(t.metrics,function(i,r){return e("button",{key:i.field,staticClass:"button is-small metric-button",style:{color:t.activeMetric===i.field?"white":t.buttonColors[r],border:`1px solid ${t.buttonColors[r]}`,"border-right":`0.4rem solid ${t.buttonColors[r]}`,"border-radius":"4px","background-color":t.activeMetric===i.field?t.buttonColors[r]:t.isDarkMode?"#333":"white"},on:{click:function(a){return t.handleClickedMetric(i)}}},[t._v(t._s(t.$i18n.locale==="de"?i.name_de:i.name_en))])}),0)])]),!t.thumbnail&&t.loadingText?e("div",{staticClass:"status-corner"},[e("p",[t._v(t._s(t.loadingText))])]):t._e()],1)},at=[];const x={};var ot=p(st,rt,at,!1,nt,"1d6f3f1d",null,null);function nt(t){for(let s in x)this[s]=x[s]}var Dt=function(){return ot.exports}();export{Dt as default};
//# sourceMappingURL=TransitDemand.12b53baa.js.map

import{d as c,g as d,U as m,B as n,S as r,n as u}from"./index.1d7144b8.js";import{V as g}from"./VuePlotly.a136978d.js";import{b as p}from"./DashBoard.c40bb82f.js";import{t as f}from"./pureFunctionsAny.generated.001ca343.js";import"./index.d10190c4.js";import"./HTTPFileSystem.33aea9ff.js";import"./TopSheet.f44901df.js";import"./extends.946277fc.js";var y=c({name:"HeatmapPanel",components:{VuePlotly:g},props:{fileSystemConfig:{type:Object,required:!0},subfolder:{type:String,required:!0},files:{type:Array,required:!0},config:{type:Object,required:!0},cardTitle:{type:String,required:!0},cardId:String,datamanager:{type:Object,required:!0},zoomed:Boolean},data:()=>({globalState:d.state,dataSet:{},id:"heatmap-"+Math.floor(1e12*Math.random()),YAMLrequirementsHeatmap:{dataset:"",y:"",columns:[]},layout:{margin:{t:8,b:50},font:{color:"#444444",family:m},barmode:"",bargap:.08,xaxis:{autorange:!0,title:""},yaxis:{autorange:!0,title:""},legend:{x:1,xanchor:"right",y:1}},data:[],options:{displaylogo:!1,responsive:!0,modeBarButtonsToRemove:["pan2d","zoom2d","select2d","lasso2d","zoomIn2d","zoomOut2d","autoScale2d","hoverClosestCartesian","hoverCompareCartesian","resetScale2d","toggleSpikelines","resetViewMapbox"],toImageButtonOptions:{format:"png",filename:"heatmap",width:1200,height:800,scale:1}}}),async mounted(){this.updateTheme(),this.checkWarningsAndErrors(),this.dataSet=await this.loadData(),Object.keys(this.dataSet).length&&(this.updateChart(),this.options.toImageButtonOptions.filename=p(this.cardTitle,this.subfolder),this.$emit("dimension-resizer",{id:this.cardId,resizer:this.changeDimensions})),this.$emit("isLoaded")},beforeDestroy(){var t;(t=this.datamanager)==null||t.removeFilterListener(this.config,this.handleFilterChanged)},watch:{zoomed(){this.resizePlot()},"globalState.isDarkMode"(){this.updateTheme()}},methods:{changeDimensions(t){this.layout=Object.assign({},this.layout,t)},resizePlot(){var t=document.getElementsByClassName("spinner-box");if(this.zoomed)for(let e of t)e.clientHeight>0&&(this.layout.height=e.clientHeight);else this.layout.height=300},updateTheme(){const t={paper_bgcolor:n[this.globalState.colorScheme],plot_bgcolor:n[this.globalState.colorScheme],font:{color:this.globalState.isDarkMode?"#cccccc":"#444444"}};this.layout=Object.assign({},this.layout,t)},handleFilterChanged(){if(!this.datamanager)return;const{filteredRows:t}=this.datamanager.getFilteredDataset(this.config);if(!t||!t.length)this.dataSet={allRows:{}};else{const e={},a=Object.keys(t[0]);a.forEach(i=>e[i]={name:i,values:[]}),t.forEach(i=>{a.forEach(s=>e[s].values.push(i[s]))}),this.dataSet={allRows:e}}this.updateChart()},async loadData(){try{this.validateYAML();let t=await this.datamanager.getDataset(this.config);if(!this.config.filters)return t;this.datamanager.addFilterListener(this.config,this.handleFilterChanged);for(const[e,a]of Object.entries(this.config.filters)){const i={dataset:this.config.dataset,column:e,value:a,range:Array.isArray(a)};this.datamanager.setFilter(i)}return{allRows:{}}}catch(t){console.error(""+t)}return{allRows:{}}},validateYAML(){console.log("in heatmap validation");for(const t in this.YAMLrequirementsHeatmap)t in this.config||this.$store.commit("setStatus",{type:r.ERROR,msg:`YAML file missing required key: ${t}`,desc:"Check this.YAMLrequirementsXY for required keys"})},updateChart(){this.layout.xaxis.title=this.config.xAxisTitle||this.config.xAxisName||"",this.layout.yaxis.title=this.config.yAxisTitle||this.config.yAxisName||"";try{this.config.groupBy?this.updateChartWithGroupBy():this.updateChartSimple()}catch(t){const e=""+t;this.$store.commit("setStatus",{type:r.ERROR,msg:e,desc:"Add a desription..."})}},updateChartWithGroupBy(){},updateChartSimple(){var t=[],e=[];const a=this.dataSet.allRows||{},i=this.config.columns||this.config.usedCol||[];if(!i.length)return;let s=a[this.config.y].values;for(const o of Object.keys(a))i.includes(o)&&t.push(o);let h=0;for(const o of this.config.columns)e[h++]=a[o].values;this.config.flipAxes||(e=f(e)),this.data=[{x:this.config.flipAxes?s:t,y:this.config.flipAxes?t:s,z:e,colorscale:"Viridis",type:"heatmap",automargin:!0}]},checkWarningsAndErrors(){var t=this.cardTitle;t.length==0&&this.$store.commit("setStatus",{type:r.WARNING,msg:"The plot title is missing!",desc:"Please add a plot title in the .yaml-file (title: 'Example title')"})}}}),v=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("VuePlotly",{staticClass:"myplot",attrs:{data:t.data,layout:t.layout,options:t.options,id:t.id}})},_=[];const l={};var S=u(y,v,_,!1,x,"6e161c80",null,null);function x(t){for(let e in l)this[e]=l[e]}var z=function(){return S.exports}();export{z as default};
//# sourceMappingURL=heatmap.b1b1ff89.js.map

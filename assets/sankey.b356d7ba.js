import{d as o,n as i}from"./index.1d7144b8.js";import a from"./SankeyDiagram.a063b044.js";import"./index.d10190c4.js";import"./timer.8d793420.js";import"./defaultLocale.52699303.js";import"./papaparse.min.61fc48be.js";import"./HTTPFileSystem.33aea9ff.js";import"./rainbow.d98e4227.js";import"./cubehelix.15b78c18.js";var s=o({name:"SankeyDiagramPanel",components:{SankeyDiagram:a},props:{fileSystemConfig:{type:Object,required:!0},subfolder:{type:String,required:!0},config:{type:Object,required:!0}},mounted(){this.$emit("isLoaded")}}),m=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("sankey-diagram",{staticClass:"deck-map",attrs:{root:e.fileSystemConfig.slug,subfolder:e.subfolder,config:e.config,thumbnail:!1}})},u=[];const r={};var _=i(s,m,u,!1,l,"44d161d3",null,null);function l(e){for(let t in r)this[t]=r[t]}var S=function(){return _.exports}();export{S as default};
//# sourceMappingURL=sankey.b356d7ba.js.map
import{d as n,n as s}from"./index.1d7144b8.js";import a from"./VegaLite.37655559.js";import"./nprogress.e9f925da.js";import"./bounds.4be3f103.js";import"./threshold.d4cae24d.js";import"./cubehelix.15b78c18.js";import"./index.5877f313.js";import"./defaultLocale.52699303.js";import"./min.4e1438e9.js";import"./sum.da638719.js";import"./timer.8d793420.js";import"./HTTPFileSystem.33aea9ff.js";var m=n({name:"VegaLitePanel",components:{VegaLite:a},props:{fileSystemConfig:{type:Object,required:!0},subfolder:{type:String,required:!0},files:{type:Array,required:!0},config:{type:Object,required:!0},cardId:{type:String,required:!0}},mounted(){this.$emit("isLoaded")},methods:{}}),u=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("vega-lite",{staticClass:"dash-element",attrs:{root:e.fileSystemConfig.slug,subfolder:e.subfolder,config:e.config.config,cardId:e.cardId,thumbnail:!1},on:{"dimension-resizer":function(o){return e.$emit("dimension-resizer",o)}}})},d=[];const r={};var p=s(m,u,d,!1,l,"ee698514",null,null);function l(e){for(let t in r)this[t]=r[t]}var j=function(){return p.exports}();export{j as default};
//# sourceMappingURL=vega.a0293e8b.js.map

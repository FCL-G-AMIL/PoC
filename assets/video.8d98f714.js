import{d as i,n as l}from"./index.1d7144b8.js";import{H as a}from"./HTTPFileSystem.33aea9ff.js";var u=i({name:"VideoPanel",props:{fileSystemConfig:{type:Object,required:!0},subfolder:{type:String,required:!0},files:{type:Array,required:!0},config:{type:Object,required:!0}},data:()=>({controls:"",loop:"",allowfullscreen:"",autoplay:"",muted:"",sources:{},r:new RegExp("^(?:[a-z]+:)?//","i")}),async mounted(){this.controls=this.config.controls,this.loop=this.config.loop,this.allowfullscreen=this.config.allowfullscreen,this.autoplay=this.config.autoplay,this.muted=this.config.muted,this.sources={};const e=new a(this.fileSystemConfig);for(const o in this.config.sources){var t=this.config.sources[o];this.r.test(t)||(t=e.cleanURL(`${this.subfolder}/${t}`)),this.sources[o]=t}this.$emit("isLoaded")}}),c=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("figure",{staticClass:"video_container"},[o("video",{attrs:{controls:e.controls,loop:e.loop,allowfullscreen:e.allowfullscreen,autoplay:e.autoplay},domProps:{muted:e.muted}},[e._l(e.sources,function(r,s){return o("source",{key:s,attrs:{src:r,type:s}})}),e._l(e.sources,function(r,s){return o("p",{key:s},[e._v("Video tag not supported. Download the video\xA0"),o("a",{attrs:{href:r,target:"_blank"}},[e._v("here")])])})],2)])},f=[];const n={};var d=l(u,c,f,!1,p,"faa6b34a",null,null);function p(e){for(let t in n)this[t]=n[t]}var m=function(){return d.exports}();export{m as default};
//# sourceMappingURL=video.8d98f714.js.map
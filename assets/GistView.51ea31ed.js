import{d as i,n as l}from"./index.1d7144b8.js";import{b as c}from"./index.d10190c4.js";import{D as f}from"./DashBoard.c40bb82f.js";import"./HTTPFileSystem.33aea9ff.js";import"./TopSheet.f44901df.js";async function u(t,e){try{const r=e||{},o=await(await fetch(`https://api.github.com/gists/${t}`)).json();console.log({gist:o});const n=r.file?o.files[r.file]:o.files[Object.keys(o.files)[0]];var s=c.parse(n.content);return s}catch(r){console.error(r)}finally{}}var _={load:u},m=i({name:"GistView",components:{DashBoard:f},props:{id:{type:String,required:!0}},data:()=>({fileSystemConfig:null,yaml:{},xsubfolder:""}),async mounted(){try{this.yaml=await _.load(this.id,this.$route.params),this.xsubfolder=this.yaml.config.folder}catch{}}}),d=function(){var t=this,e=t.$createElement,s=t._self._c||e;return t.xsubfolder?s("dash-board",{attrs:{root:"gist",gist:t.yaml,xsubfolder:t.yaml.config.folder}}):t._e()},p=[];const a={};var v=l(m,d,p,!1,y,"302c0774",null,null);function y(t){for(let e in a)this[e]=a[e]}var G=function(){return v.exports}();export{G as default};
//# sourceMappingURL=GistView.51ea31ed.js.map

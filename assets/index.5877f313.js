class h extends Map{constructor(e,s=i){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:s}}),e!=null)for(const[r,c]of e)this.set(r,c)}get(e){return super.get(n(this,e))}has(e){return super.has(n(this,e))}set(e,s){return super.set(u(this,e),s)}delete(e){return super.delete(o(this,e))}}class a extends Set{constructor(e,s=i){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:s}}),e!=null)for(const r of e)this.add(r)}has(e){return super.has(n(this,e))}add(e){return super.add(u(this,e))}delete(e){return super.delete(o(this,e))}}function n({_intern:t,_key:e},s){const r=e(s);return t.has(r)?t.get(r):s}function u({_intern:t,_key:e},s){const r=e(s);return t.has(r)?t.get(r):(t.set(r,s),s)}function o({_intern:t,_key:e},s){const r=e(s);return t.has(r)&&(s=t.get(r),t.delete(r)),s}function i(t){return t!==null&&typeof t=="object"?t.valueOf():t}export{h as I,a};
//# sourceMappingURL=index.5877f313.js.map

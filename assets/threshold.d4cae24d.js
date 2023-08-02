import{R as C,d as Z,e as A,f as z,g as $,C as B,i as D,r as N,n as F,j as J}from"./cubehelix.15b78c18.js";import{I as M}from"./index.5877f313.js";function m(n,t){return n==null||t==null?NaN:n<t?-1:n>t?1:n>=t?0:NaN}function P(n,t){return n==null||t==null?NaN:t<n?-1:t>n?1:t>=n?0:NaN}function R(n){let t,r,e;n.length!==2?(t=m,r=(s,c)=>m(n(s),c),e=(s,c)=>n(s)-c):(t=n===m||n===P?n:Q,r=n,e=n);function i(s,c,f=0,l=s.length){if(f<l){if(t(c,c)!==0)return l;do{const h=f+l>>>1;r(s[h],c)<0?f=h+1:l=h}while(f<l)}return f}function a(s,c,f=0,l=s.length){if(f<l){if(t(c,c)!==0)return l;do{const h=f+l>>>1;r(s[h],c)<=0?f=h+1:l=h}while(f<l)}return f}function u(s,c,f=0,l=s.length){const h=i(s,c,f,l-1);return h>f&&e(s[h-1],c)>-e(s[h],c)?h-1:h}return{left:i,center:u,right:a}}function Q(){return 0}function T(n){return n===null?NaN:+n}function*sn(n,t){if(t===void 0)for(let r of n)r!=null&&(r=+r)>=r&&(yield r);else{let r=-1;for(let e of n)(e=t(e,++r,n))!=null&&(e=+e)>=e&&(yield e)}}const I=R(m),U=I.right,cn=I.left;R(T).center;var V=U;const p=18,j=.96422,q=1,L=.82521,S=4/29,b=6/29,E=3*b*b,W=b*b*b;function G(n){if(n instanceof o)return new o(n.l,n.a,n.b,n.opacity);if(n instanceof g)return K(n);n instanceof C||(n=Z(n));var t=v(n.r),r=v(n.g),e=v(n.b),i=y((.2225045*t+.7168786*r+.0606169*e)/q),a,u;return t===r&&r===e?a=u=i:(a=y((.4360747*t+.3850649*r+.1430804*e)/j),u=y((.0139322*t+.0971045*r+.7141733*e)/L)),new o(116*i-16,500*(a-i),200*(i-u),n.opacity)}function ln(n,t){return new o(n,0,0,t==null?1:t)}function _(n,t,r,e){return arguments.length===1?G(n):new o(n,t,r,e==null?1:e)}function o(n,t,r,e){this.l=+n,this.a=+t,this.b=+r,this.opacity=+e}A(o,_,z(B,{brighter(n){return new o(this.l+p*(n==null?1:n),this.a,this.b,this.opacity)},darker(n){return new o(this.l-p*(n==null?1:n),this.a,this.b,this.opacity)},rgb(){var n=(this.l+16)/116,t=isNaN(this.a)?n:n+this.a/500,r=isNaN(this.b)?n:n-this.b/200;return t=j*w(t),n=q*w(n),r=L*w(r),new C(d(3.1338561*t-1.6168667*n-.4906146*r),d(-.9787684*t+1.9161415*n+.033454*r),d(.0719453*t-.2289914*n+1.4052427*r),this.opacity)}}));function y(n){return n>W?Math.pow(n,1/3):n/E+S}function w(n){return n>b?n*n*n:E*(n-S)}function d(n){return 255*(n<=.0031308?12.92*n:1.055*Math.pow(n,1/2.4)-.055)}function v(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function H(n){if(n instanceof g)return new g(n.h,n.c,n.l,n.opacity);if(n instanceof o||(n=G(n)),n.a===0&&n.b===0)return new g(NaN,0<n.l&&n.l<100?0:NaN,n.l,n.opacity);var t=Math.atan2(n.b,n.a)*D;return new g(t<0?t+360:t,Math.sqrt(n.a*n.a+n.b*n.b),n.l,n.opacity)}function fn(n,t,r,e){return arguments.length===1?H(n):new g(r,t,n,e==null?1:e)}function x(n,t,r,e){return arguments.length===1?H(n):new g(n,t,r,e==null?1:e)}function g(n,t,r,e){this.h=+n,this.c=+t,this.l=+r,this.opacity=+e}function K(n){if(isNaN(n.h))return new o(n.l,0,0,n.opacity);var t=n.h*$;return new o(n.l,Math.cos(t)*n.c,Math.sin(t)*n.c,n.opacity)}A(g,x,z(B,{brighter(n){return new g(this.h,this.c,this.l+p*(n==null?1:n),this.opacity)},darker(n){return new g(this.h,this.c,this.l-p*(n==null?1:n),this.opacity)},rgb(){return K(this).rgb()}}));function O(n,t){switch(arguments.length){case 0:break;case 1:this.range(n);break;default:this.range(t).domain(n);break}return this}function hn(n,t){switch(arguments.length){case 0:break;case 1:{typeof n=="function"?this.interpolator(n):this.range(n);break}default:{this.domain(n),typeof t=="function"?this.interpolator(t):this.range(t);break}}return this}const k=Symbol("implicit");function nn(){var n=new M,t=[],r=[],e=k;function i(a){let u=n.get(a);if(u===void 0){if(e!==k)return e;n.set(a,u=t.push(a)-1)}return r[u%r.length]}return i.domain=function(a){if(!arguments.length)return t.slice();t=[],n=new M;for(const u of a)n.has(u)||n.set(u,t.push(u)-1);return i},i.range=function(a){return arguments.length?(r=Array.from(a),i):r.slice()},i.unknown=function(a){return arguments.length?(e=a,i):e},i.copy=function(){return nn(t,r).unknown(e)},O.apply(i,arguments),i}function X(n,t,r,e,i){var a=n*n,u=a*n;return((1-3*n+3*a-u)*t+(4-6*a+3*u)*r+(1+3*n+3*a-3*u)*e+u*i)/6}function tn(n){var t=n.length-1;return function(r){var e=r<=0?r=0:r>=1?(r=1,t-1):Math.floor(r*t),i=n[e],a=n[e+1],u=e>0?n[e-1]:2*i-a,s=e<t-1?n[e+2]:2*a-i;return X((r-e/t)*t,u,i,a,s)}}function rn(n){var t=n.length;return function(r){var e=Math.floor(((r%=1)<0?++r:r)*t),i=n[(e+t-1)%t],a=n[e%t],u=n[(e+1)%t],s=n[(e+2)%t];return X((r-e/t)*t,i,a,u,s)}}var on=function n(t){var r=J(t);function e(i,a){var u=r((i=N(i)).r,(a=N(a)).r),s=r(i.g,a.g),c=r(i.b,a.b),f=F(i.opacity,a.opacity);return function(l){return i.r=u(l),i.g=s(l),i.b=c(l),i.opacity=f(l),i+""}}return e.gamma=n,e}(1);function Y(n){return function(t){var r=t.length,e=new Array(r),i=new Array(r),a=new Array(r),u,s;for(u=0;u<r;++u)s=N(t[u]),e[u]=s.r||0,i[u]=s.g||0,a[u]=s.b||0;return e=n(e),i=n(i),a=n(a),s.opacity=1,function(c){return s.r=e(c),s.g=i(c),s.b=a(c),s+""}}}var gn=Y(tn),bn=Y(rn);function en(){var n=[.5],t=[0,1],r,e=1;function i(a){return a!=null&&a<=a?t[V(n,a,0,e)]:r}return i.domain=function(a){return arguments.length?(n=Array.from(a),e=Math.min(n.length,t.length-1),i):n.slice()},i.range=function(a){return arguments.length?(t=Array.from(a),e=Math.min(n.length,t.length-1),i):t.slice()},i.invertExtent=function(a){var u=t.indexOf(a);return[n[u-1],n[u]]},i.unknown=function(a){return arguments.length?(r=a,i):r},i.copy=function(){return en().domain(n).range(t).unknown(r)},O.apply(i,arguments)}export{fn as a,m as b,cn as c,P as d,on as e,V as f,ln as g,x as h,tn as i,O as j,hn as k,_ as l,T as m,sn as n,nn as o,rn as p,bn as q,gn as r,R as s,en as t,U as u,k as v};
//# sourceMappingURL=threshold.d4cae24d.js.map

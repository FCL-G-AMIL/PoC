import{G as l}from"./index.84f8ccb6.js";import{T as _,R as m,S as v,W as E,X as I,Y as O}from"./layer.0cd20467.js";var F=`// BC 2021-04-30: this file forked from https://github.com/visgl/deck.gl\r
//\r
// Copyright (c) 2015 - 2017 Uber Technologies, Inc.\r
//\r
// Permission is hereby granted, free of charge, to any person obtaining a copy\r
// of this software and associated documentation files (the "Software"), to deal\r
// in the Software without restriction, including without limitation the rights\r
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r
// copies of the Software, and to permit persons to whom the Software is\r
// furnished to do so, subject to the following conditions:\r
//\r
// The above copyright notice and this permission notice shall be included in\r
// all copies or substantial portions of the Software.\r
//\r
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r
// THE SOFTWARE.\r
\r
#define SHADER_NAME icon-layer-vertex-shader\r
\r
attribute vec2 positions;\r
\r
attribute float instanceSizes;\r
attribute vec4 instanceColors;\r
attribute vec3 instancePickingColors;\r
attribute vec4 instanceIconFrames;\r
attribute float instanceColorModes;\r
attribute vec2 instanceOffsets;\r
attribute vec2 instancePixelOffset;\r
\r
uniform float sizeScale;\r
uniform vec2 iconsTextureDim;\r
uniform float sizeMinPixels;\r
uniform float sizeMaxPixels;\r
uniform bool billboard;\r
\r
uniform float currentTime;\r
\r
uniform vec2 iconStillOffsets;\r
uniform vec4 iconStillFrames;\r
\r
attribute float instanceTimestamps;\r
attribute float instanceTimestampsNext;\r
attribute vec2 instanceStartPositions;\r
attribute vec2 instanceEndPositions;\r
\r
varying float vColorMode;\r
varying vec4 vColor;\r
varying vec2 vTextureCoords;\r
varying vec2 uv;\r
varying float vPercentComplete;\r
\r
// ------------------------------------------------------------------\r
\r
vec2 rotate_by_angle(vec2 vertex, float angle_radian) {\r
  float cos_angle = cos(angle_radian);\r
  float sin_angle = sin(angle_radian);\r
  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);\r
  return rotationMatrix * vertex;\r
}\r
\r
vec3 interpolate(in vec3 point1, in vec3 point2, in float timestepFraction) {\r
    if (timestepFraction <= 0.0) {\r
        return point1;\r
    } else if (timestepFraction >= 1.0 ) {\r
        return point2;\r
    } else {\r
        vec3 direction = point2 - point1;\r
        return point1 + (direction * timestepFraction);\r
    }\r
}\r
\r
void main(void) {\r
\r
  // Calculate progress:\r
  // Skip everything else if this vertex is outside the time window\r
  if (currentTime < instanceTimestamps) {\r
    vPercentComplete = -1.0;\r
    return;\r
  } else if (currentTime > instanceTimestampsNext) {\r
    vPercentComplete = -1.0;\r
    return;\r
  } else {\r
    vPercentComplete = (currentTime - instanceTimestamps) /\r
                       (instanceTimestampsNext - instanceTimestamps);\r
  }\r
\r
  geometry.pickingColor = instancePickingColors;\r
\r
  vec3 startPosition = vec3(instanceStartPositions, 5.0);\r
  vec3 endPosition = vec3(instanceEndPositions, 5.0);\r
\r
  // are we stationary/still\r
  bool still = (instanceStartPositions == instanceEndPositions);\r
\r
  // geometry.uv = positions;\r
  // uv = positions;\r
\r
  // this could be the problem right here;\r
  vec2 iconSize = still ? iconStillFrames.zw : instanceIconFrames.zw;\r
  // convert size in meters to pixels, then scaled and clamp\r
  // project meters to pixels and clamp to limits\r
  float sizePixels = clamp(\r
    project_size_to_pixel(instanceSizes * sizeScale),\r
    sizeMinPixels, sizeMaxPixels\r
  );\r
\r
  // scale icon height to match instanceSize\r
  float instanceScale = iconSize.y == 0.0 ? 0.0 : sizePixels / iconSize.y;\r
\r
  // // figure out angle based on motion direction\r
  float angle = 0.0;\r
  if (!still) {\r
    vec3 direction = normalize(endPosition - startPosition);\r
    angle = atan( direction.y / direction.x);\r
    if (direction.x < 0.0) angle = angle - PI;\r
  }\r
\r
  // scale and rotate vertex in "pixel" value and convert back to fraction in clipspace\r
  vec2 pixelOffset = positions / 2.0 * iconSize + (still ? iconStillOffsets : instanceOffsets);\r
  pixelOffset = rotate_by_angle(pixelOffset, angle) * instanceScale;\r
  pixelOffset += instancePixelOffset;\r
  pixelOffset.y *= -1.0;\r
\r
  vec3 newPosition = interpolate(startPosition, endPosition, vPercentComplete);\r
\r
  if (billboard)  {\r
    gl_Position = project_position_to_clipspace(newPosition, vec3(0.0), vec3(0.0), geometry.position);\r
    vec3 offset = vec3(pixelOffset, 0.0);\r
    DECKGL_FILTER_SIZE(offset, geometry);\r
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);\r
\r
  } else {\r
    vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);\r
    DECKGL_FILTER_SIZE(offset_common, geometry);\r
    gl_Position = project_position_to_clipspace(newPosition, vec3(0.0), offset_common, geometry.position);\r
  }\r
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);\r
\r
  vec2 upperleft = (still ? iconStillFrames.xy : instanceIconFrames.xy);\r
\r
  vTextureCoords = mix(\r
    upperleft,\r
    upperleft + iconSize,\r
    (positions.xy + 1.0) / 2.0\r
  ) / iconsTextureDim;\r
\r
  vColor = instanceColors;\r
  DECKGL_FILTER_COLOR(vColor, geometry);\r
\r
  vColorMode = instanceColorModes;\r
}\r
`,H=`// BC 2021-04-30: this file forked from https://github.com/visgl/deck.gl\r
//\r
// Copyright (c) 2015 - 2017 Uber Technologies, Inc.\r
//\r
// Permission is hereby granted, free of charge, to any person obtaining a copy\r
// of this software and associated documentation files (the "Software"), to deal\r
// in the Software without restriction, including without limitation the rights\r
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r
// copies of the Software, and to permit persons to whom the Software is\r
// furnished to do so, subject to the following conditions:\r
//\r
// The above copyright notice and this permission notice shall be included in\r
// all copies or substantial portions of the Software.\r
//\r
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r
// THE SOFTWARE.\r
\r
#define SHADER_NAME icon-layer-fragment-shader\r
\r
precision highp float;\r
\r
uniform float opacity;\r
uniform sampler2D iconsTexture;\r
uniform float alphaCutoff;\r
\r
varying float vColorMode;\r
varying vec4 vColor;\r
varying vec2 vTextureCoords;\r
varying vec2 uv;\r
\r
uniform float currentTime;\r
varying float vPercentComplete;\r
\r
void main(void) {\r
\r
  if (vPercentComplete == -1.0) discard;\r
\r
  geometry.uv = uv;\r
\r
  vec4 texColor = texture2D(iconsTexture, vTextureCoords);\r
\r
  // if colorMode == 0, use pixel color from the texture\r
  // if colorMode == 1 or rendering picking buffer, use texture as transparency mask\r
  vec3 color = mix(texColor.rgb, vColor.rgb, vColorMode);\r
  // Take the global opacity and the alpha from vColor into account for the alpha component\r
  float a = texColor.a * opacity * vColor.a;\r
\r
  if (a < alphaCutoff) {\r
    discard;\r
  }\r
\r
  gl_FragColor = vec4(color, a);\r
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);\r
}\r
`;const R=1024,x=4,d=()=>{},S={[l.TEXTURE_MIN_FILTER]:l.LINEAR_MIPMAP_LINEAR,[l.TEXTURE_MAG_FILTER]:l.LINEAR,[l.TEXTURE_WRAP_S]:l.CLAMP_TO_EDGE,[l.TEXTURE_WRAP_T]:l.CLAMP_TO_EDGE};function A(i){return Math.pow(2,Math.ceil(Math.log2(i)))}function C(i,n,t,e){return t===n.width&&e===n.height?n:(i.canvas.height=e,i.canvas.width=t,i.clearRect(0,0,i.canvas.width,i.canvas.height),i.drawImage(n,0,0,n.width,n.height,0,0,t,e),i.canvas)}function f(i){return i&&(i.id||i.url)}function N(i,n,t,e){const r=n.width,o=n.height,s=E(n,{width:t,height:e});return I(n,s,{targetY:0,width:r,height:o}),n.delete(),s}function g(i,n,t){for(let e=0;e<n.length;e++){const{icon:r,xOffset:o}=n[e],s=f(r);i[s]={...r,x:o,y:t}}}function P({icons:i,buffer:n,mapping:t={},xOffset:e=0,yOffset:r=0,rowHeight:o=0,canvasWidth:s}){let a=[];for(let c=0;c<i.length;c++){const h=i[c],u=f(h);if(!t[u]){const{height:T,width:p}=h;e+p+n>s&&(g(t,a,r),e=0,r=o+r+n,o=0,a=[]),a.push({icon:h,xOffset:e}),e=e+p+n,o=Math.max(o,T)}}return a.length>0&&g(t,a,r),{mapping:t,rowHeight:o,xOffset:e,yOffset:r,canvasWidth:s,canvasHeight:A(o+r+n)}}function b(i,n,t){if(!i||!n)return null;t=t||{};const e={},{iterable:r,objectInfo:o}=O(i);for(const s of r){o.index++;const a=n(s,o),c=f(a);if(!a)throw new Error("Icon is missing.");if(!a.url)throw new Error("Icon url is missing.");!e[c]&&(!t[c]||a.url!==t[c].url)&&(e[c]={...a,source:s,sourceIndex:o.index})}return e}class w{constructor(n,{onUpdate:t=d,onError:e=d}){this.gl=n,this.onUpdate=t,this.onError=e,this._loadOptions=null,this._getIcon=null,this._texture=null,this._externalTexture=null,this._mapping={},this._pendingCount=0,this._autoPacking=!1,this._xOffset=0,this._yOffset=0,this._rowHeight=0,this._buffer=x,this._canvasWidth=R,this._canvasHeight=0,this._canvas=null}finalize(){var n;(n=this._texture)==null||n.delete()}getTexture(){return this._texture||this._externalTexture}getIconMapping(n){const t=this._autoPacking?f(n):n;return this._mapping[t]||{}}setProps({loadOptions:n,autoPacking:t,iconAtlas:e,iconMapping:r,data:o,getIcon:s}){n&&(this._loadOptions=n),t!==void 0&&(this._autoPacking=t),s&&(this._getIcon=s),r&&(this._mapping=r),e&&this._updateIconAtlas(e),this._autoPacking&&(o||s)&&typeof document!="undefined"&&(this._canvas=this._canvas||document.createElement("canvas"),this._updateAutoPacking(o))}get isLoaded(){return this._pendingCount===0}_updateIconAtlas(n){var t;(t=this._texture)==null||t.delete(),this._texture=null,this._externalTexture=n,this.onUpdate()}_updateAutoPacking(n){const t=Object.values(b(n,this._getIcon,this._mapping)||{});if(t.length>0){const{mapping:e,xOffset:r,yOffset:o,rowHeight:s,canvasHeight:a}=P({icons:t,buffer:this._buffer,canvasWidth:this._canvasWidth,mapping:this._mapping,rowHeight:this._rowHeight,xOffset:this._xOffset,yOffset:this._yOffset});this._rowHeight=s,this._mapping=e,this._xOffset=r,this._yOffset=o,this._canvasHeight=a,this._texture||(this._texture=new _(this.gl,{width:this._canvasWidth,height:this._canvasHeight,parameters:S})),this._texture.height!==this._canvasHeight&&(this._texture=N(this.gl,this._texture,this._canvasWidth,this._canvasHeight)),this.onUpdate(),this._loadIcons(t)}}_loadIcons(n){const t=this._canvas.getContext("2d");for(const e of n)this._pendingCount++,m(e.url,v,this._loadOptions).then(r=>{const o=f(e),{x:s,y:a,width:c,height:h}=this._mapping[o],u=C(t,r,c,h);this._texture.setSubImageData({data:u,x:s,y:a,width:c,height:h}),this._texture.generateMipmap(),this.onUpdate()}).catch(r=>{this.onError({url:e.url,source:e.source,sourceIndex:e.sourceIndex,loadOptions:this._loadOptions,error:r})}).finally(()=>{this._pendingCount--})}}export{w as I,H as f,F as v};
//# sourceMappingURL=icon-manager.44d6d2bd.js.map

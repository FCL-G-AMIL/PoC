import{a as k,a4 as _e,a5 as ye,a6 as xe,_ as h,T as ae,R as Ce,X as Pe,Y as re,b as D,c as N,U as R,M as H,G,l as O}from"./layer.0cd20467.js";const be="compositeLayer.renderLayers";class le extends k{get isComposite(){return!0}get isLoaded(){return super.isLoaded&&this.getSubLayers().every(e=>e.isLoaded)}getSubLayers(){return this.internalState&&this.internalState.subLayers||[]}initializeState(e){}setState(e){super.setState(e),this.setNeedsUpdate()}getPickingInfo({info:e}){const{object:t}=e;return t&&t.__source&&t.__source.parent&&t.__source.parent.id===this.id&&(e.object=t.__source.object,e.index=t.__source.index),e}filterSubLayer(e){return!0}shouldRenderSubLayer(e,t){return t&&t.length}getSubLayerClass(e,t){const{_subLayerProps:n}=this.props;return n&&n[e]&&n[e].type||t}getSubLayerRow(e,t,n){return e.__source={parent:this,object:t,index:n},e}getSubLayerAccessor(e){if(typeof e=="function"){const t={index:-1,data:this.props.data,target:[]};return(n,i)=>n&&n.__source?(t.index=n.__source.index,e(n.__source.object,t)):e(n,i)}return e}getSubLayerProps(e={}){var t;const{opacity:n,pickable:i,visible:s,parameters:o,getPolygonOffset:r,highlightedObjectIndex:a,autoHighlight:c,highlightColor:g,coordinateSystem:u,coordinateOrigin:d,wrapLongitude:f,positionFormat:p,modelMatrix:x,extensions:v,fetch:m,operation:S,_subLayerProps:C}=this.props,y={id:"",updateTriggers:{},opacity:n,pickable:i,visible:s,parameters:o,getPolygonOffset:r,highlightedObjectIndex:a,autoHighlight:c,highlightColor:g,coordinateSystem:u,coordinateOrigin:d,wrapLongitude:f,positionFormat:p,modelMatrix:x,extensions:v,fetch:m,operation:S},_=C&&e.id&&C[e.id],L=_&&_.updateTriggers,A=e.id||"sublayer";if(_){const T=this.props[_e],b=e.type?e.type._propTypes:{};for(const I in _){const E=b[I]||T[I];E&&E.type==="accessor"&&(_[I]=this.getSubLayerAccessor(_[I]))}}Object.assign(y,e,_),y.id="".concat(this.props.id,"-").concat(A),y.updateTriggers={all:(t=this.props.updateTriggers)===null||t===void 0?void 0:t.all,...e.updateTriggers,...L};for(const T of v){const b=T.getSubLayerProps.call(this,T);b&&Object.assign(y,b,{updateTriggers:Object.assign(y.updateTriggers,b.updateTriggers)})}return y}_updateAutoHighlight(e){for(const t of this.getSubLayers())t.updateAutoHighlight(e)}_getAttributeManager(){return null}_postUpdate(e,t){let n=this.internalState.subLayers;const i=!n||this.needsUpdate();if(i){const s=this.renderLayers();n=ye(s,Boolean),this.internalState.subLayers=n}xe(be,this,i,n);for(const s of n)s.parent=this}}h(le,"layerName","CompositeLayer");var Le=`#define SHADER_NAME icon-layer-vertex-shader

attribute vec2 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceSizes;
attribute float instanceAngles;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;
attribute vec4 instanceIconFrames;
attribute float instanceColorModes;
attribute vec2 instanceOffsets;
attribute vec2 instancePixelOffset;

uniform float sizeScale;
uniform vec2 iconsTextureDim;
uniform float sizeMinPixels;
uniform float sizeMaxPixels;
uniform bool billboard;
uniform int sizeUnits;

varying float vColorMode;
varying vec4 vColor;
varying vec2 vTextureCoords;
varying vec2 uv;

vec2 rotate_by_angle(vec2 vertex, float angle) {
  float angle_radian = angle * PI / 180.0;
  float cos_angle = cos(angle_radian);
  float sin_angle = sin(angle_radian);
  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
  return rotationMatrix * vertex;
}

void main(void) {
  geometry.worldPosition = instancePositions;
  geometry.uv = positions;
  geometry.pickingColor = instancePickingColors;
  uv = positions;

  vec2 iconSize = instanceIconFrames.zw;
  float sizePixels = clamp(
    project_size_to_pixel(instanceSizes * sizeScale, sizeUnits), 
    sizeMinPixels, sizeMaxPixels
  );
  float instanceScale = iconSize.y == 0.0 ? 0.0 : sizePixels / iconSize.y;
  vec2 pixelOffset = positions / 2.0 * iconSize + instanceOffsets;
  pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * instanceScale;
  pixelOffset += instancePixelOffset;
  pixelOffset.y *= -1.0;

  if (billboard)  {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
    vec3 offset = vec3(pixelOffset, 0.0);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);

  } else {
    vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
    DECKGL_FILTER_SIZE(offset_common, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position); 
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }

  vTextureCoords = mix(
    instanceIconFrames.xy,
    instanceIconFrames.xy + iconSize,
    (positions.xy + 1.0) / 2.0
  ) / iconsTextureDim;

  vColor = instanceColors;
  DECKGL_FILTER_COLOR(vColor, geometry);

  vColorMode = instanceColorModes;
}
`,Se=`#define SHADER_NAME icon-layer-fragment-shader

precision highp float;

uniform float opacity;
uniform sampler2D iconsTexture;
uniform float alphaCutoff;

varying float vColorMode;
varying vec4 vColor;
varying vec2 vTextureCoords;
varying vec2 uv;

void main(void) {
  geometry.uv = uv;

  vec4 texColor = texture2D(iconsTexture, vTextureCoords);
  vec3 color = mix(texColor.rgb, vColor.rgb, vColorMode);
  float a = texColor.a * opacity * vColor.a;

  if (a < alphaCutoff) {
    discard;
  }

  gl_FragColor = vec4(color, a);
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;const Te=1024,Me=4,Y=()=>{},X={[10241]:9987,[10240]:9729,[10242]:33071,[10243]:33071};function Ae(l){return Math.pow(2,Math.ceil(Math.log2(l)))}function Ie(l,e,t,n){const i=Math.min(t/e.width,n/e.height),s=Math.floor(e.width*i),o=Math.floor(e.height*i);return i===1?{data:e,width:s,height:o}:(l.canvas.height=o,l.canvas.width=s,l.clearRect(0,0,s,o),l.drawImage(e,0,0,e.width,e.height,0,0,s,o),{data:l.canvas,width:s,height:o})}function F(l){return l&&(l.id||l.url)}function ze(l,e,t,n){const i=l.width,s=l.height,o=new ae(l.gl,{width:e,height:t,parameters:n});return Pe(l,o,{targetY:0,width:i,height:s}),l.delete(),o}function q(l,e,t){for(let n=0;n<e.length;n++){const{icon:i,xOffset:s}=e[n],o=F(i);l[o]={...i,x:s,y:t}}}function Ee({icons:l,buffer:e,mapping:t={},xOffset:n=0,yOffset:i=0,rowHeight:s=0,canvasWidth:o}){let r=[];for(let a=0;a<l.length;a++){const c=l[a],g=F(c);if(!t[g]){const{height:u,width:d}=c;n+d+e>o&&(q(t,r,i),n=0,i=s+i+e,s=0,r=[]),r.push({icon:c,xOffset:n}),n=n+d+e,s=Math.max(s,u)}}return r.length>0&&q(t,r,i),{mapping:t,rowHeight:s,xOffset:n,yOffset:i,canvasWidth:o,canvasHeight:Ae(s+i+e)}}function we(l,e,t){if(!l||!e)return null;t=t||{};const n={},{iterable:i,objectInfo:s}=re(l);for(const o of i){s.index++;const r=e(o,s),a=F(r);if(!r)throw new Error("Icon is missing.");if(!r.url)throw new Error("Icon url is missing.");!n[a]&&(!t[a]||r.url!==t[a].url)&&(n[a]={...r,source:o,sourceIndex:s.index})}return n}class Fe{constructor(e,{onUpdate:t=Y,onError:n=Y}){h(this,"gl",void 0),h(this,"onUpdate",void 0),h(this,"onError",void 0),h(this,"_loadOptions",null),h(this,"_texture",null),h(this,"_externalTexture",null),h(this,"_mapping",{}),h(this,"_textureParameters",null),h(this,"_pendingCount",0),h(this,"_autoPacking",!1),h(this,"_xOffset",0),h(this,"_yOffset",0),h(this,"_rowHeight",0),h(this,"_buffer",Me),h(this,"_canvasWidth",Te),h(this,"_canvasHeight",0),h(this,"_canvas",null),this.gl=e,this.onUpdate=t,this.onError=n}finalize(){var e;(e=this._texture)===null||e===void 0||e.delete()}getTexture(){return this._texture||this._externalTexture}getIconMapping(e){const t=this._autoPacking?F(e):e;return this._mapping[t]||{}}setProps({loadOptions:e,autoPacking:t,iconAtlas:n,iconMapping:i,textureParameters:s}){if(e&&(this._loadOptions=e),t!==void 0&&(this._autoPacking=t),i&&(this._mapping=i),n){var o;(o=this._texture)===null||o===void 0||o.delete(),this._texture=null,this._externalTexture=n}s&&(this._textureParameters=s)}get isLoaded(){return this._pendingCount===0}packIcons(e,t){if(!this._autoPacking||typeof document=="undefined")return;const n=Object.values(we(e,t,this._mapping)||{});if(n.length>0){const{mapping:i,xOffset:s,yOffset:o,rowHeight:r,canvasHeight:a}=Ee({icons:n,buffer:this._buffer,canvasWidth:this._canvasWidth,mapping:this._mapping,rowHeight:this._rowHeight,xOffset:this._xOffset,yOffset:this._yOffset});this._rowHeight=r,this._mapping=i,this._xOffset=s,this._yOffset=o,this._canvasHeight=a,this._texture||(this._texture=new ae(this.gl,{width:this._canvasWidth,height:this._canvasHeight,parameters:this._textureParameters||X})),this._texture.height!==this._canvasHeight&&(this._texture=ze(this._texture,this._canvasWidth,this._canvasHeight,this._textureParameters||X)),this.onUpdate(),this._canvas=this._canvas||document.createElement("canvas"),this._loadIcons(n)}}_loadIcons(e){const t=this._canvas.getContext("2d",{willReadFrequently:!0});for(const n of e)this._pendingCount++,Ce(n.url,this._loadOptions).then(i=>{const s=F(n),o=this._mapping[s],{x:r,y:a,width:c,height:g}=o,{data:u,width:d,height:f}=Ie(t,i,c,g);this._texture.setSubImageData({data:u,x:r+(c-d)/2,y:a+(g-f)/2,width:d,height:f}),o.width=d,o.height=f,this._texture.generateMipmap(),this.onUpdate()}).catch(i=>{this.onError({url:n.url,source:n.source,sourceIndex:n.sourceIndex,loadOptions:this._loadOptions,error:i})}).finally(()=>{this._pendingCount--})}}const ce=[0,0,0,255],Oe={iconAtlas:{type:"image",value:null,async:!0},iconMapping:{type:"object",value:{},async:!0},sizeScale:{type:"number",value:1,min:0},billboard:!0,sizeUnits:"pixels",sizeMinPixels:{type:"number",min:0,value:0},sizeMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},alphaCutoff:{type:"number",value:.05,min:0,max:1},getPosition:{type:"accessor",value:l=>l.position},getIcon:{type:"accessor",value:l=>l.icon},getColor:{type:"accessor",value:ce},getSize:{type:"accessor",value:1},getAngle:{type:"accessor",value:0},getPixelOffset:{type:"accessor",value:[0,0]},onIconError:{type:"function",value:null,optional:!0},textureParameters:{type:"object",ignore:!0}};class j extends k{constructor(...e){super(...e),h(this,"state",void 0)}getShaders(){return super.getShaders({vs:Le,fs:Se,modules:[D,N]})}initializeState(){this.state={iconManager:new Fe(this.context.gl,{onUpdate:this._onUpdate.bind(this),onError:this._onError.bind(this)})},this.getAttributeManager().addInstanced({instancePositions:{size:3,type:5130,fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceSizes:{size:1,transition:!0,accessor:"getSize",defaultValue:1},instanceOffsets:{size:2,accessor:"getIcon",transform:this.getInstanceOffset},instanceIconFrames:{size:4,accessor:"getIcon",transform:this.getInstanceIconFrame},instanceColorModes:{size:1,type:5121,accessor:"getIcon",transform:this.getInstanceColorMode},instanceColors:{size:this.props.colorFormat.length,type:5121,normalized:!0,transition:!0,accessor:"getColor",defaultValue:ce},instanceAngles:{size:1,transition:!0,accessor:"getAngle"},instancePixelOffset:{size:2,transition:!0,accessor:"getPixelOffset"}})}updateState(e){super.updateState(e);const{props:t,oldProps:n,changeFlags:i}=e,s=this.getAttributeManager(),{iconAtlas:o,iconMapping:r,data:a,getIcon:c,textureParameters:g}=t,{iconManager:u}=this.state,d=o||this.internalState.isAsyncPropLoading("iconAtlas");if(u.setProps({loadOptions:t.loadOptions,autoPacking:!d,iconAtlas:o,iconMapping:d?r:null,textureParameters:g}),d?n.iconMapping!==t.iconMapping&&s.invalidate("getIcon"):(i.dataChanged||i.updateTriggersChanged&&(i.updateTriggersChanged.all||i.updateTriggersChanged.getIcon))&&u.packIcons(a,c),i.extensionsChanged){var f;const{gl:p}=this.context;(f=this.state.model)===null||f===void 0||f.delete(),this.state.model=this._getModel(p),s.invalidateAll()}}get isLoaded(){return super.isLoaded&&this.state.iconManager.isLoaded}finalizeState(e){super.finalizeState(e),this.state.iconManager.finalize()}draw({uniforms:e}){const{sizeScale:t,sizeMinPixels:n,sizeMaxPixels:i,sizeUnits:s,billboard:o,alphaCutoff:r}=this.props,{iconManager:a}=this.state,c=a.getTexture();c&&this.state.model.setUniforms(e).setUniforms({iconsTexture:c,iconsTextureDim:[c.width,c.height],sizeUnits:R[s],sizeScale:t,sizeMinPixels:n,sizeMaxPixels:i,billboard:o,alphaCutoff:r}).draw()}_getModel(e){const t=[-1,-1,-1,1,1,1,1,-1];return new H(e,{...this.getShaders(),id:this.props.id,geometry:new G({drawMode:6,attributes:{positions:{size:2,value:new Float32Array(t)}}}),isInstanced:!0})}_onUpdate(){this.setNeedsRedraw()}_onError(e){var t;const n=(t=this.getCurrentLayer())===null||t===void 0?void 0:t.props.onIconError;n?n(e):O.error(e.error.message)()}getInstanceOffset(e){const{width:t,height:n,anchorX:i=t/2,anchorY:s=n/2}=this.state.iconManager.getIconMapping(e);return[t/2-i,n/2-s]}getInstanceColorMode(e){return this.state.iconManager.getIconMapping(e).mask?1:0}getInstanceIconFrame(e){const{x:t,y:n,width:i,height:s}=this.state.iconManager.getIconMapping(e);return[t,n,i,s]}}h(j,"defaultProps",Oe);h(j,"layerName","IconLayer");var Re=`#define SHADER_NAME scatterplot-layer-vertex-shader

attribute vec3 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceRadius;
attribute float instanceLineWidths;
attribute vec4 instanceFillColors;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform float lineWidthScale;
uniform float lineWidthMinPixels;
uniform float lineWidthMaxPixels;
uniform float stroked;
uniform bool filled;
uniform bool antialiasing;
uniform bool billboard;
uniform int radiusUnits;
uniform int lineWidthUnits;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float outerRadiusPixels;


void main(void) {
  geometry.worldPosition = instancePositions;
  outerRadiusPixels = clamp(
    project_size_to_pixel(radiusScale * instanceRadius, radiusUnits),
    radiusMinPixels, radiusMaxPixels
  );
  float lineWidthPixels = clamp(
    project_size_to_pixel(lineWidthScale * instanceLineWidths, lineWidthUnits),
    lineWidthMinPixels, lineWidthMaxPixels
  );
  outerRadiusPixels += stroked * lineWidthPixels / 2.0;
  float edgePadding = antialiasing ? (outerRadiusPixels + SMOOTH_EDGE_RADIUS) / outerRadiusPixels : 1.0;
  unitPosition = edgePadding * positions.xy;
  geometry.uv = unitPosition;
  geometry.pickingColor = instancePickingColors;

  innerUnitRadius = 1.0 - stroked * lineWidthPixels / outerRadiusPixels;
  
  if (billboard) {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
    vec3 offset = edgePadding * positions * outerRadiusPixels;
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
  } else {
    vec3 offset = edgePadding * positions * project_pixel_size(outerRadiusPixels);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset, geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }
  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);
  DECKGL_FILTER_COLOR(vFillColor, geometry);
  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);
  DECKGL_FILTER_COLOR(vLineColor, geometry);
}
`,We=`#define SHADER_NAME scatterplot-layer-fragment-shader

precision highp float;

uniform bool filled;
uniform float stroked;
uniform bool antialiasing;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float outerRadiusPixels;

void main(void) {
  geometry.uv = unitPosition;

  float distToCenter = length(unitPosition) * outerRadiusPixels;
  float inCircle = antialiasing ? 
    smoothedge(distToCenter, outerRadiusPixels) : 
    step(distToCenter, outerRadiusPixels);

  if (inCircle == 0.0) {
    discard;
  }

  if (stroked > 0.5) {
    float isLine = antialiasing ? 
      smoothedge(innerUnitRadius * outerRadiusPixels, distToCenter) :
      step(innerUnitRadius * outerRadiusPixels, distToCenter);

    if (filled) {
      gl_FragColor = mix(vFillColor, vLineColor, isLine);
    } else {
      if (isLine == 0.0) {
        discard;
      }
      gl_FragColor = vec4(vLineColor.rgb, vLineColor.a * isLine);
    }
  } else if (filled) {
    gl_FragColor = vFillColor;
  } else {
    discard;
  }

  gl_FragColor.a *= inCircle;
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;const Z=[0,0,0,255],ke={radiusUnits:"meters",radiusScale:{type:"number",min:0,value:1},radiusMinPixels:{type:"number",min:0,value:0},radiusMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},lineWidthUnits:"meters",lineWidthScale:{type:"number",min:0,value:1},lineWidthMinPixels:{type:"number",min:0,value:0},lineWidthMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},stroked:!1,filled:!0,billboard:!1,antialiasing:!0,getPosition:{type:"accessor",value:l=>l.position},getRadius:{type:"accessor",value:1},getFillColor:{type:"accessor",value:Z},getLineColor:{type:"accessor",value:Z},getLineWidth:{type:"accessor",value:1},strokeWidth:{deprecatedFor:"getLineWidth"},outline:{deprecatedFor:"stroked"},getColor:{deprecatedFor:["getFillColor","getLineColor"]}};class ge extends k{getShaders(){return super.getShaders({vs:Re,fs:We,modules:[D,N]})}initializeState(){this.getAttributeManager().addInstanced({instancePositions:{size:3,type:5130,fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceRadius:{size:1,transition:!0,accessor:"getRadius",defaultValue:1},instanceFillColors:{size:this.props.colorFormat.length,transition:!0,normalized:!0,type:5121,accessor:"getFillColor",defaultValue:[0,0,0,255]},instanceLineColors:{size:this.props.colorFormat.length,transition:!0,normalized:!0,type:5121,accessor:"getLineColor",defaultValue:[0,0,0,255]},instanceLineWidths:{size:1,transition:!0,accessor:"getLineWidth",defaultValue:1}})}updateState(e){if(super.updateState(e),e.changeFlags.extensionsChanged){var t;const{gl:n}=this.context;(t=this.state.model)===null||t===void 0||t.delete(),this.state.model=this._getModel(n),this.getAttributeManager().invalidateAll()}}draw({uniforms:e}){const{radiusUnits:t,radiusScale:n,radiusMinPixels:i,radiusMaxPixels:s,stroked:o,filled:r,billboard:a,antialiasing:c,lineWidthUnits:g,lineWidthScale:u,lineWidthMinPixels:d,lineWidthMaxPixels:f}=this.props;this.state.model.setUniforms(e).setUniforms({stroked:o?1:0,filled:r,billboard:a,antialiasing:c,radiusUnits:R[t],radiusScale:n,radiusMinPixels:i,radiusMaxPixels:s,lineWidthUnits:R[g],lineWidthScale:u,lineWidthMinPixels:d,lineWidthMaxPixels:f}).draw()}_getModel(e){const t=[-1,-1,0,1,-1,0,1,1,0,-1,1,0];return new H(e,{...this.getShaders(),id:this.props.id,geometry:new G({drawMode:6,vertexCount:4,attributes:{positions:{size:3,value:new Float32Array(t)}}}),isInstanced:!0})}}h(ge,"defaultProps",ke);h(ge,"layerName","ScatterplotLayer");var Be=`#define SHADER_NAME multi-icon-layer-fragment-shader

precision highp float;

uniform float opacity;
uniform sampler2D iconsTexture;
uniform float gamma;
uniform bool sdf;
uniform float alphaCutoff;
uniform float sdfBuffer;
uniform float outlineBuffer;
uniform vec4 outlineColor;

varying vec4 vColor;
varying vec2 vTextureCoords;
varying vec2 uv;

void main(void) {
  geometry.uv = uv;

  if (!picking_uActive) {
    float alpha = texture2D(iconsTexture, vTextureCoords).a;
    vec4 color = vColor;
    if (sdf) {
      float distance = alpha;
      alpha = smoothstep(sdfBuffer - gamma, sdfBuffer + gamma, distance);

      if (outlineBuffer > 0.0) {
        float inFill = alpha;
        float inBorder = smoothstep(outlineBuffer - gamma, outlineBuffer + gamma, distance);
        color = mix(outlineColor, vColor, inFill);
        alpha = inBorder;
      }
    }
    float a = alpha * color.a;
    
    if (a < alphaCutoff) {
      discard;
    }

    gl_FragColor = vec4(color.rgb, a * opacity);
  }

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;const B=192/256,$=[],Ue={getIconOffsets:{type:"accessor",value:l=>l.offsets},alphaCutoff:.001,smoothing:.1,outlineWidth:0,outlineColor:{type:"color",value:[0,0,0,255]}};class K extends j{constructor(...e){super(...e),h(this,"state",void 0)}getShaders(){return{...super.getShaders(),fs:Be}}initializeState(){super.initializeState(),this.getAttributeManager().addInstanced({instanceOffsets:{size:2,accessor:"getIconOffsets"},instancePickingColors:{type:5121,size:3,accessor:(t,{index:n,target:i})=>this.encodePickingColor(n,i)}})}updateState(e){super.updateState(e);const{props:t,oldProps:n}=e;let{outlineColor:i}=t;i!==n.outlineColor&&(i=i.map(s=>s/255),i[3]=Number.isFinite(i[3])?i[3]:1,this.setState({outlineColor:i})),!t.sdf&&t.outlineWidth&&O.warn("".concat(this.id,": fontSettings.sdf is required to render outline"))()}draw(e){const{sdf:t,smoothing:n,outlineWidth:i}=this.props,{outlineColor:s}=this.state,o=i?Math.max(n,B*(1-i)):-1;if(e.uniforms={...e.uniforms,sdfBuffer:B,outlineBuffer:o,gamma:n,sdf:Boolean(t),outlineColor:s},super.draw(e),t&&i){const{iconManager:r}=this.state;r.getTexture()&&this.state.model.draw({uniforms:{outlineBuffer:B}})}}getInstanceOffset(e){return e?Array.from(e).flatMap(t=>super.getInstanceOffset(t)):$}getInstanceColorMode(e){return 1}getInstanceIconFrame(e){return e?Array.from(e).flatMap(t=>super.getInstanceIconFrame(t)):$}}h(K,"defaultProps",Ue);h(K,"layerName","MultiIconLayer");const w=1e20;class De{constructor({fontSize:e=24,buffer:t=3,radius:n=8,cutoff:i=.25,fontFamily:s="sans-serif",fontWeight:o="normal",fontStyle:r="normal"}={}){this.buffer=t,this.cutoff=i,this.radius=n;const a=this.size=e+t*4,c=this._createCanvas(a),g=this.ctx=c.getContext("2d",{willReadFrequently:!0});g.font=`${r} ${o} ${e}px ${s}`,g.textBaseline="alphabetic",g.textAlign="left",g.fillStyle="black",this.gridOuter=new Float64Array(a*a),this.gridInner=new Float64Array(a*a),this.f=new Float64Array(a),this.z=new Float64Array(a+1),this.v=new Uint16Array(a)}_createCanvas(e){const t=document.createElement("canvas");return t.width=t.height=e,t}draw(e){const{width:t,actualBoundingBoxAscent:n,actualBoundingBoxDescent:i,actualBoundingBoxLeft:s,actualBoundingBoxRight:o}=this.ctx.measureText(e),r=Math.ceil(n),a=0,c=Math.max(0,Math.min(this.size-this.buffer,Math.ceil(o-s))),g=Math.min(this.size-this.buffer,r+Math.ceil(i)),u=c+2*this.buffer,d=g+2*this.buffer,f=Math.max(u*d,0),p=new Uint8ClampedArray(f),x={data:p,width:u,height:d,glyphWidth:c,glyphHeight:g,glyphTop:r,glyphLeft:a,glyphAdvance:t};if(c===0||g===0)return x;const{ctx:v,buffer:m,gridInner:S,gridOuter:C}=this;v.clearRect(m,m,c,g),v.fillText(e,m,m+r);const y=v.getImageData(m,m,c,g);C.fill(w,0,f),S.fill(0,0,f);for(let _=0;_<g;_++)for(let L=0;L<c;L++){const A=y.data[4*(_*c+L)+3]/255;if(A===0)continue;const T=(_+m)*u+L+m;if(A===1)C[T]=0,S[T]=w;else{const b=.5-A;C[T]=b>0?b*b:0,S[T]=b<0?b*b:0}}J(C,0,0,u,d,u,this.f,this.v,this.z),J(S,m,m,c,g,u,this.f,this.v,this.z);for(let _=0;_<f;_++){const L=Math.sqrt(C[_])-Math.sqrt(S[_]);p[_]=Math.round(255-255*(L/this.radius+this.cutoff))}return x}}function J(l,e,t,n,i,s,o,r,a){for(let c=e;c<e+n;c++)Q(l,t*s+c,s,i,o,r,a);for(let c=t;c<t+i;c++)Q(l,c*s+e,1,n,o,r,a)}function Q(l,e,t,n,i,s,o){s[0]=0,o[0]=-w,o[1]=w,i[0]=l[e];for(let r=1,a=0,c=0;r<n;r++){i[r]=l[e+r*t];const g=r*r;do{const u=s[a];c=(i[r]-i[u]+g-u*u)/(r-u)/2}while(c<=o[a]&&--a>-1);a++,s[a]=r,o[a]=c,o[a+1]=w}for(let r=0,a=0;r<n;r++){for(;o[a+1]<r;)a++;const c=s[a],g=r-c;l[e+r*t]=i[c]+g*g}}const Ne=32,He=[];function Ge(l){return Math.pow(2,Math.ceil(Math.log2(l)))}function je({characterSet:l,getFontWidth:e,fontHeight:t,buffer:n,maxCanvasWidth:i,mapping:s={},xOffset:o=0,yOffset:r=0}){let a=0,c=o;const g=t+n*2;for(const u of l)if(!s[u]){const d=e(u);c+d+n*2>i&&(c=0,a++),s[u]={x:c+n,y:r+a*g+n,width:d,height:g,layoutWidth:d,layoutHeight:t},c+=d+n*2}return{mapping:s,xOffset:c,yOffset:r+a*g,canvasHeight:Ge(r+(a+1)*g)}}function ue(l,e,t,n){let i=0;for(let o=e;o<t;o++){var s;const r=l[o];i+=((s=n[r])===null||s===void 0?void 0:s.layoutWidth)||0}return i}function de(l,e,t,n,i,s){let o=e,r=0;for(let a=e;a<t;a++){const c=ue(l,a,a+1,i);r+c>n&&(o<a&&s.push(a),o=a,r=0),r+=c}return r}function Ke(l,e,t,n,i,s){let o=e,r=e,a=e,c=0;for(let g=e;g<t;g++)if((l[g]===" "||l[g+1]===" "||g+1===t)&&(a=g+1),a>r){let u=ue(l,r,a,i);c+u>n&&(o<r&&(s.push(r),o=r,c=0),u>n&&(u=de(l,r,a,n,i,s),o=s[s.length-1])),r=a,c+=u}return c}function Ve(l,e,t,n,i=0,s){s===void 0&&(s=l.length);const o=[];return e==="break-all"?de(l,i,s,t,n,o):Ke(l,i,s,t,n,o),o}function Ye(l,e,t,n,i,s){let o=0,r=0;for(let a=e;a<t;a++){const c=l[a],g=n[c];g?(r||(r=g.layoutHeight),i[a]=o+g.layoutWidth/2,o+=g.layoutWidth):(O.warn("Missing character: ".concat(c," (").concat(c.codePointAt(0),")"))(),i[a]=o,o+=Ne)}s[0]=o,s[1]=r}function Xe(l,e,t,n,i){const s=Array.from(l),o=s.length,r=new Array(o),a=new Array(o),c=new Array(o),g=(t==="break-word"||t==="break-all")&&isFinite(n)&&n>0,u=[0,0],d=[0,0];let f=0,p=0,x=0;for(let m=0;m<=o;m++){const S=s[m];if((S===`
`||m===o)&&(x=m),x>p){const C=g?Ve(s,t,n,i,p,x):He;for(let y=0;y<=C.length;y++){const _=y===0?p:C[y-1],L=y<C.length?C[y]:x;Ye(s,_,L,i,r,d);for(let A=_;A<L;A++){var v;const T=s[A],b=((v=i[T])===null||v===void 0?void 0:v.layoutOffsetY)||0;a[A]=f+d[1]/2+b,c[A]=d[0]}f=f+d[1]*e,u[0]=Math.max(u[0],d[0])}p=x}S===`
`&&(r[p]=0,a[p]=0,c[p]=0,p++)}return u[1]=f,{x:r,y:a,rowWidth:c,size:u}}function qe({value:l,length:e,stride:t,offset:n,startIndices:i,characterSet:s}){const o=l.BYTES_PER_ELEMENT,r=t?t/o:1,a=n?n/o:0,c=i[e]||Math.ceil((l.length-a)/r),g=s&&new Set,u=new Array(e);let d=l;if(r>1||a>0){const f=l.constructor;d=new f(c);for(let p=0;p<c;p++)d[p]=l[p*r+a]}for(let f=0;f<e;f++){const p=i[f],x=i[f+1]||c,v=d.subarray(p,x);u[f]=String.fromCodePoint.apply(null,v),g&&v.forEach(g.add,g)}if(g)for(const f of g)s.add(String.fromCodePoint(f));return{texts:u,characterCount:c}}class fe{constructor(e=5){h(this,"limit",void 0),h(this,"_cache",{}),h(this,"_order",[]),this.limit=e}get(e){const t=this._cache[e];return t&&(this._deleteOrder(e),this._appendOrder(e)),t}set(e,t){this._cache[e]?(this.delete(e),this._cache[e]=t,this._appendOrder(e)):(Object.keys(this._cache).length===this.limit&&this.delete(this._order[0]),this._cache[e]=t,this._appendOrder(e))}delete(e){this._cache[e]&&(delete this._cache[e],this._deleteOrder(e))}_deleteOrder(e){const t=this._order.indexOf(e);t>=0&&this._order.splice(t,1)}_appendOrder(e){this._order.push(e)}}function Ze(){const l=[];for(let e=32;e<128;e++)l.push(String.fromCharCode(e));return l}const z={fontFamily:"Monaco, monospace",fontWeight:"normal",characterSet:Ze(),fontSize:64,buffer:4,sdf:!1,cutoff:.25,radius:12,smoothing:.1},ee=1024,te=.9,ne=1.2,he=3;let W=new fe(he);function $e(l,e){let t;typeof e=="string"?t=new Set(Array.from(e)):t=new Set(e);const n=W.get(l);if(!n)return t;for(const i in n.mapping)t.has(i)&&t.delete(i);return t}function Je(l,e){for(let t=0;t<l.length;t++)e.data[4*t+3]=l[t]}function ie(l,e,t,n){l.font="".concat(n," ").concat(t,"px ").concat(e),l.fillStyle="#000",l.textBaseline="alphabetic",l.textAlign="left"}function Qe(l){O.assert(Number.isFinite(l)&&l>=he,"Invalid cache limit"),W=new fe(l)}class et{constructor(){h(this,"props",{...z}),h(this,"_key",void 0),h(this,"_atlas",void 0)}get texture(){return this._atlas}get mapping(){return this._atlas&&this._atlas.mapping}get scale(){const{fontSize:e,buffer:t}=this.props;return(e*ne+t*2)/e}setProps(e={}){Object.assign(this.props,e),this._key=this._getKey();const t=$e(this._key,this.props.characterSet),n=W.get(this._key);if(n&&t.size===0){this._atlas!==n&&(this._atlas=n);return}const i=this._generateFontAtlas(t,n);this._atlas=i,W.set(this._key,i)}_generateFontAtlas(e,t){const{fontFamily:n,fontWeight:i,fontSize:s,buffer:o,sdf:r,radius:a,cutoff:c}=this.props;let g=t&&t.data;g||(g=document.createElement("canvas"),g.width=ee);const u=g.getContext("2d",{willReadFrequently:!0});ie(u,n,s,i);const{mapping:d,canvasHeight:f,xOffset:p,yOffset:x}=je({getFontWidth:v=>u.measureText(v).width,fontHeight:s*ne,buffer:o,characterSet:e,maxCanvasWidth:ee,...t&&{mapping:t.mapping,xOffset:t.xOffset,yOffset:t.yOffset}});if(g.height!==f){const v=u.getImageData(0,0,g.width,g.height);g.height=f,u.putImageData(v,0,0)}if(ie(u,n,s,i),r){const v=new De({fontSize:s,buffer:o,radius:a,cutoff:c,fontFamily:n,fontWeight:"".concat(i)});for(const m of e){const{data:S,width:C,height:y,glyphTop:_}=v.draw(m);d[m].width=C,d[m].layoutOffsetY=s*te-_;const L=u.createImageData(C,y);Je(S,L),u.putImageData(L,d[m].x,d[m].y)}}else for(const v of e)u.fillText(v,d[v].x,d[v].y+o+s*te);return{xOffset:p,yOffset:x,mapping:d,data:g,width:g.width,height:g.height}}_getKey(){const{fontFamily:e,fontWeight:t,fontSize:n,buffer:i,sdf:s,radius:o,cutoff:r}=this.props;return s?"".concat(e," ").concat(t," ").concat(n," ").concat(i," ").concat(o," ").concat(r):"".concat(e," ").concat(t," ").concat(n," ").concat(i)}}var tt=`#define SHADER_NAME text-background-layer-vertex-shader

attribute vec2 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute vec4 instanceRects;
attribute float instanceSizes;
attribute float instanceAngles;
attribute vec2 instancePixelOffsets;
attribute float instanceLineWidths;
attribute vec4 instanceFillColors;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;

uniform bool billboard;
uniform float opacity;
uniform float sizeScale;
uniform float sizeMinPixels;
uniform float sizeMaxPixels;
uniform vec4 padding;
uniform int sizeUnits;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying float vLineWidth;
varying vec2 uv;
varying vec2 dimensions;

vec2 rotate_by_angle(vec2 vertex, float angle) {
  float angle_radian = radians(angle);
  float cos_angle = cos(angle_radian);
  float sin_angle = sin(angle_radian);
  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
  return rotationMatrix * vertex;
}

void main(void) {
  geometry.worldPosition = instancePositions;
  geometry.uv = positions;
  geometry.pickingColor = instancePickingColors;
  uv = positions;
  vLineWidth = instanceLineWidths;
  float sizePixels = clamp(
    project_size_to_pixel(instanceSizes * sizeScale, sizeUnits),
    sizeMinPixels, sizeMaxPixels
  );

  dimensions = instanceRects.zw * sizePixels + padding.xy + padding.zw;

  vec2 pixelOffset = (positions * instanceRects.zw + instanceRects.xy) * sizePixels + mix(-padding.xy, padding.zw, positions);
  pixelOffset = rotate_by_angle(pixelOffset, instanceAngles);
  pixelOffset += instancePixelOffsets;
  pixelOffset.y *= -1.0;

  if (billboard)  {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
    vec3 offset = vec3(pixelOffset, 0.0);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
  } else {
    vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
    DECKGL_FILTER_SIZE(offset_common, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }
  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);
  DECKGL_FILTER_COLOR(vFillColor, geometry);
  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);
  DECKGL_FILTER_COLOR(vLineColor, geometry);
}
`,nt=`#define SHADER_NAME text-background-layer-fragment-shader

precision highp float;

uniform bool stroked;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying float vLineWidth;
varying vec2 uv;
varying vec2 dimensions;

void main(void) {
  geometry.uv = uv;

  vec2 pixelPosition = uv * dimensions;
  if (stroked) {
    float distToEdge = min(
      min(pixelPosition.x, dimensions.x - pixelPosition.x),
      min(pixelPosition.y, dimensions.y - pixelPosition.y)
    );
    float isBorder = smoothedge(distToEdge, vLineWidth);
    gl_FragColor = mix(vFillColor, vLineColor, isBorder);
  } else {
    gl_FragColor = vFillColor;
  }

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;const it={billboard:!0,sizeScale:1,sizeUnits:"pixels",sizeMinPixels:0,sizeMaxPixels:Number.MAX_SAFE_INTEGER,padding:{type:"array",value:[0,0,0,0]},getPosition:{type:"accessor",value:l=>l.position},getSize:{type:"accessor",value:1},getAngle:{type:"accessor",value:0},getPixelOffset:{type:"accessor",value:[0,0]},getBoundingRect:{type:"accessor",value:[0,0,0,0]},getFillColor:{type:"accessor",value:[0,0,0,255]},getLineColor:{type:"accessor",value:[0,0,0,255]},getLineWidth:{type:"accessor",value:1}};class V extends k{constructor(...e){super(...e),h(this,"state",void 0)}getShaders(){return super.getShaders({vs:tt,fs:nt,modules:[D,N]})}initializeState(){this.getAttributeManager().addInstanced({instancePositions:{size:3,type:5130,fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceSizes:{size:1,transition:!0,accessor:"getSize",defaultValue:1},instanceAngles:{size:1,transition:!0,accessor:"getAngle"},instanceRects:{size:4,accessor:"getBoundingRect"},instancePixelOffsets:{size:2,transition:!0,accessor:"getPixelOffset"},instanceFillColors:{size:4,transition:!0,normalized:!0,type:5121,accessor:"getFillColor",defaultValue:[0,0,0,255]},instanceLineColors:{size:4,transition:!0,normalized:!0,type:5121,accessor:"getLineColor",defaultValue:[0,0,0,255]},instanceLineWidths:{size:1,transition:!0,accessor:"getLineWidth",defaultValue:1}})}updateState(e){super.updateState(e);const{changeFlags:t}=e;if(t.extensionsChanged){var n;const{gl:i}=this.context;(n=this.state.model)===null||n===void 0||n.delete(),this.state.model=this._getModel(i),this.getAttributeManager().invalidateAll()}}draw({uniforms:e}){const{billboard:t,sizeScale:n,sizeUnits:i,sizeMinPixels:s,sizeMaxPixels:o,getLineWidth:r}=this.props;let{padding:a}=this.props;a.length<4&&(a=[a[0],a[1],a[0],a[1]]),this.state.model.setUniforms(e).setUniforms({billboard:t,stroked:Boolean(r),padding:a,sizeUnits:R[i],sizeScale:n,sizeMinPixels:s,sizeMaxPixels:o}).draw()}_getModel(e){const t=[0,0,1,0,1,1,0,1];return new H(e,{...this.getShaders(),id:this.props.id,geometry:new G({drawMode:6,vertexCount:4,attributes:{positions:{size:2,value:new Float32Array(t)}}}),isInstanced:!0})}}h(V,"defaultProps",it);h(V,"layerName","TextBackgroundLayer");const se={start:1,middle:0,end:-1},oe={top:1,center:0,bottom:-1},U=[0,0,0,255],st=1,ot={billboard:!0,sizeScale:1,sizeUnits:"pixels",sizeMinPixels:0,sizeMaxPixels:Number.MAX_SAFE_INTEGER,background:!1,getBackgroundColor:{type:"accessor",value:[255,255,255,255]},getBorderColor:{type:"accessor",value:U},getBorderWidth:{type:"accessor",value:0},backgroundPadding:{type:"array",value:[0,0,0,0]},characterSet:{type:"object",value:z.characterSet},fontFamily:z.fontFamily,fontWeight:z.fontWeight,lineHeight:st,outlineWidth:{type:"number",value:0,min:0},outlineColor:{type:"color",value:U},fontSettings:{type:"object",value:{},compare:1},wordBreak:"break-word",maxWidth:{type:"number",value:-1},getText:{type:"accessor",value:l=>l.text},getPosition:{type:"accessor",value:l=>l.position},getColor:{type:"accessor",value:U},getSize:{type:"accessor",value:32},getAngle:{type:"accessor",value:0},getTextAnchor:{type:"accessor",value:"middle"},getAlignmentBaseline:{type:"accessor",value:"center"},getPixelOffset:{type:"accessor",value:[0,0]},backgroundColor:{deprecatedFor:["background","getBackgroundColor"]}};class pe extends le{constructor(...e){super(...e),h(this,"state",void 0),h(this,"getBoundingRect",(t,n)=>{let{size:[i,s]}=this.transformParagraph(t,n);const{fontSize:o}=this.state.fontAtlasManager.props;i/=o,s/=o;const{getTextAnchor:r,getAlignmentBaseline:a}=this.props,c=se[typeof r=="function"?r(t,n):r],g=oe[typeof a=="function"?a(t,n):a];return[(c-1)*i/2,(g-1)*s/2,i,s]}),h(this,"getIconOffsets",(t,n)=>{const{getTextAnchor:i,getAlignmentBaseline:s}=this.props,{x:o,y:r,rowWidth:a,size:[c,g]}=this.transformParagraph(t,n),u=se[typeof i=="function"?i(t,n):i],d=oe[typeof s=="function"?s(t,n):s],f=o.length,p=new Array(f*2);let x=0;for(let v=0;v<f;v++){const m=(1-u)*(c-a[v])/2;p[x++]=(u-1)*c/2+m+o[v],p[x++]=(d-1)*g/2+r[v]}return p})}initializeState(){this.state={styleVersion:0,fontAtlasManager:new et},this.props.maxWidth>0&&O.warn("v8.9 breaking change: TextLayer maxWidth is now relative to text size")()}updateState(e){const{props:t,oldProps:n,changeFlags:i}=e;(i.dataChanged||i.updateTriggersChanged&&(i.updateTriggersChanged.all||i.updateTriggersChanged.getText))&&this._updateText(),(this._updateFontAtlas()||t.lineHeight!==n.lineHeight||t.wordBreak!==n.wordBreak||t.maxWidth!==n.maxWidth)&&this.setState({styleVersion:this.state.styleVersion+1})}getPickingInfo({info:e}){return e.object=e.index>=0?this.props.data[e.index]:null,e}_updateFontAtlas(){const{fontSettings:e,fontFamily:t,fontWeight:n}=this.props,{fontAtlasManager:i,characterSet:s}=this.state,o={...e,characterSet:s,fontFamily:t,fontWeight:n};if(!i.mapping)return i.setProps(o),!0;for(const r in o)if(o[r]!==i.props[r])return i.setProps(o),!0;return!1}_updateText(){var e;const{data:t,characterSet:n}=this.props,i=(e=t.attributes)===null||e===void 0?void 0:e.getText;let{getText:s}=this.props,o=t.startIndices,r;const a=n==="auto"&&new Set;if(i&&o){const{texts:c,characterCount:g}=qe({...ArrayBuffer.isView(i)?{value:i}:i,length:t.length,startIndices:o,characterSet:a});r=g,s=(u,{index:d})=>c[d]}else{const{iterable:c,objectInfo:g}=re(t);o=[0],r=0;for(const u of c){g.index++;const d=Array.from(s(u,g)||"");a&&d.forEach(a.add,a),r+=d.length,o.push(r)}}this.setState({getText:s,startIndices:o,numInstances:r,characterSet:a||n})}transformParagraph(e,t){const{fontAtlasManager:n}=this.state,i=n.mapping,s=this.state.getText,{wordBreak:o,lineHeight:r,maxWidth:a}=this.props,c=s(e,t)||"";return Xe(c,r,o,a*n.props.fontSize,i)}renderLayers(){const{startIndices:e,numInstances:t,getText:n,fontAtlasManager:{scale:i,texture:s,mapping:o},styleVersion:r}=this.state,{data:a,_dataDiff:c,getPosition:g,getColor:u,getSize:d,getAngle:f,getPixelOffset:p,getBackgroundColor:x,getBorderColor:v,getBorderWidth:m,backgroundPadding:S,background:C,billboard:y,fontSettings:_,outlineWidth:L,outlineColor:A,sizeScale:T,sizeUnits:b,sizeMinPixels:I,sizeMaxPixels:E,transitions:M,updateTriggers:P}=this.props,ve=this.getSubLayerClass("characters",K),me=this.getSubLayerClass("background",V);return[C&&new me({getFillColor:x,getLineColor:v,getLineWidth:m,padding:S,getPosition:g,getSize:d,getAngle:f,getPixelOffset:p,billboard:y,sizeScale:T,sizeUnits:b,sizeMinPixels:I,sizeMaxPixels:E,transitions:M&&{getPosition:M.getPosition,getAngle:M.getAngle,getSize:M.getSize,getFillColor:M.getBackgroundColor,getLineColor:M.getBorderColor,getLineWidth:M.getBorderWidth,getPixelOffset:M.getPixelOffset}},this.getSubLayerProps({id:"background",updateTriggers:{getPosition:P.getPosition,getAngle:P.getAngle,getSize:P.getSize,getFillColor:P.getBackgroundColor,getLineColor:P.getBorderColor,getLineWidth:P.getBorderWidth,getPixelOffset:P.getPixelOffset,getBoundingRect:{getText:P.getText,getTextAnchor:P.getTextAnchor,getAlignmentBaseline:P.getAlignmentBaseline,styleVersion:r}}}),{data:a.attributes&&a.attributes.background?{length:a.length,attributes:a.attributes.background}:a,_dataDiff:c,autoHighlight:!1,getBoundingRect:this.getBoundingRect}),new ve({sdf:_.sdf,smoothing:Number.isFinite(_.smoothing)?_.smoothing:z.smoothing,outlineWidth:L/(_.radius||z.radius),outlineColor:A,iconAtlas:s,iconMapping:o,getPosition:g,getColor:u,getSize:d,getAngle:f,getPixelOffset:p,billboard:y,sizeScale:T*i,sizeUnits:b,sizeMinPixels:I*i,sizeMaxPixels:E*i,transitions:M&&{getPosition:M.getPosition,getAngle:M.getAngle,getColor:M.getColor,getSize:M.getSize,getPixelOffset:M.getPixelOffset}},this.getSubLayerProps({id:"characters",updateTriggers:{all:P.getText,getPosition:P.getPosition,getAngle:P.getAngle,getColor:P.getColor,getSize:P.getSize,getPixelOffset:P.getPixelOffset,getIconOffsets:{getTextAnchor:P.getTextAnchor,getAlignmentBaseline:P.getAlignmentBaseline,styleVersion:r}}}),{data:a,_dataDiff:c,startIndices:e,numInstances:t,getIconOffsets:this.getIconOffsets,getIcon:n})]}static set fontAtlasCacheLimit(e){Qe(e)}}h(pe,"defaultProps",ot);h(pe,"layerName","TextLayer");export{le as C,j as I,ge as S,pe as T};
//# sourceMappingURL=text-layer.c8c59efd.js.map

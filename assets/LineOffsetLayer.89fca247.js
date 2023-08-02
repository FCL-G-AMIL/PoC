import{g as o}from"./index.1d7144b8.js";import{L as i}from"./line-layer.ca4a1987.js";var s=`#define SHADER_NAME line-layer-vertex-shader\r
\r
attribute vec3 positions;\r
attribute vec3 instanceSourcePositions;\r
attribute vec3 instanceTargetPositions;\r
attribute vec3 instanceSourcePositions64Low;\r
attribute vec3 instanceTargetPositions64Low;\r
attribute vec4 instanceColors;\r
attribute vec3 instancePickingColors;\r
attribute float instanceWidths;\r
\r
uniform float opacity;\r
uniform float widthScale;\r
uniform float widthMinPixels;\r
uniform float widthMaxPixels;\r
uniform float useShortestPath;\r
uniform int widthUnits;\r
\r
uniform float offsetDirection;\r
uniform float bearing;\r
\r
varying vec4 vColor;\r
varying vec2 uv;\r
\r
// offset vector by strokeWidth pixels\r
// offset_direction is -1 (left) or 1 (right)\r
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction, float width) {\r
  // normalized direction of the line\r
  vec2 dir_screenspace = normalize(line_clipspace * project_uViewportSize);\r
  // rotate by 90 degrees\r
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);\r
\r
  return dir_screenspace * offset_direction * width / 2.0;\r
}\r
\r
vec3 splitLine(vec3 a, vec3 b, float x) {\r
  float t = (x - a.x) / (b.x - a.x);\r
  return vec3(x, mix(a.yz, b.yz, t));\r
}\r
\r
void drivingSideOffset(inout vec3 size, float widthPixels) {\r
\r
    // a -> b\r
    vec3 link = geometry.worldPositionAlt.xyz - geometry.worldPosition.xyz;\r
\r
    // normalized direction of the line\r
    vec2 direction = normalize(link.xy * project_uViewportSize);\r
\r
    // rotate by map bearing\r
    vec2 rotation;\r
    rotation.x = direction.x * cos(bearing) + direction.y * -sin(bearing);\r
    rotation.y = direction.x * sin(bearing) + direction.y *  cos(bearing);\r
\r
    // rotate by 90 degrees to get offset direction\r
    rotation = vec2(-rotation.y, rotation.x);\r
\r
    // offset the coordinates\r
    vec2 offset = rotation * offsetDirection * widthPixels / 2.0;\r
\r
    size.x += offset.x;\r
    size.y += offset.y;\r
}\r
\r
void main(void) {\r
  geometry.worldPosition = instanceSourcePositions;\r
  geometry.worldPositionAlt = instanceTargetPositions;\r
\r
  vec3 source_world = instanceSourcePositions;\r
  vec3 target_world = instanceTargetPositions;\r
  vec3 source_world_64low = instanceSourcePositions64Low;\r
  vec3 target_world_64low = instanceTargetPositions64Low;\r
\r
  if (useShortestPath > 0.5 || useShortestPath < -0.5) {\r
    source_world.x = mod(source_world.x + 180., 360.0) - 180.;\r
    target_world.x = mod(target_world.x + 180., 360.0) - 180.;\r
    float deltaLng = target_world.x - source_world.x;\r
\r
    if (deltaLng * useShortestPath > 180.) {\r
      source_world.x += 360. * useShortestPath;\r
      source_world = splitLine(source_world, target_world, 180. * useShortestPath);\r
      source_world_64low = vec3(0.0);\r
    } else if (deltaLng * useShortestPath < -180.) {\r
      target_world.x += 360. * useShortestPath;\r
      target_world = splitLine(source_world, target_world, 180. * useShortestPath);\r
      target_world_64low = vec3(0.0);\r
    } else if (useShortestPath < 0.) {\r
      // Line is not split, abort\r
      gl_Position = vec4(0.);\r
      return;\r
    }\r
  }\r
\r
  // Position\r
  vec4 source_commonspace;\r
  vec4 target_commonspace;\r
  vec4 source = project_position_to_clipspace(source_world, source_world_64low, vec3(0.), source_commonspace);\r
  vec4 target = project_position_to_clipspace(target_world, target_world_64low, vec3(0.), target_commonspace);\r
\r
  // linear interpolation of source & target to pick right coord\r
  float segmentIndex = positions.x;\r
  vec4 p = mix(source, target, segmentIndex);\r
  geometry.position = mix(source_commonspace, target_commonspace, segmentIndex);\r
  uv = positions.xy;\r
  geometry.uv = uv;\r
  geometry.pickingColor = instancePickingColors;\r
\r
  // Multiply out width and clamp to limits\r
  float widthPixels = clamp(\r
    project_size_to_pixel(instanceWidths * widthScale, widthUnits),\r
    widthMinPixels, widthMaxPixels\r
  );\r
\r
  // extrude\r
  vec3 offset = vec3(\r
    getExtrusionOffset(target.xy - source.xy, positions.y, widthPixels),\r
    0.0);\r
\r
  drivingSideOffset(offset, 1.0 + widthPixels);\r
\r
  DECKGL_FILTER_SIZE(offset, geometry);\r
  gl_Position = p + vec4(project_pixel_size_to_clipspace(offset.xy), 0.0, 0.0);\r
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);\r
\r
  // Color\r
  vColor = vec4(instanceColors.rgb, instanceColors.a * opacity);\r
  DECKGL_FILTER_COLOR(vColor, geometry);\r
}\r
`;const a={NONE:0,LEFT:1,RIGHT:-1};class e extends i{initializeState(r){super.initializeState(r)}getShaders(){return{...super.getShaders(),vs:s}}draw({uniforms:r}){const{offsetDirection:t}=this.props,n={...r,offsetDirection:t,bearing:o.state.viewState.bearing*Math.PI/180};super.draw({uniforms:n})}}e.layerName="LineOffsetLayer";e.defaultProps={bearing:0,offsetDirection:a.RIGHT};export{e as L,a as O};
//# sourceMappingURL=LineOffsetLayer.89fca247.js.map

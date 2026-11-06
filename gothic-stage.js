import * as THREE from './vendor/three.module.js';

const canvas = document.querySelector('#gothicCanvas');
const stage = document.querySelector('.world-backdrop');
const film = document.querySelector('#storyVideo');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const pointer = new THREE.Vector2(.5, .5);
const mouse = new THREE.Vector2(.5, .5);
let progress = 0;
let strength = 0;
let visible = true;
let staticMode = document.body.classList.contains('static-motion');
let renderer, material, frame = 0, disposed = false;

try {
  renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:false, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.4));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
} catch {
  // The DOM poster and three chapter controls remain the complete fallback.
  canvas.hidden = true;
}

if (renderer) {
  const loader = new THREE.TextureLoader();
  const files = ['assets/scroll-film-v2/背景V2-01-window.jpg','assets/scroll-film-v2/背景V2-05-library.jpg','assets/scroll-film-v2/12-meeting-seedream.jpg'];
  const textures = await Promise.all(files.map(file => loader.loadAsync(file).catch(() => null)));
  if (textures.some(texture => !texture)) {
    canvas.hidden = true;
    renderer.dispose();
  } else {
    textures.forEach(texture => { texture.colorSpace = THREE.SRGBColorSpace; texture.minFilter = THREE.LinearFilter; texture.generateMipmaps = false; });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const videoTexture = new THREE.VideoTexture(film);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    material = new THREE.ShaderMaterial({
      uniforms:{first:{value:textures[0]}, second:{value:textures[1]}, third:{value:textures[2]}, videoFrame:{value:videoTexture}, videoReady:{value:0}, resolution:{value:new THREE.Vector2(1,1)}, pointer:{value:pointer}, strength:{value:0}, focalX:{value:.68}, progress:{value:0}, time:{value:0}},
      vertexShader:`varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
      fragmentShader:`
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D first,second,third,videoFrame;
        uniform vec2 resolution,pointer;
        uniform float strength,progress,time,videoReady,focalX;
        vec2 cover(vec2 uv){
          float screenRatio=resolution.x/resolution.y;float imageRatio=1.7777778;
          if(screenRatio<imageRatio){float scale=screenRatio/imageRatio;uv.x=(uv.x-.5)*scale+.5+(focalX-.5)*(1.-scale);}
          else{uv.y=(uv.y-.5)*imageRatio/screenRatio+.5;}
          return uv;
        }
        float field(vec2 p){return sin(p.x*7.+p.y*4.)*.5+sin(p.y*11.-p.x*3.)*.25;}
        void main(){
          vec2 uv=vUv;vec2 d=uv-pointer;d.x*=resolution.x/resolution.y;
          float radius=length(d);float wave=sin(radius*32.-time*3.)*exp(-radius*5.)*strength*.007;
          uv+=normalize(d+vec2(.0001))*wave;
          float a=smoothstep(.245,.375,progress);float b=smoothstep(.605,.735,progress);
          float passage=sin(a*3.14159265)+sin(b*3.14159265);
          vec2 bend=vec2(field(uv*2.+time*.025),field(uv.yx*2.7-time*.025))*.011*passage;
          // Tiny optical movement of the painted scene, without deforming faces.
          uv=(uv-.5)/(1.012+sin(time*.13)*.003)+.5;
          vec4 c1=texture2D(first,clamp(cover(uv+bend),.001,.999));
          vec4 c2=texture2D(second,clamp(cover(uv-bend),.001,.999));
          vec4 c3=texture2D(third,clamp(cover(uv+bend*.7),.001,.999));
          vec4 color=mix(mix(c1,c2,a),c3,b);
          // The actual Seedance film is the primary full-screen background.
          // Artwork textures are only a loading / reduced-motion fallback.
          vec4 movingFrame=texture2D(videoFrame,clamp(cover(uv+bend*.25),.001,.999));
          // Custom ShaderMaterial must decode browser video samples explicitly.
          // Without this, the final sRGB output transform washes out the film.
          movingFrame.rgb=mix(movingFrame.rgb/12.92,pow((movingFrame.rgb+.055)/1.055,vec3(2.4)),step(vec3(.04045),movingFrame.rgb));
          color=mix(color,movingFrame,videoReady);
          color.rgb*=1.-passage*.11;
          float opening=smoothstep(.75,.85,progress)*(1.-smoothstep(.86,.91,progress));
          float beam=exp(-pow((uv.x-.57)/(.015+.15*opening),2.))*pow(1.-uv.y,1.5);
          color.rgb+=vec3(.10,.052,.018)*beam*opening;
          gl_FragColor=color;
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`
    });
    scene.add(new THREE.Mesh(geometry,material));
    // A real segmented leaf crosses the camera, in front of the film.
    const foreground = new THREE.Scene();
    const foregroundCamera = new THREE.PerspectiveCamera(45, 1, .1, 40);foregroundCamera.position.z=6;
    foreground.add(new THREE.AmbientLight(0xc4d0d6, 1.1));
    const pageLight=new THREE.DirectionalLight(0xffd9a4,2.2);pageLight.position.set(-3,4,5);foreground.add(pageLight);
    const pageTexture=loader.load('assets/covers/crime-v1.jpg');pageTexture.colorSpace=THREE.SRGBColorSpace;
    const pageGeometry=new THREE.PlaneGeometry(4.7,6.5,36,12);const pageOriginal=pageGeometry.attributes.position.array.slice();
    const pageFront=new THREE.MeshStandardMaterial({map:pageTexture,roughness:.82,side:THREE.FrontSide,color:0xb6aaa0});
    const pageBack=new THREE.MeshStandardMaterial({color:0xbdb39a,roughness:.95,side:THREE.BackSide});
    const leaf=new THREE.Group();leaf.add(new THREE.Mesh(pageGeometry,pageFront),new THREE.Mesh(pageGeometry,pageBack));leaf.visible=false;foreground.add(leaf);
    function turnLeaf(){leaf.visible=false;}
    let passageRenderer=null,lastPassageScroll=0;
    addEventListener('scroll',()=>{lastPassageScroll=performance.now();},{passive:true});
    renderer.autoClear=false;
    function resize(){const rect=stage.getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);material.uniforms.resolution.value.set(rect.width,rect.height);foregroundCamera.aspect=rect.width/Math.max(1,rect.height);foregroundCamera.updateProjectionMatrix();if(passageRenderer)passageRenderer.setSize(rect.width,rect.height,false);}
    let lastRender = 0;
    function animate(now){
      frame=0;if(disposed||!visible||staticMode||document.hidden||document.body.classList.contains('author-idle')){if(passageRenderer)passageRenderer.domElement.hidden=true;return;}
      if(now-lastRender<1000/30){frame=requestAnimationFrame(animate);return;}lastRender=now;
      pointer.lerp(mouse,.065);strength*=.96;
      material.uniforms.strength.value=strength;
      const focal = progress < .125 ? .68 : progress > .875 ? .65 : .5; material.uniforms.focalX.value += (focal-material.uniforms.focalX.value)*.06;
      material.uniforms.progress.value=progress;
      material.uniforms.time.value=now*.001;
      material.uniforms.videoReady.value=film.readyState>=2?1:0;
      if(film.readyState>=2)videoTexture.needsUpdate=true;
      turnLeaf();renderer.clear();renderer.render(scene,camera);if(passageRenderer){const recent=now-lastPassageScroll<1200;passageRenderer.domElement.style.opacity=recent?'1':'0';passageRenderer.domElement.hidden=!leaf.visible||now-lastPassageScroll>1800;if(leaf.visible&&!passageRenderer.domElement.hidden){passageRenderer.clear();passageRenderer.render(foreground,foregroundCamera);}}else if(leaf.visible){renderer.clearDepth();renderer.render(foreground,foregroundCamera);}
      canvas.classList.add('ready');
      frame=requestAnimationFrame(animate);
    }
    function wake(){if(staticMode&&passageRenderer)passageRenderer.domElement.hidden=true;if(!frame&&!disposed&&visible&&!staticMode&&!document.hidden)frame=requestAnimationFrame(animate);}
    addEventListener('gothic-progress',event=>{progress=event.detail.progress;wake();});
    addEventListener('gothic-motion',event=>{staticMode=event.detail.static;wake();});
    addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const r=stage.getBoundingClientRect();mouse.set((event.clientX-r.left)/r.width,1-(event.clientY-r.top)/r.height);strength=Math.min(1,strength+.12);wake();},{passive:true});
    addEventListener('resize',()=>{resize();wake();},{passive:true});
    addEventListener('visibilitychange',wake);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;wake();},{threshold:0});observer.observe(stage);
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();disposed=true;canvas.hidden=true;cancelAnimationFrame(frame);});
    addEventListener('pageshow',wake);
    addEventListener('pagehide',event=>{if(event.persisted){cancelAnimationFrame(frame);frame=0;return;}disposed=true;cancelAnimationFrame(frame);observer.disconnect();textures.forEach(texture=>texture.dispose());videoTexture.dispose();geometry.dispose();material.dispose();pageGeometry.dispose();pageFront.dispose();pageBack.dispose();pageTexture.dispose();if(passageRenderer){passageRenderer.dispose();passageRenderer.domElement.remove();}renderer.dispose();},{once:true});
    reduced.addEventListener('change',()=>{staticMode=reduced.matches||document.body.classList.contains('static-motion');wake();});
    progress=Math.max(0,Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));
    staticMode=document.body.classList.contains('static-motion');
    resize();wake();
  }
}

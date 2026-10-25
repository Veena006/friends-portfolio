(function(){
"use strict";
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var coarse = window.matchMedia("(pointer: coarse)").matches;
var root = document.documentElement;

/* ---------- data ---------- */
var PLAYER="https://player.cloudinary.com/embed/?cloud_name=sgmkhwke&public_id=";
var MORE=[
 "AQN3QlN30BkMg1npj8J1mmgp_-9PWXwjyojMuF46VdCX4ctQgL9YfRHef4F40rZWqGTtGTFBCWAEPKFbmGOhlw-rZp3z02RSCAh9jsw",
 "AQOvYqUY_c2k6Mqd-1XR_HKhYEjysITkZBBNpjdqQxE5Tsc9aVypozDDFP09ir33CJznSMBoRGlkzIGTPjwXN90-",
 "AQMRK5NI2FrGaBbhWny9WwR9wcjWHfjQDFOqYNIYXqixqjEb7htIHSRR0lHSwbCXulXOe7ituXNtfwc1KATutihG",
 "AQOa7Pboy3NSvIZAzJzyi_N6ymGB2_4ZNEnteCcet7nhjgGulCWzfkSR881i5GVeqilBASb4Alvo2KI9pEqsUmQAQOaSo4271eXaPvM"
];
var CAL={
 feb:[
  ["Feb 1-7","Academy introduction or training highlights","Coach / player spotlight graphic","Training clips, polls, Q&A","Awareness"],
  ["Feb 8-14","Skill drill or coaching tip","Valentine-week team / community post (optional)","Practice moments, reposts","Engagement"],
  ["Feb 15-21","Player progress / practice montage","Training schedule or academy update","Short clips, question sticker","Trust"],
  ["Feb 22-28","Weekly highlights / best moments","Photo carousel or facility post","Recap, audience questions","Retention"]],
 mar:[
  ["Mar 1-7","Training intensity / drill montage","Coach introduction or tip card","Behind the scenes, polls","Awareness"],
  ["Mar 8-14","In sport / community feature (if relevant)","Player profile or academy values","Practice clips, Q&A","Community"],
  ["Mar 15-21","Match / net-session highlights","Carousel: key moments or tips","Live updates when available","Engagement"],
  ["Mar 22-28","Best shots of the month / player feature","Upcoming training or event notice","Reposts, question sticker","Conversion"],
  ["Mar 29-31","Monthly recap reel","Top-performing content recap","Feedback poll, teaser for April","Review"]]
};
var TOOLS=["Adobe Premiere Pro","CapCut","Canva","Meta Business Suite","Meta Ads Manager","Figma","Google Sheets","Video editing","Social media","Event coordination"];

function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
var PLAY='<span class="play"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></span>';

/* hero name split */
document.querySelectorAll("[data-split]").forEach(function(n,row){
  var s=n.getAttribute("data-split");
  for(var i=0;i<s.length;i++){var sp=el("span","ch",s[i]);sp.style.setProperty("--i",i+row*4);n.appendChild(sp)}
});
/* marquee */
var mq=document.getElementById("mq");
var half=TOOLS.map(function(t){return "<span>"+t+"</span>"}).join("");
mq.innerHTML=half+half;
/* video cards */
var mr=document.getElementById("more-reels");
MORE.forEach(function(id,i){
  var n=i+1,f=el("figure","vid mini-vid reveal",'<video controls playsinline preload="metadata" poster="video/edit-'+n+'.jpg" aria-label="Video edit '+n+'"><source src="video/edit-'+n+'.mp4" type="video/mp4"></video><figcaption>Edit 0'+n+'</figcaption>');
  mr.appendChild(f);
});

/* calendar */
var rows=document.getElementById("cal-rows"),tf=document.getElementById("tab-feb"),tm=document.getElementById("tab-mar");
function showCal(k){
  rows.innerHTML=CAL[k].map(function(r){return "<tr><td>"+r[0]+"</td><td>"+r[1]+"</td><td>"+r[2]+"</td><td>"+r[3]+"</td><td><span class=\"goal\">"+r[4]+"</span></td></tr>"}).join("");
  tf.setAttribute("aria-selected",k==="feb");tm.setAttribute("aria-selected",k==="mar");
}
tf.addEventListener("click",function(){showCal("feb")});tm.addEventListener("click",function(){showCal("mar")});
showCal("feb");

/* ---------- theme ---------- */
var tb=document.getElementById("theme");
function isDark(){
  var t=root.getAttribute("data-theme");
  if(t) return t==="dark";
  return !window.matchMedia("(prefers-color-scheme: light)").matches;
}
try{var saved=localStorage.getItem("sm-theme");if(saved)root.setAttribute("data-theme",saved)}catch(e){}
tb.addEventListener("click",function(){
  var n=isDark()?"light":"dark";root.setAttribute("data-theme",n);
  try{localStorage.setItem("sm-theme",n)}catch(e){}
  setTimeout(applyWave,30);
});
window.matchMedia("(prefers-color-scheme: light)").addEventListener&&window.matchMedia("(prefers-color-scheme: light)").addEventListener("change",function(){setTimeout(applyWave,30)});

/* ---------- 3D ribbon ---------- */
var canvas=document.getElementById("stage"),renderer,scene,camera,group,lines=[],P=200,L=58,mat=[],W=9,mx=0,my=0,tx=0,ty=0,scrollP=0,running=false;
function waveCss(){var cs=getComputedStyle(root);return{c:cs.getPropertyValue("--wave").trim()||"#e2b886",o:parseFloat(cs.getPropertyValue("--wave-op"))||.5}}
function applyWave(){
  if(!renderer)return;var w=waveCss();
  mat.forEach(function(m,i){m.color.set(w.c);m.opacity=w.o*(0.55+0.45*Math.sin(i/L*Math.PI))});
  if(reduce)draw(0);
}
function initGL(){
  try{
    renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(0,0,13);
    group=new THREE.Group();scene.add(group);
    for(var i=0;i<L;i++){
      var g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(new Float32Array(P*3),3));
      var m=new THREE.LineBasicMaterial({transparent:true,opacity:.5});mat.push(m);
      var ln=new THREE.Line(g,m);ln.frustumCulled=false;lines.push(ln);group.add(ln);
    }
    applyWave();resize();update(0);
    return true;
  }catch(e){return false}
}
function update(t){
  var w=2.1+Math.sin(t*.25)*.35;
  for(var i=0;i<L;i++){
    var u=i/(L-1),a=lines[i].geometry.attributes.position.array;
    for(var j=0;j<P;j++){
      var x=(j/(P-1)-.5)*2*W;
      var env=.35+.65*Math.exp(-Math.pow(x/(W*.9),2));
      var w1=Math.sin(x*.52+t*.55);
      var w2=Math.sin(x*.52+t*.55+2.4+Math.sin(x*.21-t*.3)*1.1)*.8;
      var y=(w1*(1-u)+w2*u)*1.7*env;
      var z=(u-.5)*w*3.1*(1+.55*Math.sin(x*.38+t*.35));
      /* pointer bulge */
      var d=x-tx*W*.9;y+=Math.exp(-d*d*.12)*ty*1.1*Math.cos(u*3.1);
      var k=j*3;a[k]=x;a[k+1]=y;a[k+2]=z;
    }
    lines[i].geometry.attributes.position.needsUpdate=true;
  }
}
function resize(){
  if(!renderer)return;var w=window.innerWidth,h=window.innerHeight;
  renderer.setSize(w,h,false);camera.aspect=w/h;
  camera.position.z=w<760?19:13.5;camera.updateProjectionMatrix();
}
function draw(t){
  if(!renderer)return;
  group.rotation.y=-.35+mx*.35+scrollP*1.4;
  group.rotation.x=.25+my*.15+scrollP*.5;
  group.position.y=-.4-scrollP*1.5;
  canvas.style.opacity=String(Math.max(.2,1-scrollP*2.4));
  update(t);renderer.render(scene,camera);
}
var t0=performance.now();
function loop(now){
  if(!running)return;
  mx+=((tx)-mx)*.05;my+=((ty)-my)*.05;
  draw((now-t0)/1000);requestAnimationFrame(loop);
}
if(typeof THREE!=="undefined"&&initGL()){
  window.addEventListener("resize",resize);
  if(!reduce){
    running=true;requestAnimationFrame(loop);
    window.addEventListener("pointermove",function(e){tx=(e.clientX/window.innerWidth-.5)*2;ty=-(e.clientY/window.innerHeight-.5)*2},{passive:true});
    document.addEventListener("visibilitychange",function(){
      if(document.hidden){running=false}else if(!running){running=true;requestAnimationFrame(loop)}
    });
  }else{draw(2)}
}else{canvas.style.display="none"}

/* ---------- scroll: progress, rail, wave ---------- */
var prog=document.getElementById("progress"),rail=document.getElementById("rail"),xp=document.getElementById("xp"),tick=false;
function onScroll(){
  var doc=document.documentElement,max=doc.scrollHeight-window.innerHeight;
  var p=max>0?window.scrollY/max:0;
  scrollP=Math.min(1,p);prog.style.transform="scaleX("+p+")";
  var r=xp.getBoundingClientRect(),vh=window.innerHeight;
  var rp=Math.min(1,Math.max(0,(vh*.7-r.top)/(r.height)));
  rail.style.transform="scaleY("+rp+")";
  if(reduce&&renderer)draw(2);
  tick=false;
}
window.addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();

/* ---------- reveal + counters + bars ---------- */
var vh0=window.innerHeight;
var revs=[].slice.call(document.querySelectorAll(".reveal"));
function countUp(n){
  var end=parseFloat(n.getAttribute("data-count")),dec=+(n.getAttribute("data-dec")||0),
      pre=n.getAttribute("data-prefix")||"",suf=n.getAttribute("data-suffix")||"";
  if(reduce){return}
  var dur=1400,s=performance.now();
  (function f(now){
    var k=Math.min(1,(now-s)/dur),e=1-Math.pow(1-k,3),v=end*e;
    n.textContent=pre+(dec?v.toFixed(dec):Math.round(v))+suf;
    if(k<1)requestAnimationFrame(f);else n.textContent=pre+(dec?end.toFixed(dec):end)+suf;
  })(s);
}
var bars=[].slice.call(document.querySelectorAll(".bar i"));
bars.forEach(function(b){b.style.transform="scaleX("+(b.getAttribute("data-w")/100)+")"});
if("IntersectionObserver" in window){
  revs.forEach(function(r){if(r.getBoundingClientRect().top>vh0*.95&&!reduce)r.classList.add("pre")});
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      var t=e.target;t.classList.remove("pre");
      t.querySelectorAll("[data-count]").forEach(countUp);
      if(t.id==="growth"&&!reduce){bars.forEach(function(b){b.style.transition="none";b.style.transform="scaleX(0)";void b.offsetWidth;b.style.transition="";b.style.transform="scaleX("+(b.getAttribute("data-w")/100)+")"})}
      io.unobserve(t);
    });
  },{threshold:.15});
  revs.forEach(function(r){io.observe(r)});
  var g=document.getElementById("growth");if(g)io.observe(g);
}

/* ---------- tilt ---------- */
if(!reduce&&!coarse){
  document.querySelectorAll(".tilt").forEach(function(c){
    c.addEventListener("pointermove",function(e){
      var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.style.setProperty("--ry",((x-.5)*16)+"deg");c.style.setProperty("--rx",(-(y-.5)*16)+"deg");
      c.style.setProperty("--gx",(x*100)+"%");c.style.setProperty("--gy",(y*100)+"%");
    });
    c.addEventListener("pointerleave",function(){c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")});
  });
  var ph=document.getElementById("photo");
  document.getElementById("about").addEventListener("pointermove",function(e){
    var r=ph.getBoundingClientRect(),x=(e.clientX-(r.left+r.width/2))/window.innerWidth,y=(e.clientY-(r.top+r.height/2))/window.innerHeight;
    ph.style.transform="rotateY("+(x*26)+"deg) rotateX("+(-y*26)+"deg)";
  });
}

/* only one video plays at a time */
var vs=[].slice.call(document.querySelectorAll(".vid video, .vp video"));
vs.forEach(function(v){v.addEventListener("play",function(){vs.forEach(function(o){if(o!==v)o.pause()})})});

/* ---------- lightbox ---------- */
var lb=document.getElementById("lb"),lbi=document.getElementById("lb-img"),lbx=document.getElementById("lb-x"),last=null;
function closeLb(){lb.hidden=true;if(last)last.focus()}
document.querySelectorAll("[data-full]").forEach(function(b){
  b.addEventListener("click",function(){last=b;lbi.src=b.getAttribute("data-full");lbi.alt=b.querySelector("img").alt;lb.hidden=false;lbx.focus()});
});
lbx.addEventListener("click",closeLb);
lb.addEventListener("click",function(e){if(e.target===lb)closeLb()});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!lb.hidden)closeLb()});

/* ---------- copy ---------- */
document.querySelectorAll(".copy").forEach(function(b){
  b.addEventListener("click",function(){
    var txt=b.getAttribute("data-copy"),done=function(){b.textContent="Copied";setTimeout(function(){b.textContent="Copy"},1600)};
    function fallback(){
      var v=b.parentNode.querySelector(".val"),rg=document.createRange();rg.selectNodeContents(v);
      var s=window.getSelection();s.removeAllRanges();s.addRange(rg);b.textContent="Selected";setTimeout(function(){b.textContent="Copy"},1600);
    }
    try{navigator.clipboard.writeText(txt).then(done,fallback)}catch(e){fallback()}
  });
});
})();

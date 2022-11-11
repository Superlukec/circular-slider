var p=Object.defineProperty;var f=(u,t,i)=>t in u?p(u,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):u[t]=i;var l=(u,t,i)=>(f(u,typeof t!="symbol"?t+"":t,i),i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function i(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(e){if(e.ep)return;e.ep=!0;const s=i(e);fetch(e.href,s)}})();class v{constructor(t,i,r){l(this,"radius");l(this,"width");l(this,"heigth");l(this,"sliders");l(this,"legend");l(this,"svg");l(this,"slidersInfo",[]);l(this,"sliderAngle",[]);l(this,"sliderRotationOffset",90);l(this,"mouseActive",!1);l(this,"calculateAngleBasedOnValue",t=>{let i=t.value*360/t.maxValue;return i===360&&(i=359),i});l(this,"calculateValueBasedOnAngle",(t,i)=>{let r=t.maxValue*i/360;return Math.ceil(r/t.step)*t.step});l(this,"generateArcForactivePath",(t,i,r,e)=>{let s=0,n=this.polarToCartesian(t,i,r,e),o=this.polarToCartesian(t,i,r,s),a=e-s<=180?0:1;return`
      M ${n.x} ${n.y}
      A ${r} ${r} 0 ${a} 0 ${o.x} ${o.y}
    `});l(this,"polarToCartesian",(t,i,r,e)=>{const s=e*(Math.PI/180);let n=t+r*Math.cos(s),o=i+r*Math.sin(s);return{x:n,y:o}});l(this,"sliderButtonCenterCalculate",(t,i)=>{const r=this.width/2+Math.cos(t)*i,e=this.heigth/2+Math.sin(t)*i;return{x:r,y:e}});l(this,"getMouseAngleInDegree",(t,i)=>{let e=Math.atan2(i-this.heigth/2,t-this.width/2)/(Math.PI/180)+this.sliderRotationOffset;return e<0&&(e=360-Math.abs(e)),e});l(this,"getMouseXY",t=>{let i=this.svg.getBoundingClientRect(),r=t.clientX,e=t.clientY;window.TouchEvent&&t instanceof TouchEvent&&(r=t.touches[0].clientX,e=t.touches[0].clientY);let s=r-i.left,n=e-i.top;return{x:s,y:n}});l(this,"mouseEventStart",(t,i=!1)=>{if(!i)this.mouseActive=!0;else if(!this.mouseActive)return;let r=this.getMouseXY(t),e=this.getMouseAngleInDegree(r.x,r.y),s=this.findSlider(r.x,r.y);this.sliderAngle[s]=e,this.sliders[s].value=this.calculateValueBasedOnAngle(this.sliders[s],e),this.draw()});l(this,"mouseEventEnd",()=>{this.mouseActive=!1});l(this,"drawLegend",()=>{let t="";return this.sliders.map(i=>{t+=`
        <div style="display: flex; align-items: center;">
          <div style="font-weight: bold; font-size: 2rem;">
            $${i.value}
          </div>
          <div style="margin-left: 15px; display: flex; align-items: end;">
            <div style="
                  width: 12px; height: 7px; background: ${i.color};"></div>
            <div style="margin-left: 10px; font-size: .7rem;">${i.name}</div>
          </div>
        </div>
      `}),t});l(this,"draw",()=>{let i=this.radius*2/this.sliders.length/2,r=this.sliders.length;this.legend.innerHTML=this.drawLegend(),this.svg.innerHTML="";let e=document.createElementNS("http://www.w3.org/2000/svg","defs");e.innerHTML=`
    <radialGradient id="radialGradient">
      <stop offset="0%" stop-color="white" />
      <stop offset="95%" stop-color="#e8e9e9" />
    </radialGradient>
    `,this.svg.appendChild(e);let s;this.sliders.map((n,o)=>{s=i*r,r--;const a=document.createElementNS("http://www.w3.org/2000/svg","g"),d=document.createElementNS("http://www.w3.org/2000/svg","circle");d.setAttribute("id",n.name),d.setAttribute("cx",""+this.width/2),d.setAttribute("cy",""+this.heigth/2),d.setAttribute("r",""+s),d.setAttribute("stroke-width","18"),d.setAttribute("stroke-dasharray","7 1"),d.setAttribute("stroke","#c1c1c1"),d.setAttribute("fill","transparent"),a.appendChild(d),this.slidersInfo.push(d);const c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("id",`progress-slider-${o}`),c.setAttribute("d",this.generateArcForactivePath(this.width/2,this.heigth/2,s,this.sliderAngle[o])),c.setAttribute("stroke-width","18"),c.setAttribute("stroke",n.color),c.setAttribute("opacity",".7"),c.setAttribute("fill","transparent"),a.appendChild(c);const g=document.createElementNS("http://www.w3.org/2000/svg","path");g.setAttribute("id",`progress-slider-${o}`),g.setAttribute("d",this.generateArcForactivePath(this.width/2,this.heigth/2,s,this.sliderAngle[o])),g.setAttribute("stroke-width","18"),g.setAttribute("stroke-dasharray","7 1"),g.setAttribute("stroke",n.color),g.setAttribute("fill","transparent"),a.appendChild(g);const m=this.sliderButtonCenterCalculate(this.sliderAngle[o]*(Math.PI*2/360),d.getAttribute("r")),h=document.createElementNS("http://www.w3.org/2000/svg","circle");h.setAttribute("cx",""+m.x),h.setAttribute("cy",""+m.y),h.setAttribute("r","13"),h.setAttribute("fill","url('#radialGradient')"),h.setAttribute("stroke-width","1"),h.setAttribute("stroke","#c8c8c8"),h.style.cursor="pointer",a.appendChild(h),this.svg.appendChild(a)})});const e=document.querySelector(t);if(!e){alert("Element not found");return}e.style.display="flex",this.radius=i,this.width=e.offsetWidth-200,this.heigth=this.width,this.sliders=[...r],this.legend=document.createElement("div"),this.legend.setAttribute("id","legend"),this.legend.style.width="200px",e.appendChild(this.legend);const s=document.createElement("div");s.style.textAlign="center";const n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("id","slider-holder"),n.setAttribute("width",""+this.width),n.setAttribute("height",""+this.heigth),n.setAttribute("transform",`rotate(-${this.sliderRotationOffset})`),n.addEventListener("mousedown",a=>{this.mouseEventStart(a)}),n.addEventListener("touchstart",a=>{this.mouseEventStart(a)}),n.addEventListener("mousemove",a=>{this.mouseEventStart(a,!0)}),n.addEventListener("touchmove",a=>{this.mouseEventStart(a,!0)}),window.addEventListener("mouseup",this.mouseEventEnd),window.addEventListener("touchend",this.mouseEventEnd),this.svg=n,e.appendChild(s),s.appendChild(this.svg);const o=document.createElement("div");o.innerHTML='<div style="font-style: italic; text-transform: uppercase; font-weight: bold;">Adjust dial to enter expenses</div>',s.appendChild(o),this.sliderAngle=r.map(a=>this.calculateAngleBasedOnValue(a))}findSlider(t,i){const r=Math.hypot(t-this.width/2,i-this.heigth/2);let e=1/0,s=-1;return this.slidersInfo.map((n,o)=>{let a=Math.abs(r-parseInt(n.getAttribute("r")||""));e>a&&(e=a,s=o)}),s}}let w=new v("#app",180,[{name:"Transportation",value:750,step:10,maxValue:1e3,minValue:0,color:"#6f508e"},{name:"Food",value:650,step:1,maxValue:1e3,minValue:0,color:"#1d8fc4"},{name:"Insurance",value:500,step:10,maxValue:1e3,minValue:0,color:"#5c9d31"},{name:"Entertainment",value:800,step:1,maxValue:1e3,minValue:0,color:"#d88227"},{name:"Health Care",value:200,step:100,maxValue:400,minValue:0,color:"#da5648"}]);w.draw();

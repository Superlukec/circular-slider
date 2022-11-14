var m = Object.defineProperty;
var w = (g, t, e) => t in g ? m(g, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : g[t] = e;
var l = (g, t, e) => (w(g, typeof t != "symbol" ? t + "" : t, e), e);
class A {
  constructor(t, e, s) {
    l(this, "radius");
    l(this, "width");
    l(this, "heigth");
    l(this, "sliders");
    l(this, "legend");
    l(this, "svg");
    l(this, "slidersInfo", []);
    l(this, "sliderAngle", []);
    l(this, "sliderRotationOffset", 90);
    l(this, "mouseActive", !1);
    l(this, "calculateAngleBasedOnValue", (t) => {
      let e = t.value * 360 / t.maxValue;
      return e === 360 && (e = 359), e;
    });
    l(this, "calculateValueBasedOnAngle", (t, e) => {
      let s = t.maxValue * e / 360;
      return Math.ceil(s / t.step) * t.step;
    });
    l(this, "generateArcForactivePath", (t, e, s, i) => {
      let r = 0, n = this.polarToCartesian(t, e, s, i), a = this.polarToCartesian(t, e, s, r), d = i - r <= 180 ? 0 : 1;
      return `
      M ${n.x} ${n.y}
      A ${s} ${s} 0 ${d} 0 ${a.x} ${a.y}
    `;
    });
    l(this, "polarToCartesian", (t, e, s, i) => {
      const r = i * (Math.PI / 180);
      let n = t + s * Math.cos(r), a = e + s * Math.sin(r);
      return { x: n, y: a };
    });
    l(this, "sliderButtonCenterCalculate", (t, e) => {
      const s = this.width / 2 + Math.cos(t) * e, i = this.heigth / 2 + Math.sin(t) * e;
      return { x: s, y: i };
    });
    l(this, "getMouseAngleInDegree", (t, e) => {
      let i = Math.atan2(e - this.heigth / 2, t - this.width / 2) / (Math.PI / 180) + this.sliderRotationOffset;
      return i < 0 && (i = 360 - Math.abs(i)), i;
    });
    l(this, "getMouseXY", (t) => {
      let e = this.svg.getBoundingClientRect(), s = t.clientX, i = t.clientY;
      window.TouchEvent && t instanceof TouchEvent && (s = t.touches[0].clientX, i = t.touches[0].clientY);
      let r = s - e.left, n = i - e.top;
      return { x: r, y: n };
    });
    l(this, "mouseEventStart", (t, e = !1) => {
      if (!e)
        this.mouseActive = !0;
      else if (!this.mouseActive)
        return;
      let s = this.getMouseXY(t), i = this.getMouseAngleInDegree(s.x, s.y), r = this.findSlider(s.x, s.y);
      this.sliderAngle[r] = i, this.sliders[r].value = this.calculateValueBasedOnAngle(this.sliders[r], i), this.draw();
    });
    l(this, "mouseEventEnd", () => {
      this.mouseActive = !1;
    });
    l(this, "drawLegend", () => {
      let t = "";
      return this.sliders.map((e) => {
        t += `
        <div style="display: flex; align-items: center;">
          <div style="font-weight: bold; font-size: 2rem;">
            $${e.value}
          </div>
          <div style="margin-left: 15px; display: flex; align-items: end;">
            <div style="
                  width: 12px; height: 7px; background: ${e.color};"></div>
            <div style="margin-left: 10px; font-size: .7rem;">${e.name}</div>
          </div>
        </div>
      `;
      }), t;
    });
    l(this, "draw", () => {
      let e = this.radius * 2 / this.sliders.length / 2, s = this.sliders.length;
      this.legend.innerHTML = this.drawLegend(), this.svg.innerHTML = "";
      let i = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      i.innerHTML = `
    <radialGradient id="radialGradient">
      <stop offset="0%" stop-color="white" />
      <stop offset="95%" stop-color="#e8e9e9" />
    </radialGradient>
    `, this.svg.appendChild(i);
      let r;
      this.sliders.map((n, a) => {
        r = e * s, s--;
        const d = document.createElementNS("http://www.w3.org/2000/svg", "g"), h = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        h.setAttribute("id", n.name), h.setAttribute("cx", "" + this.width / 2), h.setAttribute("cy", "" + this.heigth / 2), h.setAttribute("r", "" + r), h.setAttribute("stroke-width", "18"), h.setAttribute("stroke-dasharray", "7 1"), h.setAttribute("stroke", "#c1c1c1"), h.setAttribute("fill", "transparent"), d.appendChild(h), this.slidersInfo.push(h);
        const u = document.createElementNS("http://www.w3.org/2000/svg", "path");
        u.setAttribute("id", `progress-slider-${a}`), u.setAttribute("d", this.generateArcForactivePath(this.width / 2, this.heigth / 2, r, this.sliderAngle[a])), u.setAttribute("stroke-width", "18"), u.setAttribute("stroke", n.color), u.setAttribute("opacity", ".7"), u.setAttribute("fill", "transparent"), d.appendChild(u);
        const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
        c.setAttribute("id", `progress-slider-${a}`), c.setAttribute("d", this.generateArcForactivePath(this.width / 2, this.heigth / 2, r, this.sliderAngle[a])), c.setAttribute("stroke-width", "18"), c.setAttribute("stroke-dasharray", "7 1"), c.setAttribute("stroke", n.color), c.setAttribute("fill", "transparent"), d.appendChild(c);
        const p = this.sliderButtonCenterCalculate(this.sliderAngle[a] * (Math.PI * 2 / 360), h.getAttribute("r")), o = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        o.setAttribute("cx", "" + p.x), o.setAttribute("cy", "" + p.y), o.setAttribute("r", "13"), o.setAttribute("fill", "url('#radialGradient')"), o.setAttribute("stroke-width", "1"), o.setAttribute("stroke", "#c8c8c8"), o.style.cursor = "pointer", d.appendChild(o), this.svg.appendChild(d);
      });
    });
    const i = document.querySelector(t);
    if (!i) {
      alert("Element not found");
      return;
    }
    i.style.display = "flex", this.radius = e, this.width = i.offsetWidth - 200, this.heigth = this.width, this.sliders = [...s], this.legend = document.createElement("div"), this.legend.setAttribute("id", "legend"), this.legend.style.width = "200px", i.appendChild(this.legend);
    const r = document.createElement("div");
    r.style.textAlign = "center";
    const n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    n.setAttribute("id", "slider-holder"), n.setAttribute("width", "" + this.width), n.setAttribute("height", "" + this.heigth), n.setAttribute("transform", `rotate(-${this.sliderRotationOffset})`), n.addEventListener("mousedown", (d) => {
      this.mouseEventStart(d);
    }), n.addEventListener("touchstart", (d) => {
      this.mouseEventStart(d);
    }), n.addEventListener("mousemove", (d) => {
      this.mouseEventStart(d, !0);
    }), n.addEventListener("touchmove", (d) => {
      this.mouseEventStart(d, !0);
    }), window.addEventListener("mouseup", this.mouseEventEnd), window.addEventListener("touchend", this.mouseEventEnd), this.svg = n, i.appendChild(r), r.appendChild(this.svg);
    const a = document.createElement("div");
    a.innerHTML = '<div style="font-style: italic; text-transform: uppercase; font-weight: bold;">Adjust dial to enter expenses</div>', r.appendChild(a), this.sliderAngle = s.map((d) => this.calculateAngleBasedOnValue(d));
  }
  findSlider(t, e) {
    const s = Math.hypot(t - this.width / 2, e - this.heigth / 2);
    let i = 1 / 0, r = -1;
    return this.slidersInfo.map((n, a) => {
      let d = Math.abs(s - parseInt(n.getAttribute("r") || ""));
      i > d && (i = d, r = a);
    }), r;
  }
}
export {
  A as Slider
};

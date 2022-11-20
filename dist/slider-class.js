var m = Object.defineProperty;
var v = (g, t, i) => t in g ? m(g, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : g[t] = i;
var n = (g, t, i) => (v(g, typeof t != "symbol" ? t + "" : t, i), i);
class A {
  constructor(t, i, s) {
    n(this, "radius");
    n(this, "width");
    n(this, "heigth");
    n(this, "sliders");
    n(this, "legend");
    n(this, "svg");
    n(this, "slidersInfo", []);
    n(this, "sliderAngle", []);
    n(this, "sliderRotationOffset", 90);
    n(this, "mouseActive", !1);
    n(this, "calculateAngleBasedOnValue", (t) => {
      let i = 360, s = t.maxValue, e = t.value;
      (t == null ? void 0 : t.minValue) > 0 && (s -= t.minValue, e -= t.minValue);
      let r = e * i / s;
      return r === 360 && (r = 359), r;
    });
    n(this, "calculateValueBasedOnAngle", (t, i) => {
      let s = 360, e = t.maxValue;
      (t == null ? void 0 : t.minValue) > 0 && (e -= t.minValue);
      let r = e * i / s;
      return r += t.minValue, Math.ceil(r / t.step) * t.step;
    });
    n(this, "generateArcForactivePath", (t, i, s, e) => {
      let r = 0, l = this.polarToCartesian(t, i, s, e), d = this.polarToCartesian(t, i, s, r), a = e - r <= 180 ? 0 : 1;
      return `
      M ${l.x} ${l.y}
      A ${s} ${s} 0 ${a} 0 ${d.x} ${d.y}
    `;
    });
    n(this, "polarToCartesian", (t, i, s, e) => {
      const r = e * (Math.PI / 180);
      let l = t + s * Math.cos(r), d = i + s * Math.sin(r);
      return { x: l, y: d };
    });
    n(this, "sliderButtonCenterCalculate", (t, i) => {
      const s = this.width / 2 + Math.cos(t) * i, e = this.heigth / 2 + Math.sin(t) * i;
      return { x: s, y: e };
    });
    n(this, "getMouseAngleInDegree", (t, i) => {
      let e = Math.atan2(i - this.heigth / 2, t - this.width / 2) / (Math.PI / 180) + this.sliderRotationOffset;
      return e < 0 && (e = 360 - Math.abs(e)), e;
    });
    n(this, "getMouseXY", (t) => {
      let i = this.svg.getBoundingClientRect(), s = t.clientX, e = t.clientY;
      window.TouchEvent && t instanceof TouchEvent && (s = t.touches[0].clientX, e = t.touches[0].clientY);
      let r = s - i.left, l = e - i.top;
      return { x: r, y: l };
    });
    n(this, "mouseEventStart", (t, i = !1) => {
      if (!i)
        this.mouseActive = !0;
      else if (!this.mouseActive)
        return;
      let s = this.getMouseXY(t), e = this.getMouseAngleInDegree(s.x, s.y), r = this.findSlider(s.x, s.y);
      this.sliderAngle[r] = e, this.sliders[r].value = this.calculateValueBasedOnAngle(this.sliders[r], e), this.draw();
    });
    n(this, "mouseEventEnd", () => {
      this.mouseActive = !1;
    });
    n(this, "drawLegend", () => {
      let t = '<div style="display:grid; grid-template-columns: 90px 1fr;">';
      return this.sliders.map((i) => {
        t += `
          <div style="font-weight: bold; font-size: 2rem;">
            $${i.value}
          </div>
          <div style="margin-left: 15px; display: flex; align-items: end;">
            <div style="
                  width: 12px; height: 7px; background: ${i.color};"></div>
            <div style="margin-left: 10px; font-size: .7rem;">${i.name}</div>
          </div>
      `;
      }), t += "</div>", t;
    });
    n(this, "draw", () => {
      let i = this.radius * 2 / this.sliders.length / 2, s = this.sliders.length;
      this.legend.innerHTML = this.drawLegend(), this.svg.innerHTML = "";
      let e = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      e.innerHTML = `
    <radialGradient id="radialGradient">
      <stop offset="0%" stop-color="white" />
      <stop offset="95%" stop-color="#e8e9e9" />
    </radialGradient>
    `, this.svg.appendChild(e);
      let r;
      this.sliders.map((l, d) => {
        r = i * s, s--;
        const a = document.createElementNS("http://www.w3.org/2000/svg", "g"), h = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        h.setAttribute("id", l.name), h.setAttribute("cx", "" + this.width / 2), h.setAttribute("cy", "" + this.heigth / 2), h.setAttribute("r", "" + r), h.setAttribute("stroke-width", "18"), h.setAttribute("stroke-dasharray", "7 1"), h.setAttribute("stroke", "#c1c1c1"), h.setAttribute("fill", "transparent"), a.appendChild(h), this.slidersInfo.push(h);
        const u = document.createElementNS("http://www.w3.org/2000/svg", "path");
        u.setAttribute("id", `progress-slider-${d}`), u.setAttribute("d", this.generateArcForactivePath(this.width / 2, this.heigth / 2, r, this.sliderAngle[d])), u.setAttribute("stroke-width", "18"), u.setAttribute("stroke", l.color), u.setAttribute("opacity", ".7"), u.setAttribute("fill", "transparent"), a.appendChild(u);
        const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
        c.setAttribute("id", `progress-slider-${d}`), c.setAttribute("d", this.generateArcForactivePath(this.width / 2, this.heigth / 2, r, this.sliderAngle[d])), c.setAttribute("stroke-width", "18"), c.setAttribute("stroke-dasharray", "7 1"), c.setAttribute("stroke", l.color), c.setAttribute("fill", "transparent"), a.appendChild(c);
        const p = this.sliderButtonCenterCalculate(this.sliderAngle[d] * (Math.PI * 2 / 360), h.getAttribute("r")), o = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        o.setAttribute("cx", "" + p.x), o.setAttribute("cy", "" + p.y), o.setAttribute("r", "13"), o.setAttribute("fill", "url('#radialGradient')"), o.setAttribute("stroke-width", "1"), o.setAttribute("stroke", "#c8c8c8"), o.style.cursor = "pointer", a.appendChild(o), this.svg.appendChild(a);
      });
    });
    const e = document.querySelector(t);
    if (!e) {
      alert("Element not found");
      return;
    }
    e.style.display = "flex", this.radius = i, this.width = e.offsetWidth - 200, this.heigth = this.width, this.sliders = [...s], this.legend = document.createElement("div"), this.legend.setAttribute("id", "legend"), this.legend.style.width = "200px", e.appendChild(this.legend);
    const r = document.createElement("div");
    r.style.textAlign = "center";
    const l = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    l.setAttribute("id", "slider-holder"), l.setAttribute("width", "" + this.width), l.setAttribute("height", "" + this.heigth), l.setAttribute("transform", `rotate(-${this.sliderRotationOffset})`), l.addEventListener("mousedown", (a) => {
      this.mouseEventStart(a);
    }), l.addEventListener("touchstart", (a) => {
      this.mouseEventStart(a);
    }), l.addEventListener("mousemove", (a) => {
      this.mouseEventStart(a, !0);
    }), l.addEventListener("touchmove", (a) => {
      this.mouseEventStart(a, !0);
    }), window.addEventListener("mouseup", this.mouseEventEnd), window.addEventListener("touchend", this.mouseEventEnd), this.svg = l, e.appendChild(r), r.appendChild(this.svg);
    const d = document.createElement("div");
    d.innerHTML = '<div style="font-style: italic; text-transform: uppercase; font-weight: bold;">Adjust dial to enter expenses</div>', r.appendChild(d), this.sliderAngle = s.map((a) => this.calculateAngleBasedOnValue(a));
  }
  findSlider(t, i) {
    const s = Math.hypot(t - this.width / 2, i - this.heigth / 2);
    let e = 1 / 0, r = -1;
    return this.slidersInfo.map((l, d) => {
      let a = Math.abs(s - parseInt(l.getAttribute("r") || ""));
      e > a && (e = a, r = d);
    }), r;
  }
}
export {
  A as Slider
};

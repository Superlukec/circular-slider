interface SliderVariable {
  name: string;
  value: number;
  color: string;
  maxValue: number;
  minValue: number;
  step: number;
}

interface Coordinates {
  x: number;
  y: number;
}

export class Slider {

  private radius!: number;
  private width!: number;
  private heigth!: number
  private sliders!: SliderVariable[];

  private legend!: HTMLDivElement;
  private svg!: SVGElement;
  private slidersInfo: SVGElement[] = [];
  private sliderAngle: number[] = [];
  private sliderRotationOffset: number = 90;
  private mouseActive: boolean = false;

  constructor(
    container: string,
    radius: number,
    sliders: SliderVariable[]) {

    // main container for the whole container
    const containerDOM: HTMLDivElement | null = document.querySelector<HTMLDivElement>(container);
    if (!containerDOM) {
      alert('Element not found');
      return;
    }

    containerDOM.style.display = 'flex';

    this.radius = radius;
    this.width = containerDOM.offsetWidth - 200;
    this.heigth = this.width;
    this.sliders = [...sliders];

    // holder for the legend
    this.legend = document.createElement('div');
    this.legend.setAttribute('id', 'legend');
    this.legend.style.width = '200px';

    containerDOM!.appendChild(this.legend);

    const svgHolder = document.createElement('div');
    svgHolder.style.textAlign = 'center';
    
    // we prepare the SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'slider-holder')
    svg.setAttribute('width', "" + this.width)
    svg.setAttribute('height', "" + this.heigth)    
    svg.setAttribute('transform', `rotate(-${this.sliderRotationOffset})`);

    // mouse and touch events
    svg.addEventListener('mousedown', (evt) => {this.mouseEventStart(evt)})
    svg.addEventListener('touchstart', (evt) => {this.mouseEventStart(evt)})
    svg.addEventListener('mousemove', (evt) => {this.mouseEventStart(evt, true)})
    svg.addEventListener('touchmove', (evt) => {this.mouseEventStart(evt, true)})
    window.addEventListener('mouseup', this.mouseEventEnd);
    window.addEventListener('touchend', this.mouseEventEnd);

    this.svg = svg;

    containerDOM!.appendChild(svgHolder);
    svgHolder.appendChild(this.svg)

    // we add the text behind the slider
    const textLabel = document.createElement('div');
    textLabel.innerHTML = `<div style="font-style: italic; text-transform: uppercase; font-weight: bold;">Adjust dial to enter expenses</div>`;
    svgHolder.appendChild(textLabel)

    this.sliderAngle = sliders.map((s) => {
      return this.calculateAngleBasedOnValue(s); //Math.floor(Math.random() * 260 + 50);
    })

  }

  // helper function - get angle based on the value
  calculateAngleBasedOnValue = (s: SliderVariable) => {

    let fullCircle = 360;
    let maxVal = s.maxValue;
    let value = s.value;

    if (s?.minValue > 0) {
      // if MIN value we calculate the right value
      maxVal -= s.minValue; 
      value -= s.minValue;
    }

    let angle = value * fullCircle / maxVal;

    if (angle === 360) angle = 359;

    return angle;
  }

  // helper function  - get the value based on the angle
  calculateValueBasedOnAngle = (s: SliderVariable, angle: number):number => {

      let fullCircle = 360;
      let maxVal = s.maxValue;

      if (s?.minValue > 0) {
        // if MIN value we calculate the right value
        maxVal -= s.minValue; 
      }

      let calculateValue = (maxVal * angle / fullCircle)
      calculateValue += s.minValue;

      let calculatedValueWithStep = Math.ceil(calculateValue / s.step) * s.step;

      return calculatedValueWithStep;
  }

  // progress slider arc generator
  private generateArcForactivePath = (x: number, y: number, radius: number, endAngle: number) => {
    let startAngle = 0;

    let start = this.polarToCartesian(x, y, radius, endAngle)
    let end = this.polarToCartesian(x, y, radius, startAngle)
    let largeArcFlag = (endAngle - startAngle <= 180) ? 0 : 1;

    return `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
    `
  }

  // Converts a polar coordinate (r,theta) to cartesian (x,y).
  private polarToCartesian = (centerX: number, centerY: number, radius: number, angleDegree: number): Coordinates => {

    const theta = (angleDegree) * (Math.PI / 180);

    let x = centerX + (radius * Math.cos(theta));
    let y = centerY + (radius * Math.sin(theta));

    return { x, y }
  }

  // Converts a polar coordinate
  private sliderButtonCenterCalculate = (angle: number, r: number): Coordinates => {
    const x = this.width / 2 + Math.cos(angle) * r;
    const y = this.heigth / 2 + Math.sin(angle) * r;
    return { x, y };
  }

  // based on the coordinates X and Y we get angle in degree
  private getMouseAngleInDegree = (x: number, y: number): number => {
    // we get the mouse angle
    let angle = Math.atan2(y - this.heigth / 2, x - this.width / 2);
    let degrees = angle / (Math.PI / 180) + this.sliderRotationOffset;

    if (degrees < 0) degrees = 360 - Math.abs(degrees);

    return degrees;
  }

  // we get mouse X,Y position on the SVG
  private getMouseXY = (evt: any): Coordinates => {

    let dim = this.svg.getBoundingClientRect();

    // we get mouse event coordinates
    let clientX = evt.clientX;
    let clientY = evt.clientY;

    // if touch event
    if (window.TouchEvent && evt instanceof TouchEvent) {
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    }

    let x = clientX - dim.left;
    let y = clientY - dim.top;

    return { x, y }
  }

  // we catch mouse down and mouse move event
  private mouseEventStart = (evt: any, mouseMoveEvent: boolean = false) => {

    if (!mouseMoveEvent) {
      this.mouseActive = true;
    } else {
      if (!this.mouseActive) {
        return;
      }
    }

    let mouseCoordinates = this.getMouseXY(evt);

    let degrees = this.getMouseAngleInDegree(mouseCoordinates.x, mouseCoordinates.y);
    let sliderIndex = this.findSlider(mouseCoordinates.x, mouseCoordinates.y);

    // we save the info about the current slider position
    this.sliderAngle[sliderIndex] = degrees;
    this.sliders[sliderIndex].value = this.calculateValueBasedOnAngle(this.sliders[sliderIndex], degrees);

    this.draw();

  }
  
  private mouseEventEnd = () => {
    this.mouseActive = false;
  }

  // based on the coordinates we find the index number of the slider
  private findSlider(x: number, y: number): number {
    const distanceFromCenter = Math.hypot(x - this.width / 2, y - this.heigth / 2);

    let shortestDistance = Infinity;
    let selectedSlider = -1;
    this.slidersInfo.map((s, i) => {

      let distance = Math.abs(distanceFromCenter - parseInt(s.getAttribute('r') || ''));

      if (shortestDistance > distance) {
        shortestDistance = distance;
        selectedSlider = i;
      }

    });

    return selectedSlider;
  }

  // we prepare the legend
  drawLegend = () => {    

    let elements = '<div style="display:grid; grid-template-columns: 90px 1fr;">';

    this.sliders.map((s) => {
      elements += `
          <div style="font-weight: bold; font-size: 2rem;">
            $${s.value}
          </div>
          <div style="margin-left: 15px; display: flex; align-items: end;">
            <div style="
                  width: 12px; height: 7px; background: ${s.color};"></div>
            <div style="margin-left: 10px; font-size: .7rem;">${s.name}</div>
          </div>
      `;
    })

    elements += '</div>';

    return elements;
  }

  // main function for drawing sliders
  draw = () => {

    // we calculate the space and size between sliders
    let fullCircle = this.radius * 2;
    let sliderCircleSpace = (fullCircle / this.sliders.length) / 2;
    let sliderCounter = this.sliders.length;
        
    this.legend.innerHTML = this.drawLegend(); 


    // we reset the view
    this.svg.innerHTML = '';

    // gradient definition for the buttons
    let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
    <radialGradient id="radialGradient">
      <stop offset="0%" stop-color="white" />
      <stop offset="95%" stop-color="#e8e9e9" />
    </radialGradient>
    `

    this.svg.appendChild(defs)

    // space between sliders
    let radius;

    // we iterate sliders
    this.sliders.map((s: SliderVariable, i: number) => {

      radius = sliderCircleSpace * sliderCounter;
      sliderCounter--;

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      // we draw the slider background
      const slider: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      slider.setAttribute('id', s.name)
      slider.setAttribute('cx', "" + this.width / 2);
      slider.setAttribute('cy', "" + this.heigth / 2);
      slider.setAttribute('r', "" + radius);
      slider.setAttribute('stroke-width', '18');
      slider.setAttribute('stroke-dasharray', '7 1');
      slider.setAttribute('stroke', '#c1c1c1');
      slider.setAttribute('fill', 'transparent');
      
      group.appendChild(slider);

      // we store information about the slider
      this.slidersInfo.push(slider);

      // we draw active path
      const activePathBackground: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      activePathBackground.setAttribute('id', `progress-slider-${i}`);
      activePathBackground.setAttribute('d', this.generateArcForactivePath(this.width / 2, this.heigth / 2, radius, this.sliderAngle[i]))
      activePathBackground.setAttribute('stroke-width', '18');
      activePathBackground.setAttribute('stroke', s.color);
      activePathBackground.setAttribute('opacity', '.7');
      activePathBackground.setAttribute('fill', 'transparent');
      
      group.appendChild(activePathBackground);

      const activePath: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      activePath.setAttribute('id', `progress-slider-${i}`);
      activePath.setAttribute('d', this.generateArcForactivePath(this.width / 2, this.heigth / 2, radius, this.sliderAngle[i]))
      activePath.setAttribute('stroke-width', '18');
      activePath.setAttribute('stroke-dasharray', '7 1');
      activePath.setAttribute('stroke', s.color);
      activePath.setAttribute('fill', 'transparent');
      
      group.appendChild(activePath);

      // we calculate the center of the button
      const sliderButtonLocation = this.sliderButtonCenterCalculate(this.sliderAngle[i] * ((Math.PI * 2) / 360), <any>slider.getAttribute('r'));

      // we add slider button on top of the slider path
      const sliderButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      sliderButton.setAttribute('cx', "" + sliderButtonLocation.x);
      sliderButton.setAttribute('cy', "" + sliderButtonLocation.y);
      sliderButton.setAttribute('r', '13');
      sliderButton.setAttribute('fill', `url('#radialGradient')`);
      sliderButton.setAttribute('stroke-width', '1');
      sliderButton.setAttribute('stroke', '#c8c8c8');
      sliderButton.style.cursor = 'pointer';

      group.appendChild(sliderButton);

      this.svg.appendChild(group);
    })


  }
}
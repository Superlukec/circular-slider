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

  private container!: string;
  private radius!: number;
  private width!: number;
  private heigth!: number
  private sliders!: SliderVariable[];

  private legend!: HTMLDivElement;
  private svg!: SVGElement;
  private slidersInfo: SVGElement[] = [];
  private sliderAngle: number[] = [];
  private activeSlider!: number;
  private sliderRotationOffset: number = 90;
  private mouseActive: boolean = false;

  constructor(
    container: string,
    radius: number,
    sliders: SliderVariable[]) {

    const containerDOM: HTMLDivElement | null = document.querySelector<HTMLDivElement>(container);
    if (!containerDOM) {
      alert('Element not found');
      return;
    }

    containerDOM.style.display = 'flex';

    this.container = container;
    this.radius = radius;
    this.width = containerDOM.offsetWidth - 200;
    this.heigth = containerDOM.offsetHeight;
    this.sliders = [...sliders];

    this.legend = document.createElement('div');
    this.legend.setAttribute('id', 'legend');
    this.legend.style.width = '200px';


    containerDOM!.appendChild(this.legend);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'slider-holder')
    svg.setAttribute('width', "" + this.width)
    svg.setAttribute('height', "" + this.heigth)    
    svg.setAttribute('transform', `rotate(-${this.sliderRotationOffset})`);

    svg.addEventListener('mousedown', this.mouseEventStart)
    svg.addEventListener('touchstart', this.mouseEventStart)
    svg.addEventListener('mousemove', this.mouseMove)
    svg.addEventListener('touchmove', this.mouseMove)
    window.addEventListener('mouseup', this.mouseEventEnd);
    window.addEventListener('touchend', this.mouseEventEnd);

    this.svg = svg;

    containerDOM!.appendChild(this.svg);

    this.sliderAngle = sliders.map((s) => {
      return this.calculateAngleBasedOnValue(s); //Math.floor(Math.random() * 260 + 50);
    })

  }

  calculateAngleBasedOnValue = (s: SliderVariable) => {

    let angle = s.value * 360 / s.maxValue;

    if (angle === 360) angle = 359;

    return angle;
  }

  calculateValueBasedOnAngle = (s: SliderVariable, angle: number):number => {
      return Math.ceil(s.maxValue * angle / 360);
  }

  // progress slider
  private generateArcForActiveSlider = (x: number, y: number, radius: number, endAngle: number) => {
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
  private sliderButtonCenter = (angle: number, r: number): Coordinates => {
    const x = this.width / 2 + Math.cos(angle) * r;
    const y = this.heigth / 2 + Math.sin(angle) * r;
    return { x, y };
  }

  private getMouseAngleInDegree = (x: number, y: number): number => {
    // we get mouse angle
    let angle = Math.atan2(y - this.heigth / 2, x - this.width / 2);
    let degrees = angle / (Math.PI / 180) + this.sliderRotationOffset;

    if (degrees < 0) degrees = 360 - Math.abs(degrees);

    return degrees;
  }

  private getMouseXY = (evt: any): Coordinates => {

    let e: any = evt.target;
    let dim = this.svg.getBoundingClientRect();

    // we get mouse event coordinates
    let clientX = evt.clientX;
    let clientY = evt.clientY;

    // if touch event
    if (window.TouchEvent && evt instanceof TouchEvent) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    let x = clientX - dim.left;
    let y = clientY - dim.top;

    return { x, y }
  }

  private mouseEventStart = (evt: any) => {

    this.mouseActive = true;

    let mouseCoordinates = this.getMouseXY(evt);

    let degrees = this.getMouseAngleInDegree(mouseCoordinates.x, mouseCoordinates.y);

    this.sliderAngle[this.findSlider(mouseCoordinates.x, mouseCoordinates.y)] = degrees;

    console.log(this.calculateValueBasedOnAngle(this.sliders[this.findSlider(mouseCoordinates.x, mouseCoordinates.y)], degrees))
    console.log('radius', this.findSlider(mouseCoordinates.x, mouseCoordinates.y), this.slidersInfo[this.findSlider(mouseCoordinates.x, mouseCoordinates.y)])

    this.draw();


  }

  private mouseMove = (evt: any) => {
    if (!this.mouseActive) {
      return;
    }

    let mouseCoordinates = this.getMouseXY(evt);

    let degrees = this.getMouseAngleInDegree(mouseCoordinates.x, mouseCoordinates.y);

    this.sliderAngle[this.activeSlider] = degrees;

    this.draw();
  }

  private mouseEventEnd = () => {
    this.mouseActive = false;
  }

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

    this.activeSlider = selectedSlider;
    return selectedSlider;
  }

  draw = () => {

    let fullCircle = this.radius * 2;

    let sliderCircleSpace = (fullCircle / this.sliders.length) / 2;
    let sliderCounter = this.sliders.length;

    /*
    this.sliders.map((s: SliderVariable) => {
      console.log(smaller * tmp)
      tmp--;
    })*/


    /*
    let calculateDistance = 0;

    this.sliders.length
    this.width*/

    let elements = '';

    this.sliders.map((s) => {
      elements += '<li>' + s.name + '</li>'
    })
    
    this.legend.innerHTML = `
      <ul>
        ${elements}
      </ul>
    `;
  


    // we reset the view
    this.svg.innerHTML = '';

    // gradient definition
    let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
    <radialGradient id="radialGradient">
      <stop offset="0%" stop-color="white" />
      <stop offset="95%" stop-color="#e8e9e9" />
    </radialGradient>
    `

    this.svg.appendChild(defs)

    // space between sliders
    let stepper = 0;

    // we iterate sliders
    this.sliders.map((s: SliderVariable, i: number) => {

      stepper = sliderCircleSpace * sliderCounter;
      sliderCounter--;

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      const slider: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      slider.setAttribute('id', s.name)
      slider.setAttribute('cx', "" + this.width / 2);
      slider.setAttribute('cy', "" + this.heigth / 2);
      slider.setAttribute('r', "" + stepper);
      slider.setAttribute('stroke-width', '18');
      slider.setAttribute('stroke-dasharray', '7 1');
      slider.setAttribute('stroke', '#c1c1c1');
      slider.setAttribute('fill', 'transparent');

      this.slidersInfo.push(slider);
      group.appendChild(slider);


      const activeSliderBg: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      activeSliderBg.setAttribute('id', `progress-slider-${i}`);
      activeSliderBg.setAttribute('d', this.generateArcForActiveSlider(this.width / 2, this.heigth / 2, stepper, this.sliderAngle[i]))
      activeSliderBg.setAttribute('stroke-width', '18');
      activeSliderBg.setAttribute('stroke', s.color);
      activeSliderBg.setAttribute('opacity', '.7');
      activeSliderBg.setAttribute('fill', 'transparent');
      group.appendChild(activeSliderBg);

      const activeSlider: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      activeSlider.setAttribute('id', `progress-slider-${i}`);
      activeSlider.setAttribute('d', this.generateArcForActiveSlider(this.width / 2, this.heigth / 2, stepper, this.sliderAngle[i]))
      activeSlider.setAttribute('stroke-width', '18');
      activeSlider.setAttribute('stroke-dasharray', '7 1');
      activeSlider.setAttribute('stroke', s.color);
      activeSlider.setAttribute('fill', 'transparent');
      group.appendChild(activeSlider);

      const sliderButtonLocation = this.sliderButtonCenter(this.sliderAngle[i] * ((Math.PI * 2) / 360), <any>slider.getAttribute('r'));

      const sliderButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      sliderButton.setAttribute('cx', "" + sliderButtonLocation.x);
      sliderButton.setAttribute('cy', "" + sliderButtonLocation.y);
      sliderButton.setAttribute('r', '13');
      sliderButton.setAttribute('fill', `url('#radialGradient')`);
      sliderButton.setAttribute('stroke-width', '1');
      sliderButton.setAttribute('stroke', '#c8c8c8');
      group.appendChild(sliderButton);

      this.svg.appendChild(group);

      //stepper -= 40;
    })


  }
}
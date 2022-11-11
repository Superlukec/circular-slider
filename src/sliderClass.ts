interface SliderVariable {
  name: string;
  value: number;
  color: string;
  maxValue?: number;
  minValue?: number;
  step?: number;
}

interface Coordinates {
  x: number;
  y: number;
}

export class Slider {

  container: string;
  radius!: number;
  width: number;
  heigth: number
  sliders: SliderVariable[];

  private svg!: SVGElement;
  private slidersInfo: SVGElement[] = [];
  private activeSlider!: SVGElement;
  private sliderRotationOffset: number = 90;

  constructor(
    container: string,
    // radius: number,
    width: number,
    height: number,
    sliders: SliderVariable[]) {
    this.container = container;
    this.width = width;
    this.heigth = height;
    this.sliders = [...sliders];
  }

  // progress slider
  generateArcForProgressSlider = (x: number, y: number, radius: number) => {    
    let startAngle = 0;
    let endAngle = 180;

    let start = this.polarToCartesian(x, y, radius, endAngle)
    let end = this.polarToCartesian(x, y, radius, startAngle)
    let largeArcFlag = (endAngle - startAngle <= 180) ? 0 : 1;

    return `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
    `
  }

  // Converts a polar coordinate (r,theta) to cartesian (x,y).
  polarToCartesian = (centerX: number, centerY: number, radius: number, angleDegree: number): Coordinates => {

    const theta = (angleDegree) * (Math.PI / 180);

    let x = centerX + (radius * Math.cos(theta));
    let y = centerY + (radius * Math.sin(theta));

    return { x, y }
  }

  // Converts a polar coordinate
  sliderButtonCenter = (angle: number, r: number): Coordinates => {
    const x = this.width / 2 + Math.cos(angle) * r;
    const y = this.heigth / 2 + Math.sin(angle) * r;
    return { x, y };
  }

  draw = () => {

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'slider-holder')
    svg.setAttribute('width', "" + this.heigth)
    svg.setAttribute('height', "" + this.heigth)
    svg.style.background = '#eee';
    svg.setAttribute('transform', `rotate(-${this.sliderRotationOffset})`);

    svg.addEventListener('mousedown', this.mouseEvent)
    svg.addEventListener('touchstart', this.mouseEvent)

    this.svg = svg;

    let stepper = this.sliders.length * 40 + 20;
    let stepperCircle = 20;

    // we iterate sliders
    this.sliders.map((s: SliderVariable, i: number) => {


      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      const slider: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      slider.setAttribute('id', s.name)
      slider.setAttribute('cx', "" + this.width / 2);
      slider.setAttribute('cy', "" + this.heigth / 2);
      slider.setAttribute('r', stepper.toString());
      slider.setAttribute('stroke-width', '18');
      slider.setAttribute('stroke-dasharray', '7 1');
      slider.setAttribute('stroke', 'lightgray');
      slider.setAttribute('fill', 'transparent');

      this.slidersInfo.push(slider);
      group.appendChild(slider);


      const progressSlider: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      progressSlider.setAttribute('id', `progress-slider-${i}`);
      progressSlider.setAttribute('d', this.generateArcForProgressSlider(this.width / 2, this.heigth / 2, stepper))
      progressSlider.setAttribute('stroke-width', '18');
      progressSlider.setAttribute('stroke-dasharray', '7 1');
      progressSlider.setAttribute('stroke', s.color);
      progressSlider.setAttribute('fill', 'transparent');

      group.appendChild(progressSlider);

      const sliderButtonLocation = this.sliderButtonCenter(180 * ((Math.PI * 2) / 360), <any>slider.getAttribute('r'));

      const sliderButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      sliderButton.setAttribute('cx', "" + sliderButtonLocation.x);
      sliderButton.setAttribute('cy', "" + sliderButtonLocation.y);
      sliderButton.setAttribute('r', '13');
      sliderButton.setAttribute('fill', 'white');
      sliderButton.setAttribute('stroke-width', '1');
      sliderButton.setAttribute('stroke', 'gray');
      group.appendChild(sliderButton);

      svg.appendChild(group);

      stepper -= 40
      stepperCircle += 40
    })

    document.querySelector<HTMLDivElement>(this.container)!.appendChild(svg);
  }

  private mouseEvent = (evt: any): Coordinates | null => {
    var e: any = evt.target;

    var dim = this.svg.getBoundingClientRect();

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


    // we get mouse angle
    let angle = Math.atan2(y - this.heigth / 2, x - this.width / 2);    
    let degrees = angle / (Math.PI / 180) + this.sliderRotationOffset;
    console.log(degrees)

    if (angle > - (Math.PI * 2) / 2 && angle < - (Math.PI * 2) / 4) 
    {
        angle = angle + (Math.PI * 2) * 1.25;
    } 
    else 
    {
        angle = angle + (Math.PI * 2) * 0.25;
    }

    //console.log(id, x, y, 'Kot ' + angle * 0.999)
    this.findSlider(x, y);

    return {x, y}
  }

  private findSlider(x: number, y: number) {
    const distanceFromCenter = Math.hypot(x - this.width/2, y - this.heigth/2);
    
    let shortestDistance = Infinity;
    let selectedSlider = -1;
    this.slidersInfo.map((s, i) => {
   
      let distance = Math.abs(distanceFromCenter - parseInt(s.getAttribute('r') || ''));
      
      if (shortestDistance > distance) {
        shortestDistance = distance;
        selectedSlider = i;
      }

    });

    this.activeSlider = this.slidersInfo[selectedSlider];
    return this.activeSlider;
  }
}
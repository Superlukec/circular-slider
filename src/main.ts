import './style.css'
//import typescriptLogo from './typescript.svg'
//import { setupCounter } from './counter'

interface SliderVariable {
  name: string;
  value: number;
  color: string;
  maxValue?: number;
  minValue?: number;
  step?: number;
}

class Slider {

  container: string;
  width: number;
  heigth: number
  sliders: SliderVariable[];

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

  generateArch = (radius: number) => {

    let centerX = this.width / 2;
    let centerY = this.heigth / 2;

    return `
      M ${centerX}, ${centerY - radius}
      A ${radius}, ${radius}, 0 1 0, ${centerX}, ${centerY + radius}    
    `
  }

  filterClick = (element: SVGElement, x: number, y: number): boolean => {

    var dim = element.getBoundingClientRect();

    //console.log(slider.getAttribute('cx'), slider.getAttribute('cy'), slider.getAttribute('r'));

    return true;
  }

  draw = () => {

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', "" + this.heigth)
    svg.setAttribute('height', "" + this.heigth)

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


      const progressSlider: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      progressSlider.setAttribute('d', this.generateArch(stepper))
      progressSlider.setAttribute('stroke-width', '18');
      progressSlider.setAttribute('stroke-dasharray', '7 1');
      progressSlider.setAttribute('stroke', s.color);
      progressSlider.setAttribute('fill', 'transparent');
      progressSlider.setAttribute('transform', `rotate(180, ${this.width / 2}, ${this.heigth / 2})`);


      [slider, progressSlider].map((slidr) => slidr.addEventListener('click', (evt) => {
        var e: any = evt.target;
        var dim = e.getBoundingClientRect();
        console.log('dim', dim.left, dim.right)
        console.log(`${s.name} clicked`, 'X: ' + (evt.clientX - dim.left), 'Y: ' + (evt.clientY - dim.top))
        /*
        if (this.filterClick(slider, evt.clientX, evt.clientY)) {
          console.log(`${s.name} clicked`, evt.clientX, evt.clientY)
        }*/
      }))
      group.appendChild(slider);
      group.appendChild(progressSlider);


      const sliderButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      sliderButton.id = `slider-${i}`;
      sliderButton.setAttribute('cx', "" + this.width / 2);
      sliderButton.setAttribute('cy', "" + ((this.heigth / (this.sliders.length * 2)) + stepperCircle));
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
}

let slider1 = new Slider(
  '#app',
  600,
  600,
  [{
    name: 'Transportation',
    value: 750,
    color: 'purple',
  }, {
    name: 'Food',
    value: 750,
    color: 'blue',
  }, {
    name: 'Insurance',
    value: 500,
    color: 'green',
  }, {
    name: 'Entertainment',
    value: 800,
    color: 'orange',
  }, {
    name: 'Health Care',
    value: 200,
    color: 'red',
  }]
);
slider1.draw();


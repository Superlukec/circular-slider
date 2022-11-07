import './style.css'
import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'

const small = document.getElementById('small')
const large = document.getElementById('large')
const circle = document.getElementById('circle')

interface SliderVariable {
  name: string;
  value: number;
  color: string;
}

class Slider {

  width: number;
  heigth: number
  sliders: SliderVariable[];

  constructor(width: number, height: number, sliders: SliderVariable[]) {  
    this.width = width;
    this.heigth = height;  
    this.sliders = [...sliders];
  }

  draw = () => {
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', "" + this.heigth)
    svg.setAttribute('height', "" + this.heigth)

    let stepper = 60;
    let stepperCircle = 36 * this.sliders.length;

    this.sliders.reverse();

    // we iterate sliders
    this.sliders.map((s: SliderVariable, i: number) => {


        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const slider = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        slider.setAttribute('cx', "" + this.width / 2);
        slider.setAttribute('cy', "" + this.heigth / 2);
        slider.setAttribute('r', stepper.toString());
        slider.setAttribute('stroke-width', '18');
        slider.setAttribute('stroke-dasharray', '7 1');
        slider.setAttribute('stroke', s.color);
        slider.setAttribute('fill', 'transparent');
        group.appendChild(slider);

        const sliderButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        sliderButton.id = `slider-${i}`;
        sliderButton.setAttribute('cx', "" + this.width / 2);
        sliderButton.setAttribute('cy', "" + ((this.heigth / (this.sliders.length * 2)) + stepperCircle));
        sliderButton.setAttribute('r', '13');
        sliderButton.setAttribute('fill', 'white');
        sliderButton.setAttribute('stroke-width', '1');
        sliderButton.setAttribute('stroke', 'black');           
        group.appendChild(sliderButton);       
       
        
        svg.appendChild(group);


      console.log('s', s)
      stepper += 40
      stepperCircle -= 40
    })

    document.querySelector<HTMLDivElement>('#app')!.appendChild(svg);
  }
}

let slider1 = new Slider(
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

small && small.addEventListener('click', () => {
  console.log('small-circle')
})

large && large.addEventListener('click', (e) => {
  console.log('large-circle', e.clientX, e.clientY);
})

circle && circle.addEventListener('click', () => {
  console.log('circle')  
})

/*
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)*/

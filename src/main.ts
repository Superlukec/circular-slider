import { Slider } from './sliderClass';
import './style.css'

let slider1 = new Slider(
  '#app',
  600,
  600,
  [{
    name: 'Transportation',
    value: 750,
    step: 1,
    maxValue: 1000,
    minValue: 0,
    color: 'purple',
  }, {
    name: 'Food',
    value: 750,
    step: 1,
    maxValue: 1000,
    minValue: 0,
    color: 'blue',
  }, {
    name: 'Insurance',
    value: 500,
    step: 10,
    maxValue: 1000,
    minValue: 0,
    color: 'green',
  }, {
    name: 'Entertainment',
    value: 800,
    step: 1,
    maxValue: 1000,
    minValue: 0,
    color: 'orange',
  }, {
    name: 'Health Care',
    value: 200,
    step: 100,
    maxValue: 1000,
    minValue: 0,
    color: 'red',
  }]
);
slider1.draw();


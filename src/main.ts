import { Slider } from './sliderClass';
import './style.css'

let slider1 = new Slider(
  '#app',
  180,
  [{
    name: 'Transportation',
    value: 750,
    step: 10,
    maxValue: 1000,
    minValue: 0,
    color: '#6f508e',
  }, {
    name: 'Food',
    value: 650,
    step: 1,
    maxValue: 1000,
    minValue: 0,
    color: '#1d8fc4',
  }, {
    name: 'Insurance',
    value: 500,
    step: 10,
    maxValue: 1000,
    minValue: 0,
    color: '#5c9d31',
  }, {
    name: 'Entertainment',
    value: 800,
    step: 1,
    maxValue: 1000,
    minValue: 0,
    color: '#d88227',
  }, {
    name: 'Health Care',
    value: 200,
    step: 100,
    maxValue: 400,
    minValue: 0,
    color: '#da5648',
  }]
);
slider1.draw();


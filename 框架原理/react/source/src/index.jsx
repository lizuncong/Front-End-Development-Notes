import React from 'react';
import ReactDOM from '../../lib/react-dom';

let element = (
  <div id="A">
    A
    <div id="B">
      <div id="C">C</div>
      <div id="D">D</div>
    </div>
    <div id="E">E</div>
  </div>
)

console.log('element...', JSON.stringify(element, null, 2))

const rootElement = document.getElementById('root');
ReactDOM.render(
  element,
  rootElement,
);

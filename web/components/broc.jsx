'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
import Home from './Home';
require('babel-polyfill');

const appEle = document.getElementById('app');
if (appEle) {
  ReactDOM.render(
    <Home></Home>,
    appEle);
}
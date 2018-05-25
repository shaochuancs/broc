'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Home = require('./app/components/Home');
require('babel-polyfill');

const appEle = document.getElementById('app');
if (appEle) {
  ReactDOM.render(
    <Home></Home>,
    appEle);
}
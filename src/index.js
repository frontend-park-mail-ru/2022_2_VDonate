'use_strict'

import Router from './modules/router.js';
import Api from './modules/api.js';

const root = document.getElementById('entry');

const api = new Api('http://192.168.137.17:8080/api/v1');
const router = new Router(root, api);

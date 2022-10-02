'use_strict'

import Router from './modules/router.js';
import Api from './modules/api.js';

/**
 * @const {Element} root корень HTML файла, куда будет рендериться страница
 */
const root = document.getElementById('entry');

/**
 * @const {*} api класс интерфейса для связи с сервером
 */
const api = new Api('http://192.168.137.17:8080/api/v1');

/**
 * @const {*} router класс маршрутизации по страницам сайта
 */
const router = new Router(root, api);

'use_strict';

import Router from './modules/router.js';
import Api from './modules/api.js';
import processForm from './modules/validationForm.js';

/**
 * класс маршрутизации по страницам сайта
 * @const {Router} router
 */
const router = new Router();

router.root = document.getElementById('entry');
router.header = document.getElementById('header');
router.main = document.getElementById('main');
router.footer = document.getElementById('footer');
router.api = new Api('/api/v1');

/**
 * шаблон футера
 * @const {HandlebarsTemplateDelegate} footerEl
 */
const footerEl = Handlebars.templates.footer;
router.footer.innerHTML = footerEl();

router.authUser();

window.processForm = processForm;

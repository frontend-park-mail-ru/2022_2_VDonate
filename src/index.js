'use_strict';

import Router from './modules/router.js';
import Api from './modules/api.js';
import processForm from './modules/validationForm.js';

/**
 * @const {Router} router класс маршрутизации по страницам сайта
 */
const router = new Router();

router.root = document.getElementById('entry');
router.header = document.getElementById('header');
router.main = document.getElementById('main');
router.footer = document.getElementById('footer');
router.api = new Api('/api/v1');

const footerEl = Handlebars.templates.footer;
router.footer.innerHTML = footerEl();

router.authUser();

window.processForm = processForm;

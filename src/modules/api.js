/**
 * Модуль интерфейса для связи с сервером
 * @module Api
 */

import Ajax from "./ajax.js";

/**Класс интерфейса для связи с сервером */
export default class Api extends Ajax {

    /**
     * Интерфейс авторизации пользователя
     * @param {string} username логин пользователя 
     * @param {string} password пароль пользователя
     * @returns {Object} обьект респонса с полями ок, статус и тело с данными е пользователе 
     */
    loginUser = (username, password) => this.post('/login', { username, password });

    /**
     * Интерфейс аутенфикации пользователя
     * @returns {Object} обьект респонса с полями ок, статус и тело с данными о пользователе 
     */
    authUser = () => this.get('/auth');

    /**
     * Интерфейс регистрации пользователя
     * @param {string} username логин
     * @param {string} firstName имя (необязательный параметр)
     * @param {string} lastName фамилия (необязательный параметр)
     * @param {string} email почта (необязательный параметр)
     * @param {string} password пароль
     * @param {string} phone телефон (необязательный параметр)
     * @returns {Object} обьект респонса с полями ок, статус и тело с данными о пользователе
     */
    signupUser = (username,
        firstName = '',
        lastName = '',
        email,
        password,
        phone = ''
    ) =>
        this.post('/users', {
            username,
            firstName,
            lastName,
            email,
            password,
            phone
        });

    /**
     * интерфейс получения данных о пользователе с данным id
     * @param {string} id id пользователя
     * @returns {Object} обьект респонса с полями ок, статус и тело с данными о пользователе
     */
    getUser = (id) => this.get(`/users/${id}`);

    /**
     * интерфейс для получения постов автора с id
     * @param {*} from первый необходимый пост
     * @param {*} count количество постов
     * @param {*} id id автора
     * @returns {Object} обьект респонса с полями ок, статус и тело с данными о пользователе
     */
    getAllPosts = (from, count, id) => this.get('/posts', { from, count, id });
}
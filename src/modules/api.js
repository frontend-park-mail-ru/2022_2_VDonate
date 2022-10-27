/**
 * Модуль интерфейса для связи с сервером
 * @module Api
 */

import Ajax from './ajax.js';

/** Класс интерфейса для связи с сервером */
export default class Api extends Ajax {
  /**
     * Ответ на запрос
     * @typedef {Object} ParsedResponse
     * @property {boolean} ok указывает, что запрос выполнен успешно
     * @property {number} status код ответа
     * @property {Object} body тело ответа
     */

  /**
     * Интерфейс авторизации пользователя
     * @param {string} username логин пользователя
     * @param {string} password пароль пользователя
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  loginUser = (username, password) => this.post('/login', {username, password});

  /**
     * Интерфейс аутенфикации пользователя
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  authUser = () => this.get('/auth');

  /**
     * Интерфейс регистрации пользователя
     * @param {string} username логин
     * @param {string} email почта
     * @param {string} password пароль
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  signupUser = (
      username,
      email,
      password,
  ) => this.post('/users', {
    username,
    email,
    password,
  });

  /**
     * интерфейс получения данных о пользователе с данным id
     * @param {string} id id пользователя
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  getUser = (id) => this.get(`/users/${id}`);

  /**
     * интерфейс для получения постов автора с id
     * @param {string} id id автора
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  getAllPosts = (id) => this.get(`/posts?user_id=${id}`);

  /**
     * Функция выхода из учетной записи
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  logout = () => this.delete('/logout');
}

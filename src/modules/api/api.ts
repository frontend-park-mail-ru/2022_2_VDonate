/**
 * Модуль интерфейса для связи с сервером
 * @module Api
 */

import Ajax, {ResponseData} from './ajax.js';

/** Класс интерфейса для связи с сервером */
export default class Api extends Ajax {
  /**
     * Интерфейс авторизации пользователя
     * @param username - логин пользователя
     * @param password - пароль пользователя
     * @return объект ответа с полями {ok,status,body}
     */
  loginUser(username: string, password: string): Promise<ResponseData> {
    return this.post('/login', {username, password});
  }

  /**
     * Функция выхода из учетной записи
     * @return объект ответа с полями {ok,status,body}
     */
  logout(): Promise<ResponseData> {
    return this.delete('/logout');
  }

  /**
     * Интерфейс аутенфикации пользователя
     * @return объект ответа с полями {ok,status,body}
     */
  authUser(): Promise<ResponseData> {
    return this.get('/auth');
  }

  /**
     * Интерфейс регистрации пользователя
     * @param username - псевдоним
     * @param email - почта
     * @param password - пароль
     * @return объект ответа с полями {ok,status,body}
     */
  signupUser(
      username: string,
      email: string,
      password: string,
  ): Promise<ResponseData> {
    return this.post('/users', {
      username,
      email,
      password,
    });
  }

  /**
     * интерфейс получения данных о пользователе с данным id
     * @param id id пользователя
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  getUser = (id: number) => this.get(`/users/${id}`);

  /**
     * интерфейс для получения постов автора с id
     * @param id id автора
     * @return объект ответа с полями {ok,status,body}
     */
  getAllPosts(id: number): Promise<ResponseData> {
    return this.get(`/posts?user_id=${id}`);
  }
}

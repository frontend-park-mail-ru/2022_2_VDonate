/**
 * Модуль интерфейса для связи с сервером
 * @module Api
 */

import ajax, {RequestData, Method, ResponseData} from './ajax';

export interface ErrorBody {
  message: string
}

/** Класс интерфейса для связи с сервером */
export default class Api {
  private readonly request: typeof ajax;

  /**
   * @param baseUrl - базовый урл
   */
  constructor(baseUrl: string) {
    this.request = (
        url: string,
        method: Method,
        withCSRF: boolean,
        data: RequestData = {}): Promise<ResponseData> => {
      return ajax(baseUrl + url, method, withCSRF, data);
    };
  }

  /**
     * Интерфейс авторизации пользователя
     * @param username - логин пользователя
     * @param password - пароль пользователя
     * @return объект ответа с полями {ok,status,body}
     */
  loginUser(username: string, password: string): Promise<ResponseData> {
    return this.request('/login', Method.POST, false, {username, password});
  }

  /**
     * Функция выхода из учетной записи
     * @return объект ответа с полями {ok,status,body}
     */
  logout(): Promise<ResponseData> {
    return this.request('/logout', Method.DELETE, true);
  }

  /**
     * Интерфейс аутенфикации пользователя
     * @return объект ответа с полями {ok,status,body}
     */
  authUser(): Promise<ResponseData> {
    return this.request('/auth', Method.GET, true);
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
    return this.request('/users', Method.POST, false, {
      username,
      email,
      password,
    });
  }

  /**
     * интерфейс получения данных о пользователе с данным id
     * @param id id пользователя
     * @return объект ответа с полями {ok,status,body}
     */
  getUser(id: number): Promise<ResponseData> {
    return this.request(`/users/${id}`, Method.GET, false);
  }

  /**
     * интерфейс для получения постов автора с id
     * @param id id автора
     * @return объект ответа с полями {ok,status,body}
     */
  getAllPosts(id: number): Promise<ResponseData> {
    return this.request(`/posts?user_id=${id}`, Method.GET, false);
  }
}

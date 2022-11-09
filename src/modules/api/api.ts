/**
 * Модуль интерфейса для связи с сервером
 * @module Api
 */

import ajax, {RequestData, Method, ResponseData, ContentType} from './ajax';

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
        contentType: ContentType,
        data: RequestData = {}): Promise<ResponseData> => {
      return ajax(baseUrl + url, method, contentType, data);
    };
  }

  /**
     * Интерфейс авторизации пользователя
     * @param username - логин пользователя
     * @param password - пароль пользователя
     * @return объект ответа с полями {ok,status,body}
     */
  loginUser(username: string, password: string): Promise<ResponseData> {
    return this.request(
        '/login',
        Method.POST,
        ContentType.json,
        {username, password},
    );
  }

  /**
     * Функция выхода из учетной записи
     * @return объект ответа с полями {ok,status,body}
     */
  logout(): Promise<ResponseData> {
    return this.request('/logout', Method.DELETE, ContentType.json);
  }

  /**
     * Интерфейс аутенфикации пользователя
     * @return объект ответа с полями {ok,status,body}
     */
  authUser(): Promise<ResponseData> {
    return this.request('/auth', Method.GET, ContentType.json);
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
    return this.request('/users', Method.POST, ContentType.json, {
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
    return this.request(`/users/${id}`, Method.GET, ContentType.json);
  }

  /**
     * интерфейс для получения постов автора с id
     * @param id id автора
     * @return объект ответа с полями {ok,status,body}
     */
  getAllPosts(id: number): Promise<ResponseData> {
    return this.request(`/posts?user_id=${id}`, Method.GET, ContentType.json);
  }

  /**
     * интерфейс для получения подписчиков автора с id
     * @param id id автора
     * @return объект ответа с полями {ok,status,body}
     */
  getSubscribers(id: number): Promise<ResponseData> {
    return this.request(`/subscribers/${id}`, Method.GET, ContentType.json);
  }

  /**
     * интерфейс для получения подписок пользователя с id
     * @param id id автора
     * @return объект ответа с полями {ok,status,body}
     */
  getSubscritions(id: number): Promise<ResponseData> {
    return this.request(
        `/subscriptions/${id}`, Method.GET, ContentType.json);
  }

  /**
   * интерфейс для получения авторских подписок с id
   * @param id id автора
   * @return объект ответа с полями {ok,status,body}
   */
  getAuthorSubscritions(id: number): Promise<ResponseData> {
    return this.request(
        `/author/subscriptions`,
        Method.GET, ContentType.json, {
          author_id: id,
        },
    );
  }

  /**
     * Интерфейс изменения данных пользователя
     * @param data Обьект
     * @return объект ответа с полями {ok,status,body}
     */
  putUserData(data: {
      id: number,
      username?: string,
      email?: string,
      password?: string,
      about?: string,
      isAuthor?: boolean,
  }): Promise<ResponseData> {
    return this.request(
        `/users/${data.id}`,
        Method.PUT,
        ContentType.formData,
        data,
    );
  }

  /**
   * @param authorID ID автора
   * @param authorSubscriptionID ID подписки
   * @return объект ответа с полями {ok,status,body}
   */
  subscribe(
      authorID: number, authorSubscriptionID: number,
  ): Promise<ResponseData> {
    return this.request('/subscribers', Method.POST, ContentType.json, {
      authorID,
      authorSubscriptionID,
    });
  }

  /**
   * @param authorID ID автора
   * @param authorSubscriptionID ID подписки
   * @return объект ответа с полями {ok,status,body}
   */
  unsubscribe(
      authorID: number, authorSubscriptionID: number,
  ): Promise<ResponseData> {
    return this.request('/subscribers', Method.DELETE, ContentType.json, {
      authorID,
      authorSubscriptionID,
    });
  }
}

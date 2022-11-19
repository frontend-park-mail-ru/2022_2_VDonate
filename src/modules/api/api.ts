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
  getAuthorPosts(id: number): Promise<ResponseData> {
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
  getSubscriptions(id: number): Promise<ResponseData> {
    return this.request(
        `/subscriptions`, Method.GET, ContentType.json, {
          user_id: id,
        });
  }

  /**
   * интерфейс для получения авторских подписок с id
   * @param id id автора
   * @return объект ответа с полями {ok,status,body}
   */
  getAuthorSubscriptions(id: number): Promise<ResponseData> {
    return this.request(
        `/subscriptions/author`,
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
    file?: File,
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

  /**
   *
   * @param data -
   * @returns dfd
   */
  createPost(data: {
    title: string,
    text: string,
    file?: File,
  }): Promise<ResponseData> {
    return this.request('/posts', Method.POST, ContentType.formData, data);
  }
  /**
   *
   * @param id -
   * @param data -
   * @returns dfd
   */
  updatePost(id: number, data: {
    title: string,
    text: string,
    file?: File,
  }): Promise<ResponseData> {
    return this.request(
        `/posts/${id}`,
        Method.PUT,
        ContentType.formData,
        data,
    );
  }

  /**
   *
   * @param id -
   * @returns d
   */
  likePost(id: number): Promise<ResponseData> {
    return this.request(`/posts/${id}/likes`, Method.POST, ContentType.json);
  }

  /**
   *
   * @param id -
   * @returns d
   */
  unlikePost(id: number): Promise<ResponseData> {
    return this.request(`/posts/${id}/likes`, Method.DELETE, ContentType.json);
  }
  /**
   * @param data -Обьект
   * @return объект ответа с полями {ok,status,body}
   */
  editAuthorSubscription(data: {
    id: number,
    price?: number,
    text?: string,
    tier?: number,
    title?: string,
    file?: File,
  }): Promise<ResponseData> {
    return this.request(
        `/subscriptions/author/${data.id}`,
        Method.PUT,
        ContentType.formData,
        data);
  }

  /**
   * @param data -Обьект
   * @return объект ответа с полями {ok,status,body}
   */
  createAuthorSubscription(data: {
    price: number,
    text: string,
    tier: number,
    title: string,
    file?: File,
  }): Promise<ResponseData> {
    return this.request(
        `/subscriptions/author`,
        Method.POST,
        ContentType.formData,
        data);
  }

  deleteAuthorSubscription(id: number): Promise<ResponseData> {
    return this.request(
        `/subscriptions/author/${id}`,
        Method.DELETE,
        ContentType.json,
    );
  }

  /**
   *
   * @returns ll
   */
  getFeed(): Promise<ResponseData> {
    return this.request(
        '/posts?filter=subscriptions',
        Method.GET,
        ContentType.json);
  }
}

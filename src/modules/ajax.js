/**
 * Модуль для отправки запросов на сервер через REST API
 * @module Ajax
 */

/**
 * Формирует из входных данных query-параметры
 * @param {Object} data данные для преобразования в query-параметры
 * @return {string} строка query-параметров
 */
function dataToQuery(data) {
  if (Object.entries(data).length === 0) {
    return '';
  }
  let queryString = '?';
  Object
      .entries(data)
      .forEach((key, value) => {
        queryString += `${key}=${value}`;
      });
  return queryString;
}

/** Класс для отправки запросов на сервер через REST API */
export default class Ajax {
  /**
     * Ответ на запрос
     * @typedef {Object} ParsedResponse
     * @property {boolean} ok указывает, что запрос выполнен успешно
     * @property {number} status код ответа
     * @property {Object} body тело ответа
     */

  /**
     * запоминает базовый адрес для обращения на API
     * @constructor
     * @param {string} baseUrl baseUrl - базовый адрес
     */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
     * отправляет GET запрос, возвращает
     * объект респонса с полями {ok,status,body}
     * @param {string} url имя пути
     * @param {Object} data данные для query-параметров
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  get(url, data = {}) {
    const urlWithParams = url + dataToQuery(data);
    return this._request(urlWithParams, 'GET', {});
  }

  /**
     * отправляет POST запрос, возвращает
     * объект респонса с полями {ok,status,body}
     * @param {string} url имя пути
     * @param {Object} data данные для составления тела запроса
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  post(url, data = {}) {
    return this._request(url, 'POST', data);
  }

  /**
     * отправляет PUT запрос, возвращает
     * объект респонса с полями {ok,status,body}
     * @param {string} url имя пути
     * @param {Object} data данные для составления тела запроса
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  put(url, data = {}) {
    return this._request(url, 'PUT', data);
  }

  /**
     * отправляет DELETE запрос, возвращает
     * объект респонса с полями {ok,status,body}
     * @param {string} url имя пути
     * @param {Object} data данные для составления тела запроса
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  delete(url, data = {}) {
    return this._request(url, 'DELETE', data);
  }

  /**
     * отправляет Request-запрос на заданный url,
     * возвращает объект ответа с полями {ok,status,body}
     * @param {string} url имя пути
     * @param {string} method метод запроса
     * @param {Object} data данные для составления тела запроса
     * @return {Object} объект ответа с полями {ok,status,body}
     */
  async _request(url, method, data) {
    const options = {
      method,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (!['GET', 'HEAD'].includes(method)) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(
        this.baseUrl + url,
        options,
    );

    try {
      const body = await response.json();
      return {
        ok: true,
        status: response.status,
        body: body,
      };
    } catch (error) {
      return {
        ok: false,
        status: response.status,
        body: {
          error: error,
        },
      };
    }
  }
}

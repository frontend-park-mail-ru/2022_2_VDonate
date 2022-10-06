/**
 * Модуль для отправки запросов на сервер через REST API
 * @module Ajax
 */

/**
 * Формирует из входных данных query-параметры
 * @param {Object} data данные для преобразования в query-параметры
 * @returns {string} строка query-параметров
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
     * отправляет GET запрос, возвращает  объект респонса с полями ок, статус и тело
     * @param {string} url имя пути
     * @param {Object} data данные для query-параметров
     * @returns {Promise<ParsedResponse>} объект ответа с полями {status, body}
     */
  get(url, data = {}) {
    const urlWithParams = url + dataToQuery(data);
    return this._request(urlWithParams, 'GET', {});
  }

  /**
     * отправляет POST запрос, возвращает  объект респонса с полями ок, статус и тело
     * @param {string} url имя пути
     * @param {Object} data данные для составления тела запроса
     * @returns {Promise<ParsedResponse>} объект ответа с полями {status, body}
     */
  post(url, data = {}) {
    return this._request(url, 'POST', data);
  }

  /**
     * отправляет PUT запрос, возвращает  объект респонса с полями ок, статус и тело
     * @param {string} url имя пути
     * @param {Object} data данные для составления тела запроса
     * @returns {Promise<ParsedResponse>} объект ответа с полями {status, body}
     */
  put(url, data = {}) {
    return this._request(url, 'PUT', data);
  }

  /**
     * отправляет DELETE запрос, возвращает  объект респонса с полями ок, статус и тело
     * @param {string} url имя пути
     * @param {Object} data данные для составления тела запроса
     * @returns {Promise<ParsedResponse>} объект ответа с полями {status, body}
     */
  delete(url, data = {}) {
    return this._request(url, 'DELETE', data);
  }

  /**
     * отправляет Request-запрос на заданный url,
     * возвращает promise<ParsedResponse>
     * @param {string} url
     * @param {string} method
     * @param {Object} data
     * @returns {Promise<ParsedResponse>}
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

    if (!['GET', 'HEAD'].includes(method)) { options.body = JSON.stringify(data); }

    const response = await fetch(
      this.baseUrl + url,
      options,
    );

    if (response.ok) {
      return response.json()
        .then((json) => ({
          status: response.status,
          body: json,
        }))
        .catch(() => ({
          status: 515,
          body: {},
        }));
    }
    return {
      status: response.status,
      body: {},
    };
  }
}

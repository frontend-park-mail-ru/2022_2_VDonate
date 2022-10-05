/**
 * Модуль для отправки запросов на сервер через REST API
 * @module Ajax 
 */

/** Класс для отправки запросов на сервер через REST API*/
export default class Ajax {

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
     * @returns {Object} объект ответа с полями { ok, status, body}
     */
    get(url, data = {}) {
        let urlWithParams = url + this._dataToQuery(data);
        return this._request(urlWithParams, 'GET', {});
    }

    /**
     * отправляет POST запрос, возвращает  объект респонса с полями ок, статус и тело
     * @param {string} url имя пути
     * @param {Object} data данные для составления тела запроса
     * @returns {Object} объект ответа с полями { ok, status, body}
     */
    post(url, data = {}) {
        return this._request(url, 'POST', data);
    }

    // /**
    //  * отправляет PUT запрос, возвращает  объект респонса с полями ок, статус и тело
    //  * @param {string} url имя пути
    //  * @param {Object} data данные для составления тела запроса
    //  * @returns {Object} объект ответа с полями { ok, status, body}
    //  */
    // put(url, data = {}) {
    //     return this._responseToJson(this._request(url, 'PUT', data));
    // }

    // /**
    //  * отправляет DELETE запрос, возвращает  объект респонса с полями ок, статус и тело
    //  * @param {string} url имя пути
    //  * @param {Object} data данные для составления тела запроса
    //  * @returns {Object} объект ответа с полями { ok, status, body}
    //  */
    // delete(url, data = {}) {
    //     return this._responseToJson(this._request(url, 'DELETE', data));
    // }

    /**
     * Формирует из входных данных query-параметры
     * @param {Object} data данные для преобразования в query-параметры 
     * @returns {string} строка query-параметров
     */
    _dataToQuery(data) {
        if (Object.entries(data).length === 0) {
            return '';
        }
        let queryString = '?';
        Object
            .entries(data)
            .map((key, value) => {
                queryString += key + '=' + value;
            })
        return queryString;
    }

    /**
     * отправляет Request-запрос на заданный url, возвращает promise<Response>
     * @param {string} url  
     * @param {string} method 
     * @param {Object} data 
     * @returns {Promise<Response>}
     */
    _request(url, method, data) {
        let status;
        const options = {
            method,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (!['GET', 'HEAD'].includes(method))
            options.body = JSON.stringify(data);

        return fetch(
            this.baseUrl + url,
            options
        ).then((response) => {
            status = response.status;
            return response.json();
        }).then((body) => {
            return {
                status,
                body,
            }
        })
    }

    // /**
    //  * конвертирует promise<Response> в объект с полями { ok, status, body}
    //  * @param {Promise<Response>} fetchPromise 
    //  * @returns {Object}
    //  */
    // async _responseToJson(fetchPromise) {
    //     jsoned.ok = response.ok;
    //     jsoned.status = response.status;
    //     return jsoned;
    // }

}

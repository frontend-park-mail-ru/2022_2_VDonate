/**
 * Модуль, связывающийся с сервером
 * @module Ajax 
 */

/** Класс, связывающийся с сервером */
export default class Ajax {

    /**
     * запоминает адрес сайта
     * @constructor
     * @param {string} baseUrl baseUrl - адрес сайта 
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * создает GET запрос, возвращает  объект респонса с полями ок, статус и тело
     * @param {string} url имя пути
     * @param {Object} data данные для query-параметров
     * @returns {Object} объект респонса с полями ок, статус и тело
     */
    get(url, data={}) {
        let urlWithParams = url + this._dataToQuery(data);
        return this._responseToJson(this._request(urlWithParams, 'GET', {}));
    }

    /**
     * создает POST запрос, возвращает  объект респонса с полями ок, статус и тело
     * @param {string} url имя пути
     * @param {Object} data данные для query-параметров
     * @returns {Object} объект респонса с полями ок, статус и тело
     */
    post(url, data = {}) {
        return this._responseToJson(this._request(url, 'POST', data));
    }

    /**
     * создает PUT запрос, возвращает  объект респонса с полями ок, статус и тело
     * @param {string} url имя пути
     * @param {Object} data данные для query-параметров
     * @returns {Object} объект респонса с полями ок, статус и тело
     */
    put(url, data = {}) {
        return this._responseToJson(this._request(url, 'PUT', data));
    }

    /**
     * создает DELETE запрос, возвращает  объект респонса с полями ок, статус и тело
     * @param {string} url имя пути
     * @param {Object} data данные для query-параметров
     * @returns {Object} объект респонса с полями ок, статус и тело
     */
    delete(url, data = {}) {
        return this._responseToJson(this._request(url, 'DELETE', data));
    }

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
                queryString += key + '='+ value;
            })
        return queryString;
    }

    /**
     * формирует Request, возвращает Response
     * @param {string} url 
     * @param {string} method 
     * @param {Object} data 
     * @returns {Promise<Response>}
     */
    _request(url, method, data) {
        const options = {
            method,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'aplication/json',
            },
        };

        if (!['GET', 'HEAD'].includes(method))
            options.body = JSON.stringify(data);

        return fetch(
            this.baseUrl + url,
            options
        )
    }

    /**
     * конвертирует Response в объект с полями ок, статус и тело 
     * @param {Promise<Response>} fetchPromise 
     * @returns {Object}
     */
    async _responseToJson(fetchPromise) {
        const response = await fetchPromise;
        const jsoned = {};
        jsoned.body = JSON.parse(await response.text()) || {};
        jsoned.ok = response.ok;
        jsoned.status = response.status;
        return jsoned;
    }
    
}

export default class Ajax {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    get(url, data={}) {
        let urlWithParams = url + this._dataToQuery(data);
        return this._responseToJson(this._request(urlWithParams, 'GET', {}));
    }

    post(url, data = {}) {
        return this._responseToJson(this._request(url, 'POST', data));
    }

    put(url, data = {}) {
        return this._responseToJson(this._request(url, 'PUT', data));
    }

    delete(url, data = {}) {
        return this._responseToJson(this._request(url, 'DELETE', data));
    }

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

    async _responseToJson(fetchPromise) {
        const response = await fetchPromise;
        const jsoned = {};
        jsoned.body = JSON.parse(await response.text()) || {};
        jsoned.ok = response.ok;
        jsoned.status = response.status;
        return jsoned;
    }


}

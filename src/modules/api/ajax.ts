/**
 * Модуль для отправки запросов на сервер через REST API
 * @module Ajax
 */

export type RequestData = Record<string, string | number | boolean>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Body = Record<string, any>

export interface ResponseData {
  /** указывает, что запрос выполнен успешно */
  ok: boolean
  /** код ответа */
  status: number
  /** тело ответа */
  body: Body
}

enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD= 'HEAD',
}

/**
 * Формирует из входных данных query-параметры
 * @param data - данные для преобразования в query-параметры
 * @return строка query-параметров
 */
function dataToQuery(data: RequestData): string {
  if (Object.entries(data).length === 0) {
    return '';
  }
  let queryString = '?';
  Object
      .entries(data)
      .forEach(([key, value]) => {
        queryString += `${key}=${value}`;
      });
  return queryString;
}

/** Класс для отправки запросов на сервер через REST API */
export default class Ajax {
  readonly baseUrl:string;

  /**
     * запоминает базовый адрес для обращения на API
     * @constructor
     * @param baseUrl - базовый адрес
     */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
     * отправляет GET запрос, возвращает
     * объект респонса с полями {ok,status,body}
     * @param url - имя пути
     * @param data данные для query-параметров
     * @return объект ответа с полями {ok,status,body}
     */
  get(url: string, data: RequestData = {}): Promise<ResponseData> {
    const urlWithParams = url + dataToQuery(data);
    return this._request(urlWithParams, Method.GET, {});
  }

  /**
     * отправляет POST запрос, возвращает
     * объект респонса с полями {ok,status,body}
     * @param url - имя пути
     * @param data - данные для составления тела запроса
     * @return объект ответа с полями {ok,status,body}
     */
  post(url: string, data: RequestData = {}): Promise<ResponseData> {
    return this._request(url, Method.POST, data);
  }

  /**
     * отправляет PUT запрос, возвращает
     * объект респонса с полями {ok,status,body}
     * @param url - имя пути
     * @param data - данные для составления тела запроса
     * @return объект ответа с полями {ok,status,body}
     */
  put(url: string, data: RequestData = {}): Promise<ResponseData> {
    return this._request(url, Method.PUT, data);
  }

  /**
     * отправляет DELETE запрос, возвращает
     * объект респонса с полями {ok,status,body}
     * @param url - имя пути
     * @param data - данные для составления тела запроса
     * @return объект ответа с полями {ok,status,body}
     */
  delete(url: string, data: RequestData = {}): Promise<ResponseData> {
    return this._request(url, Method.DELETE, data);
  }

  /**
     * отправляет Request-запрос на заданный url,
     * возвращает объект ответа с полями {ok,status,body}
     * @param url - имя пути
     * @param method - метод запроса
     * @param data - данные для составления тела запроса
     * @return объект ответа с полями {ok,status,body}
     */
  async _request(
      url: string,
      method: Method,
      data: RequestData = {}): Promise<ResponseData> {
    const options: RequestInit = {
      method,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (![Method.GET, Method.HEAD].includes(method)) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(
        this.baseUrl + url,
        options,
    );

    try {
      const body: Body = await response.json() as Body;
      return {
        ok: true,
        status: response.status,
        body,
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

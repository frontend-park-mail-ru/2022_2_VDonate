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

export enum Method {
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
const dataToQuery = (data: RequestData): string => {
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
};


/**
     * отправляет Request-запрос на заданный url,
     * возвращает объект ответа с полями {ok,status,body}
     * @param url - имя пути
     * @param method - метод запроса
     * @param data - данные для составления тела запроса
     * @return объект ответа с полями {ok,status,body}
     */
export default async (
    url: string,
    method: Method,
    data: RequestData = {}): Promise<ResponseData> => {
  const options: RequestInit = {
    method,
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if ([Method.GET, Method.HEAD].includes(method)) {
    url += dataToQuery(data);
  } else {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(
      url,
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
};


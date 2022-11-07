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
  HEAD = 'HEAD',
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
/** Поле для CSFR токена */
const csrfField = 'csrf_token';
/**
 *  Сохрание CSRF токена в локальное хранилище
 * @returns успешное сохранение CSRF токена
 */
export const saveCSRF = (): boolean => {
  const csrfCookie = document.cookie.match(
      new RegExp(`${csrfField}=([\\w-]+)`),
  );
  if (!csrfCookie) {
    return false;
  }
  localStorage.setItem(csrfField, csrfCookie[0]);
  return true;
};
/**
     * отправляет Request-запрос на заданный url,
     * возвращает объект ответа с полями {ok,status,body}
     * @param url - имя пути
     * @param method - метод запроса
     * @param withCSRF - выполнить запрос с указаниме загловка CSRF
     * из локального хранилища csrf_token
     * @param data - данные для составления тела запроса
     * @return объект ответа с полями {ok,status,body}
     */
export default async (
    url: string,
    method: Method,
    withCSRF: boolean,
    data: RequestData = {}): Promise<ResponseData> => {
  const options: RequestInit = {
    method,
    mode: 'cors',
    credentials: 'include',
  };
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  if ([Method.GET, Method.HEAD].includes(method)) {
    url += dataToQuery(data);
  } else {
    options.body = JSON.stringify(data);
    if (withCSRF) {
      headers.append('X-CSRF-TOKEN', localStorage.getItem('csrf_token') ?? '');
    }
  }
  options.headers = headers;
  const response = await fetch(
      url,
      options,
  );

  try {
    const body: Body = await response.json() as Body;
    return {
      ok: response.ok,
      status: response.status,
      body,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: {
        error: error,
      },
    };
  }
};


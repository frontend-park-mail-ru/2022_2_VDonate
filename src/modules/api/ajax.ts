/**
 * Модуль для отправки запросов на сервер через REST API
 * @module Ajax
 */

export type RequestData = Record<string, string | number | boolean | Blob>

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

export enum ContentType {
  json = 'application/json',
  formData = 'multipart/form-data'
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
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
      .forEach(([key, value]) => {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        queryString += `${key}=${value.toString()}`;
      });
  return queryString;
};
/** Поле для CSFR токена */
// const csrfField = 'csrf_token';
/**
 *  Сохрание CSRF токена в локальное хранилище
 * @returns успешное сохранение CSRF токена
 */
export const saveCSRF = (): boolean => {
  // document.cookie = `${csrfField}=OjEM2QPpsGd8SjXybAtHwgENY8e3BFFz;`;
  return true;
  // const csrfCookie = document.cookie.match(
  //     new RegExp(`${csrfField}=([\\w-]+)`),
  // );
  // if (!csrfCookie) {
  //   return false;
  // }
  // localStorage.setItem(csrfField, csrfCookie[1]);
  // return true;
};
/**
     * отправляет Request-запрос на заданный url,
     * возвращает объект ответа с полями {ok,status,body}
     * @param url - имя пути
     * @param method - метод запроса
     * @param contentType - тип тела в запросе
     * @param data - данные для составления тела запроса
     * @return объект ответа с полями {ok,status,body}
     */
export default async (
    url: string,
    method: Method,
    contentType: ContentType,
    data: RequestData = {}): Promise<ResponseData> => {
  const options: RequestInit = {
    method,
    mode: 'cors',
    credentials: 'include',
  };
  const headers = new Headers({
    'Content-Type': contentType,
  });
  if ([Method.GET, Method.HEAD].includes(method)) {
    url += dataToQuery(data);
  } else {
    switch (contentType) {
      case ContentType.json:
        options.body = JSON.stringify(data);
        break;
      case ContentType.formData: {
        const formData = new FormData();

        for (const [name, value] of Object.entries(data)) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          if (value instanceof Blob) {
            formData.append(name, value, 'newfile.jpg');
          } else {
            switch (typeof value) {
              case 'boolean':
              case 'number':
                formData.append(name, value.toString());
                break;
              default:
                formData.append(name, value);
                break;
            }
          }
        }
        options.body = formData;
        headers.delete('Content-Type');
      }
        break;
    }

    // headers.append(
    //     'X-CSRF-Token',
    //     localStorage.getItem(`${csrfField}`) ?? '',
    // );
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

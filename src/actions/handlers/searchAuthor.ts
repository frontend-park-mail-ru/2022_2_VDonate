import {ActionType} from '@actions/types/action';
import {PayloadUser} from '@actions/types/user';
import {ResponseData} from '@api/ajax';
import api from '@app/api';
import store from '@app/store';

export interface SearchAuthorForm extends HTMLCollection {
    searchField: HTMLInputElement
}

export default (form: SearchAuthorForm): void => {
  api.searchAuthors(form.searchField.value)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.SEARCH_AUTHORS,
            payload: {
              authors: res.body as PayloadUser[],
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: res.body.message as string,
            },
          });
          return;
        }
      },
      )
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
        return;
      },
      );
};

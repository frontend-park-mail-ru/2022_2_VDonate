import ActionType from '@configs/action';
import {Dispatcher} from '@flux/types/store';
import {ResponseData} from '@api/ajax';
import api from '@app/api';
import {LoginForm} from './types/login';

export default (props: LoginForm, dispatch: Dispatcher): void => {
  api.loginUser(props.username.value, props.password.value)
      .then((res: ResponseData) => {
        dispatch({
          type: ActionType.LOGIN,
          payload: {
            id: res.body.id as number,
          },
        });
      })
      .catch(() => {
        dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: 'error fetch',
          },
        });
      });
};

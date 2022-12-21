import {Action, ActionType} from '@actions/types/action';
import {PayloadUser} from '@actions/types/user';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const userReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.AUTH:
      case ActionType.LOGIN_SUCCESS:
      case ActionType.SIGNUP_SUCCESS:
        return action.payload.user;
      case ActionType.CHANGE_USERDATA_SUCCESS:
        if (action.payload.user.avatar) {
          (state as PayloadUser).avatar =
          action.payload.user.avatar;
        }
        if (action.payload.user.username) {
          (state as PayloadUser).username =
          action.payload.user.username;
        }
        if (action.payload.user.email) {
          (state as PayloadUser).email =
          action.payload.user.email;
        }
        return state;
      case ActionType.LOGOUT_SUCCESS:
        return {
          avatar: '',
          countSubscriptions: 0,
          isAuthor: false,
          id: 0,
          username: 'Псевдоним',
          about: 'Тут будет описание',
          countDonaters: 0,
        };
      case ActionType.EDIT_ABOUT:
        (state as PayloadUser).about = action.payload.about;
        return state;
      case ActionType.BECOME_AUTHOR:
        (state as PayloadUser).isAuthor = action.payload.success;
        return state;
      default:
        return state;
    }
  };

export default userReducer;

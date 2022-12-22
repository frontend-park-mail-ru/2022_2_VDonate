import {Action, ActionType} from '@actions/types/action';
import {
  PayloadGetProfileData} from '@actions/types/getProfileData';
import {PayloadSubscription} from '@actions/types/subscribe';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const profileReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.WITHDRAW:
        // так как может вызваться только в своем профиле,
        // то нет смысла проверять
        (state as PayloadGetProfileData).user.balance = 0;
        return state;
      case ActionType.GET_PROFILEDATA:
        return action.payload;
      case ActionType.CREATE_AUTHOR_SUBSCRIPTION: {
        if (!action.payload.subscription) {
          return state;
        }
        const newSub: PayloadSubscription = action.payload.subscription;
        const authorSubscriptions = (state as PayloadGetProfileData)
            .authorSubscriptions;
        if (authorSubscriptions) {
          authorSubscriptions.push(newSub);
          authorSubscriptions.sort((a, b) => a.price - b.price);
          authorSubscriptions.forEach((sub, idx) => {
            sub.tier = idx + 1;
          });
        }
        return state;
      }
      case ActionType.EDIT_AUTHOR_SUBSCRIPTION: {
        const authorSubscriptions = (state as PayloadGetProfileData)
            .authorSubscriptions;
        if (!authorSubscriptions) return state;

        const targetSubscription = authorSubscriptions.find((sub) =>
          sub.id == action.payload.subscription?.id);
        const payload = action.payload.subscription;
        if (payload && targetSubscription) {
          targetSubscription.img = payload.img;
          targetSubscription.price = payload.price;
          targetSubscription.text = payload.text;
          targetSubscription.tier = payload.tier;
          targetSubscription.title = payload.title;
          authorSubscriptions.sort((a, b) => a.price - b.price);
          authorSubscriptions.forEach((sub, idx) => {
            sub.tier = idx + 1;
          });
        }
        return state;
      }
      case ActionType.DELETE_AUTHOR_SUBSCRIPTION: {
        const authorSubscriptions = (state as PayloadGetProfileData)
            .authorSubscriptions;
        if (!authorSubscriptions) return state;

        if (authorSubscriptions.length == 1 &&
          authorSubscriptions[0].id == action.payload.id) {
          (state as PayloadGetProfileData).authorSubscriptions = [];
          return state;
        }
        const idx = authorSubscriptions
            .findIndex((sub) => sub.id == action.payload.id);
        if (idx > -1) {
          authorSubscriptions.splice(idx, 1);
          authorSubscriptions.sort((a, b) => a.price - b.price);
          authorSubscriptions.forEach((sub, idx) => {
            sub.tier = idx + 1;
          });
        }
        return state;
      }
      case ActionType.CHANGE_USERDATA_SUCCESS:
        if ((state as PayloadGetProfileData).user.id !==
            action.payload.user.id) {
          return state;
        }
        if (action.payload.user.avatar) {
          (state as PayloadGetProfileData).user.avatar =
          action.payload.user.avatar;
        }
        if (action.payload.user.username) {
          (state as PayloadGetProfileData).user.username =
          action.payload.user.username;
        }
        return state;
      case ActionType.SUBSCRIBE: {
        const user = (state as PayloadGetProfileData).user;
        if (action.payload.authorSubscriptionID &&
        user.countDonaters !== undefined) {
          user.countDonaters += 1;
        }
        return state;
      }
      case ActionType.UNSUBSCRIBE: {
        const user = (state as PayloadGetProfileData).user;
        if (action.payload.authorSubscriptionID &&
        user.countDonaters !== undefined) {
          user.countDonaters -= 1;
        }
        return state;
      }
      case ActionType.ROUTING:
        if (action.payload.options.samePage) {
          return state;
        }
        return {
          user: {
            avatar: '',
            countSubscriptions: 0,
            isAuthor: false,
            id: 0,
            username: 'Псевдоним',
            about: 'Тут будет описание',
            countDonaters: 0,
          },
          subscriptions: [],
          authorSubscriptions: [],
          posts: [],
        };
      case ActionType.EDIT_ABOUT:
        (state as PayloadGetProfileData).user.about = action.payload.about;
        return state;
      case ActionType.BECOME_AUTHOR:
        (state as PayloadGetProfileData).user.isAuthor = action.payload.success;
        (state as PayloadGetProfileData).authorSubscriptions = [];
        return state;
      default:
        return state;
    }
  };

export default profileReducer;

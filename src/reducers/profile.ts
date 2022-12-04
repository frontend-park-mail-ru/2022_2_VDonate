/* eslint-disable no-case-declarations */
import {Action, ActionType} from '@actions/types/action';
import {
  PayloadGetProfileData} from '@actions/types/getProfileData';
import {Subscription} from '@actions/types/subscribe';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const profileReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.GETPROFILEDATA:
        return action.payload;
      case ActionType.CREATEAUTHORSUBSRIPTION:
        if (!action.payload.subscription) {
          return state;
        }
        const newSub: Subscription = action.payload.subscription;
        (state as PayloadGetProfileData).authorSubscriptions?.push(newSub);
        return state;
      case ActionType.EDITAUTHORSUBSRIPTION:
        const authorSub = (state as PayloadGetProfileData).authorSubscriptions
            ?.find((sub) =>
              sub.id == action.payload.subscription?.id);
        const payload = action.payload.subscription;
        if (payload && authorSub) {
          authorSub.img = payload.img;
          authorSub.price = payload.price;
          authorSub.text = payload.text;
          authorSub.tier = payload.tier;
          authorSub.title = payload.title;
        }
        return state;
      case ActionType.DELETEAUTHORSUBSCRIPTION:
        const subscriptions = (state as PayloadGetProfileData)
            .authorSubscriptions;
        if (subscriptions?.length == 1 &&
          subscriptions[0].id == action.payload.id) {
          (state as PayloadGetProfileData).authorSubscriptions = [];
          return state;
        }
        const idx = subscriptions
            ?.findIndex((sub) => sub.id == action.payload.id);
        if (idx && idx > -1) {
          (state as PayloadGetProfileData).authorSubscriptions?.splice(idx, 1);
        }
        return state;
      case ActionType.CHANGEUSERDATA_SUCCESS:
        if ((state as PayloadGetProfileData).user.id !==
            action.payload.user.id) {
          return state;
        }
        if (action.payload.user.about) {
          (state as PayloadGetProfileData).user.about =
          action.payload.user.about;
        }
        if (action.payload.user.avatar) {
          (state as PayloadGetProfileData).user.avatar =
          action.payload.user.avatar;
        }
        if (action.payload.user.isAuthor) {
          (state as PayloadGetProfileData).user.isAuthor =
          action.payload.user.isAuthor;
        }
        if (action.payload.user.username) {
          (state as PayloadGetProfileData).user.username =
          action.payload.user.username;
        }
        return state;
      case ActionType.SUBSCRIBE:
        const user = (state as PayloadGetProfileData).user;
        if (action.payload.authorSubscriptionID &&
        user.countDonaters !== undefined) {
          user.countDonaters += 1;
        }
        return state;
      case ActionType.UNSUBSCRIBE:
        const userr = (state as PayloadGetProfileData).user;
        if (action.payload.authorSubscriptionID &&
        userr.countDonaters !== undefined) {
          userr.countDonaters -= 1;
        }
        return state;
      default:
        return state;
    }
  };

export default profileReducer;

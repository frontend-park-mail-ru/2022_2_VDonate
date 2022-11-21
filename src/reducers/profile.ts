/* eslint-disable no-case-declarations */
import {Action, ActionType} from '@actions/types/action';
import {
  PayloadAuthorSubscription,
  PayloadGetProfileData} from '@actions/types/getProfileData';
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
        const newSub: PayloadAuthorSubscription = {
          authorID: (state as PayloadGetProfileData).user.id,
          id: action.payload.subscription.subscriptionId,
          img: action.payload.subscription.imgPath,
          price: action.payload.subscription.price,
          text: action.payload.subscription.text,
          tier: action.payload.subscription.tier,
          title: action.payload.subscription.title,
        };
        (state as PayloadGetProfileData).authorSubscriptions?.push(newSub);
        return state;
      case ActionType.EDITAUTHORSUBSRIPTION:
        const authorSub = (state as PayloadGetProfileData).authorSubscriptions
            ?.find((sub) =>
              sub.id == action.payload.subscription?.subscriptionId);
        const payload = action.payload.subscription;
        if (payload && authorSub) {
          authorSub.img = payload.imgPath;
          authorSub.price = payload.price;
          authorSub.text = payload.text;
          authorSub.tier = payload.tier;
          authorSub.title = payload.title;
        }
        return state;
      case ActionType.DELETEAUTHORSUBSCRIPTION:
        const idx = (state as PayloadGetProfileData).authorSubscriptions
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
      default:
        return state;
    }
  };

export default profileReducer;

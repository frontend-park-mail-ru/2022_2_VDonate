/* eslint-disable no-case-declarations */
import {Action, ActionType} from '@actions/types/action';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import {Subscription} from '@actions/types/subscribe';
import store from '@app/store';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const UserSubscribersReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.GETSUBSCRIPTIONS:
        return action.payload.subscriptions;
      case ActionType.SUBSCRIBE:
        const profile =
          store.getState().profile as PayloadGetProfileData;
        if (!profile.authorSubscriptions) {
          return state;
        }
        const authorSub =
          profile.authorSubscriptions.find((sub) =>
            sub.id == action.payload.authorSubscriptionID);
        if (authorSub) {
          (state as Subscription[]).push(authorSub);
        }
        return state;
      case ActionType.UNSUBSCRIBE:
        const idx =
          (state as Subscription[]).findIndex((sub) =>
            sub.id == action.payload.authorSubscriptionID);
        if (idx && idx > -1) {
          (state as Subscription[]).splice(idx, 1);
        }
        return state;
      default:
        return state;
    }
  };

export default UserSubscribersReducer;

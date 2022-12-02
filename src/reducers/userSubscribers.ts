/* eslint-disable no-case-declarations */
import {Action, ActionType} from '@actions/types/action';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import {Subscription} from '@actions/types/subscribe';
import store from '@app/Store';
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
          const sub: Subscription = {
            authorAvatar: profile.user.avatar,
            authorID: authorSub.authorID,
            authorName: profile.user.username,
            id: authorSub.id,
            img: authorSub.img,
            price: authorSub.price,
            text: authorSub.text,
            tier: authorSub.tier,
            title: authorSub.title,
          };
          (state as Subscription[]).push(sub);
        }
        return state;
      case ActionType.UNSUBSCRIBE:
        const subs = state as Subscription[];
        if (subs.length == 1 &&
          subs[0].id == action.payload.authorSubscriptionID) {
          state = [];
          return state;
        }
        const idx =
            subs.findIndex((sub) =>
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

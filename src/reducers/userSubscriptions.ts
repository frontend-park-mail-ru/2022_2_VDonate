/* eslint-disable no-case-declarations */
import {Action, ActionType} from '@actions/types/action';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import {PayloadSubscription} from '@actions/types/subscribe';
import store from '@app/Store';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const createSubscriptionsMap =
  (subscriptions: PayloadSubscription[]): Map<number, PayloadSubscription> => {
    const subscriptionsMap = new Map<number, PayloadSubscription>();
    subscriptions.forEach(
        (subscriptions) => subscriptionsMap.set(
            subscriptions.id,
            subscriptions,
        ),
    );
    return subscriptionsMap;
  };

const userSubscriptionsReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.GETSUBSCRIPTIONS:
        return createSubscriptionsMap(action.payload);
      case ActionType.SUBSCRIBE:
        const profile =
          store.getState().profile as PayloadGetProfileData;
        if (!profile.authorSubscriptions) return state;
        const authorSub =
          profile.authorSubscriptions.find((sub) =>
            sub.id == action.payload.authorSubscriptionID);
        if (authorSub) {
          const subscription: PayloadSubscription = {
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
          (state as Map<number, PayloadSubscription>)
              .set(subscription.id, subscription);
        }
        return state;
      case ActionType.UNSUBSCRIBE:
        (state as Map<number, PayloadSubscription>)
            .delete(action.payload.authorSubscriptionID);
        return state;
      case ActionType.LOGOUT_SUCCESS:
        return new Map<number, PayloadSubscription>();
      default:
        return state;
    }
  };

export default userSubscriptionsReducer;

import {PayloadSubscription} from '@actions/types/subscribe';
import store from '@app/Store';
import ProfileMini, {ProfileMiniType}
  from '@components/ProfileMini/ProfileMini';
import './subscriptions-list-container.styl';
import UpgradeViewBase from '@app/UpgradeView';

export default class SubscriptionsListContainer extends UpgradeViewBase {
  private userSubscriptionsState = new Map<number, PayloadSubscription>();
  private profiles = new Map<number, ProfileMini>();

  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'subscriptions-list-container';

    return container;
  }

  notify(): void {
    const userSubscriptionsNew = store.getState()
        .userSubscriptions as Map<number, PayloadSubscription>;
    this.userSubscriptionsState.forEach((_, subID) => {
      if (!userSubscriptionsNew.has(subID)) {
        this.deleteUserSubscription(subID);
      }
    });

    userSubscriptionsNew.forEach((sub, subID) => {
      if (this.userSubscriptionsState.has(subID)) {
        this.profiles.get(subID)?.update({
          avatar: sub.authorAvatar,
          username: sub.authorName,
          isAuthor: true,
        });
      } else {
        this.profiles.set(subID, new ProfileMini(this.domElement, {
          type: ProfileMiniType.OTHER_PROFILE,
          id: sub.authorID,
          avatar: sub.authorAvatar,
          username: sub.authorName,
          isAuthor: true,
        }));
      }
    });

    this.userSubscriptionsState = new Map(userSubscriptionsNew);
  }

  protected onErase(): void {
    this.profiles.forEach((profile) => profile.remove());
    this.profiles.clear();
  }

  private deleteUserSubscription(subID: number): void {
    this.profiles.get(subID)?.remove();
    this.profiles.delete(subID);
    this.userSubscriptionsState.delete(subID);
  }
}

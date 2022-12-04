import SubscriptionCard,
{SubscriptionCardStatus} from '@components/SubscriptionCard/SubscriptionCard';
import './subscriptions-container.styl';
import plusIcon from '@icon/plus.svg';
import store from '@app/Store';
import {Subscription} from '@actions/types/subscribe';
import {openSubscribtionEditor} from '@actions/handlers/editor';
import Button, {ButtonType} from '@components/Button/Button';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import ContainerBase from '@app/Container';

interface SubscriptionsContainerOptions {
  changeable: boolean
}

/**
 * Модель поля подписок
 */
export default class SubscriptionsContainer
  extends ContainerBase<Map<number, Subscription>> {
  private subscriptionsState = new Map<number, Subscription>();
  private subscriptionCards = new Map<number, SubscriptionCard>();
  constructor(el: HTMLElement,
    private options: SubscriptionsContainerOptions) {
    super();
    this.renderTo(el);
    this.notify();
  }
  private container: HTMLElement = document.createElement('div');

  protected render(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('sub-container');

    const head = document.createElement('div');
    head.classList.add('sub-container__head');
    head.innerText = 'Уровни подписок';
    if (this.options.changeable) {
      const editBtn = new Button(head, {
        viewType: ButtonType.ICON,
        innerIcon: plusIcon,
        actionType: 'button',
        clickHandler: () => {
          openSubscribtionEditor();
        },
      });
      editBtn.addClassNames('sub-container__head_btn');
    }
    this.container.classList.add('sub-container__container');
    container.append(head, this.container);

    return container;
  }

  notify(): void {
    const SubscriptionsMap = new Map<number, Subscription>();
    (store.getState().profile as PayloadGetProfileData)
        .authorSubscriptions?.forEach((sub) => {
          SubscriptionsMap.set(sub.id, sub);
        });
    this.update(SubscriptionsMap);
  }
  update(newSubscriptionsState: Map<number, Subscription>): void {
    this.subscriptionsState.forEach((_, subID) => {
      if (!newSubscriptionsState.has(subID)) {
        this.deleteSubscriptionCard(subID);
      }
    });

    newSubscriptionsState.forEach(
        (subcription, subID) => {
          const oldSubscriptionCard = this.subscriptionsState.get(subID);
          if (oldSubscriptionCard) {
            let status: SubscriptionCardStatus;
            if (this.options.changeable) status = SubscriptionCardStatus.AUTHOR;
            else {
              const userSubscriptions =
                store.getState().userSubscribers as Subscription[] | undefined;
              const idx = userSubscriptions
                  ?.findIndex((sub) => sub.id === subID);
              status =
                (idx !== undefined && idx > -1) ? SubscriptionCardStatus.OWNER :
              SubscriptionCardStatus.DONATER;
            }
            this.subscriptionCards.get(subID)?.update({
              subscriptionStatus: status,
              subscriptionName: subcription.title,
              lvl: subcription.tier,
              img: subcription.img,
              price: subcription.price,
              description: subcription.text,
            });
          } else {
            this.addSubcriptionCard(subcription);
          }
        },
    );
  }

  addSubcriptionCard(sub: Subscription) {
    let status: SubscriptionCardStatus;
    if (this.options.changeable) status = SubscriptionCardStatus.AUTHOR;
    else {
      const userSubscriptions =
          store.getState().userSubscribers as Subscription[] | undefined;
      const idx = userSubscriptions
          ?.findIndex((o) => sub.id === o.id);
      status = (idx !== undefined && idx > -1) ? SubscriptionCardStatus.OWNER :
          SubscriptionCardStatus.DONATER;
    }
    const card = new SubscriptionCard(this.container, {
      subscriptionStatus: status,
      authorID: sub.authorID,
      subscriptionID: sub.id,
      subscriptionName: sub.title,
      lvl: sub.tier,
      img: sub.img,
      price: sub.price,
      description: sub.text,
    });
    card.addClassNames('sub-container__card');
    this.subscriptionCards.set(sub.id, card);
    this.subscriptionsState.set(sub.id, sub);
  }

  private deleteSubscriptionCard(subID: number) {
    this.subscriptionCards.get(subID)?.remove();
    this.subscriptionCards.delete(subID);
    this.subscriptionsState.delete(subID);
  }
}

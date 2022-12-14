import SubscriptionCard,
{SubscriptionCardStatus} from '@components/SubscriptionCard/SubscriptionCard';
import './subscription-cards-container.styl';
import plusIcon from '@icon/plus.svg';
import store from '@app/Store';
import {PayloadSubscription} from '@actions/types/subscribe';
import {openSubscribtionEditor} from '@actions/handlers/editor';
import Button, {ButtonType} from '@components/Button/Button';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import UpgradeViewBase from '@app/UpgradeView';
import {querySelectorWithThrow} from '@flux/types/component';

interface SubscriptionCardsContainerOptions {
  changeable: boolean
}

/**
 * Модель поля подписок
 */
export default class SubscriptionCardsContainer
  extends UpgradeViewBase {
  private subscriptionsState = new Map<number, PayloadSubscription>();
  private subscriptionCards = new Map<number, SubscriptionCard>();
  constructor(el: HTMLElement,
    private options: SubscriptionCardsContainerOptions) {
    super();
    this.renderTo(el);
    this.notify();
  }
  private container: HTMLElement = document.createElement('div');

  protected render(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('subscription-cards-container');

    const header = document.createElement('div');
    header.classList.add(
        'subscription-cards-container__title-area',
        'font_big',
    );
    header.innerText = 'Уровни подписок';

    if (this.options.changeable) {
      new Button(header, {
        viewType: ButtonType.ICON,
        innerIcon: plusIcon,
        actionType: 'button',
        clickHandler: () => {
          openSubscribtionEditor();
        },
      });
    }
    this.container.classList.add('subscription-cards-container__card-area');
    const empty = document.createElement('div');
    empty.classList.add('subscription-cards-container__empty', 'font_regular');
    empty.innerText = this.options.changeable ?
      `Пока что подписок нет
      но вы можете их создать` :
      `Этот автор пока что не создал ни одной подписки`;
    const overflowContainer = document.createElement('div');
    overflowContainer.classList
        .add('subscription-cards-container__overflow-area');
    overflowContainer.append(this.container);
    container.append(header, empty, overflowContainer);

    return container;
  }

  notify(): void {
    const newSubscriptionsState = new Map<number, PayloadSubscription>();
    (store.getState().profile as PayloadGetProfileData)
        .authorSubscriptions?.forEach((sub) => {
          newSubscriptionsState.set(sub.id, sub);
        });
    if (newSubscriptionsState.size == 0) {
      querySelectorWithThrow(
          this.domElement,
          '.subscription-cards-container__empty',
      )
          .hidden = false;
    } else {
      querySelectorWithThrow(
          this.domElement,
          '.subscription-cards-container__empty',
      )
          .hidden = true;
    }
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
              const userSubscriptions = store.getState()
                  .userSubscriptions as Map<number, PayloadSubscription>;
              status =
                userSubscriptions.has(subID) ?
                  SubscriptionCardStatus.ALREADY_DONATED :
                  SubscriptionCardStatus.CAN_DONATE;
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

  protected onErase(): void {
    this.subscriptionCards.forEach((card) => {
      card.remove();
    });
    this.subscriptionCards.clear();
    this.subscriptionsState.clear();
  }

  addSubcriptionCard(sub: PayloadSubscription) {
    let status: SubscriptionCardStatus;
    if (this.options.changeable) status = SubscriptionCardStatus.AUTHOR;
    else {
      const userSubscriptions = store.getState()
          .userSubscriptions as Map<number, PayloadSubscription>;
      status = userSubscriptions.has(sub.id) ?
          SubscriptionCardStatus.ALREADY_DONATED :
          SubscriptionCardStatus.CAN_DONATE;
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
    card.addClassNames('subscription-cards-container__card');
    this.subscriptionCards.set(sub.id, card);
    this.subscriptionsState.set(sub.id, sub);
  }

  private deleteSubscriptionCard(subID: number) {
    this.subscriptionCards.get(subID)?.remove();
    this.subscriptionCards.delete(subID);
    this.subscriptionsState.delete(subID);
  }
}

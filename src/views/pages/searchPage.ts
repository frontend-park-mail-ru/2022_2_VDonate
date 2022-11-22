import api from '@app/api';
import {Glass, GlassType} from '@components/glass/glass';
import {SubscriptionItem} from '@components/subscriptionItem/subscriptionItem';
import {IView} from '@flux/types/view';

export default class SearchPage implements IView {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('content');
    const head = document.createElement('div');
    head.classList.add('content__head');
    head.innerText = 'Доступные авторы';
    const glass = new Glass(GlassType.mono);
    glass.element.classList.add('content__glass');
    api.getUser(17)
        .then((res) => {
          if (res.ok) {
            const sub = new SubscriptionItem(
                17,
                res.body.avatar as string,
                res.body.username as string,
                `донатеров ${res.body.countSubscribers as number}`);
            glass.element.appendChild(sub.element);
          }
        })
        .catch(() => {
          console.log('нет 17 пользовотаеля');
        });
    api.getUser(18)
        .then((res) => {
          if (res.ok) {
            const sub = new SubscriptionItem(
                18,
                res.body.avatar as string,
                res.body.username as string,
                `Донатеров ${res.body.countSubscribers as number}`);
            glass.element.appendChild(sub.element);
          }
        })
        .catch(() => {
          console.log('нет 18 пользовотаеля');
        });
    api.getUser(3)
        .then((res) => {
          if (res.ok) {
            const sub = new SubscriptionItem(
                3,
                res.body.avatar as string,
                res.body.username as string,
                `Донатеров ${res.body.countSubscribers as number}`);
            glass.element.appendChild(sub.element);
          }
        })
        .catch(() => {
          console.log('нет 3 пользовотаеля');
        });
    api.getUser(4)
        .then((res) => {
          if (res.ok) {
            const sub = new SubscriptionItem(
                4,
                res.body.avatar as string,
                res.body.username as string,
                `Донатеров ${res.body.countSubscribers as number}`);
            glass.element.appendChild(sub.element);
          }
        })
        .catch(() => {
          console.log('нет 4 пользовотаеля');
        });
    this.element.append(head, glass.element);
  }
  reset(): void {
    this.element.remove();
  }
  render(): HTMLElement {
    return this.element;
  }
}

import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import ComponentBase from '@flux/types/component';
import './subscription-link.styl';

interface SubscriptionLinkOptions {
  id: number
  imgPath: string
  username: string
  tier: string
  isLast: boolean
}

/**
 * Компонент элемента навбара
 */
export default
class SubscriptionLink extends ComponentBase<'a'> {
  constructor(
      el: HTMLElement, private options: SubscriptionLinkOptions) {
    super();
    this.renderTo(el);
  }
  protected render(): HTMLAnchorElement {
    const subscription = document.createElement('a');
    subscription.setAttribute('href', `/profile?id=${this.options.id}`);
    subscription.setAttribute('data-link', '');
    subscription.classList.
        add('subscription-link', 'subscription-link__back');
    if (!this.options.isLast) {
      subscription.classList.
          add('subscription-link__back_with-border');
    }
    const avatar = new Avatar(subscription, {
      imgPath: this.options.imgPath,
      viewType: AvatarType.AUTHOR,
    });
    avatar.addClassNames('subscription-link__img');

    const user = document.createElement('div');
    user.classList.add('subscription-link__username', 'font_regular');
    user.innerText = this.options.username;
    const lvl = document.createElement('div');
    lvl.classList.add('subscription-link__tier', 'font_regular');
    lvl.innerText = this.options.tier;

    subscription.append(user, lvl);

    return subscription;
  }
  update(data: never): void {
    return data;
  }
}

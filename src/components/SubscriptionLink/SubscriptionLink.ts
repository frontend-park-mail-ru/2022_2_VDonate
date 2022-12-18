import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import ComponentBase from '@flux/types/component';
import './subscription-link.styl';

interface SubscriptionLinkOptions {
  id: number
  imgPath: string
  username: string
  tier: string
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
    const avatar = new Avatar(subscription, {
      imgPath: this.options.imgPath,
      viewType: AvatarType.AUTHOR,
    });
    avatar.addClassNames('subscription-link__img');

    const user = document.createElement('div');
    user.classList.add('subscription-link__username', 'font_regular');
    user.innerText = this.options.username;
    const tier = document.createElement('div');
    tier.classList.add('subscription-link__tier', 'font_regular');
    tier.innerText = this.options.tier;

    subscription.append(user, tier);

    return subscription;
  }
  update(data: never): void {
    return data;
  }
}

import {openPayEditor} from '@actions/handlers/editor';
import {subscribe} from '@actions/handlers/subscribe';
import Button, {ButtonType} from '@components/Button/Button';
import {SubscriptionCardStatus}
  from '@components/SubscriptionCard/SubscriptionCard';
import ComponentBase from '@flux/types/component';
import './follow-button.styl';

interface FollowButtonFollowed {
  isFollowed: true
  subscriptionID: number
}

interface FollowButtonNotFollowed {
  isFollowed: false
}

type FollowButtonOptions = { authorID: number } &
  (FollowButtonFollowed | FollowButtonNotFollowed);

type FollowButtonUpdateContext = FollowButtonFollowed | FollowButtonNotFollowed

export default
class FollowButton extends ComponentBase<'div', FollowButtonUpdateContext> {
  private curBtn!: Button;

  constructor(el: HTMLElement, private options: FollowButtonOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const followButton = document.createElement('div');
    followButton.classList.add('follow-button');

    if (this.options.isFollowed) {
      const subscriptionID = this.options.subscriptionID;
      this.curBtn = new Button(followButton, {
        viewType: ButtonType.OUTLINE,
        actionType: 'button',
        innerText: 'Отписаться',
        clickHandler: () => {
          openPayEditor(
              this.options.authorID,
              subscriptionID,
              SubscriptionCardStatus.ALREADY_DONATED,
          );
        },
      });
    } else {
      this.curBtn = new Button(followButton, {
        viewType: ButtonType.PRIMARY,
        actionType: 'button',
        innerText: 'Подписаться',
        clickHandler: () =>
          subscribe(this.options.authorID, -this.options.authorID),
      });
    }
    return followButton;
  }

  update(data: FollowButtonUpdateContext): void {
    if (data.isFollowed !== this.options.isFollowed) {
      this.curBtn.remove();
      this.options.isFollowed = data.isFollowed;
      if (this.options.isFollowed) {
        const subscriptionID = this.options.subscriptionID;
        this.curBtn = new Button(this.domElement, {
          viewType: ButtonType.PRIMARY,
          actionType: 'button',
          innerText: 'Отписаться',
          clickHandler: () => {
            openPayEditor(
                this.options.authorID,
                subscriptionID,
                SubscriptionCardStatus.ALREADY_DONATED,
            );
          },
        });
      } else {
        this.curBtn = new Button(this.domElement, {
          viewType: ButtonType.PRIMARY,
          actionType: 'button',
          innerText: 'Подписаться',
          clickHandler: () =>
            subscribe(this.options.authorID, -this.options.authorID),
        });
      }
    }
    if (
      data.isFollowed &&
      this.options.isFollowed &&
      data.subscriptionID !== this.options.subscriptionID
    ) {
      this.options.subscriptionID = data.subscriptionID;
      this.curBtn.remove();
      this.curBtn = new Button(this.domElement, {
        viewType: ButtonType.PRIMARY,
        actionType: 'button',
        innerText: 'Отписаться',
        clickHandler: () => {
          openPayEditor(
              this.options.authorID,
              data.subscriptionID,
              SubscriptionCardStatus.ALREADY_DONATED,
          );
        },
      });
    }
  }
}

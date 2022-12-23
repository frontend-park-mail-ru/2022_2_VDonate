import ComponentBase from '@flux/types/component';
import './mini-statistic.styl';

interface MiniStatisticContext {
  countSubscriptions?: number
  countDonaters?: number
  countPosts?: number
  countProfitMounth?: number
  countSubscribersMounth?: number
  isAuthor: boolean
}

interface MiniStatisticOptions {
  countSubscriptions?: number
  countDonaters?: number
  countPosts?: number
  countProfitMounth?: number
  countSubscribersMounth?: number
  isAuthor: boolean
  changeable: boolean
}

/**
 * Компонент элемента навбара
 */
export default
class MiniStatistic
  extends ComponentBase<'div', MiniStatisticContext> {
  private countSubscriptions!: HTMLSpanElement;
  private countDonaters!: HTMLSpanElement;
  private countPosts!: HTMLSpanElement;
  private countProfitMounth!: HTMLSpanElement;
  private countSubscribersMounth!: HTMLSpanElement;
  constructor(el: HTMLElement, private options: MiniStatisticOptions) {
    super();
    this.renderTo(el);
  }

  update(data: MiniStatisticContext): void {
    if (!this.options.isAuthor && data.isAuthor) {
      this.options.isAuthor = data.isAuthor;
      this.domElement.innerHTML = '';
      this.renderAuthorStatistic(this.domElement);
    } else if (this.options.isAuthor && !data.isAuthor) {
      this.options.isAuthor = false;
      this.domElement.innerHTML = '';
      this.renderDonaterStatistic(this.domElement);
    }
    if (this.options.isAuthor) {
      if (this.options.countDonaters !== data.countDonaters) {
        this.options.countDonaters = data.countDonaters;
        this.countDonaters.innerText = data.countDonaters?.toString() ?? '0';
      }
      if (this.options.countPosts !== data.countPosts) {
        this.options.countPosts = data.countPosts;
        this.countPosts.innerText = data.countPosts?.toString() ?? '0';
      }
      if (this.options.changeable &&
          this.options.countProfitMounth !== data.countProfitMounth) {
        this.options.countProfitMounth = data.countProfitMounth;
        this.countProfitMounth.innerText =
          this.options.countProfitMounth?.toString() ?? '0';
        this.countProfitMounth.innerHTML += ' &#8381;';
      }
      if (this.options.changeable &&
        this.options.countSubscribersMounth !== data.countSubscribersMounth) {
        this.options.countSubscribersMounth = data.countSubscribersMounth;
        this.countSubscribersMounth.innerText =
          data.countSubscribersMounth?.toString() ?? '0';
      }
    } else {
      if (this.options.countSubscriptions !== data.countSubscriptions) {
        this.options.countSubscriptions = data.countSubscriptions;
        this.countSubscriptions.innerText =
          data.countSubscriptions?.toString() ?? '0';
      }
    }
  }

  protected render(): HTMLDivElement {
    const miniStatistic = document.createElement('div');
    miniStatistic.classList.add('mini-statistic');
    if (this.options.isAuthor) {
      this.renderAuthorStatistic(miniStatistic);
    } else {
      this.renderDonaterStatistic(miniStatistic);
    }

    return miniStatistic;
  }

  private renderAuthorStatistic(miniStatistic: HTMLDivElement) {
    const donatersContainer = document.createElement('div');
    donatersContainer.classList
        .add('mini-statistic__container', 'statistic');

    const donaters = document.createElement('span');
    donaters.classList.add('statistic__text', 'font_regular');
    donaters.innerText = 'Донатеров';

    this.countDonaters = document.createElement('span');
    this.countDonaters.classList.add('statistic__text', 'font_regular');
    this.countDonaters.innerText =
      this.options.countDonaters?.toString() ?? '0';
    donatersContainer.append(donaters, this.countDonaters);
    miniStatistic.appendChild(donatersContainer);

    const postsContainer = document.createElement('div');
    postsContainer.classList
        .add('mini-statistic__container', 'statistic');

    const posts = document.createElement('span');
    posts.classList.add('statistic__text', 'font_regular');
    posts.innerText = 'Постов';

    this.countPosts = document.createElement('span');
    this.countPosts.classList.add('statistic__text', 'font_regular');
    this.countPosts.innerText =
      this.options.countPosts?.toString() ?? '0';
    postsContainer.append(posts, this.countPosts);
    miniStatistic.appendChild(postsContainer);

    if (this.options.changeable) {
      const profitContainer = document.createElement('div');
      profitContainer.classList
          .add('mini-statistic__container', 'statistic');

      const profit = document.createElement('span');
      profit.classList.add('statistic__text', 'font_regular');
      profit.innerText = 'Заработок за месяц';

      this.countProfitMounth = document.createElement('span');
      this.countProfitMounth
          .classList.add('statistic__text', 'font_regular');

      this.countProfitMounth.innerText =
        this.options.countProfitMounth?.toString() ?? '0';

      this.countProfitMounth.innerHTML += ' &#8381;';
      profitContainer.append(profit, this.countProfitMounth);
      miniStatistic.appendChild(profitContainer);

      const subPerMounthContainer = document.createElement('div');
      subPerMounthContainer.classList
          .add('mini-statistic__container', 'statistic');

      const subPerMounth = document.createElement('span');
      subPerMounth.classList.add('statistic__text', 'font_regular');

      subPerMounth.innerText = 'Донатеров за месяц';

      this.countSubscribersMounth = document.createElement('span');
      this.countSubscribersMounth
          .classList.add('statistic__text', 'font_regular');

      this.countSubscribersMounth.innerText =
        this.options.countSubscribersMounth?.toString() ?? '0';

      subPerMounthContainer.append(subPerMounth, this.countSubscribersMounth);
      miniStatistic.appendChild(subPerMounthContainer);
    }
  }

  private renderDonaterStatistic(miniStatistic: HTMLDivElement) {
    const subsContainer = document.createElement('div');
    subsContainer.classList.add('mini-statistic__container', 'statistic');

    const subscriptionsTitle = document.createElement('span');
    subscriptionsTitle.classList.add('statistic__text', 'font_regular');
    subscriptionsTitle.innerText = 'Подписок';

    this.countSubscriptions = document.createElement('span');
    this.countSubscriptions.classList
        .add('statistic__text', 'font_regular');
    this.countSubscriptions.innerText =
      this.options.countSubscriptions?.toString() ?? '0';

    subsContainer.append(subscriptionsTitle, this.countSubscriptions);
    miniStatistic.appendChild(subsContainer);
  }
}

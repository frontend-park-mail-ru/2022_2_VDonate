import './navbar.styl';
import feedIcon from '@icon/feed.svg';
import searchIcon from '@icon/search.svg';
import store from '@app/Store';
import Logo from '@components/Logo/Logo';
import NavbarLink from '@components/NavbarLink/NavbarLink';
import {getSubscriptions} from '@actions/handlers/subscribe';
import SubscriptionsListContainer
  from '../SubscriptionsListContainer/SubscriptionsListContainer';
import UpgradeViewBase from '@app/UpgradeView';
import {PayloadLocation} from '@actions/types/routing';
import {Pages} from '@configs/router';
import NoticeBell from '@components/NoticeBell/NoticeBell';
import ProfileContainer from '../ProfileContainer/ProfileContainer';

const links = [
  {
    icon: feedIcon,
    text: 'Лента',
    link: '/feed',
  },
  {
    icon: searchIcon,
    text: 'Поиск',
    link: '/search',
  },
];

/**
 * Модель левого навбара
 */
export default class Navbar extends UpgradeViewBase {
  private navbarLinks: NavbarLink[] = [];
  private profile!: HTMLElement;
  private locationState: PayloadLocation;
  // private profileMini!: ProfileMini;
  private subscriptionsListContainer!: SubscriptionsListContainer;
  private noticeBell!: NoticeBell;
  // private backNoticeCount: number;
  private profileContainer!: ProfileContainer;

  constructor(el: HTMLElement, private options: number) {
    super();
    this.locationState = store.getState().location as PayloadLocation;
    this.renderTo(el);
    getSubscriptions(options);
  }

  protected render(): HTMLDivElement {
    const navbar = document.createElement('div');
    navbar.classList.add('navbar');

    const back = document.createElement('div');
    back.classList.add('navbar__back', 'bg_main');
    navbar.appendChild(back);

    const logo = new Logo(back);
    logo.addClassNames('navbar__logo');

    links.forEach(({icon, text, link}) => {
      const linkComponent = new NavbarLink(back, {
        isActive: false,
        href: link,
        icon,
        text,
      });
      linkComponent.addClassNames('navbar__link');
      this.navbarLinks.push(linkComponent);
    });

    const hr = document.createElement('hr');
    hr.classList.add('navbar-hr', 'bg_hr');
    back.appendChild(hr);

    this.subscriptionsListContainer = new SubscriptionsListContainer(back);
    this.subscriptionsListContainer.addClassNames('navbar__subs-list');

    back.appendChild(hr.cloneNode());

    this.profileContainer = new ProfileContainer(back, {
      id: this.options,
      subMebuParent: navbar,
    });

    this.renderLocation(this.locationState.type);
    return navbar;
  }

  /** Callback метод обновления хранилища */
  notify(): void {
    const locationNew = store.getState().location as PayloadLocation;
    if (this.locationState.type !== locationNew.type) {
      this.locationState = locationNew;
      this.renderLocation(locationNew.type);
    }
  }

  protected onErase(): void {
    this.navbarLinks.forEach((link) => {
      link.remove();
    });
    this.subscriptionsListContainer.erase();
    this.profileContainer.erase();
  }

  /**
   * рендер выбора локации
   * @param page -
   */
  renderLocation(page: Pages) {
    switch (page) {
      case Pages.FEED:
        this.navbarLinks[0].update(true);
        this.navbarLinks[1].update(false);
        break;
      case Pages.SEARCH:
        this.navbarLinks[0].update(false);
        this.navbarLinks[1].update(true);
        break;
      default:
        this.navbarLinks.forEach((link) => {
          link.update(false);
        });
        break;
    }
  }

  /** функция скрывающая navbar */
  hideNavbar() {
    this.domElement.style.display = 'none';
  }
  /** функция показывающая navbar */
  showNavbar() {
    this.domElement.removeAttribute('style');
  }
}

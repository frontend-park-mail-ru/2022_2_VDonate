import {Glass, GlassType} from '@components/glass/glass';
import {IconButton} from '@components/icon_button/icon_button';
import {Popup} from '../popup/about/popup';
import './about.styl';
import editIcn from '@icon/edit.svg';
import store from '@app/store';
import {IObserver} from '@flux/types/observer';
import {PayloadGetProfileData} from '@actions/types/getProfileData';

/**
 * Модель поля 'Обо мне'
 */
export class About implements IObserver {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  private about: HTMLElement;
  private textAbout: string | undefined;
  /**
   * @param changeable возможность изменять текст
   */
  constructor(changeable: boolean) {
    const glass = new Glass(GlassType.mono);
    this.element = glass.element;
    this.element.classList.add('about');
    const head = document.createElement('div');
    head.classList.add('about__head');
    head.innerText = 'Обо мне';
    this.about = document.createElement('div');
    this.about.classList.add('about__text');
    const profileStore = store.getState().profile as PayloadGetProfileData;
    this.textAbout = profileStore.profile?.about;
    if (changeable) {
      const redactBtn = new IconButton(editIcn, 'button');
      redactBtn.element.classList.add('about__head_btn');
      head.appendChild(redactBtn.element);
      redactBtn.element.onclick = () => {
        const popup = new Popup(
            'Обо мне',
            this.textAbout,
        );
        document.body.appendChild(popup.element);
      };
    }
    this.element.appendChild(head);
    this.element.appendChild(this.about);
    store.registerObserver(this);
  }

  /**
   * set text
   */
  setText() {
    if (this.textAbout) {
      this.about.innerHTML = this.textAbout;
    } else {
      this.about.innerHTML = 'Пользователь пока что не расказал о себе';
    }
  }

  /** Callback метод обновления хранилища */
  notify(): void {
    const profileStore = store.getState().profile as PayloadGetProfileData;
    if (profileStore.profile?.about != this.textAbout && profileStore.profile) {
      this.textAbout = profileStore.profile.about;
      this.setText();
    }
  }
}

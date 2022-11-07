import {Glass, GlassType} from '@components/glass/glass';
import {IconButton} from '@components/icon_button/icon_button';
import {Popup} from '../popup/post_and_about/popup';
import './about.styl';
import redactIcn from '@icon/redact.svg';
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
    if (changeable) {
      const redactBtn = new IconButton(redactIcn, 'button');
      redactBtn.element.classList.add('about__head_btn');
      head.appendChild(redactBtn.element);
      // TODO: вызвать изменение вместо пустой фунции
      const popup = new Popup(
          'Обо мне',
          '', // TODO потом придумать что с этим сделать
          () => {
            // TODO: вызвать изменение вместо пустой фунции
            return true;
          });
      redactBtn.element.onclick = () => {
        popup.element.style.display = 'flex';
      };
      document.getElementById('entry')?.appendChild(popup.element);
    }
    this.about = document.createElement('div');
    this.about.classList.add('about__text');
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

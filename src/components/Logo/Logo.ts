import './logo.styl';
import donutIco from '@icon/favicon.ico';
import ComponentBase from '@flux/types/component';
import routing from '@actions/handlers/routing';
import {PayloadUser} from '@actions/types/user';
import store from '@app/Store';

/**
 * Компонент лого
 */
export default class Logo extends ComponentBase<'div'> {
  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const logo = document.createElement('div');
    logo.classList.add('logo');
    const vd = document.createElement('span');
    vd.classList.add('logo__text', 'font_logo');
    vd.innerText = 'ВД';
    const donut = document.createElement('img');
    donut.classList.add('logo__icon');
    donut.src = donutIco;
    const nate = document.createElement('span');
    nate.classList.add('logo__text', 'font_logo');
    nate.innerText = 'нате';
    logo.appendChild(vd);
    logo.appendChild(donut);
    logo.appendChild(nate);

    logo.addEventListener('click', () => {
      if ((store.getState().user as PayloadUser).id) {
        routing('/feed');
      }
    });
    return logo;
  }

  update(data: never): void {
    return data;
  }
}

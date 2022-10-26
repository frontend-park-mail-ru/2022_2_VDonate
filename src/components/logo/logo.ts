import './logo.styl';
import donutIco from '@icon/favicon.ico';

/**
 * Компонент лого
 */
export class Logo {
  /**
   * Актуальный контейнер лого
   */
  readonly element : HTMLElement;

  /**
   * Конструктор
  */
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('logo');
    const vd = document.createElement('span');
    vd.classList.add('logo__text');
    vd.innerText = 'ВД';
    const donut = document.createElement('img');
    donut.classList.add('logo__ico');
    donut.src = donutIco;
    const nate = document.createElement('span');
    nate.classList.add('logo__text');
    nate.innerText = 'нате';
    this.element.appendChild(vd);
    this.element.appendChild(donut);
    this.element.appendChild(nate);
  }
}

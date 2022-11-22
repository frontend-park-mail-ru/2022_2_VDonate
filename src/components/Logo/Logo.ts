import './logo.styl';
import donutIco from '@icon/favicon.ico';
import ComponentBase from '@flux/types/component';

/**
 * Компонент лого
 */
export default class Logo extends ComponentBase<HTMLDivElement, never> {
  protected render(): HTMLDivElement {
    const logo = document.createElement('div');
    logo.classList.add('logo');
    const vd = document.createElement('span');
    vd.classList.add('logo__text');
    vd.innerText = 'ВД';
    const donut = document.createElement('img');
    donut.classList.add('logo__ico');
    donut.src = donutIco;
    const nate = document.createElement('span');
    nate.classList.add('logo__text');
    nate.innerText = 'нате';
    logo.appendChild(vd);
    logo.appendChild(donut);
    logo.appendChild(nate);
    return logo;
  }

  update(data: never): void {
    return data;
  }
}

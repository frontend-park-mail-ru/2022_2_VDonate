import ComponentBase from '@flux/types/component';
import './small-size-info.styl';
import memImg from '@img/mem.jpg';

export default class SmallSizeInfo extends ComponentBase<'div'> {
  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const smallSizeInfo = document.createElement('div');
    smallSizeInfo.classList.add('small-size-info', 'font_regular');

    const infoText = document.createElement('span');
    infoText.classList.add('small-size-info__text');
    infoText.innerText = `
      Извините, Ваш экран слишком мал
      ¯\\_(ツ)_/¯
      Попробуйте перейти в альбомную ориентацию или воспользоваться 
      другим устройством
    `;
    smallSizeInfo.appendChild(infoText);

    const memImage = document.createElement('img');
    memImage.src = memImg;
    memImage.alt = 'mem';
    memImage.classList.add('small-size-info__img');
    smallSizeInfo.appendChild(memImage);

    return smallSizeInfo;
  }

  update(data: never): void {
    return data;
  }
}

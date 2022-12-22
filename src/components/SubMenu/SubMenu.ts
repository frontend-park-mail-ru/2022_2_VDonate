import ComponentBase from '@flux/types/component';
import './sub-menu.styl';
import Button, {ButtonOptions} from '@components/Button/Button';
import BackNoticeContainer
  from '@views/containers/BackNoticeContainer/BackNoticeConatiner';

export enum SubMenuType {
  PROFILE,
  NOTICE,
}

interface SubMenuOptions {
  type: SubMenuType
  buttonsOptions: ButtonOptions[];
}

type SubMenuUpdateContext = 'toggle' | 'enable' | 'disable'

export default
class SubMenu extends ComponentBase<'div', SubMenuUpdateContext> {
  private noticeContainer?: BackNoticeContainer;

  constructor(el: HTMLElement, private options: SubMenuOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const btnArea = document.createElement('div');
    btnArea.classList.add('sub-menu', 'sub-menu__back', 'bg_sub-menu');

    if (this.options.type === SubMenuType.NOTICE) {
      this.noticeContainer = new BackNoticeContainer(btnArea);
    }

    this.options.buttonsOptions.forEach((buttonOptions) => {
      new Button(btnArea, buttonOptions);
    });

    return btnArea;
  }

  update(data: SubMenuUpdateContext): void {
    switch (data) {
      case 'toggle':
        if (this.domElement.classList.contains('sub-menu_enable')) {
          this.domElement.classList.remove('sub-menu_enable');
        } else {
          this.domElement.classList.add('sub-menu_enable');
        }
        break;
      case 'enable':
        this.domElement.classList.add('sub-menu_enable');
        break;
      case 'disable':
        this.domElement.classList.remove('sub-menu_enable');
        break;
      default:
        break;
    }
  }

  remove(): void {
    super.remove();
    this.noticeContainer?.erase();
  }
}

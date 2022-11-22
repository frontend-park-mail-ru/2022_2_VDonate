// import {PayloadLocation} from '@actions/types/routing';
// import store from '@app/store';
// import {Pages} from '@configs/router';
// import {IObserver} from '@flux/types/observer';
// import PreloadPage from './pages/PreloadPage';
// import EntryPage, {EntryFormType} from './pages/EntryPage/EntryPage';
// import NotFoundPage from './pages/NotFoundPage';
// import {PayloadNotice} from '@actions/types/notice';
// import ProfilePage from './pages/ProfilePage/ProfilePage';
// import {LeftNavbar} from '@models/navbar/left/left_navbar';
// import {auth} from '@actions/handlers/user';
// import {PayloadEditor} from '@actions/types/editor';
// import EditorContainer from './containers/EditorContainer/EditorContainer';
// import {FormErrorType, PayloadFormError} from '@actions/types/formError';
// import NoticeContainer from './containers/NoticeContainer/NoticeContainer';
// import {getSubscritions} from '@actions/handlers/subscribe';
// import {PayloadUser} from '@actions/types/user';
// import FeedPage from './pages/FeedPage/FeedPage';
// import ViewBase from '@flux/types/view';
// /** Тип структорного представления страницы из компонентов */
// interface RootModel {
//   root: HTMLElement
//   children: {
//     leftNavBar: LeftNavbar
//     main?: IView
//     editor: EditorContainer
//     notice: NoticeContainer
//   }
// }
// FIXME Доделать
// type Page =
//   | NotFoundPage
//   | PreloadPage
//   | ProfilePage
//   | EntryPage
//   | FeedPage

// class App extends ViewBase<PayloadLocation> {
//   private locationState!: PayloadLocation;
//   private leftNavBar!: LeftNavbar;
//   private editor!: EditorContainer;
//   private notice!: NoticeContainer;
//   private page!: Page;

//   constructor(element: HTMLElement) {
//     super(element);
//     this.notify();
//     store.registerObserver(this);
//   }
//   erase(): void {
//     store.removeObserver(this);

//     this.editor.erase();
//     this.notice.erase();

//     this.remove();
//   }
//   protected render(): HTMLDivElement {
//     const app = document.createElement('div');

//     this.leftNavBar = new LeftNavbar();
//     app.appendChild(this.leftNavBar.element);

//     this.editor = new EditorContainer(app);
//     this.notice = new NoticeContainer(app);

//     this.page = new PreloadPage();
//     app.appendChild(this.page.render());

//     return app;
//   }
//   notify(): void {
//     const state = store.getState();

//     const locationNew = state.location as PayloadLocation;
//     if (JSON.stringify(locationNew) !== JSON.stringify(this.locationState)) {
//       this.locationState = locationNew;
//       this.update(this.locationState);
//     }
//   }
//   update(data: PayloadLocation): void {
//     switch (data.type) {
//       case Pages.PRELOAD:
//         this.leftNavBar.hideNavbar();
//         this.page.reset();
//         this.page = new PreloadPage();
//         return this.page.children.main.render();
//       case Pages.LOGIN:
//         this.leftNavBar.hideNavbar();
//         this.page.children.main = new EntryPage(EntryFormType.logIn);
//         return this.page.children.main.render();
//       case Pages.SIGNUP:
//         this.leftNavBar.hideNavbar();
//         this.page.children.main = new EntryPage(EntryFormType.signUp);
//         return this.page.children.main.render();
//       case Pages.PROFILE:
//         this.leftNavBar.showNavbar();
//         this.page.children.main = new ProfilePage();
//         return this.page.children.main.render();
//       case Pages.FEED:
//         this.leftNavBar.showNavbar();
//         this.page.children.main = new FeedPage();
//         return this.page.children.main.render();
//       case Pages.SEARCH:
//       case Pages.NOT_FOUND:
//         this.leftNavBar.showNavbar();
//         this.page.children.main = new NotFoundPage();
//         return this.page.children.main.render();
//     }
//   }
// }

// /** Класс корневой вьюшки */
// export default class Root {
//   private page: RootModel;
//   /** Состояния расположения в приложении */
//   private locationState: PayloadLocation;
//   private noticeState: PayloadNotice;
//   private formErrors: PayloadFormError;
//   private editorState: PayloadEditor;
//   private user: PayloadUser | undefined;
//   /**
//    * Конструктор
//    * @param rootElement - корневой элемент для вставки страницы
//    */
//   constructor(rootElement: HTMLElement) {
//     const state = store.getState();
//     this.locationState = state.location as PayloadLocation;
//     this.noticeState = state.notice as PayloadNotice;
//     this.editorState = state.editor as PayloadEditor;

//     this.page = {
//       root: rootElement,
//       children: {
//         leftNavBar: new LeftNavbar(),
//         editor: new EditorContainer(),
//         notice: new NoticeContainer(),
//       },
//     };

//     rootElement.append(
//         this.leftNavBar.element,
//         this.page.children.editor.element,
//         this.page.children.notice.element,
//         this.render(),
//     );

//     store.registerObserver(this);
//     auth();
//   }

//   /** Оповещение об изменением хранилища */
//   notify(): void {
//     const state = store.getState();

//     const newUser = store.getState().user as PayloadUser;
//     if (newUser !== this.user) {
//       this.user = newUser;
//       getSubscritions(newUser.id);
//     }
//     const noticeStateNew = state.notice as PayloadNotice;
//     if (JSON.stringify(noticeStateNew) !== JSON.stringify(this.noticeState))
// {
//       this.noticeState = noticeStateNew;
//       if (typeof this.noticeState.message === 'string' &&
//         /^[а-яёА-ЯЁ]/.test(this.noticeState.message)) {
//         this.page.children.notice.update(this.noticeState.message);
//       }
//       if (Array.isArray(this.noticeState.message)) {
//         this.noticeState.message.forEach(
//             (message) => this.page.children.notice.update(message),
//         );
//       }
//     }

//     const formErrorsNew = state.formErrors as PayloadFormError;
//     if (JSON.stringify(formErrorsNew) !== JSON.stringify(this.formErrors)) {
//       this.formErrors = formErrorsNew;
//       switch (this.formErrors?.type) {
//         case FormErrorType.EDIT_USER:
//         case FormErrorType.AUTHOR_SUBSCRIPTION:
//           this.page.children.editor.displayErrors(this.formErrors);
//           break;
//         default:
//           break;
//       }
//     }

//     const editorNew = state.editor as PayloadEditor;
//     if (JSON.stringify(editorNew) !== JSON.stringify(this.editorState)) {
//       this.editorState = editorNew;
//       this.page.children.editor.displayEditor(this.editorState);
//     }

//     const locationNew = state.location as PayloadLocation;
//     if (JSON.stringify(locationNew) !== JSON.stringify(this.locationState)) {
//       this.locationState = locationNew;
//       this.page.root.appendChild(this.render());
//     }
//   }
//   /** Сброс страницы */
//   reset(): void {
//     if (!this.page.children.main) {
//       return;
//     }
//     this.page.children.main.reset();
//     this.page.children.main = undefined;
//   }
//   /**
//    * Отрисовка старницы по урлу
//    * @returns Страница-элемент для вставки в body
//    */
//   render(): HTMLElement {
//     this.reset();
//     switch (this.locationState.type) {
//       case Pages.PRELOAD:
//         this.leftNavBar.hideNavbar();
//         this.page.children.main = new PreloadPage();
//         return this.page.children.main.render();
//       case Pages.LOGIN:
//         this.leftNavBar.hideNavbar();
//         this.page.children.main = new EntryPage(EntryFormType.logIn);
//         return this.page.children.main.render();
//       case Pages.SIGNUP:
//         this.leftNavBar.hideNavbar();
//         this.page.children.main = new EntryPage(EntryFormType.signUp);
//         return this.page.children.main.render();
//       case Pages.PROFILE:
//         this.leftNavBar.showNavbar();
//         this.page.children.main = new ProfilePage();
//         return this.page.children.main.render();
//       case Pages.FEED:
//         this.leftNavBar.showNavbar();
//         this.page.children.main = new FeedPage();
//         return this.page.children.main.render();
//       case Pages.SEARCH:
//       case Pages.NOT_FOUND:
//         this.leftNavBar.showNavbar();
//         this.page.children.main = new NotFoundPage();
//         return this.page.children.main.render();
//     }
//   }
// }

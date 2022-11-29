// import About from '@components/About/About';
// import PostEditor from '@components/Editor/PostEditor';
// import ProfileEditor from '@components/Editor/ProfileEditor';
// import SubscriptionEditor from '@components/Editor/SubscriptionEditor';
// import {FormErrorType} from '@actions/types/formError';
// import LogInForm from '@components/EntryForm/LogInForm';
// import SignUpForm from '@components/EntryForm/SignUpForm';
// import Logo from '@components/Logo/Logo';
// import NavbarLink from '@components/NavbarLink/NavbarLink';
// import Notice from '@components/Notice/Notice';
// import PayEditor from '@components/Editor/PayEditor';
// import Post, {PostUpdateType} from '@components/Post/Post';
// import ProfileInfo from '@components/ProfileInfo/ProfileInfo';
// import SubscriptionCard, {SubscriptionCardStatus}
// from '@components/SubscriptionCard/SubscriptionCard';
// import SubscriptionLink from '@components/SubscriptionLink/SubscriptionLink';
// import img from '@img/0.jpg';

// const a = new About(document.body, {
//   aboutTextHtml: `
//   <b>Жирный</b> Нежирный
//   `,
// });

// const pe = new PostEditor(document.body, {
//   id: 1,
//   text: 'qwewqe',
//   title: 'ewq',
// });

// const pe = new ProfileEditor(document.body, {
//   id: 1,
//   email: 'qwe',
//   isAuthor: true,
//   username: 'erew',
// });

// const pe = new SubscriptionEditor(document.body, {
//   id: 1,
//   price: 123,
//   text: 'qwe',
//   tier: 2,
//   title: 'qwqq',
// });

// const l = new LogInForm(document.body);

// const s = new SignUpForm(document.body);


// const logo = new Logo(document.body);

// const link = new NavbarLink(document.body, {
//   href: 'qwe',
//   icon: img,
//   text: 'rrr',
// });

// const n = new Notice(document.body, {
//   message: 'qwe',
//   onDelete() {
//     console.log('this.message');
//   },
// });

// const p = new Post(document.body, {
//   author: {
//     id: 1,
//     imgPath: img,
//     username: 'test',
//   },
//   changable: true,
//   commentsNum: 10,
//   content: {
//     img,
//     text: 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqwwwwwwwwwwwwwwwwwwwwweeeeeeeeee',
//     title: 'qweqweqwe',
//   },
//   date: new Date(Date.now()),
//   isLiked: false,
//   likesNum: 12,
//   postID: 1,
// });

// const ni = new ProfileInfo(document.body, {
//   avatar: img,
//   isAuthor: false,
//   countSubscriptions: 10,
//   username: 'Childe',
// });

// const sc = new SubscriptionCard(document.body, {
//   authorID: 1,
//   description:
// 'jjjjgjghgjodnhgoupsjgfpisrgivponsdfz;ohfojtyhyijpoitruyoiearhg',
//   img,
//   lvl: 100,
//   price: 100000,
//   subscriptionID: 1,
//   subscriptionName: 'qweeqw',
//   subscriptionStatus: SubscriptionCardStatus.AUTHOR,
// });

// setTimeout(() => {
//   sc.update({
//     description: 'qwe',
//   });
// }, 10000);

// const sl = new SubscriptionLink(document.body, {
//   id: 1,
//   imgPath: img,
//   tier: 2,
//   username: 'qwe',
// });

// const pae = new PayEditor(document.body, {
//   authorID: 1,
//   authorSubscriptionID: 2,
//   subType: SubscriptionCardStatus.DONATER,
// });

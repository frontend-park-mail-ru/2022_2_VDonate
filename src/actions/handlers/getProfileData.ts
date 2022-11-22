import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {
  PayloadProfileUser} from '@actions/types/getProfileData';
import {PayloadPost} from '@actions/types/posts';
import {PostResponse} from './posts';
import {Pages} from '@configs/router';
import {Subscription} from '@actions/types/subscribe';


const getAuthorData = async (user: PayloadProfileUser) => {
  const getSubscriptionsRes = await api.getAuthorSubscriptions(user.id);
  const getPostsRes = await api.getAuthorPosts(user.id);
  const authorSubscriptions = getSubscriptionsRes.ok ?
    getSubscriptionsRes.body as Subscription[] : undefined;

  const posts = getPostsRes.ok ?
    (getPostsRes.body as PostResponse[]).map(
        (postResponse) => {
          const post: PayloadPost = {
            author: {
              id: user.id,
              username: user.username,
              imgPath: user.avatar,
            },
            postID: postResponse.postID,
            content: {
              img: postResponse.img,
              text: postResponse.text,
              title: postResponse.title,
            },
            likesNum: postResponse.likesNum,
            isLiked: postResponse.isLiked,
            commentsNum: 0, // TODO получать из запроса
            date: new Date(Date.now()), // TODO получать из запроса
          };
          return post;
        },
    ) : undefined;

  store.dispatch({
    type: ActionType.GETPROFILEDATA,
    payload: {
      user,
      authorSubscriptions,
      posts,
    },
  });
};

const getDonaterData = async (user: PayloadProfileUser) => {
  const getSubscriptionsRes = await api.getSubscriptions(user.id);
  const subscriptions = getSubscriptionsRes.ok ?
    getSubscriptionsRes.body as Subscription[] :
    undefined;

  store.dispatch({
    type: ActionType.GETPROFILEDATA,
    payload: {
      user,
      subscriptions,
    },
  });
};

export default (id: number): void => {
  api.getUser(id)
      .then((res: ResponseData) => {
        if (res.ok) {
          const user: PayloadProfileUser = {
            id: id,
            avatar: res.body.avatar as string,
            isAuthor: res.body.isAuthor as boolean,
            username: res.body.username as string,
            countSubscriptions: res.body.countSubscriptions as number,
          };
          if (user.isAuthor) {
            user.countSubscribers = res.body.countSubscribers as number;
            user.about = res.body.about as string;
            return getAuthorData(user);
          } else {
            return getDonaterData(user);
          }
        } else {
          if (res.status === 404) {
            store.dispatch({
              type: ActionType.ROUTING,
              payload: {
                type: Pages.NOT_FOUND,
              },
            });
          }
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: res.body.message as string,
            },
          });
          return;
        }
      },
      )
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
        return;
      },
      );
};

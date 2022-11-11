import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {
  PayloadAuthorSubscription,
  PayloadProfileSubscription,
  PayloadProfileUser} from '@actions/types/getProfileData';
import {PayloadPost} from '@actions/types/posts';
import {PostResponse} from './posts';

const getAuthorData = async (id: number, user: PayloadProfileUser) => {
  const getSubscriptionsRes = await api.getAuthorSubscriptions(id);
  const getPostsRes = await api.getAuthorPosts(id);
  const authorSubscriptions = getSubscriptionsRes.ok ?
    getSubscriptionsRes.body as PayloadAuthorSubscription[] : undefined;

  const posts = getPostsRes.ok ?
    (getPostsRes.body as PostResponse[]).map(
        (postResponse) => {
          const post: PayloadPost = {
            author: {
              id,
              username: user.username,
              img: user.avatar,
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

const getDonater = async (id: number, user: PayloadProfileUser) => {
  const getSubscriptionsRes = await api.getSubscriptions(id);
  const subscriptions = getSubscriptionsRes.ok ?
    getSubscriptionsRes.body as PayloadProfileSubscription[] :
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
      .then(
          (res: ResponseData) => {
            if (res.ok) {
              const user = res.body as PayloadProfileUser;
              return user.isAuthor ?
                getAuthorData(id, user) :
                getDonater(id, user);
            } else {
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
      .catch(
          (err) => {
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

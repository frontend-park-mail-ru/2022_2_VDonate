import {PayloadAuthorSubscriptionErrors} from './subscribe';
import {
  PayloadEditUserErrors,
  PayloadLogInErrors,
  PayloadSignUpErrors,
} from './user';

export enum FormErrorType {
  LOGIN,
  SIGNUP,
  EDIT_USER,
  AUTHOR_SUBSCRIPTION,
}

export type PayloadFormError =
  | PayloadLogInErrors
  | PayloadSignUpErrors
  | PayloadEditUserErrors
  | PayloadAuthorSubscriptionErrors
  | undefined

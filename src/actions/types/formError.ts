import {PayloadAuthorSubscriptionErrors} from './subscribe';
import {
  PayloadEditUserErrors,
  PayloadLogInErrors,
  PayloadSignUpErrors,
  PayloadWithdrawErrors,
} from './user';

export enum FormErrorType {
  LOGIN,
  SIGNUP,
  EDIT_USER,
  AUTHOR_SUBSCRIPTION,
  WITHDRAW,
}

export type PayloadFormError =
  | PayloadLogInErrors
  | PayloadSignUpErrors
  | PayloadEditUserErrors
  | PayloadAuthorSubscriptionErrors
  | PayloadWithdrawErrors;

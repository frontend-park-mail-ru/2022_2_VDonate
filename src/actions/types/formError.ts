import {
  PayloadEditUserErrors,
  PayloadLogInErrors,
  PayloadSignUpErrors,
} from './user';

export enum FormErrorType {
  LOGIN,
  SIGNUP,
  EDIT_USER,
}

export type PayloadFormError =
  | PayloadLogInErrors
  | PayloadSignUpErrors
  | PayloadEditUserErrors
  | undefined

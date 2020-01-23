import { User } from "../models";

export const SIGNIN_PENDING = "SIGNIN_PENDING";
export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS";
export const SIGNIN_ERROR = "SIGNIN_ERROR";

export const SIGNUP_PENDING = "SIGNUP_PENDING";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_ERROR = "SIGNUP_ERROR";

export const SIGNOUT_PENDING = "SIGNOUT_PENDING";
export const SIGNOUT_SUCCESS = "SIGNOUT_SUCCESS";
export const SIGNOUT_ERROR = "SIGNOUT_ERROR";

export const signInPending = (payload: Partial<User>) =>
  ({
    type: SIGNIN_PENDING,
    payload
  } as const);

export const signInSuccess = () =>
  ({
    type: SIGNIN_SUCCESS
  } as const);

export const signInError = (payload: object) =>
  ({
    type: SIGNIN_ERROR,
    payload,
    error: true
  } as const);

export const signUpPending = (payload: Partial<User>) =>
  ({
    type: SIGNUP_PENDING,
    payload
  } as const);

export const signUpSuccess = () =>
  ({
    type: SIGNUP_SUCCESS
  } as const);

export const signUpError = (payload: object) =>
  ({
    type: SIGNUP_ERROR,
    payload,
    error: true
  } as const);

export const signOutPending = () =>
  ({
    type: SIGNOUT_PENDING
  } as const);

export const signOutSuccess = () =>
  ({
    type: SIGNOUT_SUCCESS
  } as const);

export const signOutError = (payload: object) =>
  ({
    type: SIGNOUT_ERROR,
    payload,
    error: true
  } as const);

export type TAuthActions =
  | ReturnType<typeof signInPending>
  | ReturnType<typeof signInSuccess>
  | ReturnType<typeof signInError>
  | ReturnType<typeof signUpPending>
  | ReturnType<typeof signUpSuccess>
  | ReturnType<typeof signUpError>
  | ReturnType<typeof signOutPending>
  | ReturnType<typeof signOutSuccess>
  | ReturnType<typeof signOutError>;

export type AuthActionDataTypes = TAuthActions["type"];

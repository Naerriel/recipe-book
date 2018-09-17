import * as AuthActions from './auth.actions';

export interface State {
  token: string;
  uid: string;
  authenticated: boolean;
}

const initialState: State = {
  token: null,
  uid: null,
  authenticated: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case (AuthActions.SIGNUP):
    case (AuthActions.SIGNIN):
      return {
        ...state,
        authenticated: true
      };
    case (AuthActions.LOGOUT):
      return {
        ...state,
        token: null,
        authenticated: false
      };
    case (AuthActions.SET_TOKEN):
      return {
        ...state,
        token: action.payload
      };
    case (AuthActions.SET_UID):
      return {
        ...state,
        uid: action.payload
      };
    default:
      return state;
  }
}

import axios from 'axios';
import { translate } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { AUTH_API_URL, SERVICENET_API_URL } from 'app/shared/util/service-url.constants';

export const ACTION_TYPES = {
  CREATE_ACCOUNT: 'register/CREATE_ACCOUNT',
  RESET: 'register/RESET'
};

const initialState = {
  loading: false,
  registrationSuccess: false,
  registrationFailure: false,
  errorMessage: null
};

export type RegisterState = Readonly<typeof initialState>;

// Reducer
export default (state: RegisterState = initialState, action): RegisterState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.CREATE_ACCOUNT):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.CREATE_ACCOUNT):
      return {
        ...initialState,
        registrationFailure: true,
        errorMessage: action.payload.response.data.errorKey
      };
    case SUCCESS(ACTION_TYPES.CREATE_ACCOUNT):
      return {
        ...initialState,
        registrationSuccess: true
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// Actions
export const handleRegister = (
  login,
  email,
  password,
  firstName,
  lastName,
  organizationName,
  organizationUrl,
  phoneNumber,
  captcha,
  organizations,
  contactFirstName,
  contactLastName,
  contactEmail,
  langKey = 'en'
) => ({
  type: ACTION_TYPES.CREATE_ACCOUNT,
  payload: axios.post(SERVICENET_API_URL + '/register', {
    login,
    email,
    password,
    firstName,
    lastName,
    organizationName,
    organizationUrl,
    phoneNumber,
    captcha,
    organizations,
    contactFirstName,
    contactLastName,
    contactEmail,
    langKey
  }),
  meta: {
    successMessage: translate('register.messages.success')
  }
});

// Actions
export const handleRegisterWithinSilo = (
  siloName,
  login,
  email,
  password,
  firstName,
  lastName,
  organizationName,
  organizationUrl,
  phoneNumber,
  captcha,
  organizations,
  contactFirstName,
  contactLastName,
  contactEmail,
  langKey = 'en'
) => ({
  type: ACTION_TYPES.CREATE_ACCOUNT,
  payload: axios.post(SERVICENET_API_URL + `/register/${siloName}`, {
    login,
    email,
    password,
    firstName,
    lastName,
    organizationName,
    organizationUrl,
    phoneNumber,
    captcha,
    organizations,
    contactFirstName,
    contactLastName,
    contactEmail,
    langKey
  }),
  meta: {
    successMessage: translate('register.messages.success')
  }
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});

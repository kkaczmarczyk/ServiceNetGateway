import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { GATEWAY_API_URL, SERVICENET_BASE_URL, AUTH_BASE_URL } from 'app/shared/util/service-url.constants';

export const ACTION_TYPES = {
  FETCH_LOGS: 'administration/FETCH_LOGS',
  FETCH_LOGS_CHANGE_LEVEL: 'administration/FETCH_LOGS_CHANGE_LEVEL',
  FETCH_HEALTH: 'administration/FETCH_HEALTH',
  FETCH_METRICS: 'administration/FETCH_METRICS',
  FETCH_THREAD_DUMP: 'administration/FETCH_THREAD_DUMP',
  FETCH_CONFIGURATIONS: 'administration/FETCH_CONFIGURATIONS',
  FETCH_ENV: 'administration/FETCH_ENV',
  FETCH_AUDITS: 'administration/FETCH_AUDITS',
  FETCH_GATEWAY_ROUTE: 'administration/FETCH_GATEWAY_ROUTE'
};

const initialState = {
  loading: false,
  errorMessage: null,
  gateway: {
    routes: []
  },
  logs: {
    loggers: [] as any[]
  },
  health: {} as any,
  metrics: {} as any,
  threadDump: [],
  configuration: {
    configProps: {} as any,
    env: {} as any
  },
  audits: [],
  totalItems: 0
};

export type AdministrationState = Readonly<typeof initialState>;

// Reducer

export default (state: AdministrationState = initialState, action): AdministrationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_GATEWAY_ROUTE):
    case REQUEST(ACTION_TYPES.FETCH_METRICS):
    case REQUEST(ACTION_TYPES.FETCH_THREAD_DUMP):
    case REQUEST(ACTION_TYPES.FETCH_LOGS):
    case REQUEST(ACTION_TYPES.FETCH_CONFIGURATIONS):
    case REQUEST(ACTION_TYPES.FETCH_ENV):
    case REQUEST(ACTION_TYPES.FETCH_AUDITS):
    case REQUEST(ACTION_TYPES.FETCH_HEALTH):
      return {
        ...state,
        errorMessage: null,
        loading: true
      };
    case FAILURE(ACTION_TYPES.FETCH_GATEWAY_ROUTE):
    case FAILURE(ACTION_TYPES.FETCH_METRICS):
    case FAILURE(ACTION_TYPES.FETCH_THREAD_DUMP):
    case FAILURE(ACTION_TYPES.FETCH_LOGS):
    case FAILURE(ACTION_TYPES.FETCH_CONFIGURATIONS):
    case FAILURE(ACTION_TYPES.FETCH_ENV):
    case FAILURE(ACTION_TYPES.FETCH_AUDITS):
    case FAILURE(ACTION_TYPES.FETCH_HEALTH):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        health: action.payload.response ? action.payload.response.data : null
      };
    case SUCCESS(ACTION_TYPES.FETCH_GATEWAY_ROUTE):
      return {
        ...state,
        loading: false,
        gateway: {
          routes: action.payload.data
        }
      };
    case SUCCESS(ACTION_TYPES.FETCH_METRICS):
      return {
        ...state,
        loading: false,
        metrics: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_THREAD_DUMP):
      return {
        ...state,
        loading: false,
        threadDump: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_LOGS):
      return {
        ...state,
        loading: false,
        logs: {
          loggers: action.payload.data
        }
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONFIGURATIONS):
      return {
        ...state,
        loading: false,
        configuration: {
          ...state.configuration,
          configProps: action.payload.data
        }
      };
    case SUCCESS(ACTION_TYPES.FETCH_ENV):
      return {
        ...state,
        loading: false,
        configuration: {
          ...state.configuration,
          env: action.payload.data
        }
      };
    case SUCCESS(ACTION_TYPES.FETCH_AUDITS):
      return {
        ...state,
        loading: false,
        audits: action.payload.data,
        totalItems: action.payload.headers['x-total-count']
      };
    case SUCCESS(ACTION_TYPES.FETCH_HEALTH):
      return {
        ...state,
        loading: false,
        health: action.payload.data
      };
    default:
      return state;
  }
};

// Actions
export const gatewayRoutes = () => ({
  type: ACTION_TYPES.FETCH_GATEWAY_ROUTE,
  payload: axios.get(GATEWAY_API_URL + '/gateway/routes')
});

export const systemHealth = () => ({
  type: ACTION_TYPES.FETCH_HEALTH,
  payload: axios.get(SERVICENET_BASE_URL + '/management/health')
});

export const systemMetrics = () => ({
  type: ACTION_TYPES.FETCH_METRICS,
  payload: axios.get(SERVICENET_BASE_URL + '/management/metrics')
});

export const systemThreadDump = () => ({
  type: ACTION_TYPES.FETCH_THREAD_DUMP,
  payload: axios.get(SERVICENET_BASE_URL + '/management/threaddump')
});

export const getLoggers = () => ({
  type: ACTION_TYPES.FETCH_LOGS,
  payload: axios.get(SERVICENET_BASE_URL + '/management/logs')
});

export const changeLogLevel = (name, level) => {
  const body = {
    level,
    name
  };
  return async dispatch => {
    await dispatch({
      type: ACTION_TYPES.FETCH_LOGS_CHANGE_LEVEL,
      payload: axios.put(SERVICENET_BASE_URL + '/management/logs', body)
    });
    dispatch(getLoggers());
  };
};

export const getConfigurations = () => ({
  type: ACTION_TYPES.FETCH_CONFIGURATIONS,
  payload: axios.get(SERVICENET_BASE_URL + '/management/configprops')
});

export const getEnv = () => ({
  type: ACTION_TYPES.FETCH_ENV,
  payload: axios.get(SERVICENET_BASE_URL + '/management/env')
});

export const getAudits = (page, size, sort, fromDate, toDate) => {
  let requestUrl = AUTH_BASE_URL + `/management/audits${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  if (fromDate) {
    requestUrl += `&fromDate=${fromDate}`;
  }
  if (toDate) {
    requestUrl += `&toDate=${toDate}`;
  }
  return {
    type: ACTION_TYPES.FETCH_AUDITS,
    payload: axios.get(requestUrl)
  };
};

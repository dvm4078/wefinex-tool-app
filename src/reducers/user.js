import * as TYPES from '../constants/user';

const initialState = {
  loading: false,
  error: false,
  users: [],
  total: 0,
  page: 1,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_USERS:
      return {
        ...state,
        page: action.page,
        loading: true,
      };

    case TYPES.GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.users,
        total: action.total,
      };

    case TYPES.CREATE_USER:
      return {
        ...state,
        loading: true,
      };

    case TYPES.CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [action.user, ...state.users].slice(0, 4),
      };

    case TYPES.UPDATE_USER:
      return {
        ...state,
        loading: true,
      };

    case TYPES.UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: true,
        users: state.users.map((user) => {
          if (user.id === action.userId) {
            return action.user;
          }
          return user;
        }),
      };

    case TYPES.DELETE_USER:
      return {
        ...state,
        loading: true,
      };

    case TYPES.ON_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };

    default:
      return state;
  }
};

export default userReducer;

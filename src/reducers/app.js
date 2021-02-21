import * as TYPES from '../constants/career';

const initialState = {
  loading: false,
  error: false,
  loggedIn: false,
  user: null,
  token: null,
};

const newPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_CAREERS:
      return {
        ...state,
        page: action.queries.page,
        loading: true,
        errorMessage: '',
      };

    case TYPES.GET_CAREERS_SUCCESS: {
      const newCareers = [...state.careers, ...action.careers];
      const hasMore = newCareers.length + 1 <= action.total;
      return {
        ...state,
        loading: false,
        hasMore,
        total: action.total,
        careers: newCareers,
      };
    }

    case TYPES.GET_CAREERS_ERROR:
      return {
        ...state,
        page: state.page - 1,
        loading: false,
        errorMessage: action.errorMessage,
      };

    default:
      return state;
  }
};

export default newPageReducer;

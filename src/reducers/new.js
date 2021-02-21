import * as TYPES from '../constants/new';

const initialState = {
  loading: false,
  errorMessage: '',
  hasMore: true,
  page: 0,
  total: 0,
  articles: [],
};

const newPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_ARTICLES:
      return {
        ...state,
        page: action.queries.page,
        loading: true,
        errorMessage: '',
      };

    case TYPES.GET_ARTICLES_SUCCESS: {
      const newArticles = [...state.articles, ...action.articles];
      const hasMore = (newArticles.length + 1) <= action.total;
      return {
        ...state,
        loading: false,
        hasMore,
        total: action.total,
        articles: newArticles,
      };
    }

    case TYPES.GET_ARTICLES_ERROR:
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

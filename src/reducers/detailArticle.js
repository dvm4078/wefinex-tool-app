import * as TYPES from '../constants/detailArticle';

const initialState = {
  loading: false,
  errorMessage: '',
  article: {},
};

const articlePageReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_ARTICLE:
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case TYPES.GET_ARTICLE_SUCCESS:
      return {
        ...state,
        loading: false,
        article: action.article,
      };

    case TYPES.GET_ARTICLE_ERROR:
      return {
        ...state,
        loading: false,
        errorMessage: action.errorMessage,
      };

    default:
      return state;
  }
};

export default articlePageReducer;

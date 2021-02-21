import * as TYPES from '../constants/detailCareer';

const initialState = {
  loading: false,
  errorMessage: '',
  career: {},
};

const articlePageReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_CAREER:
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case TYPES.GET_CAREER_SUCCESS:
      return {
        ...state,
        loading: false,
        career: action.career,
      };

    case TYPES.GET_CAREER_ERROR:
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

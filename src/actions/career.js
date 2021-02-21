import * as TYPES from '../constants/career';

export const getCareers = (queries) => ({
  type: TYPES.GET_CAREERS,
  queries,
});

export const getCareersSuccess = (total, careers) => ({
  type: TYPES.GET_CAREERS_SUCCESS,
  total,
  careers,
});

export const getCareersError = (errorMessage) => ({
  type: TYPES.GET_CAREERS_ERROR,
  errorMessage,
});

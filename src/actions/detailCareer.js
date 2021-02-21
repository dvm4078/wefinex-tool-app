import * as TYPES from '../constants/detailCareer';

export const getCareer = (careerAlias) => ({
  type: TYPES.GET_CAREER,
  careerAlias,
});

export const getCareerSuccess = (career) => ({
  type: TYPES.GET_CAREER_SUCCESS,
  career,
});

export const getCareerError = (errorMessage) => ({
  type: TYPES.GET_CAREER_ERROR,
  errorMessage,
});

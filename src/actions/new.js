import * as TYPES from '../constants/new';

export const getArticles = (queries) => ({
  type: TYPES.GET_ARTICLES,
  queries,
});

export const getArticlesSuccess = (total, articles) => ({
  type: TYPES.GET_ARTICLES_SUCCESS,
  total,
  articles
});

export const getArticlesError = (errorMessage) => ({
  type: TYPES.GET_ARTICLES_ERROR,
  errorMessage,
});

import * as TYPES from '../constants/detailArticle';

export const getArticle = (articleAlias) => ({
  type: TYPES.GET_ARTICLE,
  articleAlias,
});

export const getArticleSuccess = (article) => ({
  type: TYPES.GET_ARTICLE_SUCCESS,
  article,
});

export const getArticleError = (errorMessage) => ({
  type: TYPES.GET_ARTICLE_ERROR,
  errorMessage,
});

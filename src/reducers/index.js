import { combineReducers } from 'redux';

import appReducer from './app';

// import teamPageReducer from './team';
// import newPageReducer from './new';
// import careerPageReducer from './career';
// import detailArticlePageReducer from './detailArticle';
// import detailCareerPageReducer from './detailCareer';

export default function createReducer() {
  const rootReducer = combineReducers({
    app: appReducer,
    // teamPage: teamPageReducer,
    // newPage: newPageReducer,
    // careerPage: careerPageReducer,
    // detailArticle: detailArticlePageReducer,
    // detailCareer: detailCareerPageReducer,
  });

  return rootReducer;
}

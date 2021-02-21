import * as TYPES from '../constants/team';

const initialState = {
  loading: false,
  errorMessage: '',
  staffs: [
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/cc-1.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/cc-2.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/cc-3.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/cc-4.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/cc-5.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/cc-7.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/mkt-1.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/mkt-2.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/mkt-3.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/mkt-4.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/mkt-5.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/mkt-6.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/mkt-7.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-1.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-2.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-3.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-4.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-5.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-6.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-7.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-8.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-9.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-10.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-11.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-12.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-13.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-14.jpg",
      "displayName": "Shaun H"
    },
    {
      "photos": "https://cdn.smobgame.com/templates/funtap-gt/employ/tech-15.jpg",
      "displayName": "Shaun H"
    }
  ],
};

const homePageReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_STAFFS:
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case TYPES.GET_STAFFS_SUCCESS:
      return {
        ...state,
        loading: false,
        staffs: action.staffs,
      };

    case TYPES.GET_STAFFS_ERROR:
      return {
        ...state,
        loading: false,
        errorMessage: action.errorMessage,
      };

    default:
      return state;
  }
};

export default homePageReducer;

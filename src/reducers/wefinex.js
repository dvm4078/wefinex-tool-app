import * as TYPES from '../constants/wefinex';

let settings = {};
try {
  settings = JSON.parse(localStorage.getItem('SETTINGS')) || {};
} catch (error) {}

const initialState = {
  isTrading: false,
  loading: false,
  // error: false,
  // groups: [],
  options: {
    betAccountType: settings.betAccountType || 'LIVE',
    methods: settings.methods || ['1'],
    // methods: [],
    takeProfit: settings.takeProfit || false,
    takeProfitValue: settings.takeProfitValue || 0,
    betValue: settings.betValue || 1,
    takeProfitType: settings.takeProfitType || '$',
    stopLoss: settings.stopLoss || false,
    stopLossValue: settings.stopLossValue || 0,
    stopLossType: settings.stopLossType || '$',
    // startWhenTakeProfitTimes: settings.startWhenTakeProfitTimes || false,
    // startWhenTakeProfitTimesValue: settings.startWhenTakeProfitTimesValue || 0,
    // startWhenStopLossTimes: settings.startWhenStopLossTimes || false,
    // startWhenStopLossTimesValue: settings.startWhenStopLossTimesValue || 0,
    startWhenTakeProfit: settings.startWhenTakeProfit || false,
    startWhenStopLoss: settings.startWhenStopLoss || false,
    saveHistory: settings.saveHistory || false,
    withWefinex: settings.withWefinex || false,
    riskReduction: settings.riskReduction || false,
    riskReductionValue: settings.riskReductionValue || 0,
    riskReductionMethod: settings.riskReductionMethod || '1',
  },

  currentOptions: {},
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.START_TRADE:
      return {
        ...state,
        loading: true,
        currentOptions: action.options,
      };

    case TYPES.START_TRADE_SUCCESS:
      return {
        ...state,
        loading: false,
        isTrading: true,
      };

    case TYPES.STOP_TRADE:
      return {
        ...state,
        loading: true,
        currentOptions: {},
      };

    case TYPES.ON_ERROR:
    case TYPES.STOP_TRADE_SUCCESS:
      return {
        ...state,
        loading: false,
        isTrading: false,
        currentOptions: {},
      };

    case TYPES.CHANGE_OPTION: {
      const newOptions = {
        ...state.options,
        [action.prop]: action.value,
      };
      localStorage.setItem('SETTINGS', JSON.stringify(newOptions));
      return {
        ...state,
        options: {
          ...newOptions,
        },
      };
    }

    case TYPES.COMPLETE_METHOD: {
      return {
        ...state,
        currentOptions: {
          ...state.currentOptions,
          methods: action.methods,
        },
      };
    }

    default:
      return state;
  }
};

export default groupReducer;

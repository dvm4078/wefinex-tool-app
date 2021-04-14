const settings = {
  // isInverse: true,
  withSignal: true,
  1: {
    signalAmount: 1,
    amount: 0,
    winAction: 1,
    loseAction: 2,
  },
  2: {
    signalAmount: 2,
    amount: 0,
    winAction: 1,
    loseAction: 3,
  },
  3: {
    signalAmount: 4,
    amount: 0,
    winAction: 2,
    loseAction: 4,
  },
  4: {
    signalAmount: 8,
    amount: 0,
    winAction: 3,
    loseAction: 5,
  },
  5: {
    signalAmount: 17,
    amount: 0,
    winAction: 4,
    loseAction: 6,
  },
  6: {
    signalAmount: 35,
    amount: 0,
    winAction: 5,
    loseAction: 1,
  },
  // 7: {
  //   signalAmount: 72,
  //   amount: 0,
  //   winAction: 5,
  //   loseAction: 1,
  // },
  // 8: {
  //   signalAmount: 147,
  //   amount: 0,
  //   winAction: 5,
  //   loseAction: 1,
  // },
  times: 6,
  commonSignal: 0,
};

export default settings;

export interface CallState {
  callResults: {
    [callKey: string]: any;
  };
  callIndex: number;
  callKeys: {
    [callKey: string]: number;
  };
}

export const initialState: CallState = {
  callResults: {},
  callIndex: 0,
  callKeys: {},
};

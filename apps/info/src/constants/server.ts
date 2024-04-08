export enum NETWORK {
  IC = "ic",
  TEST = "test",
  LOCAL = "local",
}

export const hostMap = {
  [NETWORK.LOCAL]: "http://localhost:8000",
  [NETWORK.TEST]: "",
  [NETWORK.IC]: "https://icp0.io",
};

export const isIC: boolean = process.env.REACT_APP_IC_NETWORK === NETWORK.IC;

export const network = (process.env.REACT_APP_IC_NETWORK as NETWORK) || NETWORK.TEST;

export const host = {
  host: hostMap[network],
};

export const ICHost = hostMap[NETWORK.IC];

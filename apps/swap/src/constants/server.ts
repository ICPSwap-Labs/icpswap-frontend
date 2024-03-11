export enum NETWORK {
  IC = "ic",
  LOCAL = "local",
}

export const hostMap = {
  [NETWORK.LOCAL]: `http://localhost:8000`,
  [NETWORK.IC]: "https://icp0.io",
};

export const network = process.env.REACT_APP_IC_NETWORK as NETWORK;

export const isIC: boolean = network === NETWORK.IC;
export const isLocal: boolean = network === NETWORK.LOCAL;

export const host = hostMap[network];

export const ICHost = hostMap[NETWORK.IC];

export const localhost = hostMap[NETWORK.LOCAL];

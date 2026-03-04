import axios from "axios";

const commonConfig = {
  headers: {
    Accept: "application/json",
  },
};
export default (baseURL = import.meta.env.VITE_URL_BASE) => {
  const instance = axios.create({
    baseURL,
    ...commonConfig,
  });

  return instance;
};

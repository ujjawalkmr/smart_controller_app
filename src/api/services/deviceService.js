import { api } from "../axiosInstance.js";


export const deviceOnOff = async ( light) => {
  try {
      const response = await api.post("/device/light",{light:light});
      console.log("Response from getAllRoom:", response.data);
   return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

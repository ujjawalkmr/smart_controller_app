import { api } from "../axiosInstance.js";
import { DeviceModel } from "../../models/deviceModel.ts";

export const getAllDevices = async () => {
  try {
    const response = await api.get("/device/info");
    console.log("Response from getAllDevices:", response.data);

    const devices = response.data.data.map((item) =>
      DeviceModel.fromJson(item),
    );

    return devices;
  } catch (error) {
    console.error("Error fetching properties:", error);
  }
};

export const getDeviceById = async (deviceId) => {
  try {
    const response = await api.post("device/infoById", {
      deviceName: deviceId,
    });
    console.log("Response from getDeviceById:", response.data);
     const deviceData = {
      ...response.data.data,
      deviceKey: deviceId,
    };
    return DeviceModel.fromJson(deviceData);
  } catch (error) {
    console.error("Error fetching device by ID:", error);
  }
};

export const deviceOnOff = async (light) => {
  try {
    const response = await api.post("/device/light", { light: light });
    console.log("Response from getAllRoom:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

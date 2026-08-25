import { api } from "../axiosInstance.js";
import { DeviceModel } from "../../models/deviceModel.ts";

export const getAllDevices = async () => {
  try {
    const response = await api.get("/info");

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
    const response = await api.post("/infoById", {
      deviceName: deviceId,
    });
     const deviceData = {
      ...response.data.data,
      deviceKey: deviceId,
    };
    return DeviceModel.fromJson(deviceData);
  } catch (error) {
    console.error("Error fetching device by ID:", error);
  }
};

export const devicePowerUpdate = async (deviceName,devicePower) => {
  try {
    const response = await api.post("/power", { deviceName:deviceName, devicePower: devicePower });
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

export const deviceTemperatureUpdate = async (
  deviceName,
  deviceTemperature,
) => {
  try {
    const response = await api.post("/temp", {
      deviceName: deviceName,
      deviceTemperature: deviceTemperature,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating device temperature:", error);
    throw error;
  }
};

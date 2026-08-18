export class DeviceModel {
  
  deviceKey: string | null;
  deviceId: string | null;

  command: {
    devicePower: "ON" | "OFF" | "BLINK" | null;
  } | null;

  status: {
    devicePower: "ON" | "OFF" | "BLINK" | null;
  } | null;

  constructor(data: any = {}) {
    this.deviceKey = data.deviceKey ?? "";
    this.deviceId = data.deviceId ?? "";

    this.command = data.command
      ? {
          devicePower: data.command.devicePower ?? "OFF",
        }
      : null;

    this.status = data.status
      ? {
          devicePower: data.status.devicePower ?? "OFF",
        }
      : null;
  }

  static fromJson(json: any): DeviceModel {
    return new DeviceModel(json);
  }
}
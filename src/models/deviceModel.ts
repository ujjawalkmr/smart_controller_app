export default class DeviceModel {
  deviceKey: string | null;
  deviceId: string | null;

  command: {
    device_stitch: "ON" | "OFF" | "BLINK" | null;
  } | null;

  status: {
    device_stitch: "ON" | "OFF" | "BLINK" | null;
  } | null;

  constructor(data: any = {}) {
    this.deviceKey = data.deviceKey ?? "";
    this.deviceId = data.deviceId ?? "";

    this.command = data.command
      ? {
          device_stitch: data.command.device_stitch ?? "OFF",
        }
      : null;

    this.status = data.status
      ? {
          device_stitch: data.status.device_stitch ?? "OFF",
        }
      : null;
  }

  static fromJson(json: any): DeviceModel {
    return new DeviceModel(json);
  }
}
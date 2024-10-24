import type { Device } from '@/types/Device';

export class DevicesCache {
  private static cache: Array<Device> = [];

  public static set(devices: Array<Device>) {
    this.cache = devices;
  }

  public static get(): Array<Device> {
    return this.cache;
  }

  public static find(uuid: string): Device | undefined {
    return this.cache.find((device) => device.uuid === uuid);
  }

  public static hasCache(): boolean {
    return this.cache.length > 0;
  }
}

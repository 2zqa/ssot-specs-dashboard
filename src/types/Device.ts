// File generated using https://transform.tools/json-to-typescript
//
// Don't forget to fix any linting issues when updating this file. The generated `Root` interface may be omitted.
export interface Device {
  uuid: string;
  updated_at: string;
  specs: Specs;
}

export interface Specs {
  motherboard: Motherboard;
  cpu: Cpu;
  disks: Array<Disk>;
  network: Network;
  bios: Bios;
  memory: Memory;
  dimms: Array<Dimm>;
  boot_time: string;
  kernel: Kernel;
  release: Release;
  oem: Oem;
  virtualization: Virtualization;
}

export interface Motherboard {
  vendor: string;
  name: string;
  serial_number: string;
}

export interface Cpu {
  name: string;
  architecture: string;
  core_count: number;
  cpu_count: number;
  max_frequency_megahertz: number;
  mitigations: Array<string>;
}

export interface Disk {
  name: string;
  size_megabytes: number;
  partitions: Array<Partition>;
}

export interface Partition {
  filesystem: string;
  capacity_megabytes: number;
  source: string;
  target: string;
}

export interface Network {
  hostname: string;
  interfaces: Array<Interface>;
}

export interface Interface {
  mac_address: string;
  driver: Driver;
  ipv4_addresses: Array<string>;
  ipv6_addresses: Array<string>;
}

export interface Driver {
  name: string;
  version: string;
  firmware_version: string;
}

export interface Bios {
  vendor: string;
  version: string;
  date: string;
}

export interface Memory {
  memory: number;
  swap: number;
  swap_devices: Array<SwapDevice>;
}

export interface SwapDevice {
  name: string;
  size: number;
}

export interface Dimm {
  size_gigabytes: number;
  speed_mt_s: number;
  manufacturer: string;
  serial_number: string;
  type: string;
  part_number: string;
  form_factor: string;
  locator: string;
  bank_locator: string;
}

export interface Kernel {
  name: string;
  version: string;
}

export interface Release {
  name: string;
  version: string;
  codename: string;
}

export interface Oem {
  manufacturer: string;
  product_name: string;
  serial_number: string;
}

export interface Virtualization {
  type: string;
}

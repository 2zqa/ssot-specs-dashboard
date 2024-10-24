import { getIdToken } from '@/data/auth';
import { type ResponseObject, request } from '@/libs';
import type { Device } from '@/types/Device';
import type { Metadata } from '@/types/Metadata';

export interface DevicesResponse {
  devices: Array<Device>;
  metadata: Metadata;
}

export interface DeviceResponse {
  device: Device;
}

/**
 * Get the devices from the backend
 */
export async function getDevices(
  page: number,
  pageSize: number,
  sortColumn: string,
  isSortAscending: boolean,
  searchQuery?: string
) {
  const url = new URL(`${import.meta.env.MF_API_INTERNAL_SSOT_SERVER}/devices`);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('page_size', pageSize.toString());
  url.searchParams.set('sort', `${isSortAscending ? '' : '-'}${sortColumn}`);

  if (searchQuery) {
    url.searchParams.set('q', searchQuery);
  }

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${getIdToken()}`);

  const req = request({
    headers,
    url: url.toString(),
    method: 'GET',
  }) as Promise<ResponseObject<DevicesResponse>>;

  return await req;
}

/**
 * Get a single device from the backend
 */
export async function getDevice(uuid: string) {
  const req = request({
    url: `${import.meta.env.MF_API_INTERNAL_SSOT_SERVER}/devices/${uuid}`,
    method: 'GET',
  }) as Promise<ResponseObject<DeviceResponse>>;

  return await req;
}

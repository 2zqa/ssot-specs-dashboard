import { Fragment, h } from 'preact';
import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { useDebounce } from 'use-debounce-preact';

import { Button } from '@/components/Button';
import { ColumnFilter } from '@/components/ColumnFilter';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Paginate } from '@/components/Paginate';
import { SearchInput } from '@/components/SearchInput';
import { Table, type TableHeader, type TableRow } from '@/components/Table';
import { refreshToken } from '@/data/auth';
import { type DevicesResponse, getDevices } from '@/data/device';
import { DevicesCache } from '@/data/devicesCache';
import { tableHeaders } from '@/data/tableHeaders';
import { IconLoader } from '@/icons/Loader';
import { type ResponseObject } from '@/libs';
import type { Device } from '@/types/Device';
import { type Metadata } from '@/types/Metadata';
import { formatDateTime } from '@/utils/locale';

const PAGE_SIZE_OPTIONS = [3, 5, 10];
const DEFAULT_SELECTED_SIZE_INDEX = 1;
const SEARCH_DEBOUNCE_TIME = 750;

function getTableRow(device: Device): TableRow {
  const tableRow: TableRow = {
    onClick: () => route(`/device/${device.uuid}`),

    // Properties
    uuid: device.uuid,
    updated_at: device.updated_at ? formatDateTime(new Date(device.updated_at)) : null,
    specs_motherboard_vendor: device.specs.motherboard.vendor,
    specs_motherboard_name: device.specs.motherboard.name,
    specs_motherboard_serial_number: device.specs.motherboard.serial_number,
    specs_cpu_name: device.specs.cpu.name,
    specs_cpu_architecture: device.specs.cpu.architecture,
    specs_cpu_core_count: device.specs.cpu.core_count,
    specs_cpu_cpu_count: device.specs.cpu.cpu_count,
    specs_cpu_max_frequency_megahertz: device.specs.cpu.max_frequency_megahertz,
    specs_network_hostname: device.specs.network.hostname,
    specs_bios_vendor: device.specs.bios.vendor,
    specs_bios_version: device.specs.bios.version,
    specs_bios_date: device.specs.bios.date,
    specs_memory_memory: device.specs.memory.memory,
    specs_memory_swap: device.specs.memory.swap,
    specs_boot_time: device.specs.boot_time ? formatDateTime(new Date(device.specs.boot_time)) : null,
    specs_kernel_name: device.specs.kernel.name,
    specs_kernel_version: device.specs.kernel.version,
    specs_release_name: device.specs.release.name,
    specs_release_version: device.specs.release.version,
    specs_release_codename: device.specs.release.codename,
    specs_oem_manufacturer: device.specs.oem.manufacturer,
    specs_oem_product_name: device.specs.oem.product_name,
    specs_oem_serial_number: device.specs.oem.serial_number,
    specs_virtualization_type: device.specs.virtualization.type,
  };

  return tableRow;
}

export function DeviceTable() {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [explanationMessage, setExplanationMessage] = useState<string>();
  const [devices, setDevices] = useState<Array<Device>>([]);
  const [visibleHeaderRows, setVisibleHeadersRows] = useState<Array<TableHeader>>(tableHeaders);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [searchQueryDebounced] = useDebounce(searchQuery, SEARCH_DEBOUNCE_TIME);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[DEFAULT_SELECTED_SIZE_INDEX]);
  const [sortColumn, setSortColumn] = useState('updated_at');
  const [isSortAscending, setIsSortAscending] = useState(true);
  const [metadata, setMetadata] = useState<Metadata>();
  const [isLoading, setIsLoading] = useState(false);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const onDevicesRetrieved = (response: ResponseObject<DevicesResponse>) => {
    const { devices, metadata } = response.data;
    setDevices(devices);
    setMetadata(metadata);
    DevicesCache.set(devices);
    setIsLoading(false);
  };

  useEffect(() => {
    const onDeviceRetrievalError = async (error: TypeError | ResponseObject) => {
      if (error instanceof TypeError) {
        setErrorMessage(error.message);
        setExplanationMessage('Is the server running, and are you connected to the internet?');
        setIsLoading(false);
        return Promise.resolve();
      }

      if (error.status !== 401) {
        setErrorMessage(`Server returned ${error.status.toString()} ${error.statusText}`);
        setExplanationMessage('Try logging back in again.');
        setIsLoading(false);
        return Promise.resolve();
      }

      return refreshToken()
        .then(async () => {
          return await getDevices(page, pageSize, sortColumn, isSortAscending, searchQueryDebounced);
        })
        .then(onDevicesRetrieved)
        .catch((error: Response) => {
          setErrorMessage(`Server returned a  ${error.status.toString()} ${error.statusText} status code`);
        });
    };

    setIsLoading(true);
    getDevices(page, pageSize, sortColumn, isSortAscending, searchQueryDebounced)
      .then(onDevicesRetrieved)
      .catch(onDeviceRetrievalError)
      .finally(() => setIsLoading(false));
  }, [page, pageSize, sortColumn, isSortAscending, searchQueryDebounced, errorMessage]);

  if (errorMessage) {
    return (
      <>
        <ErrorMessage
          message={`Sorry, something went wrong trying to fetch the devices. ${
            explanationMessage ? explanationMessage + ' ' : ''
          }Error: "${errorMessage}"`}
        />
        <Button onClick={() => setErrorMessage('')}>Retry</Button>
      </>
    );
  }

  if (metadata === undefined) {
    return (
      <div class="flex justify-center items-center gap-2">
        <p>Loading devices</p>
        <IconLoader class="inline-block h-5" />
      </div>
    );
  }

  return (
    <>
      <div class="flex justify-between">
        <ColumnFilter onColumnFilterChange={setVisibleHeadersRows} />
        <SearchInput
          id="device-search-bar"
          label="Search device properties"
          class="max-w-sm"
          onInput={setSearchQuery}
        />
      </div>
      <div class="overflow-x-auto">
        <Table
          layout="auto"
          onSort={(header, newSortingMode) => {
            setSortColumn(header.property);
            setIsSortAscending(newSortingMode === 'ascending');
          }}
          data={{
            headers: visibleHeaderRows,
            rows: devices.map(getTableRow),
          }}
        />
      </div>
      <Paginate
        isLoadingNewPage={isLoading}
        page={metadata.current_page}
        itemsPerPage={metadata.page_size}
        totalItems={metadata.total_records}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        defaultPageSizeIndex={DEFAULT_SELECTED_SIZE_INDEX}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}

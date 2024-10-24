import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { Collapse } from '@/components/Collapse';
import { Infobox } from '@/components/Infobox';
import { getDevice } from '@/data/device';
import { DevicesCache } from '@/data/devicesCache';
import type { Device } from '@/types/Device';
import { formatDate, formatDateTime } from '@/utils/locale';

interface Props {
  uuid: string;
}

export function DeviceDetails(props: Props) {
  const [device, setDevice] = useState<Device>();

  // Get device from cache, if it exists. Otherwise, fetch it from the API.
  useEffect(() => {
    const device = DevicesCache.find(props.uuid);
    if (device) {
      setDevice(device);
      return;
    }
    getDevice(props.uuid).then((response) => setDevice(response.data.device));
  }, [props.uuid]);

  if (!device) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Collapse label="General info" isDefaultOpen>
        <div className="flex flex-wrap gap-4">
          <Infobox
            title="Device"
            rows={[
              { key: 'Hostname', value: device.specs.network.hostname },
              { key: 'Updated at', value: device.updated_at ? formatDateTime(new Date(device.updated_at)) : null },
              { key: 'Virtualization type', value: device.specs.virtualization.type },
              { key: 'Boot time', value: formatDateTime(new Date(device.specs.boot_time)) },
            ]}
          />
          <Infobox
            title="Motherboard"
            rows={[
              { key: 'Vendor', value: device.specs.motherboard.vendor },
              { key: 'Name', value: device.specs.motherboard.name },
              { key: 'Serial number', value: device.specs.motherboard.serial_number },
            ]}
          />
          <Infobox
            title="CPU"
            rows={[
              { key: 'Name', value: device.specs.cpu.name },
              { key: 'Architecture', value: device.specs.cpu.architecture },
              { key: 'Core count', value: device.specs.cpu.core_count },
              { key: 'CPU count', value: device.specs.cpu.cpu_count },
              { key: 'Max frequency', value: device.specs.cpu.max_frequency_megahertz, unit: 'MHz' },
              { key: 'Mitigations', value: device.specs.cpu.mitigations?.join(', ') },
            ]}
          />
          <Infobox
            title="BIOS"
            rows={[
              { key: 'Vendor', value: device.specs.bios.vendor },
              { key: 'Version', value: device.specs.bios.version },
              {
                key: 'Date',
                value: device.specs.bios.date ? formatDate(new Date(device.specs.bios.date)) : null,
              },
            ]}
          />
          <Infobox
            title="Memory"
            rows={[
              { key: 'Total', value: device.specs.memory.memory, unit: 'MB' },
              { key: 'Swap total', value: device.specs.memory.swap, unit: 'MB' },
            ]}
          />
          <Infobox
            title="Kernel"
            rows={[
              { key: 'Name', value: device.specs.kernel.name },
              { key: 'Version', value: device.specs.kernel.version },
            ]}
          />
          <Infobox
            title="Release"
            rows={[
              { key: 'Name', value: device.specs.release.name },
              { key: 'Version', value: device.specs.release.version },
              { key: 'Codename', value: device.specs.release.codename },
            ]}
          />
          <Infobox
            title="OEM"
            rows={[
              { key: 'Manufacturer', value: device.specs.oem.manufacturer },
              { key: 'Product name', value: device.specs.oem.product_name },
              { key: 'Serial number', value: device.specs.oem.serial_number },
            ]}
          />
        </div>
      </Collapse>
      <Collapse label="Disks" isDefaultOpen>
        <div className="flex flex-wrap gap-4">
          {device.specs.disks.map((disk, index) => (
            <Infobox
              key={disk}
              title={'Disk ' + (index + 1)}
              rows={[
                { key: 'Name', value: disk.name },
                { key: 'Size', value: disk.size_megabytes, unit: 'MB' },
              ]}
            />
          ))}
        </div>
      </Collapse>
      <Collapse label="Network interfaces" isDefaultOpen>
        <div className="flex flex-wrap gap-4">
          {device.specs.network.interfaces.map((iface, index) => (
            <Infobox
              key={iface}
              title={'Network Interface ' + (index + 1)}
              rows={[
                { key: 'MAC Address', value: iface.mac_address },
                { key: 'IPv4 Addresses', value: iface.ipv4_addresses.join(', ') },
                { key: 'IPv6 Addresses', value: iface.ipv6_addresses.join(', ') },
                { key: 'Driver firmware name', value: iface.driver.name },
                { key: 'Driver version', value: iface.driver.version },
                { key: 'Driver firmware version', value: iface.driver.firmware_version },
              ]}
            />
          ))}
        </div>
      </Collapse>
    </>
  );
}

import { Injectable, NgModule, forwardRef, Inject } from '@angular/core';

import {Drone, MamboUUIDs} from '.';

@Injectable()
export class MamboService {

  constructor() {
  }
  
  async search(): Promise<Drone> {
    const device: BluetoothDevice = await navigator.bluetooth.requestDevice(
    {
      filters: [{ namePrefix: 'Mambo' }],
      optionalServices: MamboUUIDs.services
    });

    const server: BluetoothRemoteGATTServer = await device.gatt.connect();
    
    console.log('Drone ready to connect');

    const drone = new Drone(server);
    await drone.connect();

    console.log('Drone connected and ready to fly');

    device.addEventListener('gattserverdisconnected', () => drone.onDisconnected());

    return drone;
  }
}

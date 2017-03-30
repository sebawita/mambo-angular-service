import { Injectable, NgModule, forwardRef, Inject } from '@angular/core';

import { Drone, MamboUUIDs } from '.';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class MamboService {

  constructor() {
  }


  public async search(): Promise<Drone> {
    const device: BluetoothDevice = await navigator.bluetooth.requestDevice(
    {
      filters: [{ namePrefix: 'Mambo' }],
      optionalServices: MamboUUIDs.services
    });
    console.log('Connecting to drone...');

    const drone = new Drone(device);
    drone.connect();

    return drone;
  }
}

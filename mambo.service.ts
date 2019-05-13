/// <reference path="./node_modules/@types/web-bluetooth/index.d.ts" />

import { Injectable } from '@angular/core';

import { Drone, MamboUUIDs } from '.';
@Injectable()
export class MamboService {
  
  constructor() {
  }
  
  /**
  * Runs a bluetooth scan, this triggers a search pop up in the browser for the user to select a device. Once that is done, `search` returns a promise with the selected Drone object
  */
  public async search(): Promise<Drone> {
    // [web-ble] Search for Device
    const device: BluetoothDevice = await window.navigator.bluetooth.requestDevice(
      {
        filters: [{ namePrefix: 'Mambo' }],
        optionalServices: MamboUUIDs.services
      });
      console.log('Connecting to drone...');
      
      const drone = new Drone(device);
      await drone.connect();
      
      return drone;
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // public search2() {
  //   return new Observable(observer => {
  //      let drone;
  //      navigator.bluetooth.requestDevice(
  //      {
  //        filters: [{ namePrefix: 'Mambo' }],
  //        optionalServices: MamboUUIDs.services
  //      }).then(device => {
  //         drone = new Drone(device);
  
  //         drone.connect()
  //         .then(() => {
  //           observer.next(drone);
  //         });
  //      });
  
  //      return () => drone && drone.disconnect();
  //   })
  // }

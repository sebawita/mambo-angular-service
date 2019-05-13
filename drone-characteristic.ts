export class DroneCharacteristic {
  private serviceUUID: string;
  private characteristicUUID: string;

  private _step = 0;
  private nextStep(): number {
    if (++this._step > 255) {
      this._step = 0;
    }

    return this._step;
  }

  // constructor(private characteristic: BluetoothRemoteGATTCharacteristic) {
  constructor(private characteristic: any) {
  }

  private prepareBuffer(params: number[]): Uint8Array {
    const buffer = [2, this.nextStep(), 2, ...params];

    return new Uint8Array(buffer);
  }

  write(command: number[]): Promise<any> {
    const value = this.prepareBuffer(command);
    
    // [web-ble] Send command
    return this.characteristic.writeValue(value);
  }

  writeWithoutResponse(command: number[]): Promise<any> {
    const value = this.prepareBuffer(command);

    // [web-ble] Send command
    this.characteristic.writeValue(value);

    return Promise.resolve();
  }
}

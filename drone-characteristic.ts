export class DroneCharacteristic {
  private serviceUUID: string;
  private characteristicUUID: string;

  private _steps = 0;
  private get steps(): number {
    if (++this._steps > 255) {
      this._steps = 0;
    }

    return this._steps;
  }

  constructor(private characteristic: BluetoothRemoteGATTCharacteristic) {
  }

  private prepareBuffer(params: number[]): Uint8Array {
    const buffer = [2, this.steps, 2].concat(params);

    return new Uint8Array(buffer);
  }

  write(command: number[]): Promise<any> {
    const value = this.prepareBuffer(command);

    return this.characteristic.writeValue(value);
  }

  writeWithoutResponse(command: number[]): Promise<any> {
    const value = this.prepareBuffer(command);

    this.characteristic.writeValue(value);

    return Promise.resolve();
  }
}
/// <reference types="web-bluetooth" />
export declare class DroneCharacteristic {
    private characteristic;
    private serviceUUID;
    private characteristicUUID;
    private _steps;
    private readonly steps;
    constructor(characteristic: BluetoothRemoteGATTCharacteristic);
    private prepareBuffer;
    write(command: number[]): Promise<any>;
    writeWithoutResponse(command: number[]): Promise<any>;
}

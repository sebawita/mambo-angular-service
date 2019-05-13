export declare class DroneCharacteristic {
    private characteristic;
    private serviceUUID;
    private characteristicUUID;
    private _step;
    private nextStep();
    constructor(characteristic: any);
    private prepareBuffer(params);
    write(command: number[]): Promise<any>;
    writeWithoutResponse(command: number[]): Promise<any>;
}

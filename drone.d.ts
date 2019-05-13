/// <reference types="web-bluetooth" />
import { Observable } from 'rxjs';
export declare class Drone {
    private device;
    private flightCommandInstructions;
    private flightParamsInstructions;
    private flightStatus;
    private batteryStatus;
    private roll;
    private pitch;
    private yaw;
    private altitude;
    private flightLoopHandle;
    private loopHandle;
    private ready;
    private connectionSubject;
    readonly connection$: Observable<boolean>;
    constructor(device: BluetoothDevice);
    connect(): Promise<any>;
    private prepareCharacteristics;
    private initialiseFlightDefaults;
    private listenToOnDisconnected;
    private onDisconnected;
    /**
     * Convenience method for setting the drone's altitude limitation
     * @param  {Integer} altitude the altitude in meters (2m-10m for Airborne Cargo / 2m - 25m for Mambo)
     */
    setMaxAltitude(maxAltitude: number): Promise<any>;
    /**
     * Convenience method for setting the drone's max tilt limitation
     * @param  {integer} tilt The max tilt from 0-100 (0 = 5° - 100 = 20°)
     */
    setMaxTilt(maxTilt: number): Promise<any>;
    /**
     * Convenience method for setting the drone's max vertical speed limitation
     * @param  {integer} verticalSpeed The max vertical speed from 0.5m/s - 2m/s
     */
    setMaxVerticalSpeed(maxVerticalSpeed: number): Promise<any>;
    /**
     * Convenience method for setting the drone's max rotation speed limitation
     * @param  {integer} tilt The max rotation speed from (50°-360° for Airborne Cargo / 50° - 180° for Mambo)
     */
    setMaxRotationSpeed(maxRotationSpeed: number): Promise<any>;
    private startFlightLoop;
    private stopFlightLoop;
    takeOff(): void;
    land(): void;
    /**
     * Instructs the drone to fire the cannon
     */
    fire(): void;
    private sendFlightParams;
    updateFlightParams(roll: number, pitch: number, yaw: number, altitude: number): void;
    /**
     * Sets the roll speed of drone's flight params
     * @param roll turn speed, expected value from -1 (move left) to 1 (move right)
     */
    setRoll(roll: any): void;
    /**
     * Sets the pitch of drone's flight params
     * @param pitch turn speed, expected value from -1 (move back) to 1 (move forward)
     */
    setPitch(pitch: any): void;
    /**
     * Sets the turn speed of drone's flight params
     * @param yaw turn speed, expected value from -1 (turn counter-clocwise) to 1 (turn clocwise)
     */
    setYaw(yaw: number): void;
    /**
     * Sets the altitude of drone's flight params
     * @param altitude turn speed, expected value from -1 (move down) to 1 (move up)
     */
    setAltitude(altitude: any): void;
    private convertToInputValue;
    private ensureBoundaries;
    private ensureBoundariesRound;
}

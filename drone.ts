import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { MamboUUIDs, DroneCharacteristic } from '.';

export class Drone  {
  private flightCommandInstructions: DroneCharacteristic;
  private flightParamsInstructions: DroneCharacteristic;
  private flightStatus: BluetoothRemoteGATTCharacteristic;

  public roll: number = 0;
  public pitch: number = 0;
  public yaw: number = 0;
  public altitude: number = 0;

  private flightLoopHandle: number = -1;

  private loopHandle: number;
  private ready: boolean = false;

  private connectionSubject: BehaviorSubject<boolean>;

  get connection$(): Observable<boolean> {
    return this.connectionSubject.asObservable();
  }

  constructor(private device: BluetoothDevice) {
  }

  public async connect(): Promise<any> {
    this.connectionSubject = new BehaviorSubject<boolean>(false);

    // [web-ble] Connect to the device
    const server: BluetoothRemoteGATTServer = await this.device.gatt.connect();

    console.log('Drone connected');
    await this.initialise(server);
  }

  public async initialise(server: BluetoothRemoteGATTServer) {
    await this.prepareCharacteristics(server);

    await this.initialiseFlightDefaults();
    this.startFlightLoop();

    this.listenToOnDisconnected();

    await this.flightStatus.startNotifications();

    this.connectionSubject.next(true);
    console.log('Drone ready to fly');
  }

  private async prepareCharacteristics(server: BluetoothRemoteGATTServer) {
    // [web-ble] Get Services
    const instructionService = await server.getPrimaryService(MamboUUIDs.serviceUUIDa);
    const notificationService = await server.getPrimaryService(MamboUUIDs.serviceUUIDb);

    this.flightCommandInstructions = new DroneCharacteristic(
      // [web-ble] Get Commands Characteristic
      await instructionService.getCharacteristic(MamboUUIDs.characteristic_command_instructions)
    );

    this.flightParamsInstructions = new DroneCharacteristic(
      // [web-ble] Get Flight Params Characteristic
      await instructionService.getCharacteristic(MamboUUIDs.characteristic_flight_params)
    );

    this.flightStatus = await notificationService.getCharacteristic(MamboUUIDs.characteristic_flightStatus);
  }

  private async initialiseFlightDefaults(): Promise<any> {
    // info: Setting max altitude to 2m
    await this.setMaxAltitude(2);
    
    // info: Setting max tilt to 40% (20° max)
    await this.setMaxTilt(40);
    
    // info: Setting max vertical speed to 0.5 m/s
    await this.setMaxVerticalSpeed(0);

    // info: Setting max rotation speed to 150 °/s
    await this.setMaxRotationSpeed(150);
  }

  private listenToOnDisconnected() {
    this.device.addEventListener('gattserverdisconnected', () => this.onDisconnected());
  }

  private onDisconnected() {
    console.log('Drone disconnected');
    this.stopFlightLoop();

    this.connectionSubject.complete();
  }
  
  /**
   * Convenience method for setting the drone's altitude limitation
   * @param  {Integer} altitude the altitude in meters (2m-10m for Airborne Cargo / 2m - 25m for Mambo)
   */
  setMaxAltitude(maxAltitude: number): Promise<any> {
    console.log('setMaxAltitude: ' + maxAltitude);
    maxAltitude = this.ensureBoundaries(maxAltitude, 2, 25);

    return this.flightCommandInstructions.write([8, 0, 0, maxAltitude, 0]);
  }

  /**
   * Convenience method for setting the drone's max tilt limitation
   * @param  {integer} tilt The max tilt from 0-100 (0 = 5° - 100 = 20°)
   */
  setMaxTilt(maxTilt: number): Promise<any> {
    console.log('setMaxTilt: ' + maxTilt);
    maxTilt = this.ensureBoundaries(maxTilt, 0, 100);

    return this.flightCommandInstructions.write([8, 1, 0, maxTilt, 0]);
  }

  /**
   * Convenience method for setting the drone's max vertical speed limitation
   * @param  {integer} verticalSpeed The max vertical speed from 0.5m/s - 2m/s
   */
  setMaxVerticalSpeed(maxVerticalSpeed: number): Promise<any> {
    console.log('setMaxVerticalSpeed: ' + maxVerticalSpeed);
    maxVerticalSpeed = this.ensureBoundaries(maxVerticalSpeed, 0, 100);

    return this.flightCommandInstructions.write([1, 0, 0, maxVerticalSpeed, 0]);
  }

  /**
   * Convenience method for setting the drone's max rotation speed limitation
   * @param  {integer} tilt The max rotation speed from (50°-360° for Airborne Cargo / 50° - 180° for Mambo)
   */
  setMaxRotationSpeed(maxRotationSpeed: number): Promise<any> {
    console.log('setMaxRotationSpeed: ' + maxRotationSpeed);
    maxRotationSpeed = this.ensureBoundaries(maxRotationSpeed, 50, 180);

    return this.flightCommandInstructions.write([1, 1, 0, maxRotationSpeed, 0]);
  }

  private startFlightLoop() {
    this.flightLoopHandle = window.setInterval(
      () => this.sendFlightParams(),
      100);
  }

  private stopFlightLoop() {
    if (this.flightLoopHandle > 0) {
      clearInterval(this.flightLoopHandle);
      this.flightLoopHandle = -1;
    }
  }

  /**
   * Instructs the drone to take off
   */
  public takeOff() {
    this.flightCommandInstructions.writeWithoutResponse([0, 1, 0]);
  }

  /**
   * Instructs the drone to land
   */
  public land() {
    this.flightCommandInstructions.writeWithoutResponse([0, 3, 0]);

    this.roll = 0;
    this.pitch = 0;
    this.yaw = 0;
    this.altitude = 0;
  }

  /**
   * Instructs the drone to fire the cannon
   */
  public fire() {
    this.flightCommandInstructions.writeWithoutResponse([16, 2, 0, 0, 0, 0, 0, 0]);
  }

  /**
   * Sets the roll, pitch, yaw and altitude of drone's flight params in one call
   * @param roll turn speed, expected value from -1 (move left) to 1 (move right)
   * @param pitch turn speed, expected value from -1 (move back) to 1 (move forward)
   * @param yaw turn speed, expected value from -1 (turn counter-clocwise) to 1 (turn clocwise)
   * @param altitude turn speed, expected value from -1 (move down) to 1 (move up)
   */
  private sendFlightParams() {
    const command = [0, 2, 0, 1, this.roll, this.pitch, this.yaw, this.altitude, 0, 0, 0, 0, 0, 0, 0, 0];
    this.flightParamsInstructions.writeWithoutResponse(command);
  }

  public updateFlightParams(roll: number, pitch: number, yaw: number, altitude: number) {
    this.setRoll(roll);
    this.setPitch(pitch);
    this.setYaw(yaw);
    this.setAltitude(altitude);
  }

  /**
   * Sets the roll speed of drone's flight params
   * @param roll turn speed, expected value from -1 (move left) to 1 (move right)
   */
  public setRoll(roll) {
    this.roll = this.convertToInputValue(roll);
  }

  /**
   * Sets the pitch of drone's flight params
   * @param pitch turn speed, expected value from -1 (move back) to 1 (move forward)
   */
  public setPitch(pitch) {
    this.pitch = this.convertToInputValue(pitch);
  }

  /**
   * Sets the turn speed of drone's flight params
   * @param yaw turn speed, expected value from -1 (turn counter-clocwise) to 1 (turn clocwise)
   */
  public setYaw(yaw: number) {
    this.yaw = this.convertToInputValue(yaw);
  }

  /**
   * Sets the altitude of drone's flight params
   * @param altitude turn speed, expected value from -1 (move down) to 1 (move up)
   */
  public setAltitude(altitude) {
    this.altitude = this.convertToInputValue(altitude);
  }

  private convertToInputValue(value: number) {
    value = this.ensureBoundaries(value, -1, 1);

    if (value >= 0) {
      return Math.round(value * 127);
    } else {
      return 255 + Math.round(value*127);
    }
  }

  private ensureBoundaries(val: number, min: number, max: number) {
    if(val < min) {
      return min;
    }

    if(val > max) {
      return max;
    }

    return val;
  }

  private ensureBoundariesRound(val: number, min: number, max: number) {
    return Math.round(this.ensureBoundaries(val, min, max))
  }
}

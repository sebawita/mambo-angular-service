declare var require: any;

import { Observable, Subject } from 'rxjs';

import { MamboUUIDs, DroneCharacteristic } from '.';

const FLIGHT_STATUSES = ['landed', 'taking off', 'hovering', 'flying',
                         'landing', 'emergency', 'rolling', 'initializing'];

export class Drone  {
  private flightCommandInstructions: DroneCharacteristic;
  private flightParamsInstructions: DroneCharacteristic;
  private flightStatus: BluetoothRemoteGATTCharacteristic;
  private batteryStatus: BluetoothRemoteGATTCharacteristic;

  private roll: number = 0;
  private pitch: number = 0;
  private yaw: number = 0;
  private altitude: number = 0;

  private flightLoopHandle: number = -1;

  // private flightStatusSubject: BehaviorSubject<string>;
  // private batteryStatusSubject: BehaviorSubject<number>;

  private loopHandle: number;
  private ready: boolean = false;

  private connectionSubject: Subject<boolean>;

  get connection$(): Observable<boolean> {
    return this.connectionSubject;
  }

  constructor(private device: BluetoothDevice) {
  }

  public async connect(): Promise<any> {
    this.connectionSubject = new Subject<boolean>();

    const server: BluetoothRemoteGATTServer = await this.device.gatt.connect();

    await this.prepareCharacteristics(server);

    await this.initialiseFlightDefaults();
    this.startFlightLoop();

    this.listenToOnDisconnected();

    await this.flightStatus.startNotifications();

    this.connectionSubject.next(true);
    console.log('Drone connected and ready to fly');
  }

  private async prepareCharacteristics(server: BluetoothRemoteGATTServer) {
    const serviceA = await server.getPrimaryService(MamboUUIDs.serviceUUIDa);
    const serviceB = await server.getPrimaryService(MamboUUIDs.serviceUUIDb);

    this.flightCommandInstructions = new DroneCharacteristic(await serviceA.getCharacteristic(MamboUUIDs.characteristic_command_instructions));
    this.flightParamsInstructions = new DroneCharacteristic(await serviceA.getCharacteristic(MamboUUIDs.characteristic_flight_params));

    this.flightStatus = await serviceB.getCharacteristic(MamboUUIDs.characteristic_flightStatus);
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

  // listenToFlightStatus() {
  //   const promise = this.flightStatus.startNotifying();

  //   this.flightStatus.getObservable().subscribe((notificationData: number[]) => {
  //     this.updateFlightStatus(notificationData);
  //   });

  //   return promise;
  // }

  // updateFlightStatus(notificationData: number[]) {
  //   if (notificationData[2] !== 2) {
  //     return;
  //   }

  //   const status = FLIGHT_STATUSES[notificationData[6]];
  //   this.flightStatusSubject.next(status);

  //   console.log('updateFlightStatus::' + status);
  // }

  // stopListeningToFlightStatus() {
  //   this.flightStatus.stopNotifying();
  // }

  // listenToBatteryStatus() {
  //   const promise = this.batteryStatus.startNotifying();

  //   this.batteryStatus.getObservable().subscribe((notificationData: number[]) => {
  //     this.updateBatteryStatus(notificationData);
  //   });

  //   return promise;
  // }

  // updateBatteryStatus(notificationData: number[]) {
  //   const status = notificationData[notificationData.length-1];
  //   this.batteryStatusSubject.next(status);

  //   console.log('updateBatteryStatus::' + status);
  // }

  // stopListeningToBatteryStatus() {
  //   this.batteryStatus.stopNotifying();
  // }

  private startFlightLoop() {
    this.flightLoopHandle = setInterval(() => this.sendFlightParams(), 100);
  }

  private stopFlightLoop() {
    if (this.flightLoopHandle > 0) {
      clearInterval(this.flightLoopHandle);
      this.flightLoopHandle = -1;
    }
  }

  public takeOff() {
    this.flightCommandInstructions.writeWithoutResponse([0, 1, 0]);
  }

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

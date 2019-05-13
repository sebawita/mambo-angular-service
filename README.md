# mambo-angular-service

Angular Service to control Parrot Mambo drone

## Examples of usage

First import `MamboService` in your `ngModule` then inject it in the component where you need to use it.

You can `MamboService` to search for nearby drones. The search will pop up a search modal in the browser, allowing the user to select a device to connect to. 
When that happens the search returns the connected drone.

```
this.mamboService.search().then(drone => this.drone = drone)
```

Then use drone's `connect$` Observable to get notified when the connection has been fully established. Also the `connect$` completion indicates that the connection has been terminated.

```
this.drone.connection$
.subscribe(
  () => this.ready,
  err => console.error('Something went wrong: ' + JSON.stringify(err)),
  () => {
    alert('Drone is no longer connected');
    this.drone = null;
    this.ready = false;
  }
);
```

Once the drone is ready you can make the drone take off and land with the follownig calls:

```
this.drone.takeOff();
this.drone.land();
```

By default every 100ms the `Drone object` sends flight parameters to the `Mambo drone`. You can provide the flight params by using the following functions:

 * setRoll
 * setPitch
 * setYaw
 * setAltitude
 * updateFlightParams

Please note that the values that are expected should be in a range from -1 to 1.

Just remember, if you set any of the flight params, the `Drone object` will send this value to the `Mambo drone` every 100ms, until you set it 0. 
If you intend for the drone to fly forward for some time you can call it like this:

```
this.drone.setPitch(0.5);
setInterval(() => this.drone.setPitch(0), 500 );
```

## API

### MamboService

search(): Promise<Drone>
 * Runs a bluetooth scan, this triggers a search pop up in the browser for the user to select a device. Once that is done, `search` returns a promise with the selected Drone object.

### Drone

#### `takeOff()`
 * Instructs the drone to take off

#### `land()`
 * Instructs the drone to land

#### `updateFlightParams(roll: number, pitch: number, yaw: number, altitude: number)`
 * Sets the roll, pitch, yaw and altitude of drone's flight params in one go
 * @param roll turn speed, expected value from -1 (move left) to 1 (move right)
 * @param pitch turn speed, expected value from -1 (move back) to 1 (move forward)
 * @param yaw turn speed, expected value from -1 (turn counter-clocwise) to 1 (turn clocwise)
 * @param altitude turn speed, expected value from -1 (move down) to 1 (move up)

#### `setRoll(roll)`
 * Sets the roll speed of drone's flight params
 * @param roll turn speed, expected value from -1 (move left) to 1 (move right)

#### `setPitch(pitch)`
 * Sets the pitch of drone's flight params
 * @param pitch turn speed, expected value from -1 (move back) to 1 (move forward)

#### `setYaw(yaw: number)`
 * Sets the turn speed of drone's flight params
 * @param yaw turn speed, expected value from -1 (turn counter-clocwise) to 1 (turn clocwise)

#### `setAltitude(altitude)`
 * Sets the altitude of drone's flight params
 * @param altitude turn speed, expected value from -1 (move down) to 1 (move up)

#### `setMaxAltitude(maxAltitude: number): Promise<any>`
 * Sets the drone's altitude limitation
 * @param  {Integer} altitude the altitude in meters (2m-10m for Airborne Cargo / 2m - 25m for Mambo)

#### `setMaxTilt(maxTilt: number): Promise<any>`
 * Sets the drone's max tilt limitation
 * @param  {integer} tilt The max tilt from 0-100 (0 = 5° - 100 = 20°)

#### `setMaxVerticalSpeed(maxVerticalSpeed: number): Promise<any>`
 * Sets the drone's max vertical speed limitation
 * @param  {integer} verticalSpeed The max vertical speed from 0.5m/s - 2m/s

#### `setMaxRotationSpeed(maxRotationSpeed: number): Promise<any>`
 * Sets the drone's max rotation speed limitation
 * @param  {integer} tilt The max rotation speed from (50°-360° for Airborne Cargo / 50° - 180° for Mambo)

#### `fire()`
 * Instructs the drone to fire the cannon

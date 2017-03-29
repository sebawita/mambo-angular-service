# mambo-angular-service

Angular Service to control Parrot Mambo drone

## Examples of usage

## API

### MamboService

search(): Promise<Drone>

### Drone

setMaxAltitude(maxAltitude: number): Promise<any>
 * Sets the drone's altitude limitation
 * @param  {Integer} altitude the altitude in meters (2m-10m for Airborne Cargo / 2m - 25m for Mambo)

setMaxTilt(maxTilt: number): Promise<any>
 * Sets the drone's max tilt limitation
 * @param  {integer} tilt The max tilt from 0-100 (0 = 5° - 100 = 20°)

setMaxVerticalSpeed(maxVerticalSpeed: number): Promise<any>
 * Sets the drone's max vertical speed limitation
 * @param  {integer} verticalSpeed The max vertical speed from 0.5m/s - 2m/s

setMaxRotationSpeed(maxRotationSpeed: number): Promise<any>
 * Sets the drone's max rotation speed limitation
 * @param  {integer} tilt The max rotation speed from (50°-360° for Airborne Cargo / 50° - 180° for Mambo)

takeOff()
 * Instructs the drone to take off

land()
 * Instructs the drone to land

public updateFlightParams(roll: number, pitch: number, yaw: number, altitude: number)
 * Sets the roll, pitch, yaw and altitude of drone's flight params
 * @param roll turn speed, expected value from -1 (move left) to 1 (move right)
 * @param pitch turn speed, expected value from -1 (move back) to 1 (move forward)
 * @param yaw turn speed, expected value from -1 (turn counter-clocwise) to 1 (turn clocwise)
 * @param altitude turn speed, expected value from -1 (move down) to 1 (move up)

public setRoll(roll)
 * Sets the roll speed of drone's flight params
 * @param roll turn speed, expected value from -1 (move left) to 1 (move right)

public setPitch(pitch)
 * Sets the pitch of drone's flight params
 * @param pitch turn speed, expected value from -1 (move back) to 1 (move forward)

public setYaw(yaw: number)
 * Sets the turn speed of drone's flight params
 * @param yaw turn speed, expected value from -1 (turn counter-clocwise) to 1 (turn clocwise)

public setAltitude(altitude)
 * Sets the altitude of drone's flight params
 * @param altitude turn speed, expected value from -1 (move down) to 1 (move up)
   
export class MamboUUIDs {
  /** 
   * Contains Command Instructions and Flight Params Characteristics
   * 9a66fa00-0800-9191-11e4-012d1540cb8e 
   */
  static serviceUUIDa = '9a66fa00-0800-9191-11e4-012d1540cb8e';

  /**
   * Contains Flight Status Characteristic
   * 9a66fb00-0800-9191-11e4-012d1540cb8e
   */
  static serviceUUIDb = '9a66fb00-0800-9191-11e4-012d1540cb8e';

  static services = [MamboUUIDs.serviceUUIDa, MamboUUIDs.serviceUUIDb];

  /** 9a66fa0b-0800-9191-11e4-012d1540cb8e */
  static characteristic_command_instructions = '9a66fa0b-0800-9191-11e4-012d1540cb8e';
  /** 9a66fa0a-0800-9191-11e4-012d1540cb8e */
  static characteristic_flight_params =        '9a66fa0a-0800-9191-11e4-012d1540cb8e';
  /** 9a66fb0e-0800-9191-11e4-012d1540cb8e */
  static characteristic_flightStatus =         '9a66fb0e-0800-9191-11e4-012d1540cb8e';
}

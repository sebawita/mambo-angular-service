/// <reference path="node_modules/@types/web-bluetooth/index.d.ts" />
import { Drone } from '.';
export declare class MamboService {
    constructor();
    /**
    * Runs a bluetooth scan, this triggers a search pop up in the browser for the user to select a device. Once that is done, `search` returns a promise with the selected Drone object
    */
    search(): Promise<Drone>;
}

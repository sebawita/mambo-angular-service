import { Component, HostListener } from '@angular/core';
import { MamboService, Drone } from 'mambo-angular-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ready = false;
  drone: Drone;
  speed = 0.5;

  constructor(private mamboService: MamboService) {
  }

  public async search() {
    this.drone = await this.mamboService.search();

    this.drone.connection$
    .subscribe(
      () => this.ready = true,
      err => console.error('Something went wrong: ' + JSON.stringify(err)),
      () => {
        alert('Drone is no longer connected');
        this.drone = null;
        this.ready = false;
      }
      );

      alert('Ready to fly');
    }

    takeOff() {
      this.drone.takeOff();
    }

    land() {
      this.drone.land();

    }

    @HostListener('window:keydown', ['$event'])
    keyboardDownInput(event: KeyboardEvent) {
      if (this.drone) {
        this.handleKeyDown(event);
      }
    }
    @HostListener('window:keyup', ['$event'])
    keyboardUpInput(event: KeyboardEvent) {
      if (this.drone) {
        this.handleKeyUp(event);
      }
    }

    public handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      switch (key) {
        case 'a':
        this.drone.setRoll(-this.speed);
        break;
        case 'd':
        this.drone.setRoll(this.speed);
        break;
        case 'w':
        this.drone.setPitch(this.speed);
        break;
        case 's':
        this.drone.setPitch(-this.speed);
        break;
        case 'l':
        this.land();
        break;
        case 'arrowleft':
        this.drone.setYaw(-1);
        break;
        case 'arrowright':
        this.drone.setYaw(1);
        break;
        case 'arrowup':
        this.drone.setAltitude(this.speed);
        break;
        case 'arrowdown':
        this.drone.setAltitude(-this.speed);
        break;
      }
    }

    public handleKeyUp(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      switch (key) {
        case '1':
        this.speed = 0.25;
        break;
        case '2':
        this.speed = 0.5;
        break;
        case '3':
        this.speed = 0.75;
        break;
        case '4':
        this.speed = 1;
        break;
        case 't':
        this.drone.takeOff();
        break;
        case 'l':
        this.drone.land();
        break;
        case 'a':
        case 'd':
        this.drone.setRoll(0);
        break;
        case 'w':
        case 's':
        this.drone.setPitch(0);
        break;
        case 'arrowleft':
        case 'arrowright':
        this.drone.setYaw(0);
        break;
        case 'arrowup':
        case 'arrowdown':
        this.drone.setAltitude(0);
        break;
        case 'f':
        this.drone.fire();
        break;
      }
    }

    async issueCommand() {

      this.drone = await this.mamboService.search();
      // wait until ready...
      this.drone.takeOff();
    }
  }

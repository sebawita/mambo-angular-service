import { Component, HostListener } from '@angular/core';
import { MamboService, Drone } from 'mambo-angular-service';
// import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  ready = false;
  drone: Drone;
  speed = 0.5;

  constructor(private mamboService: MamboService) {
  }

  search() {
    this.mamboService.search()
    .then((drone) => {
      console.log('Ready to connect');
      this.drone = drone;

      // this.connect();
    } );
  }

  connect() {
    this.drone.connect()
    .then(() => {
      console.log('Ready to fly');
      this.ready = true;
    });
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

  takeOff() {
    this.drone.takeOff();
  }

  land() {
    this.drone.land();
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
    }
  }
}

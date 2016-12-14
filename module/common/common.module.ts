import { NgModule } from '@angular/core';
import {EventListenerService} from "./event-listener/event-listener.service";
import {MultiEventListenerService} from "./event-listener/multi-event-listener.service";

@NgModule({
  imports: [
  ],
  declarations: [
  ],
  providers: [
    EventListenerService,
    MultiEventListenerService,
  ],
  exports: [
  ]
})
export class CommonModule {}

import { Injectable } from '@angular/core';
import {EventListenerService} from "./event-listener.service";


@Injectable()
export class MultiEventListenerService extends EventListenerService{
    public setStatus( status:string ):void{
        this.setCurrentStatus( status );
    }
}
import { Injectable } from '@angular/core';

class EventSubscriberModel {
    constructor( public func:any, public status:string=null ){}
}

@Injectable()
export class EventListenerService {
    private statusListeners:Array<EventSubscriberModel> = [];
    private currentStatus:string = "";

    public subscribeToStatusChange( func:any, status:string=null ):void{
        let obj:EventSubscriberModel = new EventSubscriberModel(func, status);

        this.statusListeners.push( obj );
    }

    protected setCurrentStatus( status:string ):void{
        this.currentStatus = status;
        this.fireStatusChangeListeners();
    }

    public getCurrentStatus():string{
        return this.currentStatus;
    }

    private fireStatusChangeListeners():void {
        for (var i in this.statusListeners) {
            if( this.statusListeners[i].status == null || this.statusListeners[i].status == this.getCurrentStatus() ){
                this.statusListeners[ i ].func();
            }
        }
    }
}
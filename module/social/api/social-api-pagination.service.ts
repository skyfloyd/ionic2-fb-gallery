import { Injectable } from '@angular/core';

@Injectable()
export class SocialApiPaginationService{
    private paginationMap:any = {};

    constructor() {}

    public setPaginationInfo( path:Array<string>, next:string, previous:string ):void{
        let pathObject:any = this.getPathObject( path, true );
        pathObject.next = next;
        pathObject.previous = previous;
    }

    public getNextPage( path:Array<string> ):any{
        let pathObject:any = this.getPathObject( path, false );
        if( pathObject === false ){
            return false;
        }

        return pathObject.next;
    }

    public getPreviousPage( path:Array<string> ):any{
        let pathObject:any = this.getPathObject( path, false );
        if( pathObject === false ){
            return false;
        }

        return pathObject.previous;
    }

    private getPathObject( path:Array<string>, create:boolean = true ):any{
        let startPoint:any = this.paginationMap;
        for( let i in path ){
            if( typeof startPoint[ path[ i ] ] == "undefined" ){
                if( create ){
                    startPoint[ path[ i ] ] = {};
                }else{
                    return false;
                }
            }
            startPoint = startPoint[ path[ i ] ];
        }

        return startPoint;
    }
}
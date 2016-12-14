import { Injectable } from '@angular/core';
import {SocialApiService} from "../../api/social-api.service";
import {MultiEventListenerService} from "../../../common/event-listener/multi-event-listener.service";

@Injectable()
export class FbGalleryService{
    private albumList:Array<any> = [];
    private selectedAlbumIndex:string = null;
    private selectedAlbumId:string = null;
    private callbackFunc:any = null;

    private albumEventManager:MultiEventListenerService = new MultiEventListenerService();
    private photoEventManager:MultiEventListenerService = new MultiEventListenerService();

    private static albumStatus_loading:string = "albumLoading";
    private static photoStatus_loading:string = "photoLoading";
    private static albumStatus_loadMore:string = "albumLoadMore";
    private static photoStatus_loadMore:string = "photoLoadMore";
    private static albumStatus_ready:string = "albumReady";
    private static photoStatus_ready:string = "photoReady";

    public static getAlbumStatus_loading():string{
        return FbGalleryService.albumStatus_loading;
    }
    public static getPhotoStatus_loading():string{
        return FbGalleryService.photoStatus_loading;
    }
    public static getAlbumStatus_loadMore():string{
        return FbGalleryService.albumStatus_loadMore;
    }
    public static getPhotoStatus_loadMore():string{
        return FbGalleryService.photoStatus_loadMore;
    }
    public static getAlbumStatus_ready():string{
        return FbGalleryService.albumStatus_ready;
    }
    public static getPhotoStatus_ready():string{
        return FbGalleryService.photoStatus_ready;
    }

    public subscribeToAlbumStatusChange( func:any, status:string=null ):void{
        this.albumEventManager.subscribeToStatusChange( func, status );
    }
    public subscribeToPhotoStatusChange( func:any, status:string=null ):void{
        this.photoEventManager.subscribeToStatusChange( func, status );
    }
    
    public getAlbumCurrentStatus():string{
        return this.albumEventManager.getCurrentStatus();
    }
    public getPhotoCurrentStatus():string{
        return this.photoEventManager.getCurrentStatus();
    }

    constructor( private socialApi:SocialApiService ){
        this.albumEventManager.setStatus( null );
        this.photoEventManager.setStatus( null );
    }

    public setCallback( callback:any ):void{
        this.callbackFunc = callback;
    }

    public callCallback( url:string, message:string ):void{
        if( this.callbackFunc !== null ){
            this.callbackFunc( url, message );
        }
    }

    public openGallery():void{
        this.albumEventManager.setStatus( FbGalleryService.getAlbumStatus_loading() );

        this.socialApi.getCurrentUserAlbums(
            (response)=>{
                this.setAlbums( response );
                this.albumEventManager.setStatus( FbGalleryService.getAlbumStatus_ready() );
            }
        );
    }

    public getAlbumList():Array<any>{
        return this.albumList;
    }

    public selectAlbum( id:string ):boolean{
        let index = this.getAlbumIndexById( id );
        if( index !== null ){
            this.selectedAlbumId = id;
            this.selectedAlbumIndex = index;
            this.photoEventManager.setStatus( FbGalleryService.getPhotoStatus_loading() );

            this.socialApi.getAlbumPhotos(
                this.selectedAlbumId,
                (res)=>{
                    this.setAlbumPhotos( res );
                    this.photoEventManager.setStatus( FbGalleryService.getPhotoStatus_ready() );
                }
            );

            return true;
        }

        return false;
    }

    public loadMoreSelectedAlbumPhotos():boolean{

        if( this.selectedAlbumId !== null ){
            this.socialApi.getAlbumPhotos(
                this.selectedAlbumId,
                (res)=>{
                    this.setAlbumPhotos( res, null, true );
                    this.photoEventManager.setStatus( FbGalleryService.getPhotoStatus_loadMore() );
                },
                null,
                true
            );

            return true;
        }

        return false;
    }

    public loadMoreAlbums():boolean{
        this.socialApi.getCurrentUserAlbums(
            (res)=>{
                this.setAlbums( res, true );
                this.albumEventManager.setStatus( FbGalleryService.getAlbumStatus_loadMore() );
            },
            null,
            true
        );

        return true;
    }

    public getSelectedAlbum():any{
        if( this.selectedAlbumIndex == null || typeof this.albumList[ this.selectedAlbumIndex ] == "undefined" ){
            return null;
        }

        return this.albumList[ this.selectedAlbumIndex ];
    }

    public getSelectedAlbumPhotos():Array<any>{
        if( this.selectedAlbumIndex == null || typeof this.albumList[ this.selectedAlbumIndex ] == "undefined" || typeof this.albumList[ this.selectedAlbumIndex ].photos == "undefined" ){
            return [];
        }

        return this.albumList[ this.selectedAlbumIndex ].photos;
    }



    private setAlbumPhotos( response:any, key:string=null, add:boolean=false ):void{
        if( typeof response.data[ 0 ] !== "undefined" ){
            if( key == null ){
                key = this.getAlbumIndexById( response.data[ 0 ].album.id );
            }
            
            if( key != null && typeof this.albumList[ key ] !== "undefined" && this.albumList[ key ].id == response.data[ 0 ].album.id ){
                this.albumList[ key ].img = response.data[ 0 ].images[ 0 ].source;
                if( add ){
                    this.albumList[ key ].photos = this.albumList[ key ].photos.concat( response.data );
                }else{
                    this.albumList[ key ].photos = response.data;
                }
            }
        }
    }

    private getAlbumIndexById( id:string ):string{
        for( let i in this.albumList ){
            if( this.albumList[ i ].id == id ){
                return i;
            }
        }

        return null;
    }

    private setAlbums( response:any, add:boolean=false ):void{
        if( add ){
            this.albumList = this.albumList.concat( response.data );
        }else{
            this.albumList = response.data;
        }
    }
}
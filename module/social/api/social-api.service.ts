import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import {Facebook} from 'ionic-native';
import {SocialApiPaginationService} from "./social-api-pagination.service";
import 'rxjs/add/operator/toPromise';
import {EventListenerService} from "../../common/event-listener/event-listener.service";
//import {EventListenerService} from "../../common/common.module";


@Injectable()
export class SocialApiService extends EventListenerService{
    private currentUserId:string = null;
    private currentSessionKey:string = null;
    private static apiStatus_appUser:string = "appUser"; //this variables must be CONST or have GET function
    private static apiStatus_notAppUser:string = "notAppUser";
    private static apiStatus_notSocialUser:string = "notSocialUser";
    private static apiStatus_loading:string = "loading";

    private appPermissions:Array<string> = ["email","public_profile","user_friends"];

    constructor( private platform: Platform, private pagination:SocialApiPaginationService, private http: Http ) {
        super();
        this.setCurrentStatus( null );
    }

    public static getApiStatus_appUser():string{
        return SocialApiService.apiStatus_appUser;
    }
    public static getApiStatus_notAppUser():string{
        return SocialApiService.apiStatus_notAppUser;
    }
    public static getApiStatus_notSocialUser():string{
        return SocialApiService.apiStatus_notSocialUser;
    }
    public static getApiStatus_loading():string{
        return SocialApiService.apiStatus_loading;
    }

    public isApiStatus_default():boolean{
        return this.getCurrentStatus() === null;
    }
    public isApiStatus_appUser():boolean{
        return !this.isApiStatus_default() && SocialApiService.apiStatus_appUser === this.getCurrentStatus();
    }
    public isApiStatus_notAppUser():boolean{
        return !this.isApiStatus_default() && SocialApiService.apiStatus_notAppUser === this.getCurrentStatus();
    }
    public isApiStatus_notSocialUser():boolean{
        return !this.isApiStatus_default() && SocialApiService.apiStatus_notSocialUser === this.getCurrentStatus();
    }
    public isApiStatus_loading():boolean{
        return SocialApiService.apiStatus_loading === this.getCurrentStatus();
    }
    public isApiStatus_notInit():boolean{
        return this.isApiStatus_default() && !this.isApiStatus_loading();
    }

    public getCurrentUserId():string{
        return this.currentUserId;
    }

    public getCurrentSessionKey():string{
        return this.currentSessionKey;
    }

    //to get the init result you need to subscribeToApiStatusChange
    public init( initParam:any=null, permissions?:Array<string> ):void{
        if( typeof permissions !== "undefined" && permissions !== null ){
            this.appPermissions = permissions;
        }

        if( this.isApiStatus_notInit() ) {
            this.setCurrentStatus( SocialApiService.apiStatus_loading );

            this.platform.ready().then((readySource) => {
                Facebook.getLoginStatus().then((response) => {
                    this.onFbLoginStatus( response );
                }).catch((error) => {
                    console.log("FB --- LOGIN STATUS PROBLEM ", JSON.stringify(error));
                });

                //Facebook.browserInit(initParam[ "key" ], 'v2.1') //or 2.1;
            });
        }
    }

    public login():void{
        Facebook.login( this.appPermissions ).then((response) => {
            this.onFbLoginStatus( response );
        }).catch((error) => {
            console.log("FB LOGIN PROBLEM ", JSON.stringify(error));
        });
    }

    public getUserInfo( userId:string, readyFunc:any, funcPar:any=null ):void{
        if( this.isApiStatus_appUser() ){
            var req = "/me";
            if( userId !== null ){
                req = ("/" + userId);
            }
            req += "?fields=id,name,age_range,birthday,email,first_name,last_name,gender,link,location,locale,timezone,picture.type(large)";
            Facebook.api( req, [] ).then((response) => {
                this.proccedServerResponse(response, readyFunc, funcPar);
            }).catch((error) => {
                console.log("getUserInfo PROBLEM ", JSON.stringify( error ));
            });
        }else{
            this.subscribeToStatusChange( ()=>{ this.getUserInfo( userId, readyFunc, funcPar ); }, SocialApiService.apiStatus_appUser );
        }
    }

    public getCurrentUserAlbums( readyFunc:any, funcPar:any=null, next:boolean=null ):void{
        if( this.isApiStatus_appUser() ){
            let path:Array<string> = [
                "/" + this.getCurrentUserId() + "/albums",
                "fields=id,name,count,cover_photo{id,picture,images}",
                "user_photos"
            ];

            if( next === null ){
                var req = path[ 0 ] + "?" + path[ 1 ];
                Facebook.api( req, path[ 2 ].split(",") ).then((response) => {
                    this.proccedServerResponse(response, readyFunc, funcPar, path);
                }).catch((error) => {
                    console.log("getCurrentUserAlbums PROBLEM ", JSON.stringify( error ));
                });
            }else{
                this.paginationRequest( path, next, readyFunc, funcPar );
            }
        }else{
            this.subscribeToStatusChange( ()=>{ this.getCurrentUserAlbums( readyFunc, funcPar ); }, SocialApiService.apiStatus_appUser );
        }
    }

    public getAlbumPhotos( albumId:string, readyFunc:any, funcPar:any=null, next:boolean=null ):void{
        if( this.isApiStatus_appUser() ){
            let path:Array<string> = [
                "/" + albumId + "/photos",
                "fields=id,name,picture,album,images",
                "user_photos"
            ];

            if( next === null ){
                var req = path[ 0 ] + "?" + path[ 1 ];
                Facebook.api( req, path[ 2 ].split(",") ).then((response) => {
                    this.proccedServerResponse(response, readyFunc, funcPar, path);
                }).catch((error) => {
                    console.log("getAlbumPhotos PROBLEM ", JSON.stringify( error ));
                });
            }else{
                this.paginationRequest( path, next, readyFunc, funcPar );
            }
        }else{
            this.subscribeToStatusChange( ()=>{ this.getAlbumPhotos( albumId, readyFunc, funcPar ); }, SocialApiService.apiStatus_appUser );
        }
    }

    private onFbLoginStatus( response:any ):void{
        if(response.status == 'connected'){
            this.setCurrentStatus( SocialApiService.apiStatus_appUser );
            this.currentUserId = response.authResponse.userID;
            this.currentSessionKey = response.authResponse.accessToken;
        }else
        if(response.status == 'not_authorized'){
            this.setCurrentStatus( SocialApiService.apiStatus_notAppUser );
        }else{
            this.setCurrentStatus( SocialApiService.apiStatus_notSocialUser );
        }
    }

    private paginationRequest( path:Array<string>, next:boolean, readyFunc:any, funcPar:any=null ):void{
        let paramValue = "";
        let paramName = "";
        if( next ){
            paramValue = this.pagination.getNextPage( path );
            paramName = "after";
        }else{
            paramValue = this.pagination.getPreviousPage( path );
            paramName = "before";
        }

        if( paramValue ){
            let req = path[ 0 ];
            if( typeof path[ 1 ] !== "undefined" && path[ 1 ] !== null ){
                req += "?" + path[ 1 ] + "&";
            }else{
                req += "?";
            }
            req += paramName + "=" + paramValue;

            let perm:Array<string> = typeof path[ 2 ] !== "undefined" && path[ 2 ] !== null ? path[ 2 ].split(",") : [];

            Facebook.api( req, perm ).then((response) => {
                this.proccedServerResponse(response, readyFunc, funcPar, path);
            }).catch((error) => {
                console.log("paginationRequest PROBLEM ", JSON.stringify( error ));
            });
        }
    }

    private proccedServerResponse(response:any, readyFunc:any, funcPar?:any, path?:Array<string>):void{
        if (response && !response.error) {
            if( typeof path != "undefined" && typeof response.paging != "undefined" ){
                //this.pagination.setPaginationInfo( path, response.paging.next, response.paging.previous );
                this.pagination.setPaginationInfo( path, response.paging.cursors.after, response.paging.cursors.before );
            }

            if( typeof funcPar != "undefined" && funcPar !== null ){
                readyFunc( funcPar, response );
            }else{
                readyFunc( response );
            }
        }else{
            console.log( "proccedServerResponse ERROR: ", JSON.stringify(response) );
        }
    }
}
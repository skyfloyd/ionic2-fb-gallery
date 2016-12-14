import { Component } from '@angular/core';
import {ViewController, LoadingController, NavController} from "ionic-angular";
import {FbGalleryService} from "../../service/fb-gallery.service";

@Component({
  templateUrl: 'fb-gallery-photo.page.html'
})
export class FbGalleryPhotoPage {
  private loadingPop:any = null;
  private infiniteScroll:any = null;
  private itemsCount:number = 0;

  constructor( private fbGalleryService:FbGalleryService, public viewCtrl: ViewController, private loadingCtrl: LoadingController, private nav: NavController) { //nav: NavController esi petq a haskanal kashxati te che
    this.loadingPop = this.loadingCtrl.create({
      content: "Loading...",
      dismissOnPageChange: true
    });
    this.loadingPop.present();

    this.fbGalleryService.subscribeToPhotoStatusChange( ()=>{ this.onMorePhotoListLoad(); }, FbGalleryService.getPhotoStatus_loadMore() );
    if( this.fbGalleryService.getPhotoCurrentStatus() != FbGalleryService.getPhotoStatus_ready() ){
      this.fbGalleryService.subscribeToPhotoStatusChange( ()=>{ this.onPhotoListLoad(); }, FbGalleryService.getPhotoStatus_ready() );
    }else{
      this.onPhotoListLoad();
    }
  }

  public getPhotoList():Array<any>{
    return this.fbGalleryService.getSelectedAlbumPhotos();
  }

  public getAlbumInfo():any{
    let info = this.fbGalleryService.getSelectedAlbum();
    if( info === null ){
      return {};
    }

    return info;
  }

  private onPhotoListLoad():void{
    this.loadingPop.dismissAll();
  }

  private onMorePhotoListLoad():void {
    if( this.infiniteScroll !== null ){
      this.infiniteScroll.complete();

      if( this.getPhotoList().length == this.itemsCount ){
        this.infiniteScroll.enable( false );
      }

      this.infiniteScroll = null;
    }
  }

  public dismiss():void {
    this.viewCtrl.dismiss();
  }

  public openPhoto( photo:any ):void {
    this.nav.remove((this.nav.length() - 2), 2).then( (res)=>{ console.log( "nav.remove success ", res ); } ).catch( (res)=>{ console.log( "nav.remove error ", res ); } );
    this.fbGalleryService.callCallback( photo.images[ 0 ].source, photo.name );
  }

  public doInfinite( infiniteScroll:any ):void{
    if( this.infiniteScroll == null ){
      this.itemsCount = this.getPhotoList().length;

      this.infiniteScroll = infiniteScroll;
      this.fbGalleryService.loadMoreSelectedAlbumPhotos();
    }
  }
}

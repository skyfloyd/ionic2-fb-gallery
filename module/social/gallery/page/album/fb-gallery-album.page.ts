import { Component } from '@angular/core';
import {ViewController, LoadingController, NavController} from "ionic-angular";
import {FbGalleryPhotoPage} from "../photo/fb-gallery-photo.page";
import {FbGalleryService} from "../../service/fb-gallery.service";

@Component({
  templateUrl: 'fb-gallery-album.page.html'
})
export class FbGalleryAlbumPage {
  private loadingPop:any = null;
  private infiniteScroll:any = null;
  private itemsCount:number = 0;

  constructor( private fbGalleryService:FbGalleryService, public viewCtrl: ViewController, private loadingCtrl: LoadingController, private nav: NavController) { //nav: NavController esi petq a haskanal kashxati te che
    this.loadingPop = this.loadingCtrl.create({
      content: "Loading...",
      dismissOnPageChange: true
    });
    this.loadingPop.present();

    this.fbGalleryService.subscribeToAlbumStatusChange( ()=>{ this.onMoreAlbumListLoad(); }, FbGalleryService.getAlbumStatus_loadMore() );
    this.fbGalleryService.subscribeToAlbumStatusChange( ()=>{ this.onAlbumListLoad(); }, FbGalleryService.getAlbumStatus_ready() );
    this.fbGalleryService.openGallery();
  }

  public getAlbumList():Array<any>{
    return this.fbGalleryService.getAlbumList();
  }

  private onAlbumListLoad():void{
    this.loadingPop.dismissAll();
  }

  private onMoreAlbumListLoad():void {
    if( this.infiniteScroll !== null ){
      this.infiniteScroll.complete();

      if( this.getAlbumList().length == this.itemsCount ){
        this.infiniteScroll.enable( false );
      }

      this.infiniteScroll = null;
    }
  }

  public dismiss():void {
    this.viewCtrl.dismiss();
  }

  public openAlbum( album:any ):void {
    this.fbGalleryService.selectAlbum( album.id );
    this.nav.push( FbGalleryPhotoPage );
  }

  public doInfinite( infiniteScroll:any ):void{
    if( this.infiniteScroll == null ){
      this.itemsCount = this.getAlbumList().length;

      this.infiniteScroll = infiniteScroll;
      this.fbGalleryService.loadMoreAlbums();
    }
  }
}

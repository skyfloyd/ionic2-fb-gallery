import { Injectable } from '@angular/core';
import {ModalController} from "ionic-angular/index";
import {FbGalleryService} from "../service/fb-gallery.service";
import {FbGalleryAlbumPage} from "../page/album/fb-gallery-album.page";


@Injectable()
export class FbGallery {
    constructor( private modalCtrl: ModalController, private fbGalleryService:FbGalleryService ) {
    }

    public init( callback:any ):void{
        this.fbGalleryService.setCallback( callback );
        let modal = this.modalCtrl.create( FbGalleryAlbumPage );
        modal.present();
    }
}

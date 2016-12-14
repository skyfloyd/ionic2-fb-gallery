import { Directive, HostListener, Input } from '@angular/core';
import {ModalController} from "ionic-angular/index";
import {FbGalleryService} from "../service/fb-gallery.service";
import {FbGalleryAlbumPage} from "../page/album/fb-gallery-album.page";

@Directive({ selector: '[fb-gallery]' })
export class FbGalleryDirective {
    constructor( private modalCtrl: ModalController, private fbGalleryService:FbGalleryService ) {
    }

    @Input('fb-gallery') callback: any;

    @HostListener('click') onClick() {
        this.fbGalleryService.setCallback( this.callback );
        let modal = this.modalCtrl.create( FbGalleryAlbumPage );
        modal.present();
    }
}
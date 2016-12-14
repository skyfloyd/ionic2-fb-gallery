import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {FbGalleryPhotoPage} from "./gallery/page/photo/fb-gallery-photo.page";
import {SocialApiPaginationService} from "./api/social-api-pagination.service";
import {SocialApiService} from "./api/social-api.service";
import {FbGalleryAlbumPage} from "./gallery/page/album/fb-gallery-album.page";
import {FbGalleryService} from "./gallery/service/fb-gallery.service";
import {FbGallery} from "./gallery/bootstrap/fb-gallery";
import {CommonModule} from "../common/common.module";
import {FbGalleryDirective} from "./gallery/bootstrap/fb-gallery.directive";

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [
    FbGalleryAlbumPage,
    FbGalleryPhotoPage,
    FbGalleryDirective
  ],
  entryComponents: [
    FbGalleryAlbumPage,
    FbGalleryPhotoPage
  ],
  providers: [
    SocialApiPaginationService,
    SocialApiService,
    FbGalleryService,
    FbGallery
  ],
  exports: [
    FbGalleryDirective
  ]
})
export class FbModule {}

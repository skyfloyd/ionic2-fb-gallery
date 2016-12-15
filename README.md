# ionic2-fb-gallery
Facebook gallery photo picker for Ionic 2

## Installation

  * Create Ionic project
  * Install `cordova-plugin-facebook4` by this command
```bash
$ ionic plugin add cordova-plugin-facebook4 --variable APP_ID="123456789" --variable APP_NAME="myApplication"
```
Find more details here [https://ionicframework.com/docs/v2/native/facebook/](https://ionicframework.com/docs/v2/native/facebook/)
  * Copy `ionic2-fb-gallery` `module` folder to `app` folder
  * Import `FbModule` to your app base `@NgModule`


## Usage

  * Call init() method of SocialApiService class object. Example here:
```bash
    constructor( private socialApi:SocialApiService ) {
        this.socialApi.subscribeToStatusChange( ()=>{ /* onApiReady(); */  }, SocialApiService.getApiStatus_appUser() );
        this.socialApi.init();
    }
```
This plugin use [ionic2-fb-api](https://github.com/skyfloyd/ionic2-fb-api/) plugin to connect with Facebook. Please take a look to [ionic2-fb-api documentation](https://github.com/skyfloyd/ionic2-fb-api/) for more info.

  * You have 2 options to open Facebook gallery photo picker dialog
    * Call `FbGallery` `init` function. It takes your callback as it's only parameter. Example here:
    ```bash
        constructor( private fbGallery:FbGallery ) {}

        public chooseFromFacebook():void{
          this.fbGallery.init((url, name)=>{
            /* do something here */
          });
        }
    ```

    * Use `fb-gallery` directive. Example here:

      **HTML file**
      ```bash
          <button ion-button block icon-left [fb-gallery]="facebookGalleryCallback()">
            <ion-icon name="logo-facebook"></ion-icon>
            Choose from Facebook
          </button>
      ```

      **TypeScript file**
      ```bash
          public facebookGalleryCallback():any{
            return (url, name)=>{
              /* do something here */
            };
          }
      ```
      
Thats all.

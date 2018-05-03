import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DOMService} from '../dom.service';

let golos = require('golos-js');

let steem = require('steem');
steem.config.set('websocket', 'wss://testnet.steem.vc');
steem.config.set('uri', 'https://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');

let APIS = {
    steem: steem,
    golos: golos,
};

// const POST_PRIVACY = [
//   { str: 'Supporters only', value: 1 },
//   { str: 'Public', value: 0 },
// ];

const POST_CONTENT_TYPES = [
    {str: 'Video', value: 1},
];

@Component({
    selector: 'vh-add-post-page',
    templateUrl: './add-post-page.component.html',
    styleUrls: ['./add-post-page.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class AddPostPageComponent implements OnInit {

    constructor(public api: ApiService,
                public router: Router,
                public domService: DOMService,
                private route: ActivatedRoute,
    ) {
    }
    isEditing = false;
    POST_PRIVACY: any;
    POST_CONTENT_TYPES = POST_CONTENT_TYPES;

    postData = {
        title: '',
        body: '',
        video_url: '',
        patrons_only: 0,
        cat_id: POST_CONTENT_TYPES[0].value,
        pKey: '',
        video_file: null,
        screen_file: null,
        base64: '',
        tags: [],
        tagsRaw: '',
    };

    isVideoVisible = false;
    backspaceEmpty = 0;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params['edit']) {
                this.api.getPostContent(localStorage.getItem('nick'),params['edit'], this.getPostContent.bind(this));
            }

        });

        this.api.getPostPrivacyValues().then(
            (data) => {
                this.POST_PRIVACY = data.privacy;
            },
            (data) => {

            }
        );
    }

    getPostContent(postData) {
        console.log(postData);
        for(let k in postData) {
            this.postData[k] = postData[k];
        }
        let metadata = JSON.parse(postData.metadata);
        this.postData.tags = metadata['tags'].slice(1);
        this.postData.screen_file = postData.post_image;
        this.isEditing = true;
        if(postData.video_ipfs) {
            let videoNode = document.querySelector('video');
            videoNode.src = postData.video_ipfs;
            this.isVideoVisible = true;
        }
        (document.getElementById('video_url') as HTMLInputElement).readOnly = true;
    }


    findByProp(arr, prop, val) {
        let result;
        if (!arr || arr.length === 0) {
            return result;
        }
        arr.forEach((elem) => {
            if (elem[prop] === val) {
                result = elem;
            }
        });

        return result;
    }

    @HostBinding('class') get classStr() {
        return 'addPostPage';
    }

    errors = [];

    validateForm()
    {
        this.errors = [];
        if(this.postData.title == '') {
            this.errors.push("Please input 'Video name'");
        }
        if(this.postData.video_file == null && this.postData.video_url == '') {
            this.errors.push("Please specify 'URL' or select video to upload");
        }
        if(this.postData.video_file != null && (this.postData.screen_file == null && this.postData.base64 == null)) {
            this.errors.push("Please select thumbnail image for you video");
        }
        return this.errors.length == 0;
    }
    post(event) {
        let promise = new Promise((resolve, reject) => {
            let postingKey = APIS['steem'].auth.toWif(localStorage.getItem('nick'), localStorage.getItem('password'), 'posting');
            this.postData.pKey = postingKey;
            if(!this.validateForm()) {
                reject();
                return false;
            }
            this.api.postAdd(this.postData).then((data) => {
                if (!data.status || data.status !== 'ok') {
                    reject();

                    return;
                }

                let wif = localStorage.getItem('privKey');
                let parentAuthor = '';
                let parentPermlink = data.data.parentPermlink;
                let author = data.data.author;
                let permlink = data.data.permlink;
                let title = data.data.title;
                let body = data.data.body;
                let jsonMetadata = JSON.stringify(data.data.jsonMetadata);

                APIS['steem'].broadcast.comment(postingKey, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
                    if (err) {
                        reject();

                        this.errors = ['Timeout limit'];
                    } else {
                        resolve();
                        this.router.navigateByUrl(data.data.post_link);
                    }
                });
            }, (data) => {
                this.errors.push(data.msg);
                reject();
            });
        });

        this.domService.onFormSubmit(event.target, promise);
    }

    clearErrors() {
        this.errors = [];
    }

    onFileInputChange($event) {
        let files = $event.target.files;
        for (let i = 0, f; f = files[i]; i++) {
            if (!f.type.match('video.*')) {
                this.showHideVideo(false);
                continue;
            }
            let reader = new FileReader();
            reader.onload = ((theFile) => {
                return (e) => {
                    document.getElementById('new_video_file').innerHTML = 'File: ' + theFile.name + ', Size: ' + theFile.size + ' bytes.';
                    this.postData.video_file = f;
                    (document.getElementById('video_url') as HTMLInputElement).readOnly = true;
                    (document.getElementById('video_url') as HTMLInputElement).value = '';
                    this.postData.video_url = '';
                    let videoNode = document.querySelector('video');
                    let canPlay = videoNode.canPlayType(theFile.type);
                    if (canPlay === '') {
                        canPlay = 'no';
                    }
                    if (canPlay === 'no') {
                        this.errors.push('File format "' + theFile.type + '": is not video format. Please select another file.');
                        return
                    }
                    videoNode.src = URL.createObjectURL(theFile);
                    this.isVideoVisible = true;
                };
            })(f);
            reader.readAsDataURL(f);
        }
    }

    cleanVideoFile() {
        document.getElementById('new_video_file').innerText = 'Click to select video to upload';
        (document.getElementById('new_video_file_input') as HTMLInputElement).value = '';
        (document.getElementById('video_url') as HTMLInputElement).readOnly = false;
        this.postData.video_file = null;
        this.showHideVideo(false);
    }

    showHideVideo(flag) {
        this.isVideoVisible = flag;
        if(!flag) {
            let videoNode = document.querySelector('video');
            videoNode.src = '';

        }
    }

    makeScreenShot() {
        let video = document.querySelector('video');
        let canvas = document.querySelector('canvas');
        let context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width , canvas.height);
        let dataURI = canvas.toDataURL('image/jpeg');
        let thumb = (document.getElementById('video_thumbnail') as HTMLImageElement);
        thumb.src =  dataURI;
        this.postData.base64 = dataURI;
        this.errors = [];
    }

    onScreenChange($event) {
        let files = $event.target.files;
        for (let i = 0, f; f = files[i]; i++) {
            if (!f.type.match('image.*')) {
                continue;
            }
            let reader = new FileReader();
            reader.onload = ((theFile) => {
                return (e) => {
                    (document.getElementById('video_thumbnail') as HTMLImageElement).src = e.target.result;
                    this.postData.screen_file = f;
                    this.errors = [];
                };
            })(f);
            reader.readAsDataURL(f);
        }

    }

    uploadScreenShot() {
        document.getElementById('screen_file').click();
    }

    chechIfFileSelected($event) {
        let target = $event.target || $event.srcElement;
        if (target.value.length == 0) {
            console.log("Suspect Cancel was hit, no files selected.");
        }
    }

    onBlueVideoFileSelection($event) {
        let target = $event.target || $event.srcElement;
        if (target.value.length == 0) {
            this.showHideVideo(false);
        }

    }

    tagsChange($event) {
        if($event.keyCode == 32 && this.postData.tagsRaw.trim() != '' && this.postData.tags.length < 4) { //SpaceKey
            this.postData.tags.push(this.postData.tagsRaw.trim());
            this.postData.tagsRaw = '';
        }
        if($event.keyCode == '8') { //Backspace
            if(this.postData.tagsRaw == '') {
                this.backspaceEmpty++;
                if(this.backspaceEmpty == 2) {
                    this.postData.tags.pop();
                    this.backspaceEmpty = 0;
                }
            }
        }
    }
    tagsBlur() {
        if( this.postData.tagsRaw.trim()!='' && this.postData.tags.length < 4) {
            this.postData.tags.push(this.postData.tagsRaw.trim());
            this.postData.tagsRaw = '';
        }
    }
    tagsDelete(tag) {
        let index = this.postData.tags.indexOf(tag);
        if (index !== -1)  this.postData.tags.splice(index, 1);
        return true;
    }

}

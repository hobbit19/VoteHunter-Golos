import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-creator-posts',
  templateUrl: './creator-posts.component.html',
  styleUrls: ['./creator-posts.component.less', '../video/video.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreatorPostsComponent implements OnInit {
  @Input() posts: any[];

  constructor() { }

  ngOnInit() {

  }

  @HostBinding('class') get classStr() {
    return 'creatorPosts';
  }

  playVideo($event)
  {
    let target = $event.target || $event.srcElement;
    let videoId = target.id.replace('play-','');
    let video=(document.getElementById(videoId) as HTMLVideoElement);
    video.setAttribute("controls","controls");
    video.play();
    video.onplaying = () => {
        (document.getElementById(target.id) as HTMLElement).style.display = 'none';
    };
    video.onpause = () => {
          (document.getElementById(target.id) as HTMLElement).style.display = 'block';
    };

      //target.style.display = 'none';
  }

  videoClick($event)
  {
      let target = $event.target || $event.srcElement;
      target.pause();
      (document.getElementById('play-' + target.id) as HTMLElement).style.display = 'block';
  }
}

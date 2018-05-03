import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {DOMService} from './dom.service';

/*
let golos = require('golos-js');
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
*/

let steem = require('steem');
steem.config.set('websocket', 'wss://testnet.steem.vc');
steem.config.set('uri', 'https://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');

interface IPost {
    author: string,
    permlink: string,
    metadata: string,
    body?: string,
    title?: string,
    id?: string,
    video_url?: string,
    video_ipfs?: string,
    post_image?: string,
}



@Injectable()
export class ApiService {
  constructor(public http: HttpClient, public domService: DOMService,) {
  }



  request(method: string, options: any): Promise<any> {
    let promise;

    if (method === 'get') {
      promise = this.http.get(options.url, {params: options.data}).toPromise();
    } else if (method === 'post') {
      // переделать на этот способ
      // https://angular.io/guide/http#override-default-request-headers-and-other-request-options
      // когда пробовал сделать в прошлый раз метод post превращался в get. видимо глюк исправят
      let headers = new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
      });
      let requestOptions = {
        headers: headers
      };

      promise = this.http.post(options.url, JSON.stringify(options.data), requestOptions).toPromise();
    }

    return new Promise((resolve, reject) => {
      promise.then((res) => {
        let data: any;
        try {
          data = res;//res.json();
        } catch (err) {
          console.log(err.message);
        }
        if (data.status === 'ok') {
          resolve(data);
        } else {
          // status === 'error' or something else
          reject(data);
        }
      }, (data) => {
        reject(data);
      });
    });
  }

  get(url: string, data?: { [key: string]: string | number | boolean }) {
    /*if (data) {
      url += '?' + $.param(data);
    }*/
    return this.request('get', {
      url: url,
      data: data
    });
  }

  post(url: string, data: { [key: string]: string | number | boolean }) {

    return this.request('post', {
      url: url,
      data: data
    });
  }

  postFormData(url, data): Promise<any> {
    let fd = this.domService.convertToFormData(data);

    return new Promise((resolve, reject) => {
      this.http.post(url, fd).subscribe((data: any) => {
        if (data.status === 'ok') {
          resolve(data);
        } else if (data.status === 'error') {
          reject(data);
        }
      });
    });
  }

  getStats() {
    return Promise.resolve([
      {name: 'Posts', num: '0'},
      {name: 'Supporters', num: '0'},
      {name: 'Steem', num: '0'},
      {name: 'Sum', num: '$0'},
    ]);
  }

    getUserStats() {
      return this.get('/profile/user-stats');
    }


    getPosts(params?: { user_id?: number }) {
    return this.get('/post/list', params);
  }

  getUserPatrons(params?: {user_id?: number}) {
    return this.get('/profile/get-patrons', params);
  }

  getAuthors(params?: { limit?: number; order?: string }) {
    return this.get('/profile/list', params);

    /*
        return Promise.resolve([
          {
            name: 'Phillip DeFranco',
            about: 'Health-Focused Bounce Houses',
            desc: '4 часа назад / 0 покровителей',
            profile_image: '/images/author.jpg'
          },
          {
            name: 'Phillip DeFranco',
            about: 'Health-Focused Bounce Houses',
            desc: '4 часа назад / 0 покровителей',
            profile_image: '/images/author.jpg'
          },
          {
            name: 'Phillip DeFranco',
            about: 'Health-Focused Bounce Houses',
            desc: '4 часа назад / 0 покровителей',
            profile_image: '/images/author.jpg'
          },
          {
            name: 'Phillip DeFranco',
            about: 'Health-Focused Bounce Houses',
            desc: '4 часа назад / 0 покровителей',
            profile_image: '/images/author.jpg'
          },
          {
            name: 'Phillip DeFranco',
            about: 'Health-Focused Bounce Houses',
            desc: '4 часа назад / 0 покровителей',
            profile_image: '/images/author.jpg'
          },
          {
            name: 'Phillip DeFranco',
            about: 'Health-Focused Bounce Houses',
            desc: '4 часа назад / 0 покровителей',
            profile_image: '/images/author.jpg'
          }
        ]);
    */
  }

  getCategories() {
    return this.get('/cat/list');
    // return Promise.resolve([
    //   { name: 'Блокчейн технологии', authorsNum: 20 },
    //   { name: 'Майтинг / Инвестинг', authorsNum: 20 },
    //   { name: 'Крипто валюты', authorsNum: 20 },
    //   { name: 'ICO / Инвестиции', authorsNum: 20 },
    // ]);
  }

  getCategory(id) {
    return this.get('/cat/get-authors', {id: id});
  }


  getUserProfile(id: number) {
    //return this.get('/profile/get',{id: id});
    return Promise.resolve({
      fullname: 'Crypto YODA',
      desc: 'еженедельные прогнозы криптовалютного рынка. 2018 год',
      bannerImg: '/images/profile-banner-example.png',
      avatar: '/images/profile-ava-example.png',
      socialLinks: [
        {name: 'twitter', link: '#'},
        {name: 'facebook', link: '#'},
        {name: 'youtube', link: '#'},
      ],
      badge: '/images/badge-2000.png',
      stats: {
        curators: 2034,
        money: 7211
      },
      goal: {
        num: '10k',
        desc: 'Lorem ipsum dolor sit amet consectetur adipiscn ing elit sed diam nonummy nibh euismod tincidunt ut. \n Lorem ipsum dolor sit amet consectetur adipiscing elit sed diam nonummy nibh euismod tincidunt ut.'
      },
      lastPosts: [
        {
          author: 'Crypto Yoda',
          avatar: '/images/profile-ava-example.png',
          date: '12.03.2018 14-00',
          dollars: 1,
          curators: 340,
          title: 'Обучение майнинга для начинающих (2)',
          desc: 'В этом выпуске я покажу как собрать и запустить...',
          isLocked: true
        },
        {
          author: 'Crypto Yoda',
          avatar: '/images/profile-ava-example.png',
          date: '12.03.2018 14-00',
          dollars: 2,
          curators: 124,
          title: 'Обучение майнинга для начинающих (3)',
          desc: 'В этом выпуске я покажу как собрать и запустить...',
          isLocked: true
        }
      ],
      rewards: [
        {
          text: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed diam nonummy nibh euismod tincidunt ut. lorem ipsum dolor sit amet consectetur adipiscing elit sed diam nonummy nibh euismod tincidunt ut.',
          num: 100
        },
        {
          text: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed diam nonummy nibh euismod tincidunt ut. lorem ipsum dolor sit amet consectetur adipiscing elit sed diam nonummy nibh euismod tincidunt ut.',
          num: 200
        }
      ]
    });
  }

  getProfileByUrl(url: string) {
    return this.get('/profile/get-by-url', {
      url: url
    });
  }

  getProfile() {
    return this.get('/profile/get');
  }

  updateProfile(data: any) {
    return this.postFormData('/profile/update', data);
  }

  updateGoals(data: any) {
    return this.post('/profile/goals', data);
  }

  updateReward(data: any) {
    return this.post('/profile/rewards', data);
  }

  deleteReward(data: any) {
        return this.post('/profile/delete-reward', data);
  }



    postAdd(data: any) {
    return this.postFormData('/post/add', data);
  }

  postShow(data: any) {
    return this.post('/post/show', data);
  }

  postList() {
    return this.get('/post/list', {});
  }

  login(data) {
    return this.post('/user/login', data);
  }

  user() {
    return this.get('/user/me');
  }

  postPay(data: any) {
    return this.post('/post/pay', data);
  }

  getCatList() {
    return this.get('/cat/list');
  }

  getPostPrivacyValues() {
    return this.get('/post/privacy-list');
  }

  getUserRewards(params?: { user_id?: number }) {
    return this.get('/profile/get-rewards', params);
  }

/*
  transferFunds() {
    let wif = golos.auth.toWif('gaidar', 'qwerty12345', 'active');
    golos.broadcast.transfer(wif, 'gaidar', 'vasya', '1.000 GOLOS', 'Patron', function (err, result) {
      console.log(err, result);
    });
  }
*/

  setAsPatron(data: any)
  {
      return this.post('/profile/set-as-patron', data);
  }

  isPostExists(data: any)
  {
      return this.get('/post/is-exists', data);
  }

  getAvatars(data:any) {
      return this.post('/profile/avatars', data);
  }

  getPostContent(author: string, permlink: string, callback?: any) {
      steem.api.getContent(author, permlink, (err, post) => {
          if (!err) {
              let postData: IPost = {
                  author: author,
                  permlink: permlink,
                  body: post.body,
                  metadata: post.json_metadata
              };

              this.postShow(postData).then((data) => {
                  if (data.status == 'ok') {
                      //delete postData.metadata;
                      postData.title = post.title;
                      postData.body = data.post.body;
                      postData.id = data.post.id;
                      postData.post_image = data.post.post_image;
                      if (data.post.video_url) {
                          postData.video_url = data.post.video_url;
                      }
                      if (data.post.video_ipfs) {
                          postData.video_ipfs = data.post.video_ipfs;
                      }
                  }
                  if(callback) {
                    callback(postData);
                  }
//                  this.post = postData;
//                  this.getComments();
              });
          } else {
              console.error(err);
          }
      });

  }
}

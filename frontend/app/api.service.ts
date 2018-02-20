import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiService {
  constructor(public http: HttpClient) { }

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

  getStats() {
    return Promise.resolve([
      { name: 'Постов', num: '7' },
      { name: 'GBG', num: '2745' },
      { name: 'Кураторы', num: '7' },
      { name: 'Сумма', num: '184$' },
    ]);
  }

  getMyBakers() {
    return Promise.resolve([
      { fullname: 'Name Surname', votes: 4, img: '/assets/images/avatar.jpg' },
      { fullname: 'Name Surname', votes: 3, img: '/assets/images/avatar.jpg' },
      { fullname: 'Name Surname', votes: 1, img: '/assets/images/avatar.jpg' },
      { fullname: 'Name Surname', votes: 2, img: '/assets/images/avatar.jpg' },
      { fullname: 'Name Surname', votes: 3, img: '/assets/images/avatar.jpg' },
    ]);
  }

  getMyPosts() {
    return Promise.resolve([
      { img: '/assets/images/yoda.png', title: 'Обучение майнинга для начинающих', desc: 'В этом выпуске я покажу как собрать и запустить ферм...' },
      { img: '/assets/images/yoda.png', title: 'Обучение майнинга для начинающих', desc: 'В этом выпуске я покажу как собрать и запустить ферм...' },
      { img: '/assets/images/yoda.png', title: 'Обучение майнинга для начинающих', desc: 'В этом выпуске я покажу как собрать и запустить ферм...' },
    ]);
  }

  getNewAuthors() {
    return Promise.resolve([
      {
        title: 'Health-Focused Bounce Houses',
        desc: 'This Pop-Up for the #CheckYoSelf Campaign Encourages Self-Exams',
        img: '/assets/images/author.jpg'
      },
      {
        title: 'Health-Focused Bounce Houses',
        desc: 'This Pop-Up for the #CheckYoSelf Campaign Encourages Self-Exams',
        img: '/assets/images/author.jpg'
      },
      {
        title: 'Health-Focused Bounce Houses',
        desc: 'This Pop-Up for the #CheckYoSelf Campaign Encourages Self-Exams',
        img: '/assets/images/author.jpg'
      },
    ]);
  }


  getAuthors() {
    return Promise.resolve([
      {
        title: 'Health-Focused Bounce Houses',
        desc: 'This Pop-Up for the #CheckYoSelf Campaign Encourages Self-Exams',
        img: '/assets/images/author.jpg'
      },
      {
        title: 'Health-Focused Bounce Houses',
        desc: 'This Pop-Up for the #CheckYoSelf Campaign Encourages Self-Exams',
        img: '/assets/images/author.jpg'
      },
      {
        title: 'Health-Focused Bounce Houses',
        desc: 'This Pop-Up for the #CheckYoSelf Campaign Encourages Self-Exams',
        img: '/assets/images/author.jpg'
      },
      {
        title: 'Health-Focused Bounce Houses',
        desc: 'This Pop-Up for the #CheckYoSelf Campaign Encourages Self-Exams',
        img: '/assets/images/author.jpg'
      },
      {
        title: 'Health-Focused Bounce Houses',
        desc: 'This Pop-Up for the #CheckYoSelf Campaign Encourages Self-Exams',
        img: '/assets/images/author.jpg'
      },
      {
        title: 'Health-Focused Bounce Houses',
        desc: 'This Pop-Up for the #CheckYoSelf Campaign Encourages Self-Exams',
        img: '/assets/images/author.jpg'
      }
    ]);
  }

  getNewFaces() {
    return Promise.resolve([
      {
        fullname: 'Гильдия Мастеров',
        img: '/assets/images/avatar_001.png'
      },
      {
        fullname: 'Igor Alexeev',
        img: '/assets/images/avatar_002.jpg'
      },
      {
        fullname: 'Normies',
        img: '/assets/images/avatar_003.jpg'
      },
      {
        fullname: 'Rubin Reports',
        img: '/assets/images/avatar_005.jpg'
      },
      {
        fullname: 'Name Surname',
        img: '/assets/images/avatar_006.jpg'
      },
    ]);
  }

  getBakers() {
    return Promise.resolve([
      {
        fullname: 'Name Surname',
        img: '/assets/images/avatar.jpg'
      },
      {
        fullname: 'Name Surname',
        img: '/assets/images/avatar.jpg'
      },
      {
        fullname: 'Name Surname',
        img: '/assets/images/avatar.jpg'
      },
      {
        fullname: 'Name Surname',
        img: '/assets/images/avatar.jpg'
      },
      {
        fullname: 'Name Surname',
        img: '/assets/images/avatar.jpg'
      },
    ]);
  }

  getCategories() {
    return Promise.resolve([
      { name: 'Блокчейн технологии', authorsNum: 20 },
      { name: 'Майтинг / Инвестинг', authorsNum: 20 },
      { name: 'Крипто валюты', authorsNum: 20 },
      { name: 'ICO / Инвестиции', authorsNum: 20 },
    ]);
  }

  getProfile(id: number) {
    return this.get('/profile/get',{id: id});
  }

  updateProfile(data: any) {
    return this.post('/profile/update', data);
  }

  postAdd(data: any) {
    return this.post('/post/add', data);
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
}
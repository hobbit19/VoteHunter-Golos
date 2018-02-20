import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent implements OnInit {

  constructor() { }

  items = [
    { text: 'О проекте', link: '#' },
    { text: 'Как это работает', link: '#' },
    { text: 'Правила использования', link: '#' },
    { text: 'Обратная связь', link: '#' },
  ];

  ngOnInit() {
  }

}

import {Component, HostBinding, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'vh-team-member',
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class TeamMemberComponent implements OnInit {
  @Input() ava: string;
  @Input() name: string;
  @Input() role: string;

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get className() {
    return 'teamMember';
  }

}

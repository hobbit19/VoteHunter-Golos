import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorRewardsComponent } from './creator-rewards.component';

describe('CreatorSidebarComponent', () => {
  let component: CreatorRewardsComponent;
  let fixture: ComponentFixture<CreatorRewardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorRewardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorGoalComponent } from './creator-goal.component';

describe('CreatorGoalComponent', () => {
  let component: CreatorGoalComponent;
  let fixture: ComponentFixture<CreatorGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

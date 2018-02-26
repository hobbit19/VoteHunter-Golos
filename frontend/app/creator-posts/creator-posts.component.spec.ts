import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorPostsComponent } from './creator-posts.component';

describe('CreatorPostsComponent', () => {
  let component: CreatorPostsComponent;
  let fixture: ComponentFixture<CreatorPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

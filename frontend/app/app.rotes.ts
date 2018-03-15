import { Routes } from '@angular/router';
import { EditProfilePageComponent } from "./edit-profile-page/edit-profile-page.component";
import { CreatorPageComponent } from "./creator-page/creator-page.component";
import { CabinetPageComponent } from "./cabinet-page/cabinet-page.component";
import { AddPostPageComponent } from "./add-post-page/add-post-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { PostPageComponent } from "./post-page/post-page.component";
import { PaymentPageComponent } from "./payment-page/payment-page.component";
import { MainPageComponent } from "./main-page/main-page.component";
import {CreatorPageResolver} from './creator-page/creator-page-resolver.service';

export const appRoutes: Routes = [
  {
    path: 'edit-profile',
    data: {name: 'editProfile'},
    component: EditProfilePageComponent,
  },
  {
    path: 'dashboard',
    data: {name: 'cabinet'},
    component: CabinetPageComponent,
  },
  {
    path: 'add-post',
    data: {name: 'addPost'},
    component: AddPostPageComponent,
  },
  {
    path: 'login',
    data: {name: 'login'},
    component: LoginPageComponent,
  },
  {
    path: 'post',
    data: {name: 'post'},
    component: PostPageComponent,
  },
  {
    path: 'payment',
    data: {name: 'payment'},
    component: PaymentPageComponent,
  },
  {
    path: '',
    data: {name: 'mainPage'},
    component: MainPageComponent
  },
  {
    path: '**',
    data: {name: 'profile'},
    component: CreatorPageComponent,
    resolve: { profile: CreatorPageResolver }
  },
];

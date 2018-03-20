import {Routes} from '@angular/router';
import {EditProfilePageComponent} from './edit-profile-page/edit-profile-page.component';
import {CreatorPageComponent} from './creator-page/creator-page.component';
import {CabinetPageComponent} from './cabinet-page/cabinet-page.component';
import {AddPostPageComponent} from './add-post-page/add-post-page.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {PostPageComponent} from './post-page/post-page.component';
import {PaymentPageComponent} from './payment-page/payment-page.component';
import {MainPageComponent} from './main-page/main-page.component';
import {CreatorPageResolver} from './creator-page/creator-page-resolver.service';
import {AuthGuard} from './auth-guard.service';
import {CategoryPageComponent} from './category-page/category-page.component';
import {CategoryPageResolverService} from './category-page/category-page-resolver.service';
import {BecomePatronPageComponent} from './become-patron-page/become-patron-page.component';
import {BecomePatronPageResolverService} from './become-patron-page/become-patron-page-resolver.service';

export const appRoutes: Routes = [
  {
    path: 'edit-profile',
    data: {name: 'editProfile'},
    component: EditProfilePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    data: {name: 'cabinet'},
    component: CabinetPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-post',
    data: {name: 'addPost'},
    component: AddPostPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'become-patron/:id',
    data: {name: 'becomePatron'},
    component: BecomePatronPageComponent,
    canActivate: [AuthGuard],
    resolve: {rewards: BecomePatronPageResolverService}
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
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    data: {name: 'payment'},
    component: PaymentPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category/:id',
    data: {name: 'category'},
    component: CategoryPageComponent,
    resolve: {category: CategoryPageResolverService}
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
    resolve: {profile: CreatorPageResolver}
  },
];

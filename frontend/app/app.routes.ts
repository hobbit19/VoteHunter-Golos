import {Routes, UrlMatchResult, UrlSegment} from '@angular/router';
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
import {RequisitesPageComponent} from './requisites-page/requisites-page.component';
import {AboutPageComponent} from './about-page/about-page.component';
import {TeamPageComponent} from './team-page/team-page.component';
import {PrivacyPageComponent} from './privacy-page/privacy-page.component';
import {TermsPageComponent} from './terms-page/terms-page.component';
import {PostPageResolver} from './post-page/post-page-resolver.service';
import {CreatorCommunityComponent} from './creator-community/creator-community.component';
import {CreatorCommunityResolver} from './creator-community/creator-community-resolver.service';

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
    resolve: {rewards: BecomePatronPageResolverService}
  },
  {
    path: 'requisites',
    data: {name: 'requisites'},
    component: RequisitesPageComponent,
  },
  {
    path: 'login',
    data: {name: 'login'},
    component: LoginPageComponent,
  },
/*
  {
    path: 'post',
    data: {name: 'post'},
    component: PostPageComponent,
    canActivate: [AuthGuard]
  },
*/
  {
    path: 'p/:url/:permlink',
    data: {name: 'post'},
    component: PostPageComponent,
      resolve: {prepareData: PostPageResolver}
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
    path: 'about',
    data: {name: 'about'},
    component: AboutPageComponent,
  },
  {
    path: 'team',
    data: {name: 'team'},
    component: TeamPageComponent,
  },
  {
    path: 'privacy',
    data: {name: 'privacy'},
    component: PrivacyPageComponent,
  },
  {
    path: 'terms',
    data: {name: 'terms'},
    component: TermsPageComponent,
  },
  {
    path: '',
    data: {name: 'mainPage'},
    component: MainPageComponent
  },
  {
    data: {name: 'profile'},
    component: CreatorCommunityComponent,
    matcher: CommunityMatcher,
    resolve: {profile: CreatorCommunityResolver}
  },
  {
    path: '**',
    data: {name: 'profile'},
    component: CreatorPageComponent,
    resolve: {profile: CreatorPageResolver}
  },
];


export function CommunityMatcher(url: UrlSegment[]): UrlMatchResult {
    if (url.length < 2) {
        return null;
    }
    const reg = /^[a-z0-9]+$/;
    const author = url[0].toString();
    if (author.match(reg) && url[1].toString() == 'community') {
        return (
            {
                consumed: url,
                posParams: {
                  author: url[0]
                }
            }
            );
    }
    return null;
}

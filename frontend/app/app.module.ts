import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LogoComponent } from './logo/logo.component';
import { LiveSearchComponent } from './live-search/live-search.component';
import { MainPageComponent } from './main-page/main-page.component';
import { FooterComponent } from './footer/footer.component';
import { AuthorsComponent } from './authors/authors.component';
import { ApiService } from "./api.service";
import { PersonsComponent } from './persons/persons.component';
import { SocialsComponent } from './socials/socials.component';
import { CategoriesComponent } from './categories/categories.component';
import { EditProfilePageComponent } from './edit-profile-page/edit-profile-page.component';
import { UserService } from "./user.service";
import { HttpClientModule } from "@angular/common/http";
import { DropdownComponent } from './dropdown/dropdown.component';
import { DropdownOptionComponent } from './dropdown-option/dropdown-option.component';
import { AddPostPageComponent } from './add-post-page/add-post-page.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CabinetPageComponent } from './cabinet-page/cabinet-page.component';
import { StatsComponent } from './stats/stats.component';
import { PostsComponent } from './posts/posts.component';
import { PostPageComponent } from './post-page/post-page.component';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { CreatorPageComponent } from './creator-page/creator-page.component';
import { CreatorBannerComponent } from './creator-banner/creator-banner.component';
import { CreatorStatsComponent } from './creator-stats/creator-stats.component';
import { CreatorGoalComponent } from './creator-goal/creator-goal.component';
import { CreatorOverviewComponent } from './creator-overview/creator-overview.component';
import { CreatorPostsComponent } from './creator-posts/creator-posts.component';
import { CreatorRewardsComponent } from './creator-rewards/creator-rewards.component';
import { StateService } from "./state.service";
import { SidebarComponent } from './sidebar/sidebar.component';
import { MediatorService } from "./mediator.service";
import { appRoutes } from "./app.rotes";
import { DOMService } from "./dom.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LogoComponent,
    LiveSearchComponent,
    MainPageComponent,
    FooterComponent,
    AuthorsComponent,
    PersonsComponent,
    SocialsComponent,
    CategoriesComponent,
    EditProfilePageComponent,
    DropdownComponent,
    DropdownOptionComponent,
    AddPostPageComponent,
    MainNavComponent,
    LoginPageComponent,
    CabinetPageComponent,
    StatsComponent,
    PostsComponent,
    PostPageComponent,
    PaymentPageComponent,
    CreatorPageComponent,
    CreatorBannerComponent,
    CreatorStatsComponent,
    CreatorGoalComponent,
    CreatorOverviewComponent,
    CreatorPostsComponent,
    CreatorRewardsComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    ApiService,
    UserService,
    StateService,
    MediatorService,
    DOMService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}



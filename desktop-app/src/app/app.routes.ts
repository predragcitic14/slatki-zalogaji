import { Routes } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/register/register.component';
import { UserNotificationsComponent } from './components/user-notifications/user-notifications.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AddPromotionComponent } from './components/add-promotion/add-promotion.component';
import { CakesComponent } from './components/cakes/cakes.component';
import { CookiesComponent } from './components/cookies/cookies.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'home', component: HomepageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'notifications', component: UserNotificationsComponent},
  { path: 'profile', component: UserProfileComponent},
  { path: 'add-product', component: AddProductComponent},
  { path: 'upload-promotion', component: AddPromotionComponent},
  { path: 'cakes', component: CakesComponent},
  { path: 'cookies', component: CookiesComponent},
  { path: 'contact', component: ContactComponent}
];

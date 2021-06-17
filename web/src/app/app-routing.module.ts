import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './_components/home/app.home';
import { LoginComponent } from './_components/login/app.login';
import { ProductComponent } from './_components/product/app.product';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
   { path: '', component: HomeComponent, canActivate: [AuthGuard] },
   { path: 'login', component: LoginComponent },
   { path: 'product/:productId/:humanUrl', component: ProductComponent, canActivate: [AuthGuard] },
   { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

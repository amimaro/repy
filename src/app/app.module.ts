import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PackageSearchComponent } from './pages/package-search/package-search.component';
import { PackageListComponent } from './pages/package-list/package-list.component';
import { SharedComponent } from './pages/shared/shared.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { PackageManagerService } from './services/package-manager.service';
import { ScriptComponent } from './pages/script/script.component';


const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Repy -- Script generator for setting environments' }
  },
  {
    path: 'packages',
    component: PackageSearchComponent,
    data: { title: 'Packages - Repy - Script generator for setting environments' }
  },
  {
    path: 'list',
    component: PackageListComponent,
    data: { title: 'Selections - Repy - Script generator for setting environments' }
  },
  {
    path: 'script',
    component: ScriptComponent,
    data: { title: 'Script - Repy - Script generator for setting environments' }
  },
  {
    path: 'shared',
    component: SharedComponent,
    data: { title: 'Shared - Repy - Script generator for setting environments' }
  },
  {
    path: 'shared/:page',
    component: SharedComponent,
    data: { title: 'Shared - Repy - Script generator for setting environments' }
  },
  {
    path: 'docs',
    component: DocumentationComponent,
    data: { title: 'Docs - Repy - Script generator for setting environments' }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    PackageSearchComponent,
    PackageListComponent,
    SharedComponent,
    DocumentationComponent,
    ScriptComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [PackageManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }

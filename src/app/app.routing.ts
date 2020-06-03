import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JuegoComponent } from './components/juego/juego.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { SalaComponent } from './components/sala/sala.component';
import { MessageComponent } from './components/message/message.component';

import { UserGuard } from './services/user.guard';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'tateti/:num', component: JuegoComponent, canActivate: [UserGuard] },
  { path: 'lobby', component: LobbyComponent, canActivate: [UserGuard] },
  { path: 'sala/:num', component: SalaComponent, canActivate: [UserGuard] },
  { path: 'message', component: MessageComponent, canActivate: [UserGuard] },
  { path: '**', component: LoginComponent },
];
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

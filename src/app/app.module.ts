import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';
import { MomentModule } from 'ngx-moment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JuegoComponent } from './components/juego/juego.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { SalaComponent } from './components/sala/sala.component';
import { MessageComponent } from './components/message/message.component';
import { PrideComponent } from './components/pride/pride.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
// Servicios
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    JuegoComponent,
    LobbyComponent,
    SalaComponent,
    MessageComponent,
    PrideComponent,
    ChatboxComponent,
    UserEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule,
    MomentModule,
    BrowserAnimationsModule
  ],
  providers: [
    appRoutingProviders,
    UserService,
    UserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AccountRestInterfaceService } from './api/accountRestInterface.service';
import { DropRestInterfaceService } from './api/dropRestInterface.service';
import { ExchangeRestInterfaceService } from './api/exchangeRestInterface.service';
import { MintRestInterfaceService } from './api/mintRestInterface.service';
import { QueryApiService } from './api/queryApi.service';
import { RegistrationRestInterfaceService } from './api/registrationRestInterface.service';
import { StakeRewardRestInterfaceService } from './api/stakeRewardRestInterface.service';
import { TokenRestInterfaceService } from './api/tokenRestInterface.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AccountRestInterfaceService,
    DropRestInterfaceService,
    ExchangeRestInterfaceService,
    MintRestInterfaceService,
    QueryApiService,
    RegistrationRestInterfaceService,
    StakeRewardRestInterfaceService,
    TokenRestInterfaceService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}

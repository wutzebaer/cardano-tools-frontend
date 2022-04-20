export * from './accountRestInterface.service';
import { AccountRestInterfaceService } from './accountRestInterface.service';
export * from './exchangeRestInterface.service';
import { ExchangeRestInterfaceService } from './exchangeRestInterface.service';
export * from './mintRestInterface.service';
import { MintRestInterfaceService } from './mintRestInterface.service';
export * from './mintoOnDemandRestInterface.service';
import { MintoOnDemandRestInterfaceService } from './mintoOnDemandRestInterface.service';
export * from './registrationRestInterface.service';
import { RegistrationRestInterfaceService } from './registrationRestInterface.service';
export * from './stakeRewardRestInterface.service';
import { StakeRewardRestInterfaceService } from './stakeRewardRestInterface.service';
export * from './tokenRestInterface.service';
import { TokenRestInterfaceService } from './tokenRestInterface.service';
export const APIS = [AccountRestInterfaceService, ExchangeRestInterfaceService, MintRestInterfaceService, MintoOnDemandRestInterfaceService, RegistrationRestInterfaceService, StakeRewardRestInterfaceService, TokenRestInterfaceService];

export * from './accountRestInterface.service';
import { AccountRestInterfaceService } from './accountRestInterface.service';
export * from './dropRestInterface.service';
import { DropRestInterfaceService } from './dropRestInterface.service';
export * from './mintRestInterface.service';
import { MintRestInterfaceService } from './mintRestInterface.service';
export * from './registrationRestInterface.service';
import { RegistrationRestInterfaceService } from './registrationRestInterface.service';
export * from './stakeRewardRestInterface.service';
import { StakeRewardRestInterfaceService } from './stakeRewardRestInterface.service';
export * from './tokenRestInterface.service';
import { TokenRestInterfaceService } from './tokenRestInterface.service';
export * from './walletStatementRestInterface.service';
import { WalletStatementRestInterfaceService } from './walletStatementRestInterface.service';
export const APIS = [
  AccountRestInterfaceService,
  DropRestInterfaceService,
  MintRestInterfaceService,
  RegistrationRestInterfaceService,
  StakeRewardRestInterfaceService,
  TokenRestInterfaceService,
  WalletStatementRestInterfaceService,
];

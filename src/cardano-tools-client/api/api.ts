export * from './accountRestInterface.service';
import { AccountRestInterfaceService } from './accountRestInterface.service';
export * from './dropRestInterface.service';
import { DropRestInterfaceService } from './dropRestInterface.service';
export * from './exchangeRestInterface.service';
import { ExchangeRestInterfaceService } from './exchangeRestInterface.service';
export * from './mintRestInterface.service';
import { MintRestInterfaceService } from './mintRestInterface.service';
export * from './queryApi.service';
import { QueryApiService } from './queryApi.service';
export * from './registrationRestInterface.service';
import { RegistrationRestInterfaceService } from './registrationRestInterface.service';
export * from './snapshotRestInterface.service';
import { SnapshotRestInterfaceService } from './snapshotRestInterface.service';
export * from './stakeRewardRestInterface.service';
import { StakeRewardRestInterfaceService } from './stakeRewardRestInterface.service';
export * from './tokenRestInterface.service';
import { TokenRestInterfaceService } from './tokenRestInterface.service';
export * from './walletStatementRestInterface.service';
import { WalletStatementRestInterfaceService } from './walletStatementRestInterface.service';
export const APIS = [AccountRestInterfaceService, DropRestInterfaceService, ExchangeRestInterfaceService, MintRestInterfaceService, QueryApiService, RegistrationRestInterfaceService, SnapshotRestInterfaceService, StakeRewardRestInterfaceService, TokenRestInterfaceService, WalletStatementRestInterfaceService];

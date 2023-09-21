import { PolicyPrivate } from 'src/cardano-tools-client';

interface Countdown {
  secondsToDday: number;
  minutesToDday: number;
  hoursToDday: number;
  daysToDday: number;
}

export class CardanoUtils {
  static currentSlot() {
    return new Date().getTime() / 1000 - 1596491091 + 4924800;
  }

  static currentEpoch() {
    return Math.floor((new Date().getTime() / 1000 - 1506203091) / 432000);
  }

  static getTimeLeft(policy: PolicyPrivate): number {
    if (policy) {
      const timeLeft = policy.policyDueSlot - this.currentSlot();
      return Math.max(timeLeft, 0);
    } else {
      return 0;
    }
  }

  static getTimeLeftString(policy: PolicyPrivate): string {
    const timeLeft = this.getTimeLeft(policy);
    const countdown: Countdown = {
      secondsToDday: Math.floor((timeLeft / 1) % 60),
      minutesToDday: Math.floor((timeLeft / (1 * 60)) % 60),
      hoursToDday: Math.floor((timeLeft / (1 * 60 * 60)) % 24),
      daysToDday: Math.floor(timeLeft / (1 * 60 * 60 * 24)),
    };
    return `${countdown.daysToDday
      .toString()
      .padStart(2, '0')}:${countdown.hoursToDday
      .toString()
      .padStart(2, '0')}:${countdown.minutesToDday
      .toString()
      .padStart(2, '0')}:${countdown.secondsToDday
      .toString()
      .padStart(2, '0')}`;
  }
}

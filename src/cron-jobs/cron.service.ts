import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(
  ) {}

  // Every hours
  /*@Cron('0 * * * *')
  async handleCron() {
    try {
      console.log('Start running cron job');
    } catch (err) {
      console.log('Error running cron job. ', err);
    }
  }*/

}

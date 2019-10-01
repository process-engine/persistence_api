/**
 * Describes an executed Cronjob.
 */
export class Cronjob {

  public processModelId: string;
  public startEventId: string;
  public crontab: string;
  public executedAt: Date;

}

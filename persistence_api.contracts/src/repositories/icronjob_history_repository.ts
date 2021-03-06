import {Cronjob} from '../data_models/index';

/**
 * The repository for storing and retrieving cronjob histories.
 *
 * Note that this only includes the cronjobs past execution dates.
 * No future execution dates are stored.
 */
export interface ICronjobHistoryRepository {

  /**
   * Stores a new Cronjob execution in the database.
   *
   * @async
   * @param cronjob  The cronjob to persist.
   */
  create(cronjob: Cronjob): Promise<void>;

  /**
   * Returns a list of all stored cronjobs.
   *
   * @async
   * @param offset Optional: The number of records to skip.
   * @param limit  Optional: The max. number of records to get.
   * @returns      A list of cronjobs.
   */
  getAll(offset?: number, limit?: number): Promise<Array<Cronjob>>;

  /**
   * Returns a list of all stored cronjobs with a matching ProcessModelId.
   *
   * @async
   * @param processModelId The ID of the ProcessModel for which to get the
   *                       cronjob history.
   * @param startERventId  Optional: The ID of the StartEvent for which to
   *                       get the cronjob history.
   * @param offset         Optional: The number of records to skip.
   * @param limit          Optional: The max. number of records to get.
   * @returns              A list of matching cronjobs.
   */
  getByProcessModelId(processModelId: string, startEventId?: string, offset?: number, limit?: number): Promise<Array<Cronjob>>;

  /**
   * Returns a list of all stored cronjobs with a matching crontab.
   *
   * @async
   * @param crontab  The crontab for which to get the execution history.
   * @param offset   Optional: The number of records to skip.
   * @param limit    Optional: The max. number of records to get.
   * @returns        A list of matching cronjobs.
   */
  getByCrontab(crontab: string, offset?: number, limit?: number): Promise<Array<Cronjob>>;
}

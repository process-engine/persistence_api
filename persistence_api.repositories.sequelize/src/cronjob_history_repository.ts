import {Logger} from 'loggerhythm';

import {FindOptions} from 'sequelize';
import {Sequelize, SequelizeOptions} from 'sequelize-typescript';

import {IDisposable} from '@essential-projects/bootstrapper_contracts';
import {SequelizeConnectionManager} from '@essential-projects/sequelize_connection_manager';

import {Cronjob, ICronjobHistoryRepository} from '@process-engine/persistence_api.contracts';

import {CronjobHistoryEntryModel} from './schemas';

const logger = new Logger('processengine:persistence:cronjob_history_repository');

interface IPagination {
  limit?: number;
  offset?: number;
}

export class CronjobHistoryRepository implements ICronjobHistoryRepository, IDisposable {

  public config: SequelizeOptions;

  private sequelizeInstance: Sequelize;
  private connectionManager: SequelizeConnectionManager;

  constructor(connectionManager: SequelizeConnectionManager) {
    this.connectionManager = connectionManager;
  }

  public async initialize(): Promise<void> {
    logger.verbose('Initializing Sequelize connection and loading models...');
    const connectionAlreadyEstablished = this.sequelizeInstance !== undefined;
    if (connectionAlreadyEstablished) {
      logger.verbose('Repository already initialized. Done.');

      return;
    }
    this.sequelizeInstance = await this.connectionManager.getConnection(this.config);

    this.sequelizeInstance.addModels([CronjobHistoryEntryModel]);
    await this.sequelizeInstance.sync();

    logger.verbose('Done.');
  }

  public async dispose(): Promise<void> {
    logger.verbose('Disposing connection');
    await this.connectionManager.destroyConnection(this.config);
    this.sequelizeInstance = undefined;
    logger.verbose('Done.');
  }

  public async create(cronjob: Cronjob): Promise<void> {
    await CronjobHistoryEntryModel.create(cronjob);
  }

  public async getAll(offset: number = 0, limit: number = 0): Promise<Array<Cronjob>> {

    const cronjobHistories = await CronjobHistoryEntryModel.findAll({
      ...this.buildPagination(offset, limit),
      order: [['createdAt', 'DESC']],
    });

    const cronjobHistoriesRuntime = cronjobHistories.map<Cronjob>(this.convertToCronjobRuntimeObject.bind(this));

    return cronjobHistoriesRuntime;
  }

  public async getByProcessModelId(processModelId: string, startEventId?: string, offset: number = 0, limit: number = 0): Promise<Array<Cronjob>> {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryConditions: any = {
      processModelId: processModelId,
    };

    if (startEventId) {
      queryConditions.startEventId = startEventId;
    }

    const findByQuery: FindOptions = {
      where: queryConditions,
      ...this.buildPagination(offset, limit),
      order: [['createdAt', 'DESC']],
    };

    const cronjobHistories = await CronjobHistoryEntryModel.findAll(findByQuery);

    const cronjobHistoriesRuntime = cronjobHistories.map<Cronjob>(this.convertToCronjobRuntimeObject.bind(this));

    return cronjobHistoriesRuntime;
  }

  public async getByCrontab(crontab: string, offset: number = 0, limit: number = 0): Promise<Array<Cronjob>> {

    const findByQuery: FindOptions = {
      where: {
        crontab: crontab,
      },
      ...this.buildPagination(offset, limit),
      order: [['createdAt', 'DESC']],
    };

    const cronjobHistories = await CronjobHistoryEntryModel.findAll(findByQuery);

    const cronjobHistoriesRuntime = cronjobHistories.map<Cronjob>(this.convertToCronjobRuntimeObject.bind(this));

    return cronjobHistoriesRuntime;
  }

  private convertToCronjobRuntimeObject(dataModel: CronjobHistoryEntryModel): Cronjob {

    const cronjob = new Cronjob();
    cronjob.processModelId = dataModel.processModelId;
    cronjob.startEventId = dataModel.startEventId;
    cronjob.crontab = dataModel.crontab;
    cronjob.executedAt = dataModel.executedAt;

    return cronjob;
  }

  private buildPagination(offset: number, limit: number): IPagination {
    const pagination: IPagination = {};

    if (offset > 0) {
      pagination.offset = offset;
    }

    if (limit > 0) {
      pagination.limit = limit;
    }

    return pagination;
  }

}

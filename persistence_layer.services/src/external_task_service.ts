import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {
  ExternalTask,
  IExternalTaskRepository,
  IExternalTaskService,
} from '@process-engine/persistence_api.contracts';

const superAdminClaim = 'can_manage_process_instances';
const canAccessExternalTasksClaim = 'can_access_external_tasks';

export class ExternalTaskService implements IExternalTaskService {

  private readonly externalTaskRepository: IExternalTaskRepository;
  private readonly iamService: IIAMService;

  constructor(externalTaskRepository: IExternalTaskRepository, iamService: IIAMService) {
    this.externalTaskRepository = externalTaskRepository;
    this.iamService = iamService;
  }

  public async create<TPayload>(
    topic: string,
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeInstanceId: string,
    identity: IIdentity,
    payload: TPayload,
  ): Promise<void> {
    await this.ensureUserHasClaim(identity, canAccessExternalTasksClaim);

    return this.externalTaskRepository.create(topic, correlationId, processModelId, processInstanceId, flowNodeInstanceId, identity, payload);
  }

  public async getById<TPayload>(
    identity: IIdentity,
    externalTaskId: string,
  ): Promise<ExternalTask<TPayload>> {
    await this.ensureUserHasClaim(identity, canAccessExternalTasksClaim);

    return this.externalTaskRepository.getById(externalTaskId);
  }

  public async getByInstanceIds<TPayload>(
    identity: IIdentity,
    correlationId: string,
    processInstanceId: string,
    flowNodeInstanceId: string,
  ): Promise<ExternalTask<TPayload>> {
    await this.ensureUserHasClaim(identity, canAccessExternalTasksClaim);

    return this.externalTaskRepository.getByInstanceIds(correlationId, processInstanceId, flowNodeInstanceId);
  }

  public async fetchAvailableForProcessing<TPayload>(
    identity: IIdentity,
    topicName: string,
    maxTasks: number,
  ): Promise<Array<ExternalTask<TPayload>>> {
    await this.ensureUserHasClaim(identity, canAccessExternalTasksClaim);

    return this.externalTaskRepository.fetchAvailableForProcessing(topicName, maxTasks);
  }

  public async lockForWorker(
    identity: IIdentity,
    workerId: string,
    externalTaskId: string,
    lockExpirationTime: Date,
  ): Promise<void> {
    await this.ensureUserHasClaim(identity, canAccessExternalTasksClaim);

    return this.externalTaskRepository.lockForWorker(workerId, externalTaskId, lockExpirationTime);
  }

  public async finishWithError(
    identity: IIdentity,
    externalTaskId: string,
    error: Error,
  ): Promise<void> {
    await this.ensureUserHasClaim(identity, canAccessExternalTasksClaim);

    return this.externalTaskRepository.finishWithError(externalTaskId, error);
  }

  public async finishWithSuccess<TResultType>(
    identity: IIdentity,
    externalTaskId: string,
    result: TResultType,
  ): Promise<void> {
    await this.ensureUserHasClaim(identity, canAccessExternalTasksClaim);

    return this.externalTaskRepository.finishWithSuccess(externalTaskId, result);
  }

  public async deleteExternalTasksByProcessModelId(
    identity: IIdentity,
    processModelId: string,
  ): Promise<void> {
    await this.ensureUserHasClaim(identity, canAccessExternalTasksClaim);

    return this.externalTaskRepository.deleteExternalTasksByProcessModelId(processModelId);
  }

  private async ensureUserHasClaim(identity: IIdentity, claimName: string): Promise<void> {

    const userIsSuperAdmin = await this.checkIfUserIsSuperAdmin(identity);
    if (userIsSuperAdmin) {
      return;
    }

    await this.iamService.ensureHasClaim(identity, claimName);
  }

  private async checkIfUserIsSuperAdmin(identity: IIdentity): Promise<boolean> {
    try {
      await this.iamService.ensureHasClaim(identity, superAdminClaim);

      return true;
    } catch (error) {
      return false;
    }
  }

}

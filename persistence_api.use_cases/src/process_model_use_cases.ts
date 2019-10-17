import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {ILoggingApi} from '@process-engine/logging_api_contracts';
import {IMetricsApi} from '@process-engine/metrics_api_contracts';
import {
  ICorrelationService,
  IExternalTaskService,
  IFlowNodeInstanceService,
  IProcessModelService,
  IProcessModelUseCases,
  Model,
  ProcessDefinitionFromRepository,
} from '@process-engine/persistence_api.contracts';

const canDeleteProcessModel = 'can_delete_process_model';
const superAdminClaim = 'can_manage_process_instances';

export class ProcessModelUseCases implements IProcessModelUseCases {

  private readonly correlationService: ICorrelationService;
  private readonly externalTaskService: IExternalTaskService;
  private readonly flowNodeInstanceService: IFlowNodeInstanceService;
  private readonly iamService: IIAMService;
  private readonly loggingService: ILoggingApi;
  private readonly metricsService: IMetricsApi;
  private readonly processModelService: IProcessModelService;

  constructor(
    correlationService: ICorrelationService,
    externalTaskService: IExternalTaskService,
    flowNodeInstanceService: IFlowNodeInstanceService,
    iamService: IIAMService,
    loggingService: ILoggingApi,
    metricsService: IMetricsApi,
    processModelService: IProcessModelService,
  ) {
    this.correlationService = correlationService;
    this.externalTaskService = externalTaskService;
    this.flowNodeInstanceService = flowNodeInstanceService;
    this.iamService = iamService;
    this.loggingService = loggingService;
    this.metricsService = metricsService;
    this.processModelService = processModelService;
  }

  public async getProcessModels(identity: IIdentity, offset: number = 0, limit: number = 0): Promise<Array<Model.Process>> {
    return this.processModelService.getProcessModels(identity, offset, limit);
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<Model.Process> {

    const processInstance = await this.correlationService.getByProcessInstanceId(identity, processInstanceId);

    const processModel = await this.processModelService.getByHash(identity, processInstance.processModelId, processInstance.hash);

    return processModel;
  }

  public async deleteProcessModel(identity: IIdentity, processModelId: string): Promise<void> {
    await this.ensureUserHasClaim(identity, canDeleteProcessModel);

    await this.processModelService.deleteProcessDefinitionById(processModelId);
    await this.correlationService.deleteCorrelationByProcessModelId(identity, processModelId);
    await this.flowNodeInstanceService.deleteByProcessModelId(processModelId);
    await this.externalTaskService.deleteExternalTasksByProcessModelId(identity, processModelId);
    await this.loggingService.archiveProcessModelLogs(identity, processModelId);
  }

  public async persistProcessDefinitions(identity: IIdentity, name: string, xml: string, overwriteExisting?: boolean): Promise<void> {
    return this.processModelService.persistProcessDefinitions(identity, name, xml, overwriteExisting);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<Model.Process> {
    return this.processModelService.getProcessModelById(identity, processModelId);
  }

  public async getProcessDefinitionAsXmlByName(identity: IIdentity, name: string): Promise<ProcessDefinitionFromRepository> {
    return this.processModelService.getProcessDefinitionAsXmlByName(identity, name);
  }

  public async getByHash(identity: IIdentity, processModelId: string, hash: string): Promise<Model.Process> {
    return this.processModelService.getByHash(identity, processModelId, hash);
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

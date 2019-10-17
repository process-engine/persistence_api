import {Logger} from 'loggerhythm';

import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {NotFoundError} from '@essential-projects/errors_ts';

import {
  Correlation,
  CorrelationState,
  ICorrelationRepository,
  ICorrelationService,
  IProcessDefinitionRepository,
  ProcessInstance,
  ProcessInstanceFromRepository,
} from '@process-engine/persistence_api.contracts';

const logger = Logger.createLogger('processengine:correlation:service');

/**
 * Groups ProcessModelHashes by their associated CorrelationId.
 *
 * Only use internally.
 */
type GroupedCorrelations = {
  [correlationId: string]: Array<ProcessInstanceFromRepository>;
};

const superAdminClaim = 'can_manage_process_instances';
const canReadProcessModelClaim = 'can_read_process_model';
const canDeleteProcessModel = 'can_delete_process_model';

export class CorrelationService implements ICorrelationService {

  private readonly correlationRepository: ICorrelationRepository;
  private readonly iamService: IIAMService;
  private readonly processDefinitionRepository: IProcessDefinitionRepository;

  constructor(
    correlationRepository: ICorrelationRepository,
    iamService: IIAMService,
    processDefinitionRepository: IProcessDefinitionRepository,
  ) {

    this.correlationRepository = correlationRepository;
    this.iamService = iamService;
    this.processDefinitionRepository = processDefinitionRepository;
  }

  public async createEntry(
    identity: IIdentity,
    correlationId: string,
    processInstanceId: string,
    processModelId: string,
    processModelHash: string,
    parentProcessInstanceId?: string,
  ): Promise<void> {
    return this
      .correlationRepository
      .createEntry(identity, correlationId, processInstanceId, processModelId, processModelHash, parentProcessInstanceId);
  }

  public async getAll(identity: IIdentity, offset: number = 0, limit: number = 0): Promise<Array<Correlation>> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);

    const correlationsFromRepo = await this.correlationRepository.getAll();

    const filteredCorrelationsFromRepo = await this.filterProcessInstancesFromRepoByIdentity(identity, correlationsFromRepo);

    const correlations = await this.mapCorrelationList(filteredCorrelationsFromRepo);

    const correlationSubset = this.applyPagination(correlations, offset, limit);

    return correlationSubset;
  }

  public async getActive(identity: IIdentity, offset: number = 0, limit: number = 0): Promise<Array<Correlation>> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);

    const activeCorrelationsFromRepo = await this.correlationRepository.getCorrelationsByState(CorrelationState.running);

    const filteredCorrelationsFromRepo = await this.filterProcessInstancesFromRepoByIdentity(identity, activeCorrelationsFromRepo);

    const activeCorrelationsForIdentity = await this.mapCorrelationList(filteredCorrelationsFromRepo);

    const correlationSubset = this.applyPagination(activeCorrelationsForIdentity, offset, limit);

    return correlationSubset;
  }

  public async getByProcessModelId(identity: IIdentity, processModelId: string, offset: number = 0, limit: number = 0): Promise<Array<Correlation>> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);

    const correlationsFromRepo = await this.correlationRepository.getByProcessModelId(processModelId);

    const filteredCorrelationsFromRepo = await this.filterProcessInstancesFromRepoByIdentity(identity, correlationsFromRepo);

    const correlations = await this.mapCorrelationList(filteredCorrelationsFromRepo);

    const correlationSubset = this.applyPagination(correlations, offset, limit);

    return correlationSubset;
  }

  public async getByCorrelationId(identity: IIdentity, correlationId: string): Promise<Correlation> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);

    // NOTE:
    // These will already be ordered by their createdAt value, with the oldest one at the top.
    const correlationsFromRepo = await this.correlationRepository.getByCorrelationId(correlationId);

    const filteredCorrelationsFromRepo = await this.filterProcessInstancesFromRepoByIdentity(identity, correlationsFromRepo);

    if (filteredCorrelationsFromRepo.length === 0) {
      throw new NotFoundError('No such correlations for the user.');
    }

    // All correlations will have the same ID here, so we can just use the top entry as a base.
    const correlation = await this.mapCorrelation(correlationsFromRepo[0].correlationId, correlationsFromRepo);

    return correlation;
  }

  public async getByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<ProcessInstance> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);

    const processInstanceFromRepo = await this.correlationRepository.getByProcessInstanceId(processInstanceId);

    if (identity.userId !== processInstanceFromRepo.identity.userId) {
      const userIsSuperAdmin = await this.checkIfUserIsSuperAdmin(identity);

      if (!userIsSuperAdmin) {
        // Throw 404 instaeads of 403, to prevent possible leak of sensitive data.
        // 403 kinda says "there is something there, you just can't see it", whereas 404 suggests "there is nothing there".
        throw new NotFoundError(`ProcessInstance with id ${processInstanceId} not found.`);
      }
    }

    const processInstance = await this.mapProcessInstance(processInstanceFromRepo);

    return processInstance;
  }

  public async getSubprocessesForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<Array<ProcessInstance>> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);

    const processInstancesFromRepo = await this.correlationRepository.getSubprocessesForProcessInstance(processInstanceId);

    const filteredProcessInstancesFromRepo = await this.filterProcessInstancesFromRepoByIdentity(identity, processInstancesFromRepo);

    const processInstances =
      await Promise.map<ProcessInstanceFromRepository, ProcessInstance>(filteredProcessInstancesFromRepo, this.mapProcessInstance.bind(this));

    return processInstances;
  }

  public async getProcessInstancesForCorrelation(
    identity: IIdentity,
    correlationId: string,
    offset?: number,
    limit?: number,
  ): Promise<Array<ProcessInstance>> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);

    const processInstancesFromRepo = await this.correlationRepository.getByCorrelationId(correlationId);

    const noCorrelationsFound = !processInstancesFromRepo || processInstancesFromRepo.length === 0;
    if (noCorrelationsFound) {
      throw new NotFoundError(`No ProcessInstances for Correlation with id "${correlationId}" found.`);
    }

    const filteredProcessInstancesFromRepo = await this.filterProcessInstancesFromRepoByIdentity(identity, processInstancesFromRepo);

    const processInstanceSubset = this.applyPagination(filteredProcessInstancesFromRepo, offset, limit);

    const processInstances =
      await Promise.map<ProcessInstanceFromRepository, ProcessInstance>(processInstanceSubset, this.mapProcessInstance.bind(this));

    return processInstances;
  }

  public async getProcessInstancesForProcessModel(
    identity: IIdentity,
    processModelId: string,
    offset?: number,
    limit?: number,
  ): Promise<Array<ProcessInstance>> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);

    const processInstancesFromRepo = await this.correlationRepository.getByProcessModelId(processModelId);

    const noProcessInstancesFound = !processInstancesFromRepo || processInstancesFromRepo.length === 0;
    if (noProcessInstancesFound) {
      throw new NotFoundError(`No ProcessInstances for ProcessModel with ID "${processModelId}" found.`);
    }

    const filteredProcessInstancesFromRepo = await this.filterProcessInstancesFromRepoByIdentity(identity, processInstancesFromRepo);

    const processInstanceSubset = this.applyPagination(filteredProcessInstancesFromRepo, offset, limit);

    const processInstances =
      await Promise.map<ProcessInstanceFromRepository, ProcessInstance>(processInstanceSubset, this.mapProcessInstance.bind(this));

    return processInstances;
  }

  public async getProcessInstancesByState(
    identity: IIdentity,
    state: CorrelationState,
    offset?: number,
    limit?: number,
  ): Promise<Array<ProcessInstance>> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);

    const processInstancesFromRepo = await this.correlationRepository.getCorrelationsByState(state);

    const filteredProcessInstancesFromRepo = await this.filterProcessInstancesFromRepoByIdentity(identity, processInstancesFromRepo);

    const processInstanceSubset = this.applyPagination(filteredProcessInstancesFromRepo, offset, limit);

    const processInstances =
      await Promise.map<ProcessInstanceFromRepository, ProcessInstance>(processInstanceSubset, this.mapProcessInstance.bind(this));

    return processInstances;
  }

  public async deleteCorrelationByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    await this.ensureUserHasClaim(identity, canDeleteProcessModel);
    await this.correlationRepository.deleteCorrelationByProcessModelId(processModelId);
  }

  public async finishProcessInstanceInCorrelation(identity: IIdentity, correlationId: string, processInstanceId: string): Promise<void> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);
    await this.correlationRepository.finishProcessInstanceInCorrelation(correlationId, processInstanceId);
  }

  public async finishProcessInstanceInCorrelationWithError(
    identity: IIdentity,
    correlationId: string,
    processInstanceId: string,
    error: Error,
  ): Promise<void> {
    await this.ensureUserHasClaim(identity, canReadProcessModelClaim);
    await this.correlationRepository.finishProcessInstanceInCorrelationWithError(correlationId, processInstanceId, error);
  }

  private async filterProcessInstancesFromRepoByIdentity(
    identity: IIdentity,
    correlationsFromRepo: Array<ProcessInstanceFromRepository>,
  ): Promise<Array<ProcessInstanceFromRepository>> {

    const userIsSuperAdmin = await this.checkIfUserIsSuperAdmin(identity);

    // Super Admins can always see everything.
    if (userIsSuperAdmin) {
      return correlationsFromRepo;
    }

    return correlationsFromRepo.filter((correlationFromRepo: ProcessInstanceFromRepository): boolean => {

      // Correlations that were created with the dummy token are visible to everybody.
      const isDummyToken = correlationFromRepo.identity.userId === 'dummy_token';
      const isInternalToken = correlationFromRepo.identity.userId === 'ProcessEngineInternalUser';
      const userIdsMatch = identity.userId === correlationFromRepo.identity.userId;

      return isDummyToken || isInternalToken || userIdsMatch;
    });
  }

  private async mapCorrelationList(correlationsFromRepo: Array<ProcessInstanceFromRepository>): Promise<Array<Correlation>> {
    const groupedCorrelations = this.groupCorrelations(correlationsFromRepo);

    const uniqueCorrelationIds = Object.keys(groupedCorrelations);

    const mappedCorrelations: Array<Correlation> = [];

    for (const correlationId of uniqueCorrelationIds) {
      const matchingCorrelationEntries = groupedCorrelations[correlationId];

      const mappedCorrelation = await this.mapCorrelation(correlationId, matchingCorrelationEntries);
      mappedCorrelations.push(mappedCorrelation);
    }

    return mappedCorrelations;
  }

  private groupCorrelations(correlations: Array<ProcessInstanceFromRepository>): GroupedCorrelations {

    const groupedCorrelations: GroupedCorrelations = {};

    for (const correlation of correlations) {

      const groupHasNoMatchingEntry = !groupedCorrelations[correlation.correlationId];

      if (groupHasNoMatchingEntry) {
        groupedCorrelations[correlation.correlationId] = [];
      }

      groupedCorrelations[correlation.correlationId].push(correlation);
    }

    return groupedCorrelations;
  }

  private async mapCorrelation(
    correlationId: string,
    processInstancesFromRepo?: Array<ProcessInstanceFromRepository>,
  ): Promise<Correlation> {

    const correlation = new Correlation();
    correlation.id = correlationId;
    correlation.createdAt = processInstancesFromRepo[0].createdAt;
    correlation.processInstances = [];

    if (processInstancesFromRepo) {
      for (const processInstanceFromRepo of processInstancesFromRepo) {
        /**
         * As long as there is at least one running ProcessInstance within a correlation,
         * the correlation will always have a running state, no matter how many
         * "finished" instances there might be.
         */
        correlation.state = correlation.state !== CorrelationState.running
          ? processInstanceFromRepo.state
          : CorrelationState.running;

        const processInstanceHasErrorAttached = processInstanceFromRepo.error !== undefined && processInstanceFromRepo.error !== null;
        if (processInstanceHasErrorAttached) {
          correlation.state = CorrelationState.error;
          correlation.error = processInstanceFromRepo.error;
        }

        const processInstance = await this.mapProcessInstance(processInstanceFromRepo);

        correlation.processInstances.push(processInstance);
      }
    }

    return correlation;
  }

  private async mapProcessInstance(processInstanceFromRepo: ProcessInstanceFromRepository): Promise<ProcessInstance> {

    const processDefinition = await this.processDefinitionRepository.getByHash(processInstanceFromRepo.processModelHash);

    const processInstance = new ProcessInstance();
    processInstance.correlationId = processInstanceFromRepo.correlationId;
    processInstance.processDefinitionName = processDefinition.name;
    processInstance.xml = processDefinition.xml;
    processInstance.hash = processInstanceFromRepo.processModelHash;
    processInstance.processModelId = processInstanceFromRepo.processModelId;
    processInstance.processInstanceId = processInstanceFromRepo.processInstanceId;
    processInstance.parentProcessInstanceId = processInstanceFromRepo.parentProcessInstanceId;
    processInstance.createdAt = processInstanceFromRepo.createdAt;
    processInstance.state = processInstanceFromRepo.state;
    processInstance.identity = processInstanceFromRepo.identity;

    const processInstanceHasErrorAttached = processInstanceFromRepo.error !== undefined && processInstanceFromRepo.error !== null;
    if (processInstanceHasErrorAttached) {
      processInstance.error = processInstanceFromRepo.error;
    }

    return processInstance;
  }

  private applyPagination(correlations: Array<any>, offset: number, limit: number): Array<any> {

    if (offset > correlations.length) {
      logger.warn(`Attempting an offset of ${offset} on a correlation list with ${correlations.length} entries. Returning an empty result set.`);
      return [];
    }

    let correlationSubset = offset > 0
      ? correlations.slice(offset)
      : correlations;

    const limitIsOutsideOfCorrelationList = limit < 1 || limit >= correlationSubset.length;
    if (limitIsOutsideOfCorrelationList) {
      return correlationSubset;
    }

    correlationSubset = correlationSubset.slice(0, limit);

    return correlationSubset;
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

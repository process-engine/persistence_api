import {IIdentity} from '@essential-projects/iam_contracts';

import {Model, ProcessDefinitionFromRepository} from '../data_models/index';

/**
 * The UseCases layer for the ProcessModel API.
 * Uses the ProcessModelService to query and manipulate ProcessModel data.
 */
export interface IProcessModelUseCases {

  /**
   * Persists a new ProcessDefinition.
   *
   * @async
   * @param identity          Contains the requesting users identity.
   * @param name              The name with which to persist the
   *                          ProcessDefinition.
   * @param xml               The ProcessDefinitions raw XML code.
   * @param overwriteExisting If true, any existing ProcessDefinition with
   *                          the same name will be overwritten.
   * @throws                  403, if the User is forbidden to persist
   *                          ProcessDefinitions.
   * @throws                  409, if a ProcessDefinition with the name already
   *                          exists and 'overwriteExisting' is
   *                          set to 'false'.
   */
  persistProcessDefinitions(identity: IIdentity, name: string, xml: string, overwriteExisting?: boolean): Promise<void>;

  /**
   * Gets a list of all stored ProcessModels.
   *
   * @async
   * @param identity Contains the requesting users identity.
   * @param offset   Optional: The number of records to skip.
   * @param limit    Optional: The max. number of records to get.
   * @returns        The retrieved ProcessModels.
   * @throws         403, if the User is forbidden to read any ProcessModels.
   */
  getProcessModels(identity: IIdentity, offset?: number, limit?: number): Promise<Array<Model.Process>>;

  /**
   * Retrieves a ProcessModel by its ID.
   * The user will only be able to see FlowNodes and Lanes that he is allowed
   * to access.
   *
   * @async
   * @param  identity       Contains the requesting users identity.
   * @param  processModelId The ID of the ProcessModel to retrieve.
   * @returns               The retrieved ProcessModel.
   * @throws                403, if the User is forbidden to see the
   *                        ProcessModel.
   * @throws                404, if the ProcessModel was not found.
   */
  getProcessModelById(identity: IIdentity, processModelId: string): Promise<Model.Process>;

  /**
   * Retrieves a ProcessModel by a ProcessInstanceID.
   * The user will only be able to see FlowNodes and Lanes that he is allowed
   * to access.
   *
   * @async
   * @param  identity          Contains the requesting users identity.
   * @param  processInstanceId The ProcessInstanceID of the ProcessModel to retrieve.
   * @returns                  The retrieved ProcessModel.
   * @throws                   403, if the User is forbidden to see the
   *                           ProcessModel.
   * @throws                   404, if the ProcessModel was not found.
   */
  getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<Model.Process>;

  /**
   * Retrieves a ProcessDefinition in its raw XML format.
   *
   * @async
   * @param  identity Contains the requesting users identity.
   * @param  name     The name of the ProcessDefinition to get.
   * @returns         The retrieved ProcessDefinition.
   * @throws          403, if the User is forbidden to read ProcessDefinitions.
   * @throws          404, if the ProcessDefinition was not found.
   */
  getProcessDefinitionAsXmlByName(identity: IIdentity, name: string): Promise<ProcessDefinitionFromRepository>;

  /**
   * Retrieves a ProcessModel by its hash.
   *
   * @async
   * @param  identity        Contains the requesting users identity.
   * @param  processModelId: The ID of the ProcessModel to get.
   * @param  hash            The hash of the ProcessModel to get.
   *                         Used for getting specific versions of the ProcessModel.
   * @returns                The retrieved ProcessModel.
   * @throws                 404, if the ProcessModel was not found.
   */
  getByHash(identity: IIdentity, processModelId: string, hash: string): Promise<Model.Process>;

  /**
   * Removes all processModels, correlations, externalTasks, flowNodeInstances
   * and ProcessTokens with a specific ProcessModelId.
   *
   * @async
   * @param identity       The requesting users identity.
   * @param processModelId The ID of the processModel that should be removed.
   */
  deleteProcessModel(identity: IIdentity, processModelId: string): Promise<void>;
}

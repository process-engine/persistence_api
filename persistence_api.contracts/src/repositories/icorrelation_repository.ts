import {IIdentity} from '@essential-projects/iam_contracts';

import {CorrelationState, ProcessInstanceFromRepository} from '../data_models/index';

/**
 * The repository for accessing and manipulating correlations.
 *
 * Correlations combine a correlation ID with a ProcessModel Hash.
 * This allows for implementing versioning of ProcessModels, as well
 * as keeping track on how a ProcessModel looked at the time a certain
 * Correlation was run.
 *
 * Note that a ProcessModel instance will only belong to one Correlation,
 * but a Correlation can have multiple ProcessModel instances.
 */
export interface ICorrelationRepository {

  /**
   * Stores a new Correlation in the database.
   *
   * @async
   * @param identity                The executing users identity.
   * @param correlationId           The ID of the Correlation to store.
   * @param processInstanceId       The ID of the ProcessInstance to associate
   *                                with the Correlation.
   * @param processModelId          The ID of the ProcessModel to associate
   *                                with the Correlation.
   * @param processModelHash        The Hash of the ProcessModel to associate
   *                                with the Correlation.
   * @param parentProcessInstanceId Optional: If the ProcessInstance is a
   *                                Subprocess, this contains the ID of the
   *                                ProcessInstance that started it.
   */
  createEntry(
    identity: IIdentity,
    correlationId: string,
    processInstanceId: string,
    processModelId: string,
    processModelHash: string,
    parentProcessInstanceId?: string,
  ): Promise<void>;

  /**
   * Returns a list of all Correlations.
   *
   * @async
   * @param offset Optional: The number of records to skip.
   * @param limit  Optional: The max. number of entries to return.
   * @returns A list of Correlations.
   */
  getAll(offset?: number, limit?: number): Promise<Array<ProcessInstanceFromRepository>>;

  /**
   * Gets all entries with a specific CorrelationId.
   *
   * @async
   * @param   correlationId The ID of the Correlation to retrieve.
   * @param   offset        Optional: The number of records to skip.
   * @param   limit         Optional: The max. number of entries to return.
   * @returns               The retrieved Correlations.
   * @throws                404, If the Correlation was not found.
   */
  getByCorrelationId(correlationId: string, offset?: number, limit?: number): Promise<Array<ProcessInstanceFromRepository>>;

  /**
   * Gets all entries with a specific ProcessModelId.
   *
   * @async
   * @param   processModelId The ID of the ProcessModel for which to retrieve
   *                         the Correlations.
   * @param   offset         Optional: The number of records to skip.
   * @param   limit          Optional: The max. number of entries to return.
   * @returns                The retrieved Correlations.
   */
  getByProcessModelId(processModelId: string, offset?: number, limit?: number): Promise<Array<ProcessInstanceFromRepository>>;

  /**
   * Gets the entry that belongs to the given ProcessInstanceId.
   * Note that ProcessInstanceIds are always unique, so this will always
   * return only one entry.
   *
   * @async
   * @param   processInstanceId The ID of the ProcessInstance for which to retrieve
   *                            the Correlations.
   * @returns                   The retrieved Correlation.
   * @throws                    404, If the Correlation was not found.
   */
  getByProcessInstanceId(processInstanceId: string): Promise<ProcessInstanceFromRepository>;

  /**
   * Gets all entries that describe a Subprocess for the ProcessInstance with the
   * given ID.
   *
   * @async
   * @param   processInstanceId The ID of the ProcessInstance for which to retrieve
   *                            the SubProcess-Correlations.
   * @param   offset            Optional: The number of records to skip.
   * @param   limit             Optional: The max. number of entries to return.
   * @returns                   The retrieved Correlations.
   *                            If none are found, an empty Array is returned.
   */
  getSubprocessesForProcessInstance(processInstanceId: string, offset?: number, limit?: number): Promise<Array<ProcessInstanceFromRepository>>;

  /**
   * Returns a list of all Correlations in the specified state.
   *
   * @async
   * @param   state  The state by which to retrieve the Correlations.
   * @param   offset Optional: The number of records to skip.
   * @param   limit  Optional: The max. number of entries to return.
   * @returns        The retrieved Correlations.
   */
  getCorrelationsByState(state: CorrelationState, offset?: number, limit?: number): Promise<Array<ProcessInstanceFromRepository>>;

  /**
   * Removes all Correlations with a specific ProcessModelId.
   *
   * @async
   * @param processModelId The ID of the processModel, by which Correlations should be removed.
   */
  deleteCorrelationByProcessModelId(correlationId: string): Promise<void>;

  /**
   * Finishes the given ProcessInstance in the given Correlation.
   *
   * @async
   * @param  correlationId     The ID of the Correlation to finish.
   * @param  processInstanceId The ID of the ProcessInstance to finish.
   * @throws {NotFoundError}   When no matching correlation was found.
   */
  finishProcessInstanceInCorrelation(correlationId: string, processInstanceId: string): Promise<void>;

  /**
   * Finishes the given ProcessInstance in the given Correlation with an error.
   *
   * @async
   * @param  correlationId     The ID of the Correlation to finish erroneously.
   * @param  processInstanceId The ID of the ProcessInstance to finish.
   * @param  error             The error that occurred.
   * @param  terminatedBy      Optional: If the ProcessInstance was terminated by a user,
   *                           this will contain the terminating users identity.
   * @throws {NotFoundError}   When no matching correlation was found.
   */
  finishProcessInstanceInCorrelationWithError(
    correlationId: string,
    processInstanceId: string,
    error: Error,
    terminatedBy?: IIdentity,
  ): Promise<void>;
}

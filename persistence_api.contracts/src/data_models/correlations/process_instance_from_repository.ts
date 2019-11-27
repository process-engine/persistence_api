import {IIdentity} from '@essential-projects/iam_contracts';

import {CorrelationState} from './correlation_state';

/**
 * Describes a ProcessInstance as it is stored in the database.
 */
export class ProcessInstanceFromRepository {

  public correlationId: string;
  public processModelHash: string;
  public processModelId: string;
  public processInstanceId: string;
  public parentProcessInstanceId?: string;
  public state: CorrelationState;
  public error: Error;
  public identity: IIdentity;
  public createdAt: Date;
  public updatedAt: Date;
  public finishedAt?: Date;
  public terminatedBy?: IIdentity;

}

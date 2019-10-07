import {ExternalTaskResultBase} from './external_task_result_base';

/**
 * Contains the result set for an ExternalTask that failed with a BpmnError.
 */
export class ExternalTaskBpmnError extends ExternalTaskResultBase {

  public readonly errorCode: string;

  constructor(externalTaskId: string, errorCode: string) {
    super(externalTaskId);
    this.errorCode = errorCode;
  }

}

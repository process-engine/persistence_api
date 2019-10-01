import {ExternalTaskResultBase} from './external_task_result_base';

/**
 * Contains the result set for an ExternalTask that failed with a service error.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ExternalTaskServiceError extends ExternalTaskResultBase {

  public readonly errorMessage: string;
  public readonly errorDetails: any;

  constructor(externalTaskId: string, errorMessage: string, errorDetails: any) {
    super(externalTaskId);
    this.errorMessage = errorMessage;
    this.errorDetails = errorDetails;
  }

}

import {ExternalTaskResultBase} from './external_task_result_base';

/**
 * Contains the result set for an ExternalTask that finished successfully.
 */
export class ExternalTaskSuccessResult extends ExternalTaskResultBase {

  public readonly result: any;

  constructor(externalTaskId: string, result: any) {
    super(externalTaskId);
    this.result = result;
  }

}

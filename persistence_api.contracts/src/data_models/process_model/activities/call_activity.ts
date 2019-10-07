import {BpmnType} from '../constants';
import {Activity} from './activity';

/**
 * Describes a BPMN CallActivity.
 *
 * CallActivities also describe a type of subprocess, except that the process
 * is not contained within the parent process, but is located somewhere else.
 *
 * This means that the process called by the CallActivity can also run by itself,
 * unlike the subprocess contained within the 'SubProcess' Activity.
 */
export class CallActivity extends Activity {

  public get bpmnType(): BpmnType {
    return BpmnType.callActivity;
  }

  public type: CallActivityType = CallActivityType.Unspecified;
  public calledReference?: string;
  /**
   * Optional: The ID of the StartEvent with which to call the CallActivity.
   * If no ID is provided, the first found StartEventID is used.
   */
  public startEventId?: string;
  /**
   * Optional: The payload with which to start the CallActivity.
   * If not provided, the current token is used as a payload.
   */
  public payload?: any; // eslint-disable-line
  public bindingType: CallActivityBindingType = CallActivityBindingType.deployment;
  public calledElementVersion?: string;
  public calledElementTenantId: string;
  public delegateVariableMapping: CallActivityDelegateVariableMapping = CallActivityDelegateVariableMapping.Unspecified;
  public variableMappingValue?: string;

}

/**
 * Contains all types of CallActivities.
 * Currently only 'BPMN' is supported.
 */
export enum CallActivityType {
  Unspecified = 0,
  BPMN = 1,
  // CMMN = 2, - Not supported yet
}

/**
 * Contains all possible types of binding that can be used with a CallActivity.
 */
export enum CallActivityBindingType {
  latest = 0,
  deployment = 1,
  version = 2,
}

/**
 * Determines the type of mapping used by the CallActivity, when passing on its
 * parameters to the called process.
 */
export enum CallActivityDelegateVariableMapping {
  Unspecified = 0,
  variableMappingClass = 1,
  variableMappingDelegateExpression = 2,
}

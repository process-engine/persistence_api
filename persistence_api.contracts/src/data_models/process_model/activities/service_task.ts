import {BpmnType} from '../constants';
import {Activity} from './activity';

/**
 * Describes a BPMN ServiceTask.
 * A ServiceTask is used to call either a function from a specific class,
 * or for performing web requests.
 */
export class ServiceTask extends Activity {

  public get bpmnType(): BpmnType {
    return BpmnType.serviceTask;
  }

  /**
   * The invocation to be used when the ServiceTask is called.
   */
  public invocation: Invocation;
  /**
   * The ServiceTasks type.
   * Currently only supports 'external' and 'internal'.
   */
  public type?: ServiceTaskType;
  /**
   * The topic to use in conjunction with external ServiceTasks.
   */
  public topic?: string;
  /**
   * The payload to use in conjunction with external ServiceTasks.
   */
  public payload?: string;

}

/**
 * Describes all currently supported ServiceTask types.
 */
export enum ServiceTaskType {
  external = 'external',
  internal = 'internal',
}

/**
 * The base class for all invocation types.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class Invocation {
}

/**
 * Used by ServiceTasks.
 * This contains the definition for a method invocation.
 */
export class MethodInvocation extends Invocation {

  public module: string;
  public method: string;
  public params: string;

}

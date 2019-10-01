import {Invocation} from './invocation';

/**
 * Used by ServiceTasks.
 * This contains the definition for a method invocation.
 */
export class MethodInvocation extends Invocation {

  public module: string;
  public method: string;
  public params: string;

}

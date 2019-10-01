import {BaseElement} from '../base/index';

/**
 * Describes a BPMN error that can be thrown by an ErrorEndEvent.
 */
export class Error extends BaseElement {

  public name: string;
  public code: string;

}

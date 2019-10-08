import {BaseElement} from '../base/index';

/**
 * Describes a global BPMN error element.
 * Can be thrown by an ErrorEndEvent and caught by an ErrorBoundaryEvent.
 */
export class Error extends BaseElement {

  public name?: string;
  public code?: string;
  public message?: string;

}

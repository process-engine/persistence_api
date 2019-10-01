import {BaseElement} from '../base/index';

/**
 * Contains a BPMN Association.
 * These associations are used to link FlowNode elements with annotations,
 * such as TextAnnotations.
 */
export class Association extends BaseElement {

  public sourceRef: string;
  public targetRef: string;

}

import {BaseElement} from '../base/index';

/**
 * Describes a BPMN SequenceFlow element, which is used to connect
 * two FlowNodes together.
 */
export class SequenceFlow extends BaseElement {

  public name: string;
  public sourceRef: string;
  public targetRef: string;
  public conditionExpression?: IConditionExpression;

}

/**
 * Describes a conditional expression that can be placed on
 * a SequenceFlow.
 */
export interface IConditionExpression {
  type: string;
  expression: string;
}

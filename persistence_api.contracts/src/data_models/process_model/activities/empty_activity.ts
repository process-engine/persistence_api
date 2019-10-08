import {BpmnType} from '../constants';
import {FlowNode} from '../base/index';

/**
 * Contains a blank activity that has no dedicated UseCase.
 *
 * Technically, this services as a Breakpoint for the Frontend.
 */
export class EmptyActivity extends FlowNode {

  public get bpmnType(): BpmnType {
    return BpmnType.emptyActivity;
  }

}

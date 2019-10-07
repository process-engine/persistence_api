import {BaseElement, FlowNode} from './base/index';
import {LaneSet, SequenceFlow} from './process/index';

/**
 * Describes a BPMN Process.
 * Any and all information about FlowNodes, SequenceFlows and Lanes is
 * stored here.
 * This is the root element for working with ProcessModels.
 */
export class Process extends BaseElement {

  public name: string;
  public isExecutable: boolean;
  public laneSet?: LaneSet;
  public flowNodes: Array<FlowNode> = [];
  public sequenceFlows: Array<SequenceFlow> = [];

}

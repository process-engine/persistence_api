import {IIdentity} from '@essential-projects/iam_contracts';

import {BpmnType, EventType} from '../process_model/index';
import {FlowNodeInstanceState} from './flow_node_instance_state';
import {ProcessToken} from './process_token';
import {ProcessTokenType} from './process_token_type';

/**
 * Describes a single FlowNodeInstance.
 */
export class FlowNodeInstance {

  /**
   * The instance ID of this FlowNodeInstance.
   */
  public id: string;
  /**
   * The unique ID of the FlowNode, as it is modelled in the diagram.
   */
  public flowNodeId: string;
  /**
   * The name of the FlowNode, as it is modelled in the diagram.
   */
  public flowNodeName: string;
  /**
   * The lane that this FlowNodeInstance belongs to.
   * Also known as the claim the user needs to have, in order to be allowed
   * to access this FlowNodeInstance.
   * Particularly relevant for ManualTasks, UserTasks and EmptyActivities,
   * which require manual continuation.
   */
  public flowNodeLane: string;
  /**
   * Describes the type of FlowNode that this instance is executing.
   * Can be UserTask, ServiceTask, ScriptTask, etc.
   */
  public flowNodeType: BpmnType;
  /**
   * Optional: If the FlowNodeInstance is an Event, this will contain
   * the type of Event (Message, Signal, Timer, etc).
   *
   * If the FNI is a regular Start- or End- Event, this will be undefined.
   */
  public eventType?: EventType;
  public correlationId: string;
  public processModelId: string;
  public processInstanceId: string;
  /**
   * Optional: If the FNI belongs to a Subprocess, this will contain the ID of the
   * parent process instance.
   */
  public parentProcessInstanceId?: string;
  public tokens: Array<ProcessToken>;
  public state: FlowNodeInstanceState = FlowNodeInstanceState.running;
  public error?: string;
  public owner: IIdentity;
  /**
   * Optional: Contains the InstanceId of the FlowNodeInstance that was executed
   * before this one.
   *
   * StartEvents will not have a predecessor, naturally.
   */
  public previousFlowNodeInstanceId?: string;

  /**
   * Gets the ProcessToken for this FlowNodeInstance that has the given type.
   *
   * @param   tokenType The type of the token to retrieve.
   * @returns           The retrieved token.
   */
  public getTokenByType(tokenType: ProcessTokenType): ProcessToken {
    return this.tokens.find((token: ProcessToken): boolean => {
      return token.type === tokenType;
    });
  }

}

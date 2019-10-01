import {FlowNode} from '../base/index';

/**
 * The base class for gateways.
 */
export abstract class Gateway extends FlowNode {

  /**
   * Determines the direction of the gateway.
   *
   * If no incoming and/or no outgoing SequenceFlows are associated with the
   * gateway, the direction will be 'unspecified', effectively rendering this
   * gateway non-executable.
   */
  public get gatewayDirection(): GatewayDirection {
    if (!this.incoming || !this.outgoing) {
      // Some SequenceFlows are missing: Gateway is undefined and not processable.
      return GatewayDirection.Unspecified;
    } if (this.incoming.length > 1 && this.outgoing.length > 1) {
      // Both incoming and outgoing SequenceFlows number more than one: Mixed Gateway.
      return GatewayDirection.Mixed;
    } if (this.incoming.length > this.outgoing.length) {
      // One outgoing and multiple incoming SequenceFlows: Join-Gateway.
      return GatewayDirection.Converging;
    } if (this.outgoing.length > this.incoming.length) {
      // One incoming and multiple outgoing SequenceFlows: Split-Gateway.
      return GatewayDirection.Diverging;
    }
    // Gateway configuration is not supported.
    return GatewayDirection.Unspecified;

  }

}

/**
 * Contains all possible Gateway directions.
 *
 * Mixed Gateways are currently not supported.
 * */
export enum GatewayDirection {
  Unspecified = 'unspecified',
  Converging = 'converging',
  Diverging = 'diverging',
  Mixed = 'mixed',
}

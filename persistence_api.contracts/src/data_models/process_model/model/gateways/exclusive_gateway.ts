import {BpmnType} from '../../constants';
import {Gateway} from './gateway';

/**
 * Describes an ExclusiveGateway.
 *
 * These gateways are used for conditional branch execution.
 */
export class ExclusiveGateway extends Gateway {

  public get bpmnType(): BpmnType {
    return BpmnType.exclusiveGateway;
  }

}

import {BpmnType} from '../constants';
import {Gateway} from './gateway';

/**
 * Describes an InclusiveGateway.
 *
 * Currently not evaluated during runtime.
 */
export class InclusiveGateway extends Gateway {

  public get bpmnType(): BpmnType {
    return BpmnType.inclusiveGateway;
  }

}

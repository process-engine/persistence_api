import {BpmnType} from '../constants';
import {Gateway} from './gateway';

/**
 * Describes a ComplexGateway.
 *
 * Currently not evaluated during runtime.
 */
export class ComplexGateway extends Gateway {

  public get bpmnType(): BpmnType {
    return BpmnType.complexGateway;
  }

}

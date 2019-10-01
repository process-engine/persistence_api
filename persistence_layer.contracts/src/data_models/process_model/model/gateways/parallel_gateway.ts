import {BpmnType} from '../../constants';
import {Gateway} from './gateway';

/**
 * Describes a ParallelGateway.
 *
 * These gateways are used to run multiple branches in parallel.
 */
export class ParallelGateway extends Gateway {

  public get bpmnType(): BpmnType {
    return BpmnType.parallelGateway;
  }

}

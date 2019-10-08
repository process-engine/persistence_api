import {BpmnType} from '../constants';
import {Gateway} from './gateway';

/**
 * Describes an EventBasedGateway.
 *
 * Currently not evaluated during runtime.
 */
export class EventBasedGateway extends Gateway {

  public get bpmnType(): BpmnType {
    return BpmnType.eventBasedGateway;
  }

}

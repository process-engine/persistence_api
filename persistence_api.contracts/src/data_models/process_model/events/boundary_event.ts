import {BpmnType, EventType} from '../constants';

import {
  ErrorEventDefinition,
  Event,
  MessageEventDefinition,
  SignalEventDefinition,
  TimerEventDefinition,
} from './event_base';

/**
 * Describes a BPMN BoundaryEvent.
 *
 * These events are always attached to an activity and will only live
 * as long as that activity gets executed.
 */
export class BoundaryEvent extends Event {

  public get bpmnType(): BpmnType {
    return BpmnType.boundaryEvent;
  }

  public get eventType(): EventType {
    const eventIsErrorEvent = this.errorEventDefinition !== undefined;
    if (eventIsErrorEvent) {

      return EventType.errorEvent;
    }

    const eventIsMessageEvent = this.messageEventDefinition !== undefined;
    if (eventIsMessageEvent) {

      return EventType.messageEvent;
    }

    const eventIsSignalEvent = this.signalEventDefinition !== undefined;
    if (eventIsSignalEvent) {

      return EventType.signalEvent;
    }

    const eventIsTimerEvent = this.timerEventDefinition !== undefined;
    if (eventIsTimerEvent) {

      return EventType.timerEvent;
    }

    return undefined;
  }

  public errorEventDefinition?: ErrorEventDefinition;
  public messageEventDefinition?: MessageEventDefinition;
  public signalEventDefinition?: SignalEventDefinition;
  public timerEventDefinition?: TimerEventDefinition;
  /**
   * If set to true, raising this event will cause the activity to
   * cease all operations.
   */
  public cancelActivity: boolean;

  /**
   * Contains the ID of the activity to which this event is attached.
   */
  public attachedToRef: string;

}

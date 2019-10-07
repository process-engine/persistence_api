import {BpmnType, EventType} from '../constants';

import {
  Event,
  MessageEventDefinition,
  SignalEventDefinition,
  TimerEventDefinition,
} from './event_base';

/**
 * Describes a BPMN StartEvent.
 */
export class StartEvent extends Event {

  public get bpmnType(): BpmnType {
    return BpmnType.startEvent;
  }

  public get eventType(): EventType {
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

  public messageEventDefinition?: MessageEventDefinition;
  public timerEventDefinition?: TimerEventDefinition;
  public signalEventDefinition?: SignalEventDefinition;

}

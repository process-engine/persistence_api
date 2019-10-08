import {BpmnType, EventType} from '../constants';

import {
  ErrorEventDefinition,
  Event,
  MessageEventDefinition,
  SignalEventDefinition,
  TerminateEventDefinition,
} from './event_base';

/**
 * Describes a BPMN EndEvent.
 * These are used to finish a process.
 *
 * Depending on the type of EndEvent used, the process will either be finished
 * with a success message or an error.
 */
export class EndEvent extends Event {

  public get bpmnType(): BpmnType {
    return BpmnType.endEvent;
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

    const eventIsTerminateEvent = this.terminateEventDefinition !== undefined;
    if (eventIsTerminateEvent) {

      return EventType.terminateEvent;
    }

    return undefined;
  }

  public errorEventDefinition?: ErrorEventDefinition;
  public messageEventDefinition?: MessageEventDefinition;
  public signalEventDefinition?: SignalEventDefinition;
  public terminateEventDefinition?: TerminateEventDefinition;
  /**
   * When sending messages or signals, this property can hold a
   * definition for a payload to send with the event.
   *
   * Use this, if you do not want to use the current ProcessToken as event
   * payload.
   */
  public inputValues?: any;

}

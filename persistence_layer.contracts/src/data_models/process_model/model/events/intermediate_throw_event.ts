import {
  LinkEventDefinition,
  MessageEventDefinition,
  SignalEventDefinition,
} from './definitions/index';

import {BpmnType, EventType} from '../../constants';
import {Event} from './event';

/**
 * Describes a BPMN IntermediateThrowEvent.
 *
 * These are used to raise events during ProcessModel execution.
 */
export class IntermediateThrowEvent extends Event {

  public get bpmnType(): BpmnType {
    return BpmnType.intermediateThrowEvent;
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

    const eventIsLinkEvent = this.linkEventDefinition !== undefined;
    if (eventIsLinkEvent) {
      return EventType.linkEvent;
    }

    return undefined;
  }

  /**
   * When using an IntermediateLinkThrowEvent, this will contain the link that
   * gets called.
   */
  public linkEventDefinition?: LinkEventDefinition;

  /**
   * When using an IntermediateMessageThrowEvent, this will contain the message
   * to throw.
   */
  public messageEventDefinition?: MessageEventDefinition;
  /**
   * When using an IntermediateSignalThrowEvent, this will contain the signal
   * to throw.
   */
  public signalEventDefinition?: SignalEventDefinition;
  /**
   * When sending messages or signals, this property can hold a
   * definition for a payload to send with the event.
   *
   * Use this, if you do not want to use the current ProcessToken as event
   * payload.
   */
  public inputValues?: any;

}

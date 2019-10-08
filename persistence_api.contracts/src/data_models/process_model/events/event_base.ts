import {BaseElement, FlowNode} from '../base/index';

/**
 * The base class for all events.
 */
export abstract class Event extends FlowNode {
}

/**
 * The base class of all event definitions.
 */
export abstract class EventDefinition extends BaseElement {
}

/**
 * Contains the definition for an ErrorEvent.
 */
export class ErrorEventDefinition extends EventDefinition {

  public name?: string;
  public code?: string;
  public message?: string;

}

/**
 * Contains the definition for a LinkEvent.
 */
export class LinkEventDefinition extends EventDefinition {

  public readonly name: string;

  constructor(linkName: string) {
    super();
    this.name = linkName;
  }

}

/**
 * Contains the definition for a MessageEvent.
 */
export class MessageEventDefinition extends EventDefinition {

  public id: string;
  public name: string;

}

/**
 * Contains the definition for a SignalEvent.
 */
export class SignalEventDefinition extends EventDefinition {

  public id: string;
  public name: string;

}

/**
 * Contains the definition for a TerminateEndEvent.
 */
export class TerminateEventDefinition extends EventDefinition {
}

/**
 * Contains the definition for a TimerEvent.
 */
export class TimerEventDefinition extends EventDefinition {

  public enabled?: boolean = true;
  public timerType: TimerType;
  public value: string;

}

/**
 * Contains all timer types that are currently supported.
 */
export enum TimerType {
  timeCycle = 0,
  timeDate = 1,
  timeDuration = 2,
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import * as definitions from './definitions/index';

export * from './boundary_event';
export * from './end_event';
export * from './event';
export * from './intermediate_catch_event';
export * from './intermediate_throw_event';
export * from './start_event';

export namespace Definitions {
  export import ErrorEventDefinition = definitions.ErrorEventDefinition;
  export import EventDefinition = definitions.EventDefinition;
  export import LinkEventDefinition = definitions.LinkEventDefinition;
  export import MessageEventDefinition = definitions.MessageEventDefinition;
  export import SignalEventDefinition = definitions.SignalEventDefinition;
  export import TerminateEventDefinition = definitions.TerminateEventDefinition;
  export import TimerEventDefinition = definitions.TimerEventDefinition;
  export import TimerType = definitions.TimerType;
}

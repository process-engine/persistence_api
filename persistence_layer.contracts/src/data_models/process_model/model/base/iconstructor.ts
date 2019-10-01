/**
 * This is a helper interface, which will allow us to create instances for
 * FlowNodes from generic functions.
 *
 * See for example:
 * https://github.com/process-engine/process_engine_core/blob/develop/src/model/parser/event_parser.ts#L156
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IConstructor<TModule> = new (...args: Array<any>) => TModule;

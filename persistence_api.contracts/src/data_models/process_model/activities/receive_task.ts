import {BpmnType} from '../constants';
import {MessageEventDefinition} from '../events/definitions';
import {Activity} from './activity';

/**
 * Describes a BPMN ReceiveTask.
 *
 * A ReceiveTask is basically the opposite of a SendTask.
 * It will block the Process Execution, until an expected Message is
 * received.
 *
 * In contrast to an IntermediateCatchEvent, a ReceiveTask will
 * throw back a confirmation Message that the ReceiveTask received the
 * defined message.
 * Therefore, a ReceiveTask will only accept messages, that where send by
 * a SendTask.
 */
export class ReceiveTask extends Activity {

  public get bpmnType(): BpmnType {
    return BpmnType.receiveTask;
  }

  /**
   * This is the user defined Message which is expected by this
   * ReceiveTask.
   */
  public messageEventDefinition: MessageEventDefinition;

}

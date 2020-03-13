import {BpmnType} from '../constants';
import {MessageEventDefinition} from '../events/index';
import {Activity} from './activity';

/**
 * Describes a BPMN SendTask.
 *
 * A send task sends a user defined message to a ReceiveTask.
 *
 * In contrast to an Intermediate Message, a SendTask will block
 * the execution of the process, until a confirmation message from a
 * ReceiveTask was fetched.
 */
export class SendTask extends Activity {

  public get bpmnType(): BpmnType {
    return BpmnType.sendTask;
  }

  /**
   * The interval in which a SendTask should re-send its message.
   * Defaults to 500ms.
   */
  public retryIntervalInMs: number = 500;
  /**
   * Optional: The maximum number of retries.
   * If not set, the SendTask will keep sending its message indefinetly, until it receives a response.
   */
  public maxRetries?: number;

  /**
   * This property contains the user defined message which should be
   * send to a receive task.
   */
  public messageEventDefinition: MessageEventDefinition;

}

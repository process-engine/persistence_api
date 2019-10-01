import {BpmnType} from '../../constants';
import {Activity} from './activity';

/**
 * Describes a BPMN ScriptTask.
 *
 * This type of task is used to execute JS code snippets.
 */
export class ScriptTask extends Activity {

  public get bpmnType(): BpmnType {
    return BpmnType.scriptTask;
  }

  public scriptFormat: string;
  public script: string;
  public resultVariable: string;

}

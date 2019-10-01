import {BpmnType} from '../../constants';
import {Activity} from './activity';

/**
 * Describes a BPMN ManualTask.
 *
 * Currently not evaluated during runtime.
 */
export class ManualTask extends Activity {

  public get bpmnType(): BpmnType {
    return BpmnType.manualTask;
  }

}

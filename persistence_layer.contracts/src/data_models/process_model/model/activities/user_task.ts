import {BpmnType} from '../../constants';
import {Activity} from './activity';
import {UserTaskFormField} from './types/user_task_form_field';

/**
 * Describes a BPMN UserTask.
 *
 * A user task will hold the current execution of the process and wait for user input
 * before continuing.
 */
export class UserTask extends Activity {

  public get bpmnType(): BpmnType {
    return BpmnType.userTask;
  }

  public preferredControl?: string;
  public assignee: string;
  public candidateUsers: string;
  public candidateGroups: string;
  public dueDate?: Date;
  public followUpDate?: Date;
  public formFields: Array<UserTaskFormField>;
  public description: string;
  public finishedMessage: string;

}

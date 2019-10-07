import {BpmnType} from '../constants';
import {Activity} from './activity';

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

/**
 * Describes a BPMN FormField.
 * A FormField is part of a UserTask and can contain all kinds of values.
 *
 * These values can then be used to finish the UserTask.
 */
export class UserTaskFormField {

  /**
   * The UserTasks unique identifier.
   */
  public id: string;

  /**
   * The UserTasks label.
   * This is the field that will be used to describe the FormField,
   * when the UserTask is reached during ProcessModel execution.
   */
  public label: string;

  /**
   * The type of the FormField.
   * Can be virtually anything; string, boolean, number, or enum.
   */
  public type: string;

  /**
   * The default value of the FormField.
   */
  public defaultValue: string;

  /**
   * If the type of the FormField is set to 'enum',
   * this will contain all possible enum values.
   */
  public enumValues?: Array<FormFieldEnumValue>;

  /**
   * Determines the preferred type of control to use with the FormField.
   * For instance, when using string, this will most likely be 'TextBox', or
   * something similar.
   */
  public preferredControl?: string;

}

/**
 * Used in combination with 'enum' type UserTask FormFields,
 * this describes a single enum value of that FormField.
 */
export class FormFieldEnumValue {

  public id: string;
  public name: string;

}

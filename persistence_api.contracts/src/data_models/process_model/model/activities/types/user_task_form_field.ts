import {FormFieldEnumValue} from './form_field_enum_value';

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

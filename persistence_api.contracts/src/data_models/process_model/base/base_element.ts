import {ExtensionElements} from './extension_elements';

/**
 * The base class for all BPMN elements, including processes, participants, etc.
 */
export abstract class BaseElement {

  public id: string;
  public documentation?: Array<string>;
  public extensionElements?: ExtensionElements;

}

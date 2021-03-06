/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cel from './camunda_execution_listener';
import * as cep from './camunda_extension_property';
import * as ee from './extension_elements';

export * from './base_element';
export * from './camunda_execution_listener';
export * from './camunda_extension_property';
export * from './extension_elements';
export * from './flow_node';
export * from './iconstructor';

// NOTE: This is only for backwards compatibility, to avoid a breaking change.
export namespace Types {
  export import CamundaExecutionListener = cel.CamundaExecutionListener;
  export import CamundaExtensionProperty = cep.CamundaExtensionProperty;
  export import ExtensionElements = ee.ExtensionElements;
}

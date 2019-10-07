/* eslint-disable @typescript-eslint/no-unused-vars */
import * as serviceTaskInvocations from './service_task';
import * as userTaskTypes from './user_task';

export * from './activity';
export * from './call_activity';
export * from './empty_activity';
export * from './manual_task';
export * from './receive_task';
export * from './script_task';
export * from './send_task';
export * from './service_task';
export * from './sub_process';
export * from './user_task';

// NOTE: This is only for backwards compatibility, to avoid a breaking change.
export namespace Invocations {
  export import Invocation = serviceTaskInvocations.Invocation;
  export import MethodInvocation = serviceTaskInvocations.MethodInvocation;
}

export namespace Types {
  export import FormFieldEnumValue = userTaskTypes.FormFieldEnumValue;
  export import UserTaskFormField = userTaskTypes.UserTaskFormField;
}

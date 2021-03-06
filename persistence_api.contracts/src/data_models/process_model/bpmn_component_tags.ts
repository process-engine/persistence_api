/**
 * Contains all BPMN tags which are commonly used with all processes.
 * These tags are usually found at the root level of the process.
 */
export enum CommonElement {
  Collaboration = 'bpmn:collaboration',
  Definitions = 'bpmn:definitions',
  Diagram = 'bpmndi:BPMNDiagram',
  Participant = 'bpmn:participant',
  Process = 'bpmn:process',
  Error = 'bpmn:error',
  Signal = 'bpmn:signal',
  Message = 'bpmn:message',
}

/**
 * Contains all XML tags contained within the "xmlns" header tag.
 */
export enum XmlnsProperty {
  bpmn = 'xmlns:bpmn',
  bpmndi = 'xmlns:bpmndi',
  di = 'xmlns:di',
  dc = 'xmlns:dc',
  camunda = 'xmlns:camunda',
  xsi = 'xmlns:xsi',
}

/**
 * Contains all tags associated with lanes and lane sets.
 */
export enum Lane {
  // eslint-disable-next-line no-shadow
  Lane = 'bpmn:lane',
  LaneSet = 'bpmn:laneSet',
}

/**
 * Contains all tags that a lane can have.
 */
export enum LaneProperty {
  ChildLaneSet = 'bpmn:childLaneSet',
  FlowNodeRef = 'bpmn:flowNodeRef',
}

/**
 * Contains the tags for all known gateway types.
 */
export enum GatewayElement {
  ComplexGateway = 'bpmn:complexGateway',
  EventBasedGateway = 'bpmn:eventBasedGateway',
  ExclusiveGateway = 'bpmn:exclusiveGateway',
  InclusiveGateway = 'bpmn:inclusiveGateway',
  ParallelGateway = 'bpmn:parallelGateway',
}

/**
 * Contains the tags for all known event types.
 */
export enum EventElement {
  StartEvent = 'bpmn:startEvent',
  EndEvent = 'bpmn:endEvent',
  Boundary = 'bpmn:boundaryEvent',
  IntermediateCatchEvent = 'bpmn:intermediateCatchEvent',
  IntermediateThrowEvent = 'bpmn:intermediateThrowEvent',
}

/**
 * Contains the tags for all known task types.
 */
export enum TaskElement {
  EmptyActivity = 'bpmn:task',

  CallActivity = 'bpmn:callActivity',
  SubProcess = 'bpmn:subProcess',

  ManualTask = 'bpmn:manualTask',
  ScriptTask = 'bpmn:scriptTask',
  ServiceTask = 'bpmn:serviceTask',
  UserTask = 'bpmn:userTask',

  SendTask = 'bpmn:sendTask',
  ReceiveTask = 'bpmn:receiveTask',

  MethodInvocation = 'bpmn:methodInvocation',
  WebServiceInvocation = 'bpmn:webServiceInvocation',
}

/**
 * Contains all BPMN tags that a BPMN element can have.
 */
export enum FlowElementProperty {
  ErrorEventDefinition = 'bpmn:errorEventDefinition',
  LinkEventDefinition = 'bpmn:linkEventDefinition',
  MessageEventDefinition = 'bpmn:messageEventDefinition',
  SignalEventDefinition = 'bpmn:signalEventDefinition',
  TerminateEventDefinition = 'bpmn:terminateEventDefinition',
  TimerEventDefinition = 'bpmn:timerEventDefinition',

  BpmnScript = 'bpmn:script',

  ConditionExpression = 'bpmn:conditionExpression',
  Documentation = 'bpmn:documentation',
  ExtensionElements = 'bpmn:extensionElements',

  SequenceFlowIncoming = 'bpmn:incoming',
  SequenceFlowOutgoing = 'bpmn:outgoing',

  XsiType = 'xsi:type',
}

/**
 * Contains all Camunda tags that a BPMN element can have.
 */
export enum CamundaProperty {
  CalledElementBinding = 'camunda:calledElementBinding',
  CalledElementVersion = 'camunda:calledElementVersion',
  CalledElementTenantId = 'camunda:calledElementTenantId',
  Assignee = 'camunda:assignee',
  CandidateUsers = 'camunda:candidateUsers',
  CandidateGroups = 'camunda:candidateGroups',
  DueDate = 'camunda:dueDate',
  ExecutionListener = 'camunda:executionListener',
  Expression = 'camunda:expression',
  FormData = 'camunda:formData',
  FormField = 'camunda:formField',
  FollowupDate = 'camunda:followUpDate',
  Properties = 'camunda:properties',
  Property = 'camunda:property',
  ResultVariable = 'camunda:resultVariable',
  Topic = 'camunda:topic',
  Type = 'camunda:type',
  Value = 'camunda:value',
  VariableMappingClass = 'camunda:variableMappingClass',
  VariableMappingDelegateExpression = 'camunda:variableMappingDelegateExpression',
}

/**
 * Contains miscellaneous tags that do not fit anywhere else.
 */
export enum OtherElements {
  Association = 'bpmn:association',
  SequenceFlow = 'bpmn:sequenceFlow',
  TextAnnotation = 'bpmn:textAnnotation',
}

'use strict';

const {
  CorrelationService,
  CronjobHistoryService,
  FlowNodeInstanceService,
  ProcessModelService,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('CorrelationService', CorrelationService)
    .dependencies('CorrelationRepository', 'IamService', 'ProcessDefinitionRepository');

  container
    .register('CronjobHistoryService', CronjobHistoryService)
    .dependencies('CronjobHistoryRepository', 'IamService');

  container
    .register('FlowNodeInstanceService', FlowNodeInstanceService)
    .dependencies('FlowNodeInstanceRepository', 'IamService');

  container
    .register('ProcessModelService', ProcessModelService)
    .dependencies('BpmnModelParser', 'IamService', 'ProcessDefinitionRepository');
}

module.exports.registerInContainer = registerInContainer;

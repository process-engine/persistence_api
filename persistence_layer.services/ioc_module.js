'use strict';

const {
  CorrelationService,
  ProcessModelService,
} = require('./dist/commonjs/index');

function registerInContainer(container) {
  container
    .register('CorrelationService', CorrelationService)
    .dependencies('CorrelationRepository', 'IamService', 'ProcessDefinitionRepository');

  container
    .register('ProcessModelService', ProcessModelService)
    .dependencies('BpmnModelParser', 'IamService', 'ProcessDefinitionRepository');
}

module.exports.registerInContainer = registerInContainer;

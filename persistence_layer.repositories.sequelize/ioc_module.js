'use strict';

const {
  CorrelationRepository,
  ProcessDefinitionRepository,
} = require('./dist/commonjs/index');
const disposableDiscoveryTag = require('@essential-projects/bootstrapper_contracts').disposableDiscoveryTag;

function registerInContainer(container) {

  container.register('CorrelationRepository', CorrelationRepository)
    .dependencies('SequelizeConnectionManager')
    .configure('process_engine:correlation_repository')
    .tags(disposableDiscoveryTag)
    .singleton();

  container.register('ProcessDefinitionRepository', ProcessDefinitionRepository)
    .dependencies('SequelizeConnectionManager')
    .configure('process_engine:process_model_repository')
    .tags(disposableDiscoveryTag)
    .singleton();
}

module.exports.registerInContainer = registerInContainer;

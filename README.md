# Persistence API

Contains all the layers that make up the Persistence API.

- [persistence_layer.contracts](./persistence_layer.contracts)
- [persistence_layer.use_cases](./persistence_layer.use_cases)
- [persistence_layer.services](./persistence_layer.services)
- [persistence_layer.repositories.sequelize](./persistence_layer.repositories.sequelize)

## Motivation

The goal of this package is to reduce the effort required for maintaining the ProcessEngine, particularly the runtime layer.

It combines what was previously known as the "Persistence Layer APIs" into a single API, located in a single GitHub repository.

Those packages include:

- [correlation.contracts](https://github.com/process-engine/correlation.contracts)
- [correlation.service](https://github.com/process-engine/correlation.service)
- [correlation.repository.sequelize](https://github.com/process-engine/correlation.repository.sequelize)
- [cronjob_history.contracts](https://github.com/process-engine/cronjob_history.contracts)
- [cronjob_history.service](https://github.com/process-engine/cronjob_history.service)
- [cronjob_history.repository.sequelize](https://github.com/process-engine/cronjob_history.repository.sequelize)
- [external_task.repository.sequelize](https://github.com/process-engine/external_task.repository.sequelize)
    - A service layer was added for this API, to ensure consistency.
- [flow_node_instance.contracts](https://github.com/process-engine/flow_node_instance.contracts)
- [flow_node_instance.service](https://github.com/process-engine/flow_node_instance.service)
- [flow_node_instance.repository.sequelize](https://github.com/process-engine/flow_node_instance.repository.sequelize)
- [process_model.contracts](https://github.com/process-engine/process_model.contracts)
- [process_model.service](https://github.com/process-engine/process_model.service)
- [process_model.repository.sequelize](https://github.com/process-engine/process_model.repository.sequelize)

## How to use

The structure of the services, repos, etc. remains as it was before, as do the corresponding IoC registrations.
So the only thing you need to do, is to replace the packages linked above with the following dependencies:

- `@process-engine/persistence_api.contracts`
- `@process-engine/persistence_api.use_cases`
- `@process-engine/persistence_api.services`
- `@process-engine/persistence_api.repositories.sequelize`

You'll also need to update your IoC setup accordingly.
However, you do not have to update your own registrations, as the IoC tree remains largely the same.
The only change is the addition of the `ExternalTaskService`, which can be used to access the `ExternalTaskRepository`.

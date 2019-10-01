/**
 * Describes a ProcessDefinition, as it is stored in the ProcessDefinitionRepository.
 */
export class ProcessDefinitionFromRepository {

  public name: string;
  public hash: string;
  public xml: string;
  public createdAt?: Date;
  public updatedAt?: Date;

}

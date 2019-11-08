import {IIdentity} from "@essential-projects/iam_contracts";

/**
 * Describes a ProcessDefinition, as it is stored in the ProcessDefinitionRepository.
 */
export class ProcessDefinitionFromRepository {

  public name: string;
  public hash: string;
  public xml: string;
  public identity?: IIdentity;
  public createdAt?: Date;
  public updatedAt?: Date;

}

import { ITasksRepository } from "../domain/tasks.repository";

export const updateEvidenceResponsablesUseCase = (repository: ITasksRepository) => {
  return repository.updateEvidenceResponsables;
};

import { ITasksRepository } from '../domain/tasks.repository';

export const updateEvidenceUseCase =(repository: ITasksRepository) => {
    return repository.updateEvidence
}
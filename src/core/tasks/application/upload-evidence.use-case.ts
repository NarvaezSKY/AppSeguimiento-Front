import { ITasksRepository } from '../domain/tasks.repository';

export const uploadEvidenceUseCase =(repository: ITasksRepository) => {
    return repository.uploadEvidence
}
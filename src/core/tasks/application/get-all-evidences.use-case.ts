import { ITasksRepository } from '../domain/tasks.repository';

export const getAllEvidencesUseCase =(repository: ITasksRepository) => {
    return repository.getAllEvidences
}
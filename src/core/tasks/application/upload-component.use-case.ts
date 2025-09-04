import { ITasksRepository } from '../domain/tasks.repository';

export const uploadComponentUseCase =(repository: ITasksRepository) => {
    return repository.uploadComponent
}
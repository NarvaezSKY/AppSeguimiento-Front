import { ITasksRepository } from '../domain/tasks.repository';

export const getUsersByComponentUseCase = (repository: ITasksRepository) => {
    return repository.getUsersByComponent
}
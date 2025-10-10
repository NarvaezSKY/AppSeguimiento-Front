import { ITasksRepository } from '../domain/tasks.repository';

export const getComponentsByResponsableUseCase =(repository: ITasksRepository) => {
    return repository.getComponentsByResponsable
}
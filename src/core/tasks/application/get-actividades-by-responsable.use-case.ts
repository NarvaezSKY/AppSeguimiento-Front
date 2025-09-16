import { ITasksRepository } from '../domain/tasks.repository';

export const getActividadesByResponsableUseCase =(repository: ITasksRepository) => {
    return repository.getActividadesByResponsable
}
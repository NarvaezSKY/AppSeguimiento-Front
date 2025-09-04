import { ITasksRepository } from "../domain/tasks.repository";

export const getComponentsUseCase =(repository: ITasksRepository) => {
    return repository.getUniqueComponents
}
import { ITasksRepository } from "../domain/tasks.repository";

export const uploadActivityUseCase =(repository: ITasksRepository) => {
    return repository.uploadActivity
}
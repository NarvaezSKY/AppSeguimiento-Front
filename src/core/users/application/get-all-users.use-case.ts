import { IUsersRepository } from "../domain/users.repository";

export const getAllUsersUseCase = (usersRepository: IUsersRepository) => {
    return usersRepository.getAllUsers
}
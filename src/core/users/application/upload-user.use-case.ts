import { IUsersRepository } from "../domain/users.repository";

export const uploadUserUseCase = (usersRepository: IUsersRepository) => {
    return usersRepository.uploadUser
}
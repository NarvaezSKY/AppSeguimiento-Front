import { IAuthRepository } from '../domain/auth.repository';

export const registerUseCase = (repository: IAuthRepository) => {
    return repository.adminRegister
}
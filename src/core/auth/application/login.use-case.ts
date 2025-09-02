import { IAuthRepository } from '../domain/auth.repository';

export const loginUseCase =(repository: IAuthRepository) => {
    return repository.login
}
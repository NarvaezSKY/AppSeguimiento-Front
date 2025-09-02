import { IAuthRepository } from "../domain/auth.repository";

export const verifyUseCase = (repository: IAuthRepository) => {
    return repository.verify
}
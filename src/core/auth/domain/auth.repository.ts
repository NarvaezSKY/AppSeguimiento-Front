import { ILoginReq, ILoginRes } from "./login";
import { IRegisterReq } from "./register";
import { IRegisterRes } from "./register/register.res";
import { IVerifyRes } from "./verify";

export interface IAuthRepository {
    login: (data: ILoginReq) => Promise<ILoginRes>;
    verify() : Promise<IVerifyRes>;
    adminRegister: (data: IRegisterReq) => Promise<IRegisterRes>;
}
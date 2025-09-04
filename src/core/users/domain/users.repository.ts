import { IGetAllUsersRes } from "./get-all-users";
import { IUploadUserReq, IUploadUserRes } from "./upload-user";

export interface IUsersRepository {
    uploadUser: (data: IUploadUserReq) => Promise<IUploadUserRes>;
    getAllUsers: () => Promise<IGetAllUsersRes>;
}
import { IGetAllUsersRes } from "@/core/users/domain/get-all-users";
import { IGetComponentsRes } from "./get-components/get-components.res";
import { IGetAllEvidencesReq } from "./get-evidences";
import { IUpdateEvidenceReq } from "./update-evidence";
import { IUploadActivityReq, IUploadActivityRes } from "./upload-activity";
import { IUploadComponentReq, IUploadComponentRes } from "./upload-component";
import { IUploadEvidenceReq, IUploadEvidenceRes } from "./upload-evidence";
import { IGetActividadesByResponsableRes } from "./get-actividades-by-responsable";

export interface ITasksRepository {
    uploadComponent: (data: IUploadComponentReq) => Promise<IUploadComponentRes>;
    uploadEvidence: (data: IUploadEvidenceReq) => Promise<IUploadEvidenceRes>;
    getAllEvidences: (data: IGetAllEvidencesReq) => Promise<IUploadEvidenceRes>;
    uploadActivity: (data: IUploadActivityReq) => Promise<IUploadActivityRes>;
    getUniqueComponents: () => Promise<IGetComponentsRes>;
    updateEvidence: (data: IUpdateEvidenceReq) => Promise<IUploadEvidenceRes>;
    getUsersByComponent: (componentId: string) => Promise<IGetAllUsersRes>;
    getActividadesByResponsable: (responsableId: string) => Promise<IGetActividadesByResponsableRes>;

}
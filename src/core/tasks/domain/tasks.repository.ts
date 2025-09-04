import { IGetComponentsRes } from "./get-components/get-components.res";
import { IUploadComponentReq, IUploadComponentRes } from "./upload-component";
import { IUploadEvidenceReq, IUploadEvidenceRes } from "./upload-evidence";

export interface ITasksRepository {
    uploadComponent: (data: IUploadComponentReq) => Promise<IUploadComponentRes>;
    uploadEvidence: (data: IUploadEvidenceReq) => Promise<IUploadEvidenceRes>;
    getAllEvidences: () => Promise<IUploadEvidenceRes>;
    getUniqueComponents: () => Promise<IGetComponentsRes>;
}
import { IGetComponentsRes } from "./get-components/get-components.res";
import { IGetAllEvidencesReq } from "./get-evidences";
import { IUpdateEvidenceReq } from "./update-evidence";
import { IUploadActivityReq, IUploadActivityRes } from "./upload-activity";
import { IUploadComponentReq, IUploadComponentRes } from "./upload-component";
import { IUploadEvidenceReq, IUploadEvidenceRes } from "./upload-evidence";

export interface ITasksRepository {
    uploadComponent: (data: IUploadComponentReq) => Promise<IUploadComponentRes>;
    uploadEvidence: (data: IUploadEvidenceReq) => Promise<IUploadEvidenceRes>;
    getAllEvidences: (data: IGetAllEvidencesReq) => Promise<IUploadEvidenceRes>;
    uploadActivity: (data: IUploadActivityReq) => Promise<IUploadActivityRes>;
    getUniqueComponents: () => Promise<IGetComponentsRes>;
    updateEvidence: (data: IUpdateEvidenceReq) => Promise<IUploadEvidenceRes>;

}
import { IActivityRes } from "@/core/tasks/domain/get-actividades-by-responsable";
import { truncate } from "./truncate";

export interface IActivity {
  _id: string;
  actividad: string;
}

export type Option = {
  value: string;
  label: string;
  title?: string;
};

export const mapActivitiesToOptions = (
  items: IActivityRes[] = [],
  maxLabelLength = 40
): Option[] =>
  items.map((a) => ({
    value: a._id,
    label: truncate(a.actividad ?? "", maxLabelLength),
    title: a.actividad,
  }));

export default mapActivitiesToOptions;
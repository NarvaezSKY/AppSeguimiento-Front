import {
  IActivitiesByYearRes,
  IActivityRes,
} from "@/core/tasks/domain/get-actividades-by-responsable";
import { truncate } from "./truncate";

export interface IActivity {
  _id: string;
  actividad: string;
}

export type Option = {
  value: string;
  label: string;
  title?: string;
  year?: number;
};

export const mapActivitiesToOptions = (
  items: IActivitiesByYearRes | IActivityRes[] = [],
  maxLabelLength = 40
): Option[] => {
  const flattened = Array.isArray(items)
    ? items.map((activity) => ({ activity, year: undefined }))
    : Object.entries(items)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .flatMap(([year, activities]) =>
        (activities ?? []).map((activity) => ({
          activity,
          year: Number(year),
        }))
      );

  return flattened.map(({ activity, year }) => ({
    value: activity._id,
    label: truncate(activity.actividad ?? "", maxLabelLength),
    title: activity.actividad,
    year,
  }));
};

export default mapActivitiesToOptions;
import { IComponents } from "@/core/tasks/domain/get-components/get-components.res";
import { truncate } from "./truncate";

export type Option = {
  value: string;
  label: string;
  title?: string;
};

export const mapComponentsToOptions = (
  items: IComponents[] = [],
  maxLabelLength = 40
): Option[] =>
  items.map((c) => ({
    value: c._id,
    label: truncate(c.nombreComponente ?? "", maxLabelLength),
    title: c.nombreComponente,
  }));

export default mapComponentsToOptions;
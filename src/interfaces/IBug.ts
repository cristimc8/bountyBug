import { ImportanceEnum } from "@/interfaces/IImportance";
import { IEmployee } from "@/interfaces/IEmployee";
import { AvailabilityStatusEnum } from "@/interfaces/IStatus";

export interface IBugCreateRequest {
  name: string;
  importance: ImportanceEnum;
  description: string;
  creatorUsername: string;
}

export interface IBugAssigningRequest {
  assigneeUsername: string;
  bugId: number;
}

export interface IBugUpdateRequest {
  id: number;
  name: string;
  importance: ImportanceEnum;
  description: string;
}

export interface IBugResponse {
  id: number;
  name: string;
  description: string;
  importance: ImportanceEnum;
  status: AvailabilityStatusEnum;
  creator: IEmployee;
  assignedBy?: IEmployee;
}

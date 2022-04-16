import { RoleEnum } from "@/interfaces/IRole";

export const mapInputEntities = (req, res, next) => {
  req.body.role = enumFromStringValue(RoleEnum, req.body.role);

  next();
};

function enumFromStringValue<T>(enm: { [s: string]: T }, value: string): T | undefined {
  return (Object.values(enm) as unknown as string[]).includes(value)
      ? value as unknown as T
      : undefined;
}

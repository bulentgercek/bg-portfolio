import { DataSource } from "typeorm";
import { Users } from "./entity/User";

/**
 * GetUsers Query Function
 * @param ds TypeORM DataSource
 * @returns Promise<Users[]>
 */
export async function getUsers(ds: DataSource): Promise<Users[]> {
  return await ds.manager.find(Users);
}

export type ID = string | number;

export type Result = {
  id: ID;
  [key: string]: any;
};

export interface Resource {
  /**
   * A current count of rows
   */
  count: number | null;

  /**
   * General
   */
  getOne(resourceName: string, id: ID): Promise<Result>;
  addOrUpdateItem(resourceName: string, data: any, id?: ID): Promise<any>;
  deleteItem(resourceName: string, id: ID): Promise<void>;

  /**
   * Table
   */
  table(id: ID): Promise<Result>;
  refTable(id: ID): Promise<Result[]>;

  /**
   * Row
   */
  rows(id: ID, options: any): Promise<Result[]>;
  addRow(id: ID, item: Result): Promise<Result>;
}

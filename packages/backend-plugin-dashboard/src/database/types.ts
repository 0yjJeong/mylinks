export type ID = string | number;

export type Result = {
  id: ID;
  [key: string]: any;
};

export interface Dashboard {
  count: number | null;
  getOne(resourceName: string, id: ID): Promise<Result>;
  addOrUpdateItem(resourceName: string, data: any, id?: ID): Promise<any>;
  deleteItem(resourceName: string, id: ID): Promise<void>;
  list(id: ID): Promise<Result>;
  refLists(listId: ID): Promise<Result[]>;
  links(listId: ID, options: any): Promise<Result[]>;
  addLink(listId: ID, url: string): Promise<Result>;
}

import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { Dashboard, ID, Result } from './types';

export default class Database implements Dashboard {
  constructor(private readonly database: Knex) {}

  async getOne(resourceName: string, id: ID): Promise<Result> {
    return (
      await this.database<Result>(resourceName)
        .where({ id })
        .select()
    )[0];
  }

  async addOrUpdateItem(
    resourceName: string,
    data: any,
    id?: ID
  ): Promise<void> {
    await this.database.transaction(async (tx) => {
      await tx(resourceName)
        .where({ id })
        .update(data)
        .catch(() => tx(resourceName).insert({ ...data, id: uuidv4() }));
    });
    return data;
  }

  async deleteItem(name: string, id: ID): Promise<void> {
    const result = await this.database<Result>(name)
      .where({ id })
      .del();
    if (!result) {
      throw new Error(`Found no item with it ID ${id}`);
    }
  }

  async list(id: ID): Promise<Result> {
    const list = await this.getOne('lists', id);
    if (!list) {
      throw new Error(`Found no list with ID ${id}`);
    }
    return list;
  }

  async refLists(listId: ID): Promise<Result[]> {
    const lists = await this.database<Result>('lists_lists')
      .where({ source_id: listId })
      .innerJoin('lists', 'target_id', 'lists.id')
      .select('lists.id', 'lists.title', 'lists.created_at');
    return lists;
  }
}

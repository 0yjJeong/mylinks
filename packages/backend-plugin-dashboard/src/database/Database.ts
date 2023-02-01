import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { Resource, ID, Result } from './types';

export default class Database implements Resource {
  public count: null | number;

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
  ): Promise<any> {
    return await this.database.transaction(async (tx) => {
      return await tx(resourceName)
        .where({ id })
        .update(data)
        .catch(async () => {
          const id = uuidv4();
          await tx(resourceName).insert({ ...data, id });
          return { ...data, id };
        });
    });
  }

  async deleteItem(name: string, id: ID): Promise<void> {
    const result = await this.database<Result>(name)
      .where({ id })
      .del();
    if (!result) {
      throw new Error(`Found no item with it ID ${id}`);
    }
  }

  async table(id: ID): Promise<Result> {
    const list = await this.getOne('tables', id);
    if (!list) {
      throw new Error(`Found no table with ID ${id}`);
    }
    return list;
  }

  async refTable(tableId: ID): Promise<Result[]> {
    const lists = await this.database<Result>('table_to_tables')
      .where({ source_id: tableId })
      .innerJoin('tables', 'target_id', 'tables.id')
      .select('tables.id', 'tables.title', 'tables.created_at');
    return lists;
  }

  async rows(id: ID, options): Promise<Result[]> {
    const tx = this.database<Result>('rows');

    tx.whereIn('table_id', [id]);
    if (options?.filter) {
      tx.orWhereIn('table_id', options?.filter);
    }

    this.count = (
      await tx
        .clone()
        .select()
        .count()
    )[0].count as number;

    if (options?.sort) {
      tx.orderBy(options?.sort.field, options?.sort.order);
    }

    if (options?.pagination) {
      tx.offset(options?.pagination.offset).limit(options?.pagination.limit);
    }

    return await tx.select();
  }

  async addRow(tableId: ID, item: Result): Promise<Result> {
    const id = uuidv4();
    console.log(id, tableId);
    await this.database<Result>('rows').insert({
      id,
      url: item.url || null,
      title: item.title || null,
      image: item.image || null,
      description: item.description || null,
      table_id: tableId,
    });
    return this.getOne('rows', id);
  }

  async deleteRows(ids: ID[]): Promise<void> {
    await this.database<Result>('rows')
      .whereIn('id', ids)
      .delete();
  }
}

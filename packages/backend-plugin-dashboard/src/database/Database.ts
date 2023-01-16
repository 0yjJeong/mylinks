import { Knex } from 'knex';
import urlMetadata from 'url-metadata';
import { v4 as uuidv4 } from 'uuid';
import { Dashboard, ID, Result } from './types';

export default class Database implements Dashboard {
  count: null | number;

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

  async links(options): Promise<Result[]> {
    const tx = this.database<Result>('links');

    if (options?.filter) {
      tx.whereIn('list_id', options?.filter);
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

  async addLink(listId: ID, url: string): Promise<Result> {
    const item = await urlMetadata(url);
    if (!item) {
      throw new Error(`Found no metadata with url ${url}`);
    }
    const id = uuidv4();
    await this.database<Result>('links').insert({
      id,
      url: item.url,
      title: item.title,
      image: item.image,
      description: item.description,
      list_id: listId,
    });
    return this.getOne('links', id);
  }
}

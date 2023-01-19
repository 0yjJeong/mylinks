import axios from 'axios';
import { LinkRaw, ListRaw } from '../../types';

type ListResponse = {
  data: ListRaw;
};

type LinksResponse = {
  count: number;
  data: LinkRaw[];
};

type RefListsResponse = {
  data: ListRaw[];
};

type AddListResponse = {
  data: ListRaw;
};

type EditListResponse = {
  data: ListRaw;
};

type DeleteListResponse = {};

type AddLinkResponse = {
  data: LinkRaw;
};

type EditLinkResponse = {
  data: LinkRaw;
};

type DeleteLinkResponse = {};

interface TDataManager {
  list(): Promise<ListResponse>;
  refLists(): Promise<RefListsResponse>;
  links(): Promise<LinksResponse>;
  addList(list: Partial<ListRaw>): Promise<AddListResponse>;
  editList(list: Omit<ListRaw, 'id' | 'created_at'>): Promise<EditListResponse>;
  deleteList(): Promise<DeleteListResponse>;
  addLink(url: string): Promise<AddLinkResponse>;
  editLink(link: Partial<LinkRaw>): Promise<EditLinkResponse>;
  deleteLink(id: string): Promise<DeleteLinkResponse>;
}

export default class DataManager implements TDataManager {
  constructor(private readonly apiUrl: string) {}

  get id() {
    return window.location.href
      .match(/\/list\/([a-zA-Z0-9-])+/g)[0]
      .split('/')[2];
  }

  get baseUrl() {
    return `${this.apiUrl}/dashboard/list`;
  }

  async list(): Promise<ListResponse> {
    const { data } = await axios.get<ListRaw>(`${this.baseUrl}/${this.id}`);
    return { data };
  }

  async links(): Promise<LinksResponse> {
    const { headers, data } = await axios.get<LinkRaw[]>(
      `${this.baseUrl}/${this.id}/links?${location.search}`
    );
    const count = parseInt(headers['x-total-count'], 10);
    return { data, count };
  }

  async refLists(): Promise<RefListsResponse> {
    const { data } = await axios.get<ListRaw[]>(
      `${this.baseUrl}/${this.id}/ref`
    );
    return { data };
  }

  async addList(list: Partial<ListRaw>): Promise<AddListResponse> {
    const { data } = await axios.post<ListRaw>(`${this.baseUrl}`, list);
    return { data };
  }

  async editList(list: Partial<ListRaw>): Promise<EditListResponse> {
    const { data } = await axios.post<ListRaw>(
      `${this.baseUrl}/${this.id}`,
      list
    );
    return { data };
  }

  async deleteList(): Promise<DeleteListResponse> {
    const { data } = await axios.delete<ListRaw>(`${this.baseUrl}/${this.id}`);
    return { data };
  }

  async addLink(url: string): Promise<AddLinkResponse> {
    const { data } = await axios.post<LinkRaw>(
      `${this.baseUrl}/${this.id}/link`,
      { url }
    );
    return { data };
  }

  async editLink(link: Partial<LinkRaw>): Promise<EditLinkResponse> {
    const { data } = await axios.put<LinkRaw>(
      `${this.baseUrl}/${this.id}/link/${this.id}`,
      link
    );
    return { data };
  }

  async deleteLink(id: string): Promise<DeleteLinkResponse> {
    const { data } = await axios.delete<LinkRaw>(
      `${this.baseUrl}/${this.id}/link/${id}`
    );
    return { data };
  }
}

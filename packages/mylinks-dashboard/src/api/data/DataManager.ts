import axios from 'axios';
import { TableRaw, RowRaw } from '../../types';

type TableResponse = {
  data: TableRaw;
};

type RefTableResponse = {
  data: TableRaw[];
};

type AddTableResponse = {
  data: TableRaw;
};

type EditTableResponse = {
  data: TableRaw;
};

type DeleteTableResponse = {};

type RowsResponse = {
  count: number;
  data: RowRaw[];
};

type AddRowResponse = {
  data: RowRaw;
};

type EditRowResponse = {
  data: RowRaw;
};

type DeleteRowResponse = {};

interface TDataManager {
  table(): Promise<TableResponse>;
  refTable(): Promise<RefTableResponse>;
  addTable(list: Partial<TableRaw>): Promise<AddTableResponse>;
  editTable(
    list: Omit<TableRaw, 'id' | 'created_at'>
  ): Promise<EditTableResponse>;
  deleteTable(): Promise<DeleteTableResponse>;
  rows(): Promise<RowsResponse>;
  addRow(url: string): Promise<AddRowResponse>;
  editRow(link: Partial<RowRaw>): Promise<EditRowResponse>;
  deleteRow(id: string): Promise<DeleteRowResponse>;
}

export default class DataManager implements TDataManager {
  constructor(private readonly apiUrl: string) {}

  get id() {
    return window.location.href
      .match(/\/table\/([a-zA-Z0-9-])+/g)[0]
      .split('/')[2];
  }

  get baseUrl() {
    return `${this.apiUrl}/dashboard/table`;
  }

  async table(): Promise<TableResponse> {
    const { data } = await axios.get<TableRaw>(`${this.baseUrl}/${this.id}`);
    return { data };
  }

  async refTable(): Promise<RefTableResponse> {
    const { data } = await axios.get<TableRaw[]>(
      `${this.baseUrl}/${this.id}/ref`
    );
    return { data };
  }

  async addTable(table: Partial<TableRaw>): Promise<AddTableResponse> {
    const { data } = await axios.post<TableRaw>(`${this.baseUrl}`, table);
    return { data };
  }

  async editTable(table: Partial<TableRaw>): Promise<EditTableResponse> {
    const { data } = await axios.post<TableRaw>(
      `${this.baseUrl}/${this.id}`,
      table
    );
    return { data };
  }

  async deleteTable(): Promise<DeleteTableResponse> {
    const { data } = await axios.delete<TableRaw>(`${this.baseUrl}/${this.id}`);
    return { data };
  }

  async rows(): Promise<RowsResponse> {
    const { headers, data } = await axios.get<RowRaw[]>(
      `${this.baseUrl}/${this.id}/rows?${location.search}`
    );
    const count = parseInt(headers['x-total-count'], 10);
    return { data, count };
  }

  async addRow(url: string): Promise<AddRowResponse> {
    const { data } = await axios.post<RowRaw>(
      `${this.baseUrl}/${this.id}/row`,
      { url }
    );
    return { data };
  }

  async editRow(row: Partial<RowRaw>): Promise<EditRowResponse> {
    const { data } = await axios.put<RowRaw>(
      `${this.baseUrl}/${this.id}/row/${this.id}`,
      row
    );
    return { data };
  }

  async deleteRow(id: string): Promise<DeleteRowResponse> {
    const { data } = await axios.delete<RowRaw>(
      `${this.baseUrl}/${this.id}/row/${id}`
    );
    return { data };
  }
}

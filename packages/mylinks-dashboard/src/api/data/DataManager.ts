import axios from 'axios';
import { TableRaw, RowRaw } from '../../types';

export type MetadataResponse = {
  data: Partial<RowRaw>;
};

export type TableResponse = {
  data?: TableRaw;
  error?: any;
};

export type RefTableResponse = {
  data: TableRaw[];
};

export type AddTableResponse = {
  data: TableRaw;
};

export type EditTableResponse = {
  data: TableRaw;
};

export type DeleteTableResponse = {};

export type RowsResponse = {
  count: number;
  data: RowRaw[];
};

export type AddRowResponse = {
  data: RowRaw;
};

export type EditRowResponse = {
  data: RowRaw;
};

export type DeleteRowResponse = {};

export type DeleteRowsResponse = void;

interface TDataManager {
  /**
   * Metadata
   */
  matadata(url: string): Promise<MetadataResponse>;

  /**
   * Table
   */
  table(id: string): Promise<TableResponse>;
  refTable(id: string): Promise<RefTableResponse>;
  addTable(list: Partial<TableRaw>): Promise<AddTableResponse>;
  editTable(
    id: string,
    list: Omit<TableRaw, 'id' | 'created_at'>
  ): Promise<EditTableResponse>;
  deleteTable(id: string): Promise<DeleteTableResponse>;

  /**
   * Row
   */
  rows(id: string): Promise<RowsResponse>;
  addRow(tableId: string): Promise<AddRowResponse>;
  editRow(id: string, row: Partial<RowRaw>): Promise<EditRowResponse>;
  deleteRow(id: string): Promise<DeleteRowResponse>;
  deleteRows(id: string, ids: string[]): Promise<DeleteRowsResponse>;
}

export default class DataManager implements TDataManager {
  constructor(private readonly apiUrl: string) {}

  get baseUrl() {
    return `${this.apiUrl}/dashboard/table`;
  }

  async matadata(url: string): Promise<MetadataResponse> {
    const { data } = await axios.post<RowRaw>(
      `${this.apiUrl}/dashboard/metadata`,
      { url }
    );
    return { data };
  }

  async table(id: string): Promise<TableResponse> {
    const { data } = await axios.get<TableRaw>(`${this.baseUrl}/${id}`);
    return { data };
  }

  async refTable(id: string): Promise<RefTableResponse> {
    const { data } = await axios.get<TableRaw[]>(`${this.baseUrl}/${id}/ref`);
    return { data };
  }

  async addTable(table: Partial<TableRaw>): Promise<AddTableResponse> {
    const { data } = await axios.post<TableRaw>(`${this.baseUrl}`, table);
    return { data };
  }

  async editTable(
    id: string,
    table: Partial<TableRaw>
  ): Promise<EditTableResponse> {
    const { data } = await axios.post<TableRaw>(`${this.baseUrl}/${id}`, table);
    return { data };
  }

  async deleteTable(id: string): Promise<DeleteTableResponse> {
    const { data } = await axios.delete<TableRaw>(`${this.baseUrl}/${id}`);
    return { data };
  }

  async rows(id: string): Promise<RowsResponse> {
    const { headers, data } = await axios.get<RowRaw[]>(
      `${this.baseUrl}/${id}/rows${location.search}`
    );
    const count = parseInt(headers['x-total-count'], 10);
    return { data, count };
  }

  async addRow(tableId: string): Promise<AddRowResponse> {
    const { data } = await axios.post<RowRaw>(
      `${this.baseUrl}/${tableId}/row`,
      { tableId }
    );
    return { data };
  }

  async editRow(id: string, row: Partial<RowRaw>): Promise<EditRowResponse> {
    const { data } = await axios.put<RowRaw>(
      `${this.baseUrl}/${id}/row/${id}`,
      row
    );
    return { data };
  }

  async deleteRow(id: string): Promise<DeleteRowResponse> {
    const { data } = await axios.delete<RowRaw>(
      `${this.baseUrl}/${id}/row/${id}`
    );
    return { data };
  }

  async deleteRows(id: string, ids: string[]): Promise<void> {
    await axios.post<void>(`${this.baseUrl}/${id}/rows`, { ids });
  }
}

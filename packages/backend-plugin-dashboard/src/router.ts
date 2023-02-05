import { Router } from 'express';
import { Resource } from './database';
import Metadata from './metadata/Metadata';
import { getListId, getOrigin } from './utils';

export function createRouter(dashboard: Resource, clientUrl: string) {
  const router = Router();

  // PATH: /metadata
  router.post('/metadata', async (req, res) => {
    const { url } = req.body;
    const metadata = new Metadata(url);
    const result = await metadata.getMetadata();
    res.status(200).json(result);
  });

  // PATH: /table
  router
    .get('/table/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await dashboard.table(id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json(error);
      }
    })
    .get('/table/:id/ref', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await dashboard.refTable(id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json(error);
      }
    })
    .post(['/table', '/table/:id'], async (req, res) => {
      try {
        const { id } = req.params;
        const result = await dashboard.addOrUpdateItem('tables', req.body, id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json(error);
      }
    })
    .delete('/table/:id', async (req, res) => {
      try {
        const { id } = req.params;
        await dashboard.deleteItem('tables', id);
        res.status(200).json();
      } catch (error) {
        const { id } = req.params;
        await dashboard.deleteItem('tables', id);
        res.status(200).json();
      }
    });

  // PATH: /table/:table_id/row
  router
    .get('/table/:table_id/rows', async (req, res) => {
      const { table_id } = req.params;
      const {
        offset = 0,
        limit = 10,
        field = 'created_at',
        order = 'asc',
        filter,
        pagination = { offset, limit },
        sort = { field, order },
      } = req.query;

      const links = await dashboard.rows(table_id, {
        pagination,
        sort,
        filter,
      });

      try {
        res
          .status(200)
          .header('x-total-count', dashboard.count.toString())
          .header('Access-Control-Expose-Headers', 'x-total-count')
          .json(links);
      } catch (error) {
        res.status(400).json(error);
      }
    })
    .post('/table/:table_id/row', async (req, res) => {
      const { tableId } = req.body;
      if (req.body.url) {
        const fromClient = getOrigin(clientUrl) === getOrigin(req.body.url);
        if (fromClient) {
          const result = await dashboard.addOrUpdateItem('table_to_tables', {
            source_id: tableId,
            target_id: getListId(req.body.url),
          });
          return res.status(200).json(result);
        }
      }
      const result = await dashboard.addRow(tableId, req.body);
      try {
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json(error);
      }
    })
    .put('/table/:table_id/row/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await dashboard.addOrUpdateItem('rows', req.body, id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json(error);
      }
    })
    .delete('/table/:table_id/row/:id', async (req, res) => {
      try {
        const { id } = req.params;
        await dashboard.deleteItem('rows', id);
        res.status(200).json();
      } catch (error) {
        res.status(400).json(error);
      }
    })
    .post('/table/:table_id/rows', async (req, res) => {
      try {
        const { ids } = req.body;
        await dashboard.deleteRows(ids);
        res.status(200).json();
      } catch (error) {
        res.status(400).json(error);
      }
    });

  return router;
}

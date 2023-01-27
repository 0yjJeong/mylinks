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
    res.status(200).send(result);
  });

  // PATH: /table
  router
    .get('/table/:id', async (req, res) => {
      const { id } = req.params;
      const result = await dashboard.table(id);
      res.status(200).send(result);
    })
    .get('/table/:id/ref', async (req, res) => {
      const { id } = req.params;
      const result = await dashboard.refTable(id);
      res.status(200).send(result);
    })
    .post(['/table', '/table/:id'], async (req, res) => {
      const { id } = req.params;
      const result = await dashboard.addOrUpdateItem('tables', req.body, id);
      res.status(200).send(result);
    })
    .delete('/table/:id', async (req, res) => {
      const { id } = req.params;
      await dashboard.deleteItem('tables', id);
      res.status(200).send();
    });

  // PATH: /table/:table_id/row
  router
    .get('/table/:table_id/rows', async (req, res) => {
      const { table_id } = req.params;
      const {
        offset,
        limit,
        field,
        order,
        filter,
        pagination = { offset, limit },
        sort = { field, order },
      } = req.query;
      console.log(req.query, field, order, sort);
      const links = await dashboard.rows(table_id, {
        pagination,
        sort,
        filter,
      });
      res
        .status(200)
        .header('x-total-count', dashboard.count.toString())
        .header('Access-Control-Expose-Headers', 'x-total-count')
        .send(links);
    })
    .post('/table/:table_id/row', async (req, res) => {
      const { table_id } = req.params;
      if (req.body.url) {
        const fromClient = getOrigin(clientUrl) === getOrigin(req.body.url);
        if (fromClient) {
          const result = await dashboard.addOrUpdateItem('table_to_tables', {
            source_id: table_id,
            target_id: getListId(req.body.url),
          });
          return res.status(200).send(result);
        }
      }
      const result = await dashboard.addRow(table_id, req.body);
      res.status(200).send(result);
    })
    .put('/table/:table_id/row/:id', async (req, res) => {
      const { id } = req.params;
      const result = await dashboard.addOrUpdateItem('rows', req.body, id);
      res.status(200).send(result);
    })
    .delete('/table/:table_id/row/:id', async (req, res) => {
      const { id } = req.params;
      await dashboard.deleteItem('rows', id);
      res.status(200).send();
    });

  return router;
}

import { Router } from 'express';
import { Dashboard } from './database';
import { getListId, getOrigin } from './utils';

export function createRouter(dashboard: Dashboard, clientUrl: string) {
  const router = Router();

  /* /list */
  router
    .get('/list/:id', async (req, res) => {
      const { id } = req.params;
      const result = await dashboard.list(id);
      res.status(200).send(result);
    })
    .get('/list/:id/ref', async (req, res) => {
      const { id } = req.params;
      const result = await dashboard.refLists(id);
      res.status(200).send(result);
    })
    .post(['/list', '/list/:id'], async (req, res) => {
      const { id } = req.params;
      const result = await dashboard.addOrUpdateItem('lists', req.body, id);
      res.status(200).send(result);
    })
    .delete('/list/:id', async (req, res) => {
      const { id } = req.params;
      await dashboard.deleteItem('lists', id);
      res.status(200).send();
    });

  /* /list/:listId */
  router
    .get('/list/:listId/links', async (req, res) => {
      const { listId } = req.params;
      const {
        offset,
        limit,
        field,
        order,
        filter,
        pagination = { offset, limit },
        sort = { field, order },
      } = req.query;
      const links = await dashboard.links(listId, {
        pagination,
        sort,
        filter,
      });
      res
        .status(200)
        .header({ 'x-total-count': dashboard.count })
        .send(links);
    })
    .post('/list/:listId/link', async (req, res) => {
      const { listId } = req.params;
      if (getOrigin(clientUrl) === getOrigin(req.body.url)) {
        const result = await dashboard.addOrUpdateItem('lists_lists', {
          source_id: listId,
          target_id: getListId(req.body.url),
        });
        return res.status(200).send(result);
      }
      const result = await dashboard.addLink(listId, req.body.url);
      res.status(200).send(result);
    })
    .put('/list/:listId/link/:id', async (req, res) => {
      const { id } = req.params;
      const result = await dashboard.addOrUpdateItem('links', req.body, id);
      res.status(200).send(result);
    })
    .delete('/list/:listId/link/:id', async (req, res) => {
      const { id } = req.params;
      await dashboard.deleteItem('links', id);
      res.status(200).send();
    });

  return router;
}

import { Router } from 'express';
import { Dashboard } from './database';

export function createRouter(dashboard: Dashboard) {
  const router = Router();

  /**
   * Lists
   */
  router
    .get('/list/:id', async (req, res) => {
      const { id } = req.params;
      const result = await dashboard.list(id);
      res.status(200).send(result);
    })
    .get('/list/ref/:id', async (req, res) => {
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

  return router;
}

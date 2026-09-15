import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import type { AuthVariables } from '@shared/middleware';
import { errorHook } from '@shared/validation';

import { restSchema } from './rest.schemas';
import { applyRest } from './rest.service';

/**
 * The first of the three atomic server actions (rest, level-up, start-up). They
 * are dedicated action routes rather than part of the autosave channel because
 * each writes fields that channel also owns — two writers on one field is the
 * clobber the save strategy exists to prevent.
 */
export const restRoutes = new Hono<{ Variables: AuthVariables }>();

restRoutes.post('/', zValidator('json', restSchema, errorHook), async (c) => {
  const userId = c.get('userId');
  // Mounted under `/:id/rest`, so the parent's param is merged into this app.
  const characterId = c.req.param('id');
  const input = c.req.valid('json');

  // The param is typed optional on a sub-app; the real ownership check runs
  // inside the transaction, so this guard is only about the type.
  if (!characterId) {
    return c.json({ error: 'Character not found' }, 404);
  }

  try {
    const outcome = await applyRest(characterId, userId, input);

    if (outcome.status === 'not-found') {
      return c.json({ error: 'Character not found' }, 404);
    }

    if (outcome.status === 'too-many-dice') {
      return c.json(
        { error: `Only ${outcome.remaining} hit dice remaining` },
        409
      );
    }

    return c.json({
      sheet: outcome.sheet,
      classResources: outcome.classResources,
      inventoryItems: outcome.inventoryItems,
    });
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to rest' }, 500);
  }
});

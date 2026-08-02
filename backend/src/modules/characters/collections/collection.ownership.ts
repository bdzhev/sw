import { createMiddleware } from 'hono/factory';

import { assertOwnedCharacter, db } from '@shared/db';
import type { AuthVariables } from '@shared/middleware';

/** `characterId` is set only after ownership passes, so reading it is safe. */
export type OwnedCharacterVariables = AuthVariables & {
  characterId: string;
};

/**
 * Ownership for every sub-collection route, applied once per sub-app instead of
 * per handler — the sub-tables carry no `user_id` of their own, so forgetting it
 * in one handler is an IDOR, which is exactly how the quiz route shipped one.
 *
 * Answers 404 rather than 403 so it does not confirm that an id exists.
 */
export const requireOwnedCharacter = createMiddleware<{
  Variables: OwnedCharacterVariables;
}>(async (c, next) => {
  const userId = c.get('userId');
  const characterId = c.req.param('id');

  if (!characterId || !(await assertOwnedCharacter(db, characterId, userId))) {
    return c.json({ error: 'Character not found' }, 404);
  }

  c.set('characterId', characterId);

  await next();
});

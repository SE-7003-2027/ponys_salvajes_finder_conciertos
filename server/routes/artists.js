const { Router } = require('express');
const { getArtistMusic } = require('../services/artist-music');
const { HttpError } = require('../lib/http-error');

const ARTIST_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

const router = Router();

/**
 * GET /api/artists/:id/music
 * :id is the Ticketmaster attraction id used in the /artist/:id page.
 */
router.get('/:id/music', async (req, res) => {
  const { id } = req.params;

  if (!ARTIST_ID_PATTERN.test(id)) {
    return res.status(400).json({ error: 'Invalid artist id' });
  }

  try {
    return res.json(await getArtistMusic(id));
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({ error: error.message });
    }

    console.error(`[artists] music for ${id} failed: ${error.message}`);
    return res.status(502).json({ error: 'Could not load artist music right now' });
  }
});

module.exports = router;

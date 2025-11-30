import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist
} from '../controllers/playlist.controllers.js';

const router = Router();

router.post('/', verifyJWT, createPlaylist);
router.get('/mine', verifyJWT, getMyPlaylists);

router.get('/:playlistId', getPlaylistById);

router.post('/add-video', verifyJWT, addVideoToPlaylist);
router.delete('/remove-video', verifyJWT, removeVideoFromPlaylist);

router.delete('/:playlistId', verifyJWT, deletePlaylist);

router.patch('/:playlistId', verifyJWT, updatePlaylist);

export default router;

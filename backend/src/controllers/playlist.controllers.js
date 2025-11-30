import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Playlist } from '../models/playlist.model.js';
import { PlaylistVideo } from '../models/playlistVideo.model.js';
import { toObjectId } from '../utils/helper.js';

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, 'Playlist name is required');
  }

  const playlist = await Playlist.create({
    owner: req.user._id,
    name,
    description: description || ''
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, 'Playlist created successfully'));
});

export const getMyPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id }).sort({
    createdAt: -1
  });

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, 'Playlists fetched successfully'));
});

export const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) throw new ApiError(400, 'Playlist ID is required');

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) throw new ApiError(404, 'Playlist not found');

  const videos = await PlaylistVideo.aggregate([
    {
      $match: { playlist: toObjectId(playlistId) }
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'video',
        foreignField: '_id',
        as: 'video',
        pipeline: [
          {
            $project: {
              title: 1,
              thumbnail: 1,
              duration: 1
            }
          }
        ]
      }
    },
    { $unwind: '$video' }
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        playlist,
        videos
      },
      'Playlist fetched successfully'
    )
  );
});

export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Playlist ID and Video ID are required");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You cannot modify this playlist");
  }

  const exists = await PlaylistVideo.findOne({
    playlist: playlistId,
    video: videoId
  });

  if (exists) {
    throw new ApiError(400, "Video already exists in playlist");
  }

  const item = await PlaylistVideo.create({
    playlist: playlistId,
    video: videoId,
    addedAt: new Date()
  });

  return res
    .status(200)
    .json(new ApiResponse(200, item, "Video added to playlist"));
});

export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;

  const removed = await PlaylistVideo.findOneAndDelete({
    playlist: playlistId,
    video: videoId
  });

  if (!removed) {
    throw new ApiError(404, 'Video not found in playlist');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Video removed from playlist'));
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You cannot delete this playlist");
  }

  await Playlist.findByIdAndDelete(playlistId);
  await PlaylistVideo.deleteMany({ playlist: playlistId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

export const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (description) updates.description = description;

  const updated = await Playlist.findByIdAndUpdate(
    playlistId,
    { $set: updates },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updated, 'Playlist updated successfully'));
});

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const { video, userLike, isFollowing, auth, comments = [], relatedVideos = [], playlists = [] } = usePage().props;

  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [likeCount, setLikeCount] = useState(video.likes_count);
  const [dislikeCount, setDislikeCount] = useState(video.dislikes_count);
  const [userLikeState, setUserLikeState] = useState(userLike);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [playlistsState, setPlaylistsState] = useState(playlists);
  const [showModal, setShowModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  const videoUrl = video.path.startsWith('http') ? video.path : `/storage/${video.path}`;

  const handleVideoLike = (isLike) => {
    if (!auth?.user) return alert('You must be logged in to vote.');

    axios.post(`/videos/${video.id}/like`, { like: isLike }).then(res => {
      setLikeCount(res.data.likes_count);
      setDislikeCount(res.data.dislikes_count);
      setUserLikeState(res.data.userLike);
    });
  };

  const handleDownload = () => {
    window.open(videoUrl, '_blank');
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Video link copied to clipboard.');
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!auth?.user) return alert('You must be logged in to comment.');
    if (comment.trim() === '') return;

    router.post(`/videos/${video.id}/comments`, {
      body: comment,
      parent_id: replyTo
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setComment('');
        setReplyTo(null);
      }
    });
  };

  const handleCommentLike = (commentId, isLike) => {
    if (!auth?.user) return alert('You must be logged in to vote.');
    router.post(`/comments/${commentId}/like`, { like: isLike }, { preserveScroll: true });
  };

  const handleAddToPlaylist = (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;

    fetch(`/playlists/${selectedPlaylist}/add-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ video_id: video.id }),
    }).then(() => {
      alert('Video added to playlist');
      setSelectedPlaylist('');
    });
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistTitle.trim()) return;

    fetch('/playlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ title: newPlaylistTitle }),
    })
      .then(res => res.json())
      .then(newPlaylist => {
        setPlaylistsState([...playlistsState, newPlaylist]);
        setNewPlaylistTitle('');
        setShowModal(false);
        alert('Playlist created.');
      });
  };

  const followStatus = typeof isFollowing !== 'undefined' ? isFollowing : false;

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Watch Video</h2>}
    >
      <Head title={video.title} />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
          {video.user && (
            <p className="text-sm text-gray-500 mb-4">
              By{' '}
              <a href={`/profile/${video.user.id}`} className="text-blue-600 hover:underline">
                {video.user.name}
              </a>{' '}
              on {new Date(video.created_at).toLocaleDateString()} –
              <span className="mx-1">👁️ {video.views} views</span>
            </p>
          )}

          <div className="mb-6">
            <video controls className="w-full max-w-xl mx-auto" preload="metadata">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="mb-6 flex gap-4 flex-wrap items-center">
            <button
              onClick={() => handleVideoLike(true)}
              className={`px-4 py-2 rounded ${userLikeState === 'like' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              👍 Like ({likeCount})
            </button>
            <button
              onClick={() => handleVideoLike(false)}
              className={`px-4 py-2 rounded ${userLikeState === 'dislike' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
            >
              👎 Dislike ({dislikeCount})
            </button>

            {auth?.user && video.user_id !== auth.user.id && (
              <button
                onClick={() => router.post(`/subscribe/${video.user.id}`)}
                className={`px-4 py-2 rounded ${followStatus ? 'bg-red-600' : 'bg-purple-600'} text-white`}
              >
                {followStatus ? 'Unfollow' : `Subscribe to ${video.user?.name || 'user'}`}
              </button>
            )}

            <button onClick={handleShare} className="px-4 py-2 bg-yellow-500 text-white rounded">Share</button>
            <button onClick={handleDownload} className="px-4 py-2 bg-gray-700 text-white rounded">Download</button>

            {auth?.user && playlistsState.length > 0 && (
              <form onSubmit={handleAddToPlaylist} className="flex items-center gap-2">
                <select
                  className="border rounded px-2 py-1"
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                  value={selectedPlaylist}
                >
                  <option value="">Add to Playlist</option>
                  {playlistsState.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                <button className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
              </form>
            )}

            {auth?.user && (
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-1 border border-gray-400 rounded text-sm"
              >
                + Create Playlist
              </button>
            )}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4">Create Playlist</h2>
                <input
                  type="text"
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder="Playlist title"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePlaylist}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

<div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder={replyTo ? 'Write your reply...' : 'Write a comment...'}
                rows="3"
              />
              {replyTo && (
                <p className="text-sm text-gray-500 mb-2">Replying to comment #{replyTo}</p>
              )}
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                Submit Comment
              </button>
            </form>

            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="border p-3 rounded">
                  <p className="text-sm font-semibold">{c.user?.name || 'User'}:</p>
                  <p className="text-gray-700 mb-2">{c.body}</p>
                  <div className="flex gap-4 text-sm">
                    <button onClick={() => handleCommentLike(c.id, true)} className="text-green-600">👍 {c.likes?.length || 0}</button>
                    <button onClick={() => handleCommentLike(c.id, false)} className="text-red-600">👎 {c.dislikes?.length || 0}</button>
                    {auth?.user && (
                      <button onClick={() => setReplyTo(c.id)} className="text-blue-500 hover:underline">Reply</button>
                    )}
                  </div>
                  {c.replies && c.replies.length > 0 && (
                    <div className="mt-3 space-y-2 border-r pr-3">
                      {c.replies.map(reply => (
                        <div key={reply.id} className="border p-2 rounded bg-gray-50">
                          <p className="text-sm font-semibold">{reply.user?.name || 'User'}:</p>
                          <p className="text-gray-700 mb-1">{reply.body}</p>
                          <div className="flex gap-3 text-xs">
                            <button onClick={() => handleCommentLike(reply.id, true)} className="text-green-600">👍 {reply.likes?.length || 0}</button>
                            <button onClick={() => handleCommentLike(reply.id, false)} className="text-red-600">👎 {reply.dislikes?.length || 0}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold mb-2">Related Videos</h3>
          {relatedVideos.map(v => (
            <div key={v.id} className="border rounded p-2">
              <a href={`/watch/${v.slug}`} className="block">
                <img
                  src={v.thumbnail ? `/storage/${v.thumbnail}` : '/images/default-thumbnail.jpg'}
                  onError={(e) => { e.target.src = '/images/default-thumbnail.jpg'; }}
                  alt={v.title}
                  className="w-full h-28 object-cover rounded mb-2"
                />
                <span className="text-sm font-semibold text-blue-600 hover:underline block">
                  {v.title}
                </span>
              </a>
              <p className="text-xs text-gray-500">By: {v.user?.name || 'User'}</p>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

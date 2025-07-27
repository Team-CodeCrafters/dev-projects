import { useState } from 'react';
import { formatDate } from '../../utils/formatters';
import LikeIcon from '../../assets/icons/Like';
import DisLikeIcon from '../../assets/icons/DisLike';
import ReplyIcon from '../../assets/icons/Reply';
import SettingsIcon from '../../assets/icons/Setting';
import { ProfileIcon } from '../../assets/icons/ProfileIcon';

export default function Comment({ comment, isReply }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLiked(!liked);
  };

  const handleDislike = () => {
    if (liked) setLiked(false);
    setDisliked(!disliked);
  };

  return (
    <div
      className={`dark:bg-black-neutral rounded-md pb-2 pl-2 pt-3 ${isReply ? 'mb-2' : 'mb-3'}`}
    >
      <div className={`flex gap-3`}>
        <span className="focus:ring-primary group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full outline-none focus:ring-2">
          {comment.user?.profilePicture ? (
            <img
              src={comment.user.profilePicture}
              alt="profile icon"
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <ProfileIcon />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-heading text-sm font-semibold">
              {comment.user.username}
            </span>
            <span className="ml-1 text-xs text-gray-500 opacity-70 dark:text-white">
              {formatDate(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-500">Edited</span>
            )}
          </div>

          <p className="my-2 break-words leading-relaxed">{comment.message}</p>

          <div className="flex w-full items-center justify-end gap-1">
            <button
              className={`flex items-center gap-1 rounded px-2 py-1 text-sm ${
                liked ? 'text-blue-600' : ''
              }`}
              onClick={handleLike}
            >
              <LikeIcon size="size-4 md:size-5" />
              {comment.likeCount + (liked ? 1 : 0) || ''}
            </button>

            <button
              className={`flex items-center gap-1 rounded px-2 py-1 text-sm ${
                disliked ? 'text-red-600' : ''
              }`}
              onClick={handleDislike}
            >
              <DisLikeIcon size="size-4 md:size-5" />
              {comment.disLikeCount + (disliked ? 1 : 0) || ''}
            </button>

            <button
              className="flex items-center gap-1 rounded px-2 py-1 text-sm"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <ReplyIcon size="size-4 md:size-5" />
            </button>

            <button className="ml-auto flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-600 hover:bg-transparent/5">
              <SettingsIcon className="h-4 w-4" />
            </button>
          </div>

          {showReplyInput && (
            <div className="mt-3 flex gap-3">
              <span className="focus:ring-primary group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full outline-none focus:ring-2">
                {comment.user?.profilePicture ? (
                  <img
                    src={comment.user.profilePicture}
                    alt="profile icon"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <ProfileIcon />
                )}
              </span>
              <div className="mr-2 flex-1 md:mr-3">
                <input
                  type="text"
                  placeholder="Add a reply..."
                  className="w-full border-b border-gray-300 bg-transparent pb-1 text-sm outline-none focus:border-gray-900"
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    className="rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
                    onClick={() => setShowReplyInput(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="cursor-not-allowed rounded bg-blue-600 px-3 py-1 text-sm text-white opacity-50"
                    disabled
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="dark:border-white-dark border-black-lighter border-l pl-4">
          <div className="space-y-0">
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

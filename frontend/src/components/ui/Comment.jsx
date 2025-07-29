import { useEffect, useRef, useState } from 'react';
import { formatDate } from '../../utils/formatters';
import ReplyIcon from '../../assets/icons/Reply';
import { ProfileIcon } from '../../assets/icons/ProfileIcon';
import { DeleteIcon } from '../../assets/icons/Delete';
import SettingIcon from '../../assets/icons/Setting';
import EditIcon from '../../assets/icons/Edit';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userProfileAtom } from '../../store/atoms/userAtoms';
import { createAccountDialogAtom } from '../../store/atoms/dialog';
import useFetchData from '../../hooks/useFetchData';
import {
  commentEditAtom,
  projectCommentsAtomFamily,
  projectDetailsAtom,
  userPreviousInteraction,
  userVotedCommentsAtom,
} from '../../store/atoms/project';
import useNotification from '../../hooks/usePopup';
import { VoteIcon } from '../../assets/icons/Vote';

const CommentOptions = ({ comment }) => {
  const user = useRecoilValue(userProfileAtom);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const settingsBtnRef = useRef(null);

  if (comment?.user?.username !== user?.username) {
    return null;
  }

  return (
    <div className={`relative opacity-80 ${!!isSettingOpen && '!opacity-100'}`}>
      <button
        onClick={() => setIsSettingOpen((prev) => !prev)}
        ref={settingsBtnRef}
        className="focus:ring-primary absolutecursor-pointer group rounded-md p-1 outline-none focus:ring-2"
      >
        <SettingIcon size="size-5" />
      </button>
      <CommentsDropDown
        comment={comment}
        settingsBtnRef={settingsBtnRef}
        setIsSettingOpen={setIsSettingOpen}
        isSettingOpen={isSettingOpen}
      />
    </div>
  );
};

const CommentsDropDown = ({
  settingsBtnRef,
  setIsSettingOpen,
  isSettingOpen,
  comment,
}) => {
  const dropDownRef = useRef(null);
  const project = useRecoilValue(projectDetailsAtom);
  const { fetchData } = useFetchData();
  const setProjectComments = useSetRecoilState(
    projectCommentsAtomFamily(project.id),
  );
  const setEditMode = useSetRecoilState(commentEditAtom(comment.id));
  const showPop = useNotification();
  useEffect(() => {
    function checkClick(e) {
      if (!isSettingOpen) return;
      const clickedInsideDropdown =
        settingsBtnRef?.current?.contains(e.target) ||
        dropDownRef.current?.contains(e.target);

      if (!clickedInsideDropdown) {
        setIsSettingOpen(false);
      }
    }

    function checkKeyPress(e) {
      if (!isSettingOpen) return;

      if (e.key === 'Escape') setIsSettingOpen(false);
    }
    document.body.addEventListener('click', checkClick);
    document.body.addEventListener('keyup', checkKeyPress);
    return () => {
      document.body.removeEventListener('click', checkClick);
      document.body.removeEventListener('keyup', checkKeyPress);
    };
  }, [isSettingOpen]);

  async function deleteComment() {
    const options = {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId: comment.id,
      }),
    };

    const response = await fetchData('/comments/', options);

    if (response.success) {
      setProjectComments((prev) => {
        return prev.filter((prevComment) => prevComment.id !== comment.id);
      });
      showPop('info', 'comment was deleted');
    }
  }

  return (
    <div
      ref={dropDownRef}
      className={`dark:bg-black-medium duration-250 absolute right-0 top-[130%] z-[999] grid h-max w-max items-center rounded-md bg-white shadow-md transition-all ${isSettingOpen ? `visible translate-y-2 opacity-100` : `invisible translate-y-[-10%] opacity-0`}`}
    >
      <ul className="font-body flex min-w-max flex-col gap-1 p-2 py-3 text-left text-sm">
        <li className="hover:bg-white-medium dark:hover:bg-black-light cursor-pointer rounded-md px-3 py-2">
          <button
            onClick={deleteComment}
            className="text-error flex items-center gap-1"
          >
            <DeleteIcon size="size-4" />
            <span>Delete</span>
          </button>
        </li>
        <li className="hover:bg-white-medium dark:hover:bg-black-light cursor-pointer rounded-md px-3 py-2">
          <button
            onClick={() => setEditMode((prev) => !prev)}
            className="flex items-center gap-1"
          >
            <EditIcon size="size-4" />
            <span>Edit</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

const Comment = ({ comment, isReply }) => {
  const { fetchData } = useFetchData();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [editMode, setEditMode] = useRecoilState(commentEditAtom(comment.id));
  const [editedMessage, setEditedMessage] = useState(comment.message);
  const project = useRecoilValue(projectDetailsAtom);
  const setProjectComments = useSetRecoilState(
    projectCommentsAtomFamily(project.id),
  );
  const showPop = useNotification();

  async function submitEditedMessage() {
    const options = {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: editedMessage,
        commentId: comment.id,
      }),
    };

    const response = await fetchData('/comments/edit', options);

    if (response.success) {
      setProjectComments((prev) =>
        prev.map((prevComment) => {
          if (prevComment.id === comment.id) {
            return { ...prevComment, message: editedMessage, isEdited: true };
          } else {
            return prevComment;
          }
        }),
      );
      setEditMode(false);
      showPop('info', 'comment was edited');
    }
  }
  const ReplyComment = () => {
    const userProfile = useRecoilValue(userProfileAtom);
    const project = useRecoilValue(projectDetailsAtom);
    const { fetchData } = useFetchData();
    const setCreateAccountDialog = useSetRecoilState(createAccountDialogAtom);
    const [replyMessage, setReplyMessage] = useState('');
    const setProjectComments = useSetRecoilState(
      projectCommentsAtomFamily(project.id),
    );
    if (userProfile === null) {
      setCreateAccountDialog(true);
      return null;
    }
    async function handleReplyComment() {
      const options = {
        method: 'POST',
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: replyMessage,
          projectId: project.id,
          parentId: comment.id,
        }),
      };

      const response = await fetchData('/comments/new', options);

      if (response.success) {
        setShowReplyInput(false);
        setProjectComments((prev) => [...prev, response.data.comment]);
      }
    }

    return (
      <>
        <div className="mt-3 flex gap-3">
          <span className="focus:ring-primary group relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full outline-none focus:ring-2">
            {userProfile?.profilePicture ? (
              <img
                src={userProfile.profilePicture}
                alt="profile icon"
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <ProfileIcon />
            )}
          </span>
          <div className="mr-2 flex-1 md:mr-3">
            <textarea
              type="text"
              name="comment"
              id="discussion-comment"
              placeholder="Add a reply"
              rows="1"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="custom-scrollbar field-sizing-content dark:bg-black-neutral bg-white-medium focus:outline-primary dark:focus:outline-primary peer w-[90%] resize-y rounded-md border-none p-1 px-2 outline-none outline-1 outline-gray-300 placeholder:text-black placeholder:opacity-80 dark:outline-gray-500 dark:placeholder:text-white"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                className="rounded px-3 py-1 text-sm hover:bg-gray-100 hover:text-black"
                onClick={() => setShowReplyInput(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleReplyComment}
                className="bg-primary rounded px-3 py-1 text-sm text-white"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className={`dark:bg-black-neutral rounded-md pb-2 pl-2 pt-3 ${isReply ? 'mb-2' : 'mb-3'}`}
    >
      <div className="flex gap-1 sm:gap-2">
        <span className="focus:ring-primary group relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full outline-none focus:ring-2">
          {comment.user?.profilePicture ? (
            <img
              src={comment.user.profilePicture}
              alt="profile icon"
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <ProfileIcon />
          )}
        </span>
        <div className="relative min-w-0 flex-1">
          <div className="absolute right-1 top-1 z-50">
            <CommentOptions comment={comment} />
          </div>
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

          <div className="my-1 w-full break-words leading-relaxed">
            {!!editMode ? (
              <div className="flex w-full flex-col items-stretch gap-2">
                <textarea
                  type="text"
                  name="comment"
                  id="discussion-comment"
                  rows="1"
                  className="custom-scrollbar field-sizing-content dark:bg-black-neutral bg-white-medium focus:outline-primary dark:focus:outline-primary peer w-[90%] resize-y rounded-md border-none p-1 px-2 outline-none outline-1 outline-gray-300 placeholder:text-black placeholder:opacity-80 dark:outline-gray-500 dark:placeholder:text-white"
                  value={editedMessage}
                  onChange={(e) => {
                    setEditedMessage(e.target.value);
                  }}
                />
                <div className="flex gap-3">
                  <button
                    className="font-heading bg-primary self-start rounded px-3 py-1 text-sm"
                    onClick={submitEditedMessage}
                  >
                    Edit
                  </button>
                  <button
                    className="font-heading self-start rounded bg-gray-100 px-3 py-1 text-sm text-gray-600"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <span>{comment.message}</span>
            )}
          </div>
        </div>
      </div>
      <CommentReaction
        comment={comment}
        setShowReplyInput={setShowReplyInput}
      />
      {!!showReplyInput && <ReplyComment />}
      <ReplyComments parentComment={comment} />
    </div>
  );
};

const CommentReaction = ({ comment, setShowReplyInput }) => {
  const [commentVotes, setCommentVotes] = useState(
    comment.upvoteCount - comment.downvoteCount,
  );
  const [userVotedComments, setUserVotedComments] = useRecoilState(
    userVotedCommentsAtom,
  );
  const userInteraction = useRecoilValue(userPreviousInteraction(comment.id));
  const { fetchData } = useFetchData();

  async function handleCommentVote(toVote) {
    const alreadyVotedComment = userVotedComments.find(
      (votedComment) => votedComment.commentId === comment.id,
    );

    let voteChange = 0;

    if (alreadyVotedComment) {
      if (alreadyVotedComment.voteType === toVote) {
        setUserVotedComments((userComments) =>
          userComments.filter(
            (userComment) => userComment.commentId !== comment.id,
          ),
        );
        voteChange = toVote === 'UPVOTE' ? -1 : 1;
      } else {
        setUserVotedComments((userComments) =>
          userComments.map((prevComment) => {
            if (prevComment.commentId === comment.id) {
              return { ...prevComment, voteType: toVote };
            }
            return prevComment;
          }),
        );
        voteChange = toVote === 'UPVOTE' ? 2 : -2;
      }
    } else {
      setUserVotedComments((prev) => [
        ...prev,
        {
          commentId: comment.id,
          voteType: toVote,
        },
      ]);
      voteChange = toVote === 'UPVOTE' ? 1 : -1;
    }
    setCommentVotes(commentVotes + voteChange);

    // sending request after updating UI
    const token = localStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId: comment.id,
        voteType: toVote,
      }),
    };

    await fetchData('/comments/vote', options);
  }

  return (
    <>
      <div className="flex w-full items-center justify-start">
        <button
          className={`flex items-center gap-1 rounded px-2 py-1 text-sm hover:bg-transparent/30 ${
            userInteraction === 'UPVOTE' ? 'text-primary' : ''
          }`}
          onClick={() => handleCommentVote('UPVOTE')}
        >
          <VoteIcon size="size-4 md:size-5" />
        </button>
        <span>{commentVotes}</span>
        <button
          className={`flex items-center gap-1 rounded px-2 py-1 text-sm ${
            userInteraction === 'DOWNVOTE' ? 'text-error' : ''
          }`}
          onClick={() => handleCommentVote('DOWNVOTE')}
        >
          <VoteIcon size="size-4 md:size-5" style={'rotate-180'} />
        </button>
        <button
          className="flex items-center gap-1 rounded px-2 py-1 text-sm"
          onClick={() => setShowReplyInput((prev) => !prev)}
        >
          <ReplyIcon size="size-4 md:size-5" />
        </button>
      </div>
    </>
  );
};

const ReplyComments = ({ parentComment }) => {
  const project = useRecoilValue(projectDetailsAtom);
  const allComments = useRecoilValue(projectCommentsAtomFamily(project.id));

  const replies = allComments.filter(
    (comment) => comment.parentId === parentComment.id,
  );

  if (replies.length > 0) {
    return (
      <div className="dark:border-white-dark border-black-lighter border-l pl-1 sm:pl-3">
        <div className="space-y-0">
          {replies.map((reply) => (
            <Comment key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      </div>
    );
  }
};
export default Comment;

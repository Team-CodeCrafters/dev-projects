import { useEffect, useState } from 'react';
import useFetchData from '../../hooks/useFetchData';
import {
  commentsCountSelector,
  projectCommentsAtomFamily,
  projectDetailsAtom,
  userVotedCommentsAtom,
} from '../../store/atoms/project';
import { useRecoilState, useRecoilValue } from 'recoil';
import NoContentToDisplay from '../ui/NoContent';
import Loader from '../ui/Loader';
import Comment from '../ui/Comment';

const ProjectComments = () => {
  const { fetchData, loading } = useFetchData();
  const { fetchData: fetchUserCommentsData } = useFetchData();
  const project = useRecoilValue(projectDetailsAtom);
  const [projectComments, setProjectComments] = useRecoilState(
    projectCommentsAtomFamily(project.id),
  );
  const commentsCount = useRecoilValue(commentsCountSelector(project.id));
  const [userVotedComments, setUserVotedComments] = useRecoilState(
    userVotedCommentsAtom,
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (userVotedComments.length == 0 && token) {
      fetchUserComments(token);
    }
    if (projectComments) {
      return;
    }

    async function fetchUserComments(token) {
      const response = await fetchUserCommentsData('/comments/user-votes', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.success) {
        setUserVotedComments(response.data?.votedComments);
      }
    }
    async function fetchProjectComments() {
      const response = await fetchData(`/comments/${project.id}`);
      const comments = response.data?.comments;
      setProjectComments(comments);
    }
    fetchProjectComments();
  }, [project.id]);

  if ((loading || loading === undefined) && !projectComments) {
    return (
      <div className="grid h-full place-items-center">
        <Loader primaryColor={true} />
      </div>
    );
  }

  if (projectComments && projectComments.length > 0) {
    return (
      <div>
        {commentsCount > 0 && (
          <h1 className="font-heading mb-3 text-lg font-semibold">
            comments
            <span className="bg-accent font-heading ml-2 aspect-square rounded-full p-1 px-2 text-center text-sm text-white">
              {commentsCount}
            </span>
          </h1>
        )}
        {projectComments.map(
          (comment) =>
            comment.parentId === null && (
              <Comment key={comment.id} comment={comment} />
            ),
        )}
      </div>
    );
  } else {
    return (
      <NoContentToDisplay
        heading={'No discussions yet'}
        body={'Be the first to start a conversation!'}
      />
    );
  }
};

export default ProjectComments;

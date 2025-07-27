import { useEffect, useState } from 'react';
import useFetchData from '../../hooks/useFetchData';
import {
  projectCommentsAtomFamily,
  projectDetailsAtom,
} from '../../store/atoms/project';
import { useRecoilState, useRecoilValue } from 'recoil';
import NoContentToDisplay from '../ui/NoContent';
import Loader from '../ui/Loader';
import { structureComments } from '../../utils/formatters';
import Comment from '../ui/Comment';
const ProjectComments = () => {
  const { fetchData, loading } = useFetchData();
  const project = useRecoilValue(projectDetailsAtom);
  const [commentsCount, setCommentsCount] = useState();
  const [projectComments, setProjectComments] = useRecoilState(
    projectCommentsAtomFamily(project.id),
  );
  useEffect(() => {
    if (projectComments) {
      return;
    }
    async function fetchProjectComments() {
      const response = await fetchData(`/comments/${project.id}`);
      const comments = response.data?.comments;
      setCommentsCount(comments.length);
      setProjectComments(structureComments(comments));
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
        <h1 className="font-heading mb-3 text-lg font-semibold">
          {commentsCount} comments
        </h1>
        {projectComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
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

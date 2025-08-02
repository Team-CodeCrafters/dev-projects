import { useState } from 'react';
import ProjectComments from './ProjectComments';
import useFetchData from '../../hooks/useFetchData';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  projectCommentsAtomFamily,
  projectDetailsAtom,
} from '../../store/atoms/project';
import usePopupNotification from '../../hooks/usePopup';

const Discussions = () => {
  const showPop = usePopupNotification();
  const [comment, setComment] = useState('');
  const project = useRecoilValue(projectDetailsAtom);
  const setProjectComments = useSetRecoilState(
    projectCommentsAtomFamily(project.id),
  );
  const { fetchData } = useFetchData();
  async function postComment() {
    const options = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: comment,
        projectId: project.id,
        parentId: null,
      }),
    };
    const response = await fetchData('/comments/new', options);
    if (response.success) {
      setProjectComments((prev) => [response.data.comment, ...prev]);
    } else {
      showPop('error', response.error);
    }
  }

  return (
    <>
      <div className="h-full w-full">
        <textarea
          type="text"
          name="comment"
          id="discussion-comment"
          placeholder={'Add a comment'}
          rows="2"
          className="custom-scrollbar field-sizing-content dark:bg-black-neutral bg-white-medium focus:outline-primary dark:focus:outline-primary peer w-full resize-none rounded-md border-none p-2 outline-none outline-1 outline-black placeholder:text-black placeholder:opacity-80 sm:p-3 dark:outline-gray-500 dark:placeholder:text-white"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        ></textarea>
        <div className="mt-1 flex justify-end gap-1 sm:gap-3">
          <button
            onClick={postComment}
            className={`bg-accent hover:bg-primary-dark font-heading block rounded-md px-3 py-1 text-sm text-white transition-all duration-150 ease-in active:scale-95 ${comment ? 'visible' : 'invisible'}`}
          >
            Comment
          </button>
          <button
            onClick={() => setComment('')}
            className={`dark:bg-white-medium bg-black-lighter hover:bg-primary-dark font-heading block rounded-md px-3 py-1 text-sm font-medium text-white transition-all duration-150 ease-in active:scale-95 dark:text-black ${comment ? 'visible' : 'invisible'}`}
          >
            Cancel
          </button>
        </div>
        <ProjectComments />
      </div>
    </>
  );
};

export default Discussions;

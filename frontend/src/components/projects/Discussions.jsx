import { useState } from 'react';
import InformationIcon from '../../assets/icons/Information';
import NoContentToDisplay from '../ui/NoContent';
import ProjectComments from './ProjectComments';

const Discussions = () => {
  const [comment, setComment] = useState('');
  function postComment() {
    console.log("post the user's comment");
  }

  return (
    <>
      <div className="w-full">
        <textarea
          type="text"
          W
          name="comment"
          id="discussion-comment"
          placeholder={'Add a comment'}
          rows="2"
          className="custom-scrollbar field-sizing-content dark:bg-black-neutral bg-white-medium focus:outline-primary dark:focus:outline-primary w-full resize-none rounded-xl border-none p-4 outline-none outline-1 outline-gray-300 placeholder:text-black placeholder:opacity-80 dark:outline-gray-500 dark:placeholder:text-white"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <button className="bg-white-medium hover:bg-primary-dark font-heading ml-auto mt-2 block rounded-md px-3 py-1 font-medium text-black transition">
          Post
        </button>

        <ProjectComments />
      </div>
    </>
  );
};

export default Discussions;

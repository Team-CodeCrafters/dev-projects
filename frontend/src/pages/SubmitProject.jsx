import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InputField from '../components/ui/InputField';

function handleSubmit(e) {
  e.preventDefault();
}

const SubmitProject = () => {
  const { id } = useParams();

  useEffect(() => {}, [id]);
  return (
    <>
      <div className="bg-white-medium dark:bg-black-medium outline-black-dark mb-96 max-w-2xl rounded-lg p-3 md:p-5">
        <h1 className="font-hea ding mb-5 text-xl font-medium tracking-wide md:text-2xl">
          submit project
        </h1>
        <form onSubmit={handleSubmit} className="">
          <div>
            <label htmlFor="">Title</label>
            <InputField inputStyles={'!py-3 text-sm'} />
          </div>
        </form>
      </div>
    </>
  );
};

export default SubmitProject;

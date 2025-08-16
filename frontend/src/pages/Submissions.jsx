import { useEffect, useState } from 'react';
import useFetchData from '../hooks/useFetchData';
import Loader from '../components/ui/Loader';
import SubmissionCard from '../components/projects/SubmissionCard';

const Submissions = () => {
  const { fetchData, loading } = useFetchData();
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    document.title = 'Dev Projects | Submissions';
    async function fetchSubmissions() {
      const response = await fetchData('/submissions/all');
      setSubmissions(response.data.submissions);
    }
    fetchSubmissions();
  }, []);

  return (
    <div className="bg-white-medium dark:bg-black-medium relative mx-auto h-full w-[95vw] rounded-lg p-3 sm:w-full md:p-5 md:pl-4">
      <h1 className="font-heading mb-2 place-self-start text-xl font-medium tracking-wide md:text-2xl">
        Submissions
      </h1>
      {submissions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pb-8 md:grid-cols-2 md:items-stretch">
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              project={submission}
              user={submission.user}
            />
          ))}
        </div>
      ) : (
        loading && (
          <div className="relative top-24 flex justify-center">
            <Loader primaryColor={true} />
          </div>
        )
      )}
    </div>
  );
};

export default Submissions;

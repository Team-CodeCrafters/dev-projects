import { useEffect } from 'react';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../ui/Loader';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  projectDetailsAtom,
  projectSubmissionsAtomFamily,
} from '../../store/atoms/project';

import NoContentToDisplay from '../ui/NoContent';
import SubmissionCard from './SubmissionCard';
const Submissions = () => {
  const { fetchData, loading } = useFetchData();
  const project = useRecoilValue(projectDetailsAtom);
  const [projectSubmissions, setProjectSubmissions] = useRecoilState(
    projectSubmissionsAtomFamily(project.id),
  );
  useEffect(() => {
    if (projectSubmissions) {
      return;
    }

    async function fetchSubmissions() {
      const response = await fetchData(`/submissions/all/${project.id}`);
      setProjectSubmissions(response.data?.submissions);
    }
    fetchSubmissions();
  }, [project.id]);

  if ((loading || loading === undefined) && !projectSubmissions) {
    return (
      <div className="grid h-full place-items-center">
        <Loader primaryColor={true} />
      </div>
    );
  }

  if (projectSubmissions && projectSubmissions.length > 0) {
    return (
      <div className="flex flex-col items-center">
        {projectSubmissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            project={submission}
            user={submission.user}
          />
        ))}
      </div>
    );
  } else {
    return (
      <NoContentToDisplay
        heading={'No submissions yet!'}
        body={'projects submit by users are displayed here'}
      />
    );
  }
};

export default Submissions;

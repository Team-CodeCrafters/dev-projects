import { useEffect } from 'react';
import { BookmarkedProjectsAtom } from '../store/atoms/project';
import useFetchData from '../hooks/useFetchData';
import { useRecoilState } from 'recoil';
import ProjectCard from '../components/projects/ProjectCard';
import Loader from '../components/ui/Loader';
import { PopupNotification } from '../components/ui/PopupNotification';
import { useNavigate } from 'react-router-dom';
import { ListIcon } from '../assets/icons/List';
import { BookmarkIcon } from '../assets/icons/Bookmark';
const Bookmarks = () => {
  const { fetchData, loading, error } = useFetchData();
  const [bookmarks, setBookmarks] = useRecoilState(BookmarkedProjectsAtom);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Dev Projects | Bookmarks';
    if (bookmarks.length > 0) return;

    async function fetchBookmarks() {
      const token = localStorage.getItem('token');
      const options = {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await fetchData('/bookmark/', options);
      if (response.success) {
        setBookmarks(response.data.bookmarkedProjects);
      }
    }
    fetchBookmarks();
  }, []);

  function redirectToDetails(projectId) {
    navigate(`/project/${projectId}`);
  }
  return (
    <>
      {!!error && <PopupNotification type="error" text={error} />}
      <div className="bg-white-medium dark:bg-black-medium outline-black-dark ml-2 grid min-h-[50%] max-w-2xl place-items-center rounded-lg p-3 md:p-5">
        {console.log(bookmarks)}
        {bookmarks.length > 0 ? (
          <>
            <h1 className="font-heading mb-2 place-self-start text-xl font-medium tracking-wide md:text-2xl">
              Bookmarks
            </h1>
            {bookmarks.map((bookmark) => {
              return (
                <ProjectCard
                  key={bookmark.id}
                  project={bookmark.project}
                  onClick={() => redirectToDetails(bookmark.project.id)}
                />
              );
            })}
          </>
        ) : loading ? (
          <Loader primaryColor={true} />
        ) : (
          !loading && bookmarks.length == 0 && <EmptyBookmarks />
        )}
      </div>
    </>
  );
};

const EmptyBookmarks = () => {
  const navigate = useNavigate();

  function goToProjectsPage() {
    navigate('/projects');
  }

  return (
    <div className="bg-white-medium dark:bg-black-medium m-4 rounded-lg p-3">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="dark:bg-black-light bg-white-dark mb-6 rounded-full p-6">
          <BookmarkIcon />
        </div>
        <h2 className="font-heading dark:text-white-light mb-3 text-xl font-medium tracking-wide">
          No bookmarks are saved
        </h2>
        <p className="dark:text-white-medium mb-8 max-w-md text-balance opacity-80">
          You will see the saved projects here
        </p>
        <button
          onClick={goToProjectsPage}
          className="bg-primary hover:bg-primary/90 duration-250 font-heading rounded-lg px-8 py-3 font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
        >
          Explore Projects
        </button>
      </div>
    </div>
  );
};
export default Bookmarks;

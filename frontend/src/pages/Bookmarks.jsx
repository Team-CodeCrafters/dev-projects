import { useEffect } from 'react';
import { BookmarkedProjectsAtom } from '../store/atoms/project';
import useFetchData from '../hooks/useFetchData';
import { useRecoilState, useSetRecoilState } from 'recoil';
import ProjectCard from '../components/projects/ProjectCard';
import Loader from '../components/ui/Loader';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon } from '../assets/icons/Bookmark';
import { DeleteIcon } from '../assets/icons/Delete';
import usePopupNotication from '../hooks/usePopup';
import NoContentToDisplay from '../components/ui/NoContent';
const Bookmarks = () => {
  const { fetchData, loading, error } = useFetchData();
  const [bookmarks, setBookmarks] = useRecoilState(BookmarkedProjectsAtom);
  const showPopup = usePopupNotication();
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
      } else {
        showPopup('error', response.error);
      }
    }
    fetchBookmarks();
  }, []);

  const DeleteBookmarkButton = ({ bookmarkId }) => {
    const setBookmarkProject = useSetRecoilState(BookmarkedProjectsAtom);
    const { fetchData } = useFetchData();

    async function removeBookmark(e) {
      e.stopPropagation();
      e.preventDefault();
      const token = localStorage.getItem('token');
      const options = {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookmarkId }),
      };

      const { success, error } = await fetchData('/bookmark/', options);
      if (success) {
        setBookmarkProject((prev) =>
          prev.filter((bookmark) => bookmark.id !== bookmarkId),
        );
      } else {
        showPopup('error', error);
      }
    }

    return (
      <>
        <button
          onClick={removeBookmark}
          className="dark:hover:bg-black-lighter hover:bg-white-dark absolute right-3 top-3 z-10 p-2 opacity-80"
        >
          <DeleteIcon />
        </button>
      </>
    );
  };

  return (
    <>
      <div className="bg-white-medium dark:bg-black-medium relative mx-auto h-full w-[95vw] rounded-lg p-3 sm:w-full md:ml-2 md:p-5">
        {bookmarks.length > 0 ? (
          <>
            <h1 className="font-heading mb-2 place-self-start text-xl font-medium tracking-wide md:text-2xl">
              Bookmarks
            </h1>
            <div className="mt-2 flex w-full flex-wrap">
              {bookmarks.map((bookmark) => {
                return (
                  <ProjectCard
                    key={bookmark.id}
                    styles={'sm:max-w-[20rem] w-full pt-6'}
                    project={bookmark.project}
                    href={`/project/${bookmark.project.id}`}
                  >
                    <DeleteBookmarkButton bookmarkId={bookmark.id} />
                  </ProjectCard>
                );
              })}
            </div>
          </>
        ) : loading || loading === undefined ? (
          <div className="relative top-40 flex h-full justify-center">
            <Loader primaryColor={true} />
          </div>
        ) : (
          !loading &&
          bookmarks.length == 0 && (
            <NoContentToDisplay
              Icon={BookmarkIcon}
              heading={'No bookmarks are saved'}
              body={' You will see the saved projects here'}
              buttonText={'explore projects'}
              href={'/projects'}
            />
          )
        )}
      </div>
    </>
  );
};

export default Bookmarks;

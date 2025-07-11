import { atom, selector } from 'recoil';
import { userProjectsAtom } from './userProjects';

export const projectDetailsAtom = atom({
  key: 'projectDetailsAtom',
  default: null,
});
export const projectDetailsTab = atom({
  key: 'projectDetailsTab',
  default: 'get-started',
});

export const BookmarkedProjectsAtom = atom({
  key: 'BookmarkedProjectsAtom',
  default: [],
});

export const similarProjectsAtom = atom({
  key: 'similarProjectsAtom',
  default: [],
});

export const projectStartedSelector = selector({
  key: 'isProjectStarted',
  get: ({ get }) => {
    const project = get(projectDetailsAtom);
    const userProjects = get(userProjectsAtom);
    if (!project || userProjects.length <= 0) return false;

    const isStarted = userProjects.some(
      ({ projectId }) => projectId === project.id,
    );
    return isStarted;
  },
});

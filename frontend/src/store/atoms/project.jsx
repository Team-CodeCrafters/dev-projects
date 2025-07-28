import { atom, atomFamily, selector } from 'recoil';
import { userProjectsAtom } from './userProjects';

export const projectDetailsAtom = atom({
  key: 'projectDetailsAtom',
  default: null,
});
export const projectDetailsActiveTab = atom({
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

export const projectsAtom = atom({
  key: 'projectsAtom',
  default: null,
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

export const projectSubmissionsAtomFamily = atomFamily({
  key: 'projectSubmissionsAtomFamily',
  default: null,
});

export const projectCommentsAtomFamily = atomFamily({
  key: 'projectCommentsAtomFamily',
  default: null,
});

export const commentEditAtom = atomFamily({
  key: 'commentEditAtom',
  default: false,
});

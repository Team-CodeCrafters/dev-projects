import { useRecoilState, useSetRecoilState } from 'recoil';
import { screenSizeAtom } from '../store/atoms/dashboardLayoutAtoms';
import { useEffect } from 'react';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useRecoilState(screenSizeAtom);
  useEffect(() => {
    function updateScreenSize() {
      const height = window.innerHeight;
      const width = window.innerWidth;
      setScreenSize({ height, width });
    }
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);
  return screenSize;
};

export default useScreenSize;

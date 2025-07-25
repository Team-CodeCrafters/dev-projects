import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

const TabsLayout = ({ tabs, activeTabAtom }) => {
  const activeTab = useRecoilValue(activeTabAtom);

  const getIndicatorPosition = useMemo(() => {
    const idx = tabs.findIndex((tab) => tab.value === activeTab);
    // calculating based on width of indicator
    return idx * 32 * 4;
  }, [activeTab]);

  return (
    <div className="scrollbar-thin custom-scrollbar mt-7 min-h-14 max-w-full grow-0 overflow-x-auto">
      <ul className="border-black-lighter flex w-max max-w-56 border-b border-opacity-40 dark:border-black">
        {tabs.map((tab) => (
          <TabElement
            key={tab.value}
            text={tab.label}
            currentTab={tab.value}
            activeTabAtom={activeTabAtom}
          />
        ))}
      </ul>

      <div className="relative h-[2px] w-full">
        <div
          className="bg-primary duration-450 absolute top-0 h-[2px] w-32 transition-all"
          style={{ left: `${getIndicatorPosition}px` }}
        ></div>
      </div>
    </div>
  );
};

const TabElement = ({ text, currentTab, activeTabAtom }) => {
  const [currentActiveTab, setCurrentActiveTab] = useRecoilState(activeTabAtom);

  return (
    <li className="flex cursor-pointer select-none">
      <label className="dark:bg-black-light dark:hover:bg-black-lighter hover:bg-white-dark has-[:checked]:text-primary w-32 cursor-pointer rounded-md p-2 px-4 text-center font-semibold outline outline-transparent transition-colors has-[:checked]:outline">
        <input
          type="radio"
          name={currentTab}
          value={text}
          className="sr-only"
          checked={currentTab === currentActiveTab}
          onChange={() => setCurrentActiveTab(currentTab)}
        />
        {text}
      </label>
    </li>
  );
};

export default TabsLayout;

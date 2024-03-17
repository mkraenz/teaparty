import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

const SelectionContext = createContext<{
  /** id of the selected convoy */
  selected: string;
  setSelected: (id: string) => void;
  setSelectedWithNavEffect: (id: string) => void;
}>({
  selected: '',
  setSelected: () => {},
  setSelectedWithNavEffect: () => {},
});

export const SelectionProvider: FC<
  PropsWithChildren<{ logicFps?: number }>
> = ({ children }) => {
  const nav = useNavigate();
  const [selected, setSelected] = useState('');
  const [selectionTime, setSelectionTime] = useState(0);

  const setSelectedWithNavEffect = useCallback(
    (val: string) => {
      setSelected(val);
      const isDoubleClick = selectionTime > Date.now() - 300;
      if (isDoubleClick) {
        nav(`/convoys/${val}`);
      }
      setSelectionTime(Date.now());
    },
    [selectionTime]
  );

  return (
    <SelectionContext.Provider
      value={{ selected, setSelected, setSelectedWithNavEffect }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useConvoySelector = () => useContext(SelectionContext);

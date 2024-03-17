import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

const SelectionContext = createContext<{
  /** id of the selected convoy */
  selected: string;
  setSelected: (id: string) => void;
}>({
  selected: '',
  setSelected: () => {},
});

export const SelectionProvider: FC<
  PropsWithChildren<{ logicFps?: number }>
> = ({ children }) => {
  const [selected, setSelected] = useState('');

  return (
    <SelectionContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useConvoySelector = () => useContext(SelectionContext);

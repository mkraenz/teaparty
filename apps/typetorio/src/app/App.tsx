import { Box, Heading, Input, Text } from '@chakra-ui/react';
import { sample } from 'lodash';
import {
  ChangeEventHandler,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

const words = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'].map((x) =>
  x.toUpperCase()
);
const keywords = {
  start: {
    text: 'START',
    action: 'start' as const,
  },
};

const getRandomNextWord = (previousWord: string): string => {
  const randomWord = sample(words) as string;
  if (previousWord === randomWord) {
    return getRandomNextWord(previousWord);
  }
  return randomWord;
};

const reducer = (
  state: typeof initialState,
  action:
    | { type: 'start' }
    | { type: 'char typed'; payload: { currentWord: string } }
    | { type: 'word completed'; payload: { nextWord: string } }
) => {
  if (action.type === 'start') {
    return {
      ...state,
      current: '',
      nextWord: getRandomNextWord(''),
      points: 0,
      resumed: true,
    };
  }

  if (action.type === 'char typed') {
    const newCurrent = action.payload.currentWord;
    const madeATypo = !state.nextWord.startsWith(newCurrent);
    if (madeATypo) {
      return state;
    }
    return {
      ...state,
      current: newCurrent,
    };
  }

  if (action.type === 'word completed') {
    return {
      ...state,
      points: state.points + 1,
      current: '',
      nextWord: action.payload.nextWord,
    };
  }

  return state;
};

const initialState = {
  current: '',
  nextWord: keywords.start.text,
  points: 0,
  resumed: false,
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [timeInSec, setTime] = useState(0);
  const timerRef = useRef(
    undefined as ReturnType<typeof setInterval> | undefined
  );
  useEffect(() => {
    if (state.resumed) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      return () => {
        clearInterval(timerRef.current);
      };
    }
  }, [timerRef, state.resumed]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value.toUpperCase();
    dispatch({
      type: 'char typed' as const,
      payload: { currentWord: inputValue },
    });
  };

  useEffect(() => {
    if (state.current === keywords.start.text) {
      dispatch({ type: keywords.start.action });
      return;
    }
    if (state.current === state.nextWord) {
      dispatch({
        type: 'word completed',
        payload: { nextWord: getRandomNextWord(state.nextWord) },
      });
    }
  }, [state.current, state.nextWord]);

  return (
    <div>
      <Heading as="h1">Typetorio</Heading>
      <Text>How to play: Type the words</Text>
      <Box
        style={{ position: 'relative' }}
        // ::after must be used with containers. input element is not a container.
        _after={{
          zIndex: 100,
          position: 'absolute',
          content: `"${state.nextWord}"`,
          left: '17px',
          top: 2,
          color: 'gray.500',
        }}
      >
        <Input
          autoFocus
          spellCheck={false}
          value={state.current}
          onChange={handleInputChange}
          style={{ position: 'relative', color: 'white', zIndex: 200 }}
        />
      </Box>
      <Text>Time: {timeInSec}</Text>
      <Text>Points: {state.points}</Text>
    </div>
  );
};

export default App;

import { HStack, Radio, RadioGroup } from '@chakra-ui/react';
import { FC } from 'react';

type Props = {
  setGamespeed: (speed: string) => void;
  gamespeed: number;
};

const Settings: FC<Props> = ({ setGamespeed, gamespeed }) => {
  return (
    <RadioGroup onChange={setGamespeed} value={gamespeed.toString()}>
      <HStack>
        <Radio value={'0'}>0x</Radio>
        <Radio value={'0.1'}>0.1x</Radio>
        <Radio value={'1'}>1x</Radio>
        <Radio value={'2'}>2x</Radio>
        <Radio value={'3'}>3x</Radio>
        <Radio value={'10'}>10x</Radio>
        <Radio value={'100'}>100x</Radio>
      </HStack>
    </RadioGroup>
  );
};

export default Settings;

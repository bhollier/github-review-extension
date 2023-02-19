import {
  Box,
  BoxProps,
  FormControl,
  FormLabel,
  Heading,
  Switch,
  useColorMode,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React from 'react';

interface AppearanceProps extends BoxProps {}

const Appearance = ({ ...props }: AppearanceProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box {...props}>
      <Heading size="md" mb={3}>
        Appearance
      </Heading>
      <FormControl display="flex" alignItems="center">
        <Switch
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
          mr={3}
        />
        <FormLabel mb={0}>Dark Mode</FormLabel>
        {colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
      </FormControl>
    </Box>
  );
};

export default Appearance;

import React from 'react';
import {
  Flex,
  FlexProps,
  Heading,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { RepeatIcon, SettingsIcon } from '@chakra-ui/icons';

interface HeaderProps extends FlexProps {
  handleRefresh: () => void;
}

const Header = ({ handleRefresh, ...props }: HeaderProps) => {
  const headerBg = useColorModeValue('gray.100', 'gray.900');

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <Flex
      position="fixed"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      top={0}
      left={0}
      zIndex={200}
      backgroundColor={headerBg}
      {...props}
    >
      <Heading size="sm" pl={4}>
        Github Review Extension
      </Heading>
      <Flex mr={1} gap={1}>
        <IconButton
          aria-label="Refresh"
          icon={<RepeatIcon />}
          onClick={handleRefresh}
        />
        <IconButton
          aria-label="Options"
          icon={<SettingsIcon />}
          onClick={handleOpenOptions}
        />
      </Flex>
    </Flex>
  );
};

export default Header;

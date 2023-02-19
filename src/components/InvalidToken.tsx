import React from 'react';
import { Link, Text, TextProps } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

interface InvalidTokenProps extends TextProps {
  alreadyOnOptionsPage?: boolean;
}

const InvalidToken = ({
  alreadyOnOptionsPage,
  ...props
}: InvalidTokenProps) => {
  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  if (alreadyOnOptionsPage) {
    return <Text {...props}>Invalid API Token!</Text>;
  }

  return (
    <Text {...props}>
      Invalid API Token, go to the{' '}
      <Link onClick={handleOpenOptions}>
        <SettingsIcon mx={1} mb={1} />
        Options
      </Link>{' '}
      to set one
    </Text>
  );
};

export default InvalidToken;

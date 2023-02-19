import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

import Repositories from '../../components/options/Repositories';
import Filters from '../../components/options/Filters';
import Appearance from '../../components/options/Appearance';
import Authorisation from '../../components/options/Authorisation';

const App = () => (
  <Box py={5} px={8}>
    <Heading mb={4}>Github Review Extension Configuration Options</Heading>
    <Repositories mb={4} />
    <Filters mb={4} />
    <Appearance mb={4} />
    <Authorisation mb={4} />
  </Box>
);

export default App;

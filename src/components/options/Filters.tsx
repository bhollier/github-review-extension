import React, { useEffect, useState } from 'react';
import {
  Box,
  BoxProps,
  FormControl,
  FormControlProps,
  FormLabel,
  Heading,
  Switch,
} from '@chakra-ui/react';

import { FilterOptions } from '../../common/types';
import { FILTER_OPTIONS_DEFAULT } from '../../common/constants';

interface FilterOptionProps extends FormControlProps {
  isChecked: boolean;
  isDisabled: boolean;
  handleSwitch: (newValue: boolean) => void;
  children: React.ReactChildren | string;
}

const FilterOption = ({
  isChecked,
  isDisabled,
  handleSwitch,
  children,
  ...props
}: FilterOptionProps) => (
  <FormControl mb={2} display="flex" alignItems="center" {...props}>
    <Switch
      mr={3}
      isChecked={isChecked}
      isDisabled={isDisabled}
      onChange={() => handleSwitch(!isChecked)}
    />
    <FormLabel mb={0}>{children}</FormLabel>
  </FormControl>
);

interface FiltersProps extends BoxProps {}

const Filters = ({ ...props }: FiltersProps) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(
    FILTER_OPTIONS_DEFAULT
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const retrieveFilterOptions = async () => {
      setIsLoading(true);
      const { filters: savedFilterOptions } = await chrome.storage.sync.get({
        filters: FILTER_OPTIONS_DEFAULT,
      });
      setFilterOptions(savedFilterOptions);
      setIsLoading(false);
    };
    retrieveFilterOptions();
  }, []);

  const updateFilterOption = (
    newValue: boolean,
    ...filters: (keyof FilterOptions)[]
  ) => {
    const saveFilterOptions = async (newFilterOptions: FilterOptions) => {
      await chrome.storage.sync.set({ filters: newFilterOptions });
    };
    const newFilterOptions: FilterOptions = {
      ...filterOptions,
    };
    filters.forEach(filter => {
      newFilterOptions[filter] = newValue;
    });
    setFilterOptions(newFilterOptions);
    saveFilterOptions(newFilterOptions);
  };

  return (
    <Box {...props}>
      <Heading size="md" mb={3}>
        Filters
      </Heading>
      <FilterOption
        isChecked={filterOptions.includeAssigned}
        isDisabled={isLoading}
        handleSwitch={newValue =>
          updateFilterOption(newValue, 'includeAssigned', 'includeAssignedToMe')
        }
      >
        Include PRs with any assignee
      </FilterOption>
      <FilterOption
        isChecked={filterOptions.includeAssignedToMe}
        isDisabled={isLoading || filterOptions.includeAssigned}
        handleSwitch={newValue =>
          updateFilterOption(newValue, 'includeAssignedToMe')
        }
      >
        Include PRs assigned to me
      </FilterOption>
      <FilterOption
        isChecked={filterOptions.includeBots}
        isDisabled={isLoading}
        handleSwitch={newValue => updateFilterOption(newValue, 'includeBots')}
      >
        Include PRs from bots
      </FilterOption>
      <FilterOption
        isChecked={filterOptions.includeDrafts}
        isDisabled={isLoading}
        handleSwitch={newValue => updateFilterOption(newValue, 'includeDrafts')}
      >
        Include drafted PRs
      </FilterOption>
    </Box>
  );
};

export default Filters;

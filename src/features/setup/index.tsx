import { createSelector } from '@reduxjs/toolkit';
import { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, selectTopics, startQuiz } from '../../store';
import { Button } from '../../ui/button';
import { ButtonSet } from '../../ui/button/button-set';
import { Icon } from '../../ui/icon';
import { InputBox } from '../../ui/input-box';
import { Option } from '../../ui/option';
import { OptionList } from '../../ui/option/option-list';
import { Card } from '../card';
import { CUSTOM_DATA_EXAMPLE } from './constants';

// Selects a unique set of item topics (falling back to the task text when needed).
const selectAvailableTopics = createSelector(
  [(state: RootState) => state.kwyjibo.items],
  items => [...new Set(items.map(({ topic, task }) => topic || task))].sort((a, b) => a.localeCompare(b))
);

// Selects a set of item counts keyed by each unique topic.
const selectItemCounts = createSelector(
  [(state: RootState) => state.kwyjibo.items],
  items =>
    items.reduce<Record<string, number>>((counts, { topic, task }) => {
      counts[topic || task] = (counts[topic || task] ?? 0) + 1;
      return counts;
    }, {})
);

export const Setup = ({
  customData,
  handleTextChange
}: {
  customData: string;
  handleTextChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const configData = useSelector((state: RootState) => state.kwyjibo.configData);
  const availableTopics = useSelector(selectAvailableTopics);
  const itemCounts = useSelector(selectItemCounts);
  const selectedTopics = useSelector((state: RootState) => state.kwyjibo.selectedTopics);

  const toggleTopic = (topic: string) => {
    const nextSelection = selectedTopics.includes(topic)
      ? selectedTopics.filter(value => value !== topic)
      : [...selectedTopics, topic];
    dispatch(selectTopics(nextSelection));
  };

  const handleStartQuiz = () => {
    dispatch(startQuiz());
  };

  return (
    <Card
      heading={configData.heading || 'What do you want to work on today?'}
      intro={configData.intro}
    >
      {availableTopics.length ? (
        <OptionList label="Preloaded cards:">
          {availableTopics.map(topic => {
            let itemCountText = '';
            if (itemCounts[topic] > 1) {
              itemCountText = ` (${itemCounts[topic]})`;
            }
            return (
              <Option
                key={topic}
                value={topic}
                label={`${topic}${itemCountText}`}
                checked={selectedTopics.includes(topic)}
                onChange={() => toggleTopic(topic)}
              />
            );
          })}
        </OptionList>
      ) : null}

      <InputBox
        label="Custom card data:"
        placeholder={CUSTOM_DATA_EXAMPLE}
        value={customData}
        onChange={handleTextChange}
      />

      <ButtonSet>
        <Button
          disabled={!selectedTopics.length && !customData}
          onClick={handleStartQuiz}
        >
          <Icon name="point-right" />
          Start
        </Button>
      </ButtonSet>
    </Card>
  );
};

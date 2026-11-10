import { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LANG } from '../../constants';
import { hasRemoteBlock } from '../../processing/has-remote-block';
import { parseCustomData } from '../../processing/parse-custom-data';
import { parseFileData } from '../../processing/parse-file-data';
import { resolveRemoteText } from '../../processing/resolve-remote-text';
import { AppDispatch, RootState, selectTopics, startDeck } from '../../store';
import { selectAvailableTopics } from '../../store/select-available-topics';
import { selectItemCounts } from '../../store/select-item-counts';
import { Button } from '../../ui/button';
import { ButtonSet } from '../../ui/button/button-set';
import { Icon } from '../../ui/icon';
import { InputBox } from '../../ui/input-box';
import { Option } from '../../ui/option';
import { OptionList } from '../../ui/option/option-list';
import { Card } from '../card';
import { CUSTOM_DATA_EXAMPLE } from './constants';

export const Setup = ({
  customData,
  handleTextChange,
}: {
  customData: string;
  handleTextChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const configData = useSelector((state: RootState) => state.kwyjibo.configData);
  const persistedCustomData = useSelector((state: RootState) => state.kwyjibo.customData);
  const availableTopics = useSelector(selectAvailableTopics);
  const itemCounts = useSelector(selectItemCounts);
  const selectedTopics = useSelector((state: RootState) => state.kwyjibo.selectedTopics);

  const toggleTopic = (topic: string) => {
    const nextSelection = selectedTopics.includes(topic)
      ? selectedTopics.filter((value) => value !== topic)
      : [...selectedTopics, topic];
    dispatch(selectTopics(nextSelection));
  };

  const handleStartDeck = async () => {
    const startCustomData = customData === persistedCustomData ? customData : persistedCustomData;

    if (!hasRemoteBlock(startCustomData) && !/https?:\/\//i.test(startCustomData)) {
      const parsedCustomData = parseFileData(startCustomData);
      dispatch(startDeck({ customData: startCustomData, resolvedCustomData: startCustomData, parsedCustomData }));
      return;
    }

    const resolvedCustomData = await resolveRemoteText(startCustomData);
    const parsedCustomData = await parseCustomData(startCustomData);
    dispatch(startDeck({ customData: startCustomData, resolvedCustomData, parsedCustomData }));
  };

  return (
    <Card heading={configData.heading || LANG.heading} intro={configData.intro}>
      {availableTopics.length ? (
        <OptionList label={configData.preloadedDataHeading || LANG.preloadedDataHeading}>
          {availableTopics.map((topic) => {
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
        label={configData.customDataHeading || LANG.customDataHeading}
        placeholder={CUSTOM_DATA_EXAMPLE}
        value={customData}
        onChange={handleTextChange}
      />

      <ButtonSet>
        <Button disabled={!selectedTopics.length && !customData} onClick={handleStartDeck}>
          <Icon name="point-right" />
          {configData.startButton || LANG.startButton}
        </Button>
      </ButtonSet>
    </Card>
  );
};

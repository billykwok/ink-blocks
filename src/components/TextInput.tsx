import TextInput_ from 'ink-text-input';
import figures from 'figures';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { Text } from 'ink';

export type TextInputProps = {
  mask?: string;
  focus?: boolean;
  invalidate?: (value: string) => string | null;
  onSubmit?: (value: string) => void;
};

export const TextInput = ({
  mask,
  focus,
  invalidate = () => null,
  onSubmit = () => {},
}: TextInputProps) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const _onChange = useCallback((value: string) => {
    setText(value);
    setError(invalidate(value));
  }, []);
  const _onSubmit = useCallback((value: string) => onSubmit(value), []);
  const hint = useMemo(() => {
    if (!text) {
      return null;
    }
    if (error) {
      return (
        <Fragment>
          <Text color="red"> {figures.cross}</Text>
          <Text color="gray">{error}</Text>
        </Fragment>
      );
    }
    return <Text color="green"> {figures.tick}</Text>;
  }, [!!text, error]);
  return (
    <Fragment>
      <Text dimColor={!text}>
        <TextInput_
          placeholder="<empty>"
          value={text}
          onChange={_onChange}
          onSubmit={_onSubmit}
          mask={mask}
          focus={focus}
          showCursor
          highlightPastedText
        />
      </Text>
      {hint}
    </Fragment>
  );
};

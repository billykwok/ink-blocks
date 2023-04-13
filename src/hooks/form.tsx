import { Fragment, useCallback, useMemo } from 'react';
import { Text } from 'ink';

import { type Item, type Renderer } from '../components/SelectInput.js';
import { TextInput } from '../components/TextInput.js';

export const enum FormAction {
  CANCEL = -2,
  SUBMIT = -1,
}

export const useFormAction = (
  submittable: boolean,
  submit: () => void,
  cancel: () => void
): [
  itemSubmit: Item<Renderer>,
  itemCancel: Item<Renderer>,
  handleFormAction: (item: Item<Renderer>) => void
] => {
  return [
    useMemo<Item<Renderer>>(
      () => ({
        key: FormAction.SUBMIT,
        value: () => <Text color="cyan">Submit</Text>,
        enabled: submittable,
      }),
      [submittable]
    ),
    useMemo(
      () => ({
        key: FormAction.CANCEL,
        value: () => <Text color="red">Back</Text>,
      }),
      []
    ),
    useCallback(
      ({ key }) => {
        switch (key) {
          case FormAction.SUBMIT:
            return submit();
          case FormAction.CANCEL:
            return cancel();
        }
      },
      [submit]
    ),
  ];
};

export const useFormFields = (
  fields: [
    name: string,
    invalidate: (value: string) => string | null,
    mask?: string
  ][]
) => fields.map((field) => useFormField(...field));

export const useFormField = (
  name: string,
  invalidate: (value: string) => string | null,
  mask?: string
) =>
  useMemo(
    () => ({
      key: Symbol(name),
      value: (selected: boolean) => (
        <Fragment>
          <Text>{name}: </Text>
          <TextInput invalidate={invalidate} focus={selected} mask={mask} />
        </Fragment>
      ),
    }),
    []
  );

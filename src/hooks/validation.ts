import { useCallback, useState } from 'react';

export type Invalidate = (value: string) => string | null;

export const useValidation = (...invalidates: Invalidate[]) => {
  const [validText, setValidText] = useState<string | null>(null);
  const invalidateText = useCallback((value: string) => {
    for (const invalidate of invalidates) {
      const result = invalidate(value);
      if (result) {
        setValidText(null);
        return result;
      }
    }
    setValidText(value);
    return null;
  }, []);
  return [validText, invalidateText] as const;
};

export const nonEmpty: Invalidate = (text) =>
  text ? null : 'Should not be empty';

export const isEmail: Invalidate = (text) =>
  /^[\w-.]+@([\w-]+.)+[a-zA-Z]{2,}$/g.test(text)
    ? null
    : 'Should be a valid email';

export const isPhoneNumber: Invalidate = (text) =>
  /^\+[0-9- ]{3,}$/g.test(text) ? null : 'Should be a valid phone number';

import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFunctionCall = <F extends (...args: any[]) => Promise<any>>(
  func: F,
  deps?: readonly unknown[]
): {
  func: F;
  loading: boolean;
  error: Error | null;
  /** `null` during execution, `true` if function executed successfully, `false` on error. */
  success: boolean | null;
  /** resets loading, success, and error to its default values */
  reset: () => void;
} => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const depsList = deps || [func];
  const wrappedFunc = useCallback(async (...args: any) => {
    try {
      setLoading(true);
      setSuccess(null);
      const result = await func(...args);
      setSuccess(true);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(JSON.stringify(err));
      setError(error);
      setSuccess(false);
    } finally {
      // this should avoid the warning about setting state on unmounted component
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- no way to statically check this
  }, depsList);
  const reset = useCallback(() => {
    setLoading(false);
    setSuccess(null);
    setError(null);
  }, [setLoading, setSuccess, setError]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { func: wrappedFunc as any, loading, error, success, reset };
};

export default useFunctionCall;

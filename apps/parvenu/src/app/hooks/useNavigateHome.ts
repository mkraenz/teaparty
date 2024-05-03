import { MouseEventHandler, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigateBack = () => {
  const nav = useNavigate();
  return useCallback<MouseEventHandler>(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      nav('/');
    },
    [nav]
  );
};

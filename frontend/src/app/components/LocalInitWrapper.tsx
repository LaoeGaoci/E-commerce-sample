'use client';

import { useInitLocalData } from '../hook/initLocalData';

export const LocalInitWrapper = ({ children }: { children: React.ReactNode }) => {
  useInitLocalData();

  return <>{children}</>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { ProfileWrapper } from './styled';
import { Helmet } from 'react-helmet-async';

export interface ProfileProps {}

export function Profile(props: ProfileProps) {
  return (
    <ProfileWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      Profile
    </ProfileWrapper>
  );
}

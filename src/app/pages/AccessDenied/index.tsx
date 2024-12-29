import * as React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';

export function AccessDenied() {
  return (
    <>
      <Helmet>
        <title>Access Denied</title>
        <meta name="description" content="Page not found - Access Denied" />
      </Helmet>
      <Wrapper>
        <Title>Access Denied</Title>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  margin-top: 50px;
`;

const Title = styled.div`
  text-align: center;
  font-weight: bold;
  color: black;
  font-size: 3.375rem;
`;

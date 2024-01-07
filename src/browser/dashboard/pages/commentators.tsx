import React from 'react';

import { render } from '../../render';
import { DashboardThemeProvider } from '../theme';
import { ReplicantProvider } from '../../ReplicantProvider';
import { CommentatorList } from '../components/commentator-list';
import { Container } from '@mui/material';
import { AddCommentator } from '../components/add-commentator';

const App = () => {
  return <DashboardThemeProvider>
    <ReplicantProvider>
      <Container sx={{ height: '640px', overflow: 'auto' }}>
        <CommentatorList />
      </Container>
      <AddCommentator />
    </ReplicantProvider>
  </DashboardThemeProvider>;
};

render(<App />);

import React from 'react';
import { render } from '../../render';
import { ReplicantProvider } from '../../ReplicantProvider';
import { UserAdditionList } from '../components/user-addition-list';
import { DashboardThemeProvider } from '../theme';
import { Container } from '@mui/material';

const App = () => {
  return (
    <DashboardThemeProvider>
      <ReplicantProvider>
        <Container sx={{ height: '640px', overflow: 'auto' }}>
          <UserAdditionList />
        </Container>
      </ReplicantProvider>
    </DashboardThemeProvider>
  );
};

render(<App />);

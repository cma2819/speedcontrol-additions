import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';
import { render } from '../../render';

const App = () => {
  return <Grid container>
    <Grid item xs={12}>
      <Button
        variant='contained'
        nodecg-dialog="import-user-addition"
      >User addition import</Button>
    </Grid>
  </Grid>;
};

render(<App />);

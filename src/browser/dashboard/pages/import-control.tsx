import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';
import { render } from '../../render';

const App = () => {
  return <Grid container spacing={2}>
    <Grid item xs={12}>
      <Button
        fullWidth
        variant='contained'
        nodecg-dialog="import-user-addition"
      >User addition import</Button>
    </Grid>
    <Grid item xs={12}>
      <Button
        fullWidth
        variant='contained'
        nodecg-dialog="import-commentator"
      >Commentator import</Button>
    </Grid>
  </Grid>;
};

render(<App />);

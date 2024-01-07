import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { SheetData } from '../../../types/SheetData';
import { useBundleNodecg } from '../../nodecg';

type Props = {
  onLoad: (url: string, sheets: SheetData[]) => void;
};

export const SpreadsheetLoader = ({ onLoad }: Props) => {
  const nodecg = useBundleNodecg();

  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('dialog-dismissed', () => {
      setSpreadsheetUrl('');
    });
  }, []);

  const loadSpreadsheet = () => {
    setIsLoading(true);

    nodecg.sendMessage(
      'loadSheetsFromSpreadsheet', spreadsheetUrl,
    ).then(data => {
      onLoad(spreadsheetUrl, data);
    }).catch(() => {
      console.error('Failed to load spreadsheet!');
    }).finally(() => { setIsLoading(false); });
  };

  return (<Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        variant='standard'
        label='Google Spreadsheet URL'
        onChange={(e) => { setSpreadsheetUrl(e.currentTarget.value); }}
        value={spreadsheetUrl}
      />
    </Grid>
    <Grid item xs={12}>
      <Button
        fullWidth
        variant='contained'
        disabled={isLoading}
        onClick={loadSpreadsheet}
      >Load Spreadsheet</Button>
    </Grid>
  </Grid>);
};

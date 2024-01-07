import React, { useState, useEffect } from 'react';
import { Container, Stack } from '@mui/material';
import { render } from '../../render';
import { ColumnSelector, ImportKeys } from '../components/column-selector';
import { useBundleNodecg } from '../../nodecg';
import { SheetData } from '../../../types/SheetData';
import { DashboardThemeProvider } from '../theme';
import { SpreadsheetLoader } from '../components/spreadsheet-loader';

const importKeys: ImportKeys<
['runId', 'name', 'twitch', 'nico', 'youtube', 'twitter']
> = [
  { label: 'Run ID', value: 'runId' },
  { label: '解説名', value: 'name' },
  { label: 'Twitch', value: 'twitch' },
  { label: 'ニコニココミュニティ', value: 'nico' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Twitter', value: 'twitter' },
];

const App = () => {
  const nodecg = useBundleNodecg();

  const [loadedSpreadhsheetUrl, setLoadedSpreadsheetUrl] = useState<string>('');
  const [sheetData, setSheetData] = useState<SheetData[]>([]);

  useEffect(() => {
    document.addEventListener('dialog-dismissed', () => {
      setLoadedSpreadsheetUrl('');
      setSheetData([]);
    });
  }, []);

  return <DashboardThemeProvider>
    <Container>
      <Stack spacing={2}>
        <SpreadsheetLoader onLoad={(url, sheets) => {
          setLoadedSpreadsheetUrl(url);
          setSheetData(sheets);
        }} />
        <ColumnSelector
          sheets={sheetData}
          keys={importKeys}
          onSubmit={(sheet, [runId, name, twitch, nico, youtube, twitter]) => {
            nodecg.sendMessage('importCommentatorFromSpreadsheet', {
              url: loadedSpreadhsheetUrl,
              sheetName: sheet,
              indexes: {
                runId,
                name,
                twitch,
                nico,
                youtube,
                twitter,
              },
            })
              .then(() => {
                console.info('Success to import commentators!');
              })
              .catch(() => {
                console.error('Failed to import commentators.');
              });
          }} />
      </Stack>
    </Container>
  </DashboardThemeProvider>;
};

render(<App />);

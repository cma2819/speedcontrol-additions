import React, { useState, useEffect } from 'react';
import { render } from '../../render';
import { SpreadsheetLoader } from '../components/spreadsheet-loader';
import { DashboardThemeProvider } from '../theme';
import { SheetData } from '../../../types/SheetData';
import { Container, Stack } from '@mui/material';
import { ColumnSelector, ImportKeys } from '../components/column-selector';
import { useBundleNodecg } from '../../nodecg';

const importKeys: ImportKeys<['name', 'nico', 'youtube', 'twitter']> = [
  { label: '走者名', value: 'name' },
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
          onSubmit={(sheet, [name, nico, youtube, twitter]) => {
            nodecg.sendMessage('importAdditionFromSpreadsheet', {
              url: loadedSpreadhsheetUrl,
              sheetName: sheet,
              indexes: {
                name,
                nico,
                youtube,
                twitter,
              },
            })
              .then(() => {
                console.info('Success to import runner additions!');
              })
              .catch(() => {
                console.error('Failed to import runner additions.');
              });
          }} />
      </Stack>
    </Container>
  </DashboardThemeProvider>;
};

render(<App />);

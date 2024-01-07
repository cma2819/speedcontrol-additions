import React, { useState, useEffect } from 'react';
import { SheetData } from '../../../types/SheetData';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

export type ImportKeys<K extends string[]> = Array<{
  value: K[number];
  label: string;
}>;

type Props<K extends string[]> = {
  sheets: SheetData[];
  keys: ImportKeys<K>;
  onSubmit: (sheet: string, columns: number[]) => void;
};

export const ColumnSelector = <K extends string[]>(
  { sheets, keys, onSubmit }: Props<K>,
) => {
  const [sheetNames, setSheetNames] = useState<string[]>([]);

  const [importSheet, setImportSheet] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [importColumns, setImportColumns] = useState<Array<number | ''>>([]);

  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('dialog-dismissed', () => {
      setImportSheet('');
    });
  }, []);

  useEffect(() => {
    setSheetNames(sheets.map(d => d.name));
  }, [sheets]);

  useEffect(() => {
    if (importSheet !== '') {
      setColumns(sheets.find(d => d.name === importSheet)?.columns ?? []);
      setImportColumns(keys.map(_ => ''));
    } else {
      setColumns([]);
      setImportColumns(keys.map(_ => ''));
    }
  }, [importSheet]);

  const selectColumn = (keyIndex: number, colIndex: number) => {
    setImportColumns(importColumns.map((col, index) => {
      if (index === keyIndex) {
        return colIndex;
      }
      return col;
    }));
  };

  const readyToImport = importSheet !== '' &&
  importColumns.every(col => col !== '');

  const submitImport = () => {
    if (!readyToImport) {
      return;
    }
    const columns = keys.map((_, kIndex) => Number(importColumns[kIndex]));
    onSubmit(importSheet, columns);
    setIsDone(true);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        Select source sheet
      </Grid>
      <Grid item xs={8}>
        <FormControl
          fullWidth
          variant='standard'
        >
          <InputLabel id='select-sheet-name-label'>Sheet name</InputLabel>
          <Select
            label='Sheet name'
            labelId='select-sheet-name-label'
            disabled={sheetNames.length === 0}
            onChange={(e) => { setImportSheet(e.target.value); }}
            value={importSheet}
          >
            <MenuItem value=''>-</MenuItem>
            { sheetNames.map(name => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        Select columns
      </Grid>
      {importColumns.map((col, keyIndex) => {
        const key = keys[keyIndex];
        return (
          <Grid key={key.value} item xs={4}>
            <FormControl
              variant='standard'
              fullWidth
            >
              <InputLabel
                id={`select-${key.value}-label`}
              >
                {key.label}
              </InputLabel>
              <Select
                labelId={`select-${key.value}-label`}
                disabled={columns.length === 0}
                onChange={(e) => {
                  selectColumn(keyIndex, Number(e.target.value) ?? '');
                }}
                value={col}
              >
                <MenuItem value=''>-</MenuItem>
                { columns.map((column, colIndex) => (
                  <MenuItem key={column} value={colIndex}>{column}</MenuItem>
                ))}
              </Select></FormControl>
          </Grid>
        );
      })}
      <Grid item xs={12}>
        {
          isDone
            ? (<Button
              variant='contained'
              color='success'
              fullWidth
              disabled
            >Finish to import! Feel free to close this dialog.</Button>)
            : (<Button
              variant='contained'
              color='success'
              fullWidth
              onClick={submitImport}
              disabled={!readyToImport}
            >Import</Button>)
        }
      </Grid>
    </Grid>
  );
};

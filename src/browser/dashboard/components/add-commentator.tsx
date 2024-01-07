import { Backdrop, Button, Container, Grid, Stack, Paper, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Commentator } from '../../../nodecg/replicants';
import { useBundleNodecg } from '../../nodecg';

const CommentatorEditor = (
  { open, closeFunction }: { open: boolean; closeFunction: () => void },
) => {
  const nodecg = useBundleNodecg();
  const initialEditing = {
    name: '',
    social: {
      twitch: '',
      nico: '',
      youtube: '',
      twitter: '',
    },
    assignedRunIdArray: [],
  };

  const [
    editing, setEditing,
  ] = useState<Omit<Commentator, 'id'>>(initialEditing);

  useEffect(() => {
    if (open) {
      setEditing(initialEditing);
    }
  }, [open]);

  const readyToSubmit = initialEditing.name !== '' &&
  !Object.values(initialEditing.social).includes('');

  const submitAddCommentator = async () => {
    await nodecg.sendMessage('createCommentator', editing);
  };

  return (
    <Backdrop open={open}>
      <Container>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12}>
              <Typography variant='h6'>
                コメンテータを追加
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='ハンドルネーム'
                fullWidth
                value={editing.name}
                onChange={(e) => {
                  setEditing({
                    ...editing,
                    name: e.currentTarget.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label='Twitch'
                fullWidth
                value={editing.social.twitch}
                onChange={(e) => {
                  setEditing({
                    ...editing,
                    social: {
                      ...editing.social,
                      twitch: e.currentTarget.value,
                    },
                  });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label='ニコニココミュニティID'
                fullWidth
                value={editing.social.nico}
                onChange={(e) => {
                  setEditing({
                    ...editing,
                    social: {
                      ...editing.social,
                      nico: e.currentTarget.value,
                    },
                  });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label='YouTube'
                fullWidth
                value={editing.social.youtube}
                onChange={(e) => {
                  setEditing({
                    ...editing,
                    social: {
                      ...editing.social,
                      youtube: e.currentTarget.value,
                    },
                  });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label='Twitter'
                fullWidth
                value={editing.social.twitter}
                onChange={(e) => {
                  setEditing({
                    ...editing,
                    social: {
                      ...editing.social,
                      twitter: e.currentTarget.value,
                    },
                  });
                }}
              />
            </Grid>
            <Grid item xs={8}>
              <Stack spacing={2} direction='row' justifyContent='end'>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => {
                    submitAddCommentator().then(() => {
                      closeFunction();
                    }).catch(() => {
                      console.error('Failed to add commentator.');
                    });
                  }}
                  disabled={readyToSubmit}
                >追加</Button>
                <Button
                  color='warning'
                  variant='contained'
                  onClick={closeFunction}
                >キャンセル</Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Backdrop>
  );
};

export const AddCommentator = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        fullWidth
        color='info'
        variant='contained'
        onClick={() => { setOpen(true); }}
      >[+] コメンテータを追加</Button>
      <CommentatorEditor
        open={open}
        closeFunction={() => { setOpen(false); }}
      />
    </>
  );
};

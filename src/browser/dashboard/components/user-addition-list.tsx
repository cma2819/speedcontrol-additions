import React, { useState, useContext, useEffect } from 'react';
import {
  Avatar,
  Chip,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Icon,
  Button,
  Backdrop,
  Container,
  Paper,
  Grid,
  TextField,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { SpeedcontrolRunner } from '../../../nodecg/speedcontrol';
import {
  SpeedcontrolUserAddition,
} from '../../../nodecg/generated/speedcontrolUserAddition';
import { ReplicantContext } from '../../ReplicantProvider';
import { useBundleNodecg } from '../../nodecg';

const UserAdditionEditor = (
  { open, closeFunction, addition }: {
    open: boolean;
    closeFunction: () => void;
    addition: SpeedcontrolUserAddition;
  },
) => {
  const nodecg = useBundleNodecg();

  const initialAddition = {
    social: {
      nico: '',
      youtube: '',
      twitter: '',
    },
  };
  const [
    editing, setEditing,
  ] = useState<Omit<SpeedcontrolUserAddition, 'id'>>(initialAddition);

  useEffect(() => {
    setEditing(
      {
        social: {
          nico: addition.social.nico ?? '',
          youtube: addition.social.youtube ?? '',
          twitter: addition.social.twitter ?? '',
        },
      },
    );
  }, [open]);

  const updateAddition = async () => {
    await nodecg.sendMessage('updateUserAddition', {
      id: addition.id,
      social: editing.social,
    });
  };

  return (
    <Backdrop open={open} sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}>
      <Container>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Stack spacing={2} direction='row' justifyContent='end'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    updateAddition().then(() => {
                      closeFunction();
                    }).catch(() => {
                      console.error('Failed to update user addition.');
                    });
                  }}
                >更新</Button>
                <Button
                  variant='contained'
                  color='warning'
                  onClick={() => {
                    closeFunction();
                  }}
                >キャンセル</Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Backdrop>
  );
};

const UserAdditionRow = ({ user, addition }: {
  user: SpeedcontrolRunner; addition?: SpeedcontrolUserAddition; },
) => {
  const [open, setOpen] = useState<boolean>(false);

  const [openEdit, setOpenEdit] = useState<boolean>(false);

  return (
    <>
      <ListItemButton onClick={() => { setOpen(!open); } }>
        <ListItemText primary={user.name} />
        { open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <ListItemText>
          <Stack spacing={1}>
            <div>
              <Chip avatar={<Avatar>ID</Avatar>} label={user.id} />
            </div>
            <div>
              <Chip
                color='twitch'
                icon={
                  <Icon baseClassName='fa-brands' className='fa-twitch'></Icon>
                }
                label={user.social.twitch ?? '-'}
              />
            </div>
            <div>
              <Chip
                color='nico'
                avatar={<Avatar>N</Avatar>}
                label={addition?.social.nico ?? '-'}
              />
            </div>
            <div>
              <Chip
                color='youtube'
                icon={
                  <Icon baseClassName='fa-brands' className='fa-youtube'></Icon>
                }
                label={addition?.social.youtube ?? '-'}
              />
            </div>
            <div>
              <Chip
                color='twitter'
                icon={
                  <Icon baseClassName='fa-brands' className='fa-twitter'></Icon>
                }
                label={addition?.social.twitter ?? '-'}
              />
            </div>
          </Stack>
        </ListItemText>
        <Button
          fullWidth
          variant='outlined'
          sx={{ textTransform: 'none' }}
          onClick={() => {
            setOpenEdit(true);
          }}
        >{ user.name } を編集</Button>
        <UserAdditionEditor open={openEdit} closeFunction={() => {
          setOpenEdit(false);
        }} addition={{ id: user.id, social: addition?.social ?? {} }} />
      </Collapse>
    </>
  );
};

export const UserAdditionList = () => {
  const { userAdditions, speedcontrolRunners } = useContext(ReplicantContext);

  const findUserAddition = (id: string) => {
    return userAdditions?.find(addition => addition.id === id);
  };

  return (
    <List sx={{ width: '100%' }}>
      { speedcontrolRunners?.map((runner) => {
        const addition = findUserAddition(runner.id);
        return <UserAdditionRow
          key={runner.id}
          user={runner}
          addition={addition}
        />;
      })}
    </List>
  );
};

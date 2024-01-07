import React, { useState, useContext, useEffect } from 'react';
import { ReplicantContext } from '../../ReplicantProvider';
import { Commentator } from '../../../nodecg/replicants';
import { Avatar, Backdrop, Button, Checkbox, Chip, Collapse, Icon, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography, Paper } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { SpeedcontrolRun } from '../../../nodecg/speedcontrol';
import { useBundleNodecg } from '../../nodecg';
import { clone } from 'lodash';

const AssignRunOverlay = ({
  commentator,
  open,
  closeFunction,
}: { commentator: Commentator; open: boolean; closeFunction: () => void }) => {
  const nodecg = useBundleNodecg();
  const { speedcontrolRuns } = useContext(ReplicantContext);

  const [
    assigned,
    setAssigned,
  ] = useState<Commentator['assignedRunIdArray']>([]);

  useEffect(() => {
    if (open) {
      setAssigned(clone(commentator.assignedRunIdArray));
    }
  }, [open]);

  const updateAssignment = async () => {
    const updated = {
      ...commentator,
      assignedRunIdArray: assigned.filter(
        (runId, index, src) => src.findIndex(r => r === runId) === index,
      ),
    };

    await nodecg.sendMessage('updateCommentator', updated);
  };

  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <Paper sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography variant='h6'>
            Edit { commentator.name }
          </Typography>
          <List sx={{ maxHeight: '520px', overflowX: 'auto' }}>
            { speedcontrolRuns?.map(run => (
              <ListItem key={run.id}>
                <ListItemButton onClick={() => {
                  setAssigned([
                    ...assigned,
                    run.id,
                  ]);
                }} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge='start'
                      checked={ assigned.includes(run.id) }
                    />
                  </ListItemIcon>
                  <ListItemText>{run.game} - {run.category}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Stack direction='row' spacing={2}>
            <Button
              color='primary'
              variant='contained'
              onClick={() => {
                updateAssignment().then(closeFunction).catch(() => {
                  console.error('Failed to update commentator.');
                });
              }}
            >保存</Button>
            <Button
              color='warning'
              variant='contained'
              onClick={closeFunction}
            >キャンセル</Button>
          </Stack>
        </Stack>
      </Paper>
    </Backdrop>
  );
};

const CommentatorRow = ({ commentator }: { commentator: Commentator }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openRunAssignment, setOpenRunAssignment] = useState<boolean>(false);

  const { speedcontrolRuns } = useContext(ReplicantContext);

  const nodecg = useBundleNodecg();

  const findAssignedRuns = () => {
    return commentator.assignedRunIdArray.map(
      (runId) => speedcontrolRuns?.find(run => run.id === runId),
    ).filter((run): run is SpeedcontrolRun => run !== undefined);
  };

  const deleteAssignedRun = (run: SpeedcontrolRun) => () => {
    if (confirm(`${commentator.name} の ${run.game} への割り当てを削除します.`)) {
      const updated = {
        ...commentator,
        assignedRunIdArray: commentator.assignedRunIdArray.filter(
          runId => runId !== run.id,
        ),
      };

      nodecg.sendMessage('updateCommentator', updated).catch(() => {
        console.error('Failed to update commentator.');
      });
    }
  };

  const deleteCommentator = () => {
    if (confirm(`${commentator.name} を削除してよろしいですか.`)) {
      nodecg.sendMessage('removeCommentator', commentator.id).catch(() => {
        console.error('Failed to remove commentator.');
      });
    }
  };

  return (
    <>
      <ListItemButton onClick={() => { setOpen(!open); } }>
        <ListItemText primary={commentator.name} />
        { open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout='auto' unmountOnExit>
        <ListItemText>
          <Stack spacing={1}>
            <div>
              <Chip avatar={<Avatar>ID</Avatar>} label={commentator.id} />
            </div>
            <div>
              <Chip
                color='twitch'
                icon={
                  <Icon baseClassName='fa-brands' className='fa-twitch' />
                }
                label={commentator.social.twitch ?? '-'}
              />
            </div>
            <div>
              <Chip
                color='nico'
                avatar={<Avatar>N</Avatar>}
                label={commentator.social.nico ?? '-'}
              />
            </div>
            <div>
              <Chip
                color='youtube'
                icon={
                  <Icon baseClassName='fa-brands' className='fa-youtube' />
                }
                label={commentator.social.youtube ?? '-'}
              />
            </div>
            <div>
              <Chip
                color='twitter'
                icon={
                  <Icon baseClassName='fa-brands' className='fa-twitter' />
                }
                label={commentator.social.twitter ?? '-'}
              />
            </div>
            <Stack direction='row' spacing={1} useFlexGap flexWrap='wrap'>
              {findAssignedRuns().map(run => (
                <div key={run.id}>
                  <Chip
                    label={`${run.game} - ${run.category}`}
                    onDelete={deleteAssignedRun(run)}
                  />
                </div>
              ))}
              <IconButton
                size='small'
                onClick={() => { setOpenRunAssignment(true); }}
              >
                <Icon baseClassName='fa' className='fa-plus' />
              </IconButton>
            </Stack>
          </Stack>
        </ListItemText>
        <Button
          variant='outlined'
          color='error'
          fullWidth
          onClick={deleteCommentator}
        >削除</Button>
      </Collapse>

      <AssignRunOverlay
        commentator={commentator}
        open={openRunAssignment}
        closeFunction={() => { setOpenRunAssignment(false); }}
      />
    </>
  );
};

export const CommentatorList = () => {
  const { commentators } = useContext(ReplicantContext);

  return (
    <List sx={{ width: '100%' }}>
      { commentators?.map(commentator => (
        <CommentatorRow key={commentator.id} commentator={commentator} />
      ))}
    </List>
  );
};

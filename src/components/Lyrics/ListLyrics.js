import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { inject, observer } from 'mobx-react'
import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import PlusOne from '@material-ui/icons/AddCircleOutline'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import { gql } from 'apollo-boost';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GET_LYRICS = gql`
query {
  getLyrics {
    title
    id
    lyric
    updatedAt
  }
}
`

const DELETE_LYRIC = gql`
mutation($id: String) {
  deleteLyric(id: $id) {
    response
  }
}
`

const ListLyrics = ({
  lyrics,
  client,
}) => {
  const [open, setOpen] = useState(false)
  const [lyricId, setLyricId] = useState(null)

  useEffect(() => {
    client.query({
      query: GET_LYRICS,
      context: {
        headers: {
          authorization: `Bearer ${localStorage.token}`
        }
      }
    }).then(({ data }) => {
      // Solve this
      lyrics.setLyrics(data.getLyrics)
    });
  }, [])

  const deleteLyric = (id) => {
    client.mutate({
      mutation: DELETE_LYRIC,
      variables: {
        id,
      },
      context: {
        headers: {
          authorization: `Bearer ${localStorage.token}`
        }
      }
    }).then(() => {
      lyrics.delete(id)
    });
  }

  if (!lyrics.list) {
    return <div>Loading....</div>
  }

  return (
    <div>
      <IconButton onClick={() => lyrics.newLyric()}>
        <PlusOne />
      </IconButton>
      <List>
        {lyrics.list.map(lyric => (
          <ListItem
            button
            onClick={() => lyrics.setLyric({ ...lyric })}
            key={lyric.id}
          >
            <ListItemText primary={lyric.title} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => { setOpen(true); setLyricId(lyric.id); }}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Delete lyric?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure want delete this lyric? You cannot recover this one.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            deleteLyric(lyricId)
            setOpen(false)
          }} color="primary">
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const enhance = compose(
  inject('lyrics'),
  observer,
)

export default enhance(ListLyrics)

import React, { useEffect } from 'react'
import { compose } from 'recompose'
import { inject, observer } from 'mobx-react'
import { List, ListItem, ListItemSecondaryAction } from '@material-ui/core'
import PlusOne from '@material-ui/icons/AddCircleOutline'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete';

const ListLyrics = ({
  lyrics,
}) => {
  useEffect(() => {
    lyrics.loadLyrics()
  }, [])

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
            onClick={() => lyrics.setLyricById(lyric.id)}
            key={lyric.id}
          >
            {lyric.title}

            <ListItemSecondaryAction>
              <a onClick={(ev) => { ev.stopPropagation(); lyrics.delete(lyric.id) }}>
                <DeleteIcon />
              </a>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

const enhance = compose(
  inject('lyrics'),
  observer,
)

export default enhance(ListLyrics)

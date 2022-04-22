import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { VebinarModel } from 'app/constants/vebinar-model';
import { getYoutubeThumbnailSrc } from 'app/utils/youtube-helpers';
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { VideoThumbnail } from './styled-elements';

interface Props {
  action: () => void;
  video: VebinarModel;
  isSuperAdmin: boolean;
  handleEdit: (item: VebinarModel) => void;
  handleDelete: () => void;
  handleCopy: () => void;
}

const VideoThumbnailElement = (props: Props): JSX.Element => {
  const { action, video, isSuperAdmin, handleEdit, handleDelete, handleCopy } =
    props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <VideoThumbnail variant="outlined">
      <Box sx={{ mb: 1 }} onClick={action}>
        <img src={getYoutubeThumbnailSrc(video.link)} alt={video.title} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <Tooltip title={video.description ?? false}>
          <Typography variant="body1" onClick={action}>
            {video.title}
          </Typography>
        </Tooltip>
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          color="primary"
          sx={{ marginLeft: 'auto' }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {isSuperAdmin
          ? [
              <MenuItem
                key="delete"
                onClick={() => {
                  handleMenuClose();
                  handleDelete();
                }}
              >
                Удалить
              </MenuItem>,
              <MenuItem
                key="edit"
                onClick={() => {
                  handleMenuClose();
                  handleEdit(video);
                }}
              >
                Редактировать
              </MenuItem>,
            ]
          : null}
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleCopy();
          }}
        >
          Копировать ссылку
        </MenuItem>
      </Menu>
    </VideoThumbnail>
  );
};

export default VideoThumbnailElement;

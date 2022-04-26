import { Box, Button, Typography } from '@mui/material';
import { VebinarModel } from 'app/constants/vebinar-model';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { VideoContainer } from './styled-elements';
import { getYoutubeVideoId } from 'app/utils/youtube-helpers';
import { Link } from 'react-router-dom';
import { Routes } from 'app/routes/routes';

interface Props {
  vebinar: VebinarModel;
}

const VideoView = (props: Props): JSX.Element => {
  const { vebinar } = props;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          to={`${Routes.MAIN}?tab=vebinars`}
          color="inherit"
        >
          К вебинарам
        </Button>
      </Box>
      <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
        {vebinar.title}
      </Typography>
      {vebinar.description && (
        <Typography textAlign="center" sx={{ mb: 4 }}>
          {vebinar.description}
        </Typography>
      )}

      <VideoContainer>
        <iframe
          title={vebinar.title}
          src={`https://www.youtube.com/embed/${getYoutubeVideoId(
            vebinar.link,
          )}`}
          frameBorder="0"
          width="640"
          height="360"
          allowFullScreen
        />
      </VideoContainer>
    </>
  );
};

export default VideoView;

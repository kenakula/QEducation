import { Box, Button, Typography } from '@mui/material';
import { VebinarModel } from 'app/constants/vebinar-model';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { VideoContainer } from './styled-elements';
import { getYoutubeVideoId } from 'app/utils/youtube-helpers';
import { useHistory } from 'react-router-dom';

interface Props {
  vebinar: VebinarModel;
}

const VideoView = (props: Props): JSX.Element => {
  const { vebinar } = props;
  const history = useHistory();

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => history.goBack()}
        >
          Назад
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
          src={`http://www.youtube.com/embed/${getYoutubeVideoId(
            vebinar.link,
          )}`}
          frameBorder="0"
          width="640"
          height="360"
        />
      </VideoContainer>
    </>
  );
};

export default VideoView;

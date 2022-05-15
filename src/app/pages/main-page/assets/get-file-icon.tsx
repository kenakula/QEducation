import React from 'react';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';

export const getFileIcon = (fileName: string): any => {
  const extension = fileName.split('.').pop();

  switch (extension) {
    case 'JPG':
    case 'jpg':
    case 'png':
    case 'icon':
    case 'jpeg':
    case 'svg':
      return <ImageIcon />;
    case 'pdf':
      return <PictureAsPdfIcon />;
    case 'doc':
    case 'docx':
      return <ArticleIcon />;
    default:
      return <AttachFileIcon />;
  }
};

export const getYoutubeVideoId = (link: string): string | false => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = link.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
};

export const getYoutubeThumbnailSrc = (link: string): string =>
  `https://img.youtube.com/vi/${getYoutubeVideoId(link)}/hqdefault.jpg`;

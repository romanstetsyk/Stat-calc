const getFilenameFromHeaders = (headers: Headers): string => {
  const contentDisposition = headers.get('Content-Disposition');
  if (!contentDisposition) {
    throw new Error('Content-Disposition header is null');
  }
  const match = contentDisposition.match(/^attachment; filename="(.*)"$/);
  if (!match) {
    throw new Error(
      "Can't extract the filename from Content-Disposition header",
    );
  }
  return match[1];
};

export { getFilenameFromHeaders };

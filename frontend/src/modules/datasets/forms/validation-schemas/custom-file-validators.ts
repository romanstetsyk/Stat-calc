import type { CustomValidator } from 'joi';

const enum FileErrorCodes {
  FILENAME_MIN = 'filename.min',
  FILENAME_MAX = 'filename.max',
  MIMETYPE_ONLY = 'mimetype.only',
  FILESIZE_GREATER = 'filesize.greater',
  FILESIZE_MAX = 'filesize.max',
}

const fileNameValidator = (
  minLength: number,
  maxLength: number,
): CustomValidator<File> => {
  return (value, helpers) => {
    const nameLength = value.name.trim().length;
    if (nameLength < minLength) {
      return helpers.error(FileErrorCodes.FILENAME_MIN);
    }
    if (nameLength > maxLength) {
      return helpers.error(FileErrorCodes.FILENAME_MAX);
    }
    return value;
  };
};

const mimetypeValidator = (
  allowedMimes: readonly string[],
): CustomValidator<File> => {
  return (value, helpers) => {
    if (!allowedMimes.includes(value.type)) {
      return helpers.error(FileErrorCodes.MIMETYPE_ONLY);
    }
    return value;
  };
};

const filesizeValidator = (
  minSize: number,
  maxSize: number,
): CustomValidator<File> => {
  return (value, helpers) => {
    if (value.size <= minSize) {
      return helpers.error(FileErrorCodes.FILESIZE_GREATER);
    }
    if (value.size > maxSize) {
      return helpers.error(FileErrorCodes.FILESIZE_MAX);
    }
    return value;
  };
};

export {
  FileErrorCodes,
  fileNameValidator,
  filesizeValidator,
  mimetypeValidator,
};

const MUTATION_KEY = {
  SIGN_IN: ['signIn'],
  SIGN_OUT: ['signOut'],
  SIGN_UP: ['signUp'],
  DELETE_FILE: ['deleteFile'],
  UPLOAD_FILE: ['uploadFile'],
  UPDATE_FILE: ['updateFile'],
  RENAME_FILE: ['renameFile'],
} as const;

export { MUTATION_KEY };

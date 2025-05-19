import { UserDocument } from 'src/user/schemas/user.schema';

export const sanitizeUser = (user: UserDocument) => {
  const {
    password,
    __v,
    emailVerificationToken,
    emailVerificationTokenExpires,
    ...rest
  } = user.toObject();
  return rest;
};

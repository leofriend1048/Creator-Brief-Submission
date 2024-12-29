export const authConfig = {
  providers: ['email'],
  callbacks: {
    signIn: async ({ user }) => {
      return !!user;
    },
  },
};
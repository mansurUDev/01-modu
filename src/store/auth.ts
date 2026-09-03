import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  email: string | null;
  name: string | null;
  isAuthed: boolean;
  /**
   * Fake sign-in gate (TZ.md §5): any front-end-valid email/password is
   * accepted, nothing is checked server-side because there is no server.
   * The password itself is deliberately not a parameter here — it is
   * validated by the auth modal (T7) and then thrown away; this store
   * never sees or stores it.
   *
   * `name` defaults to the part of the email before "@" when omitted —
   * the Sign in tab has no name field, only Sign up does.
   */
  signIn: (email: string, name?: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: null,
      name: null,
      isAuthed: false,
      signIn: (email, name) =>
        set({
          email,
          name: name?.trim() || email.split("@")[0],
          isAuthed: true,
        }),
    }),
    {
      name: "modu-auth",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

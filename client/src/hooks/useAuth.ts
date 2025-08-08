import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, database, ref, set } from '@/lib/firebase';
import { useToast } from './use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      
      // Store user profile in Firebase Realtime Database
      const userProfile = {
        id: result.user.uid,
        email: result.user.email,
        displayName: displayName,
        hasHostingPrivilege: false, // Default to false, can be changed by admin
        createdAt: new Date().toISOString()
      };
      
      const userRef = ref(database, `users/${result.user.uid}`);
      await set(userRef, userProfile);
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to Kicked in the Disc",
      });
      return result;
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Signed in successfully!",
        description: "Welcome back",
      });
      return result;
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    logout,
  };
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { database, ref, get, update } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  hasHostingPrivilege: boolean;
  createdAt: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersList = Object.values(usersData) as UserProfile[];
        setUsers(usersList);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleHostingPrivilege = async (userId: string, currentValue: boolean) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, { hasHostingPrivilege: !currentValue });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, hasHostingPrivilege: !currentValue }
            : user
        )
      );
      
      toast({
        title: "Success",
        description: `Hosting privilege ${!currentValue ? 'granted' : 'revoked'}`,
      });
    } catch (error) {
      console.error('Error updating user privilege:', error);
      toast({
        title: "Error",
        description: "Failed to update user privilege",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage user privileges and system settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found in the database
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{user.displayName || 'No name'}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Hosting Privilege:</span>
                      <Switch
                        checked={user.hasHostingPrivilege}
                        onCheckedChange={() => toggleHostingPrivilege(user.id, user.hasHostingPrivilege)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button onClick={loadUsers} variant="outline">
          Refresh Users
        </Button>
      </div>
    </div>
  );
} 
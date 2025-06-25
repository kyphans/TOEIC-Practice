'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Bell, Globe } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
export default function Profile() {
  const { user } = useUser();

  // Profile form state
  const [name, setName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || '');
  const [bio, setBio] = useState('TOEIC learner aiming for a score of 900+');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [testReminders, setTestReminders] = useState(true);
  const [scoreUpdates, setScoreUpdates] = useState(true);
  const [newTests, setNewTests] = useState(false);

  // Language preferences
  const [interfaceLanguage, setInterfaceLanguage] = useState('English');
  const [studyFocus, setStudyFocus] = useState('Both');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    alert('Profile updated successfully!');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    // In a real app, you would send this data to your backend
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className='space-y-8 p-6'>
      <div className='brutalist-container'>
        <h1 className='text-3xl font-black mb-4'>Your Profile</h1>
        <p className='text-lg'>Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='grid grid-cols-4 mb-8'>
          <TabsTrigger
            value='profile'
            className='brutalist-button hover:text-blue-500 data-[state=active]:bg-blue-500 data-[state=active]:text-white'>
            <User className='mr-2 h-4 w-4' /> Profile
          </TabsTrigger>
          <TabsTrigger
            value='password'
            className='brutalist-button hover:text-blue-500 data-[state=active]:bg-blue-500 data-[state=active]:text-white'>
            <Lock className='mr-2 h-4 w-4' /> Password
          </TabsTrigger>
          <TabsTrigger
            value='notifications'
            className='brutalist-button hover:text-blue-500 data-[state=active]:bg-blue-500 data-[state=active]:text-white'>
            <Bell className='mr-2 h-4 w-4' /> Notifications
          </TabsTrigger>
          <TabsTrigger
            value='preferences'
            className='brutalist-button hover:text-blue-500 data-[state=active]:bg-blue-500 data-[state=active]:text-white'>
            <Globe className='mr-2 h-4 w-4' /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value='profile'>
          <div className='brutalist-container'>
            <form onSubmit={handleProfileUpdate} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <Label htmlFor='name' className='text-lg font-bold'>
                    Full Name
                  </Label>
                  <Input
                    id='name'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='brutalist-input w-full mt-2'
                  />
                </div>

                <div>
                  <Label htmlFor='email' className='text-lg font-bold'>
                    Email
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='brutalist-input w-full mt-2'
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='bio' className='text-lg font-bold'>
                  Bio
                </Label>
                <textarea
                  id='bio'
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className='brutalist-input w-full mt-2'></textarea>
              </div>

              <Button type='submit' className='brutalist-button'>
                Update Profile
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value='password'>
          <div className='brutalist-container'>
            <form onSubmit={handlePasswordUpdate} className='space-y-6'>
              <div>
                <Label htmlFor='currentPassword' className='text-lg font-bold'>
                  Current Password
                </Label>
                <Input
                  id='currentPassword'
                  type='password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className='brutalist-input w-full mt-2'
                />
              </div>

              <div>
                <Label htmlFor='newPassword' className='text-lg font-bold'>
                  New Password
                </Label>
                <Input
                  id='newPassword'
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='brutalist-input w-full mt-2'
                />
              </div>

              <div>
                <Label htmlFor='confirmPassword' className='text-lg font-bold'>
                  Confirm New Password
                </Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='brutalist-input w-full mt-2'
                />
              </div>

              <Button type='submit' className='brutalist-button'>
                Update Password
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value='notifications'>
          <div className='brutalist-container'>
            <h2 className='text-2xl font-bold mb-6'>Notification Settings</h2>

            <div className='space-y-6'>
              <div className='brutalist-card p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-lg font-bold'>Email Notifications</h3>
                    <p className='text-sm'>Receive notifications via email</p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={emailNotifications}
                      onChange={() =>
                        setEmailNotifications(!emailNotifications)
                      }
                      className='sr-only peer'
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <div className='brutalist-card p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-lg font-bold'>Test Reminders</h3>
                    <p className='text-sm'>
                      Get reminders about scheduled tests
                    </p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={testReminders}
                      onChange={() => setTestReminders(!testReminders)}
                      className='sr-only peer'
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <div className='brutalist-card p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-lg font-bold'>Score Updates</h3>
                    <p className='text-sm'>
                      Receive notifications about your test scores
                    </p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={scoreUpdates}
                      onChange={() => setScoreUpdates(!scoreUpdates)}
                      className='sr-only peer'
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <div className='brutalist-card p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-lg font-bold'>New Tests Available</h3>
                    <p className='text-sm'>
                      Get notified when new tests are added
                    </p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={newTests}
                      onChange={() => setNewTests(!newTests)}
                      className='sr-only peer'
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <Button className='brutalist-button'>
                Save Notification Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value='preferences'>
          <div className='brutalist-container'>
            <h2 className='text-2xl font-bold mb-6'>Preferences</h2>

            <div className='space-y-6'>
              <div>
                <Label htmlFor='language' className='text-lg font-bold'>
                  Interface Language
                </Label>
                <select
                  id='language'
                  value={interfaceLanguage}
                  onChange={(e) => setInterfaceLanguage(e.target.value)}
                  className='brutalist-input w-full mt-2'>
                  <option value='English'>English</option>
                  <option value='Vietnamese'>Vietnamese</option>
                  <option value='Japanese'>Japanese</option>
                  <option value='Korean'>Korean</option>
                </select>
              </div>

              <div>
                <Label htmlFor='focus' className='text-lg font-bold'>
                  Study Focus
                </Label>
                <select
                  id='focus'
                  value={studyFocus}
                  onChange={(e) => setStudyFocus(e.target.value)}
                  className='brutalist-input w-full mt-2'>
                  <option value='Both'>Both Listening and Reading</option>
                  <option value='Listening'>Listening Only</option>
                  <option value='Reading'>Reading Only</option>
                </select>
              </div>

              <Button className='brutalist-button'>Save Preferences</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: string;
  profile_role?: string;
  subscription?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

interface ProfilesState {
  currentProfile: Profile | null;
  allProfiles: Profile[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfilesState = {
  currentProfile: null,
  allProfiles: [],
  loading: false,
  error: null,
};

// Async thunk to fetch profile by user_id
export const fetchProfileByUserId = createAsyncThunk(
  'profiles/fetchByUserId',
  async (userId: string) => {
    const usingProfile = localStorage.getItem('UsingProfile');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('profile_role', usingProfile || 'main')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Profile;
  }
);

// Async thunk to fetch all profiles for a user
export const fetchAllProfilesByUserId = createAsyncThunk(
  'profiles/fetchAllProfilesByUserId',
  async (userId: string) => {
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data as Profile[];
  }
);

// Async thunk to create a new profile
export const createProfile = createAsyncThunk(
  'profiles/createProfile',
  async ({ userId, name, profileRole, subscription, expiresAt }: {
    userId: string;
    name: string;
    profileRole: string;
    subscription: string;
    expiresAt?: string;
  }) => {
    // console.log({
    //   user_id: userId,
    //   name,
    //   profile_role: profileRole,
    //   subscription,
    //   expires_at: expiresAt,
    //   created_at: new Date().toISOString(),
    //   updated_at: new Date().toISOString(),
    // });
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        name,
        profile_role: profileRole,
        subscription,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Profile;
  }
);

// Async thunk to update profile
export const updateProfile = createAsyncThunk(
  'profiles/updateProfile',
  async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Profile;
  }
);

// Async thunk to update specific profile by ID
export const updateProfileById = createAsyncThunk(
  'profiles/updateProfileById',
  async ({ profileId, updates }: { profileId: string; updates: Partial<Profile> }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Profile;
  }
);

// Async thunk to delete profile
export const deleteProfile = createAsyncThunk(
  'profiles/deleteProfile',
  async (profileId: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profileId);

    if (error) {
      throw new Error(error.message);
    }

    return profileId;
  }
);

// Async thunk to update subscription
export const updateSubscription = createAsyncThunk(
  'profiles/updateSubscription',
  async ({ userId, subscription, expiresAt }: { 
    userId: string; 
    subscription: string; 
    expiresAt?: string;
  }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription,
        expires_at: expiresAt || new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('profile_role', 'main')
      .select()
      .single();

    await supabase.from('profiles').update({
      subscription,
      expires_at: expiresAt || new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return data as Profile;
  }
);

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.currentProfile = null;
      state.allProfiles = [];
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.currentProfile = action.payload;
      state.error = null;
    },
    setAllProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.allProfiles = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProfileByUserId
      .addCase(fetchProfileByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfileByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // fetchAllProfilesByUserId
      .addCase(fetchAllProfilesByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProfilesByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.allProfiles = action.payload;
        state.error = null;
      })
      .addCase(fetchAllProfilesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profiles';
      })
      // createProfile
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.allProfiles.push(action.payload);
        state.error = null;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create profile';
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      // updateProfileById
      .addCase(updateProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileById.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProfile = action.payload;
        state.allProfiles = state.allProfiles.map(profile => 
          profile.id === updatedProfile.id ? updatedProfile : profile
        );
        if (state.currentProfile?.id === updatedProfile.id) {
          state.currentProfile = updatedProfile;
        }
        state.error = null;
      })
      .addCase(updateProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      // deleteProfile
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.allProfiles = state.allProfiles.filter(profile => profile.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete profile';
      })
      // updateSubscription
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
        state.error = null;
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update subscription';
      });
  },
});

export const { clearProfile, setProfile, setAllProfiles, setLoading, setError } = profilesSlice.actions;
export default profilesSlice.reducer; 
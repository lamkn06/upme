import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { request } from '../request';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithCredentials,
} from './user';

export const PROFILE_STATUS = {
  NEW: 'new',
  OLD: 'old',
};

export const fetchProfilePublicView = createAsyncThunk(
  'profile/fetchProfilePublicView',
  async ({ page }, { rejectWithValue }) => {
    try {
      const { data: profileData } = await request.get(
        `v1/profile/public/${page}`
      );
      return profileData;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const fetchProfileById = createAsyncThunk(
  'profile/fetchProfileById',
  async ({ id: profileId }) => {
    const { data: profileData } = await request.get(`v1/profile/${profileId}`);
    return profileData;
  }
);

export const fetchLocalProfile = createAsyncThunk(
  'profile/fetchLocalProfile',
  async (_, { getState }) => {
    return await getState().profile;
  }
);

export const uploadProfileImage = createAsyncThunk(
  'profile/uploadProfileImage',
  async (formData) => {
    const {
      data: { data: picture },
    } = await request.post('/v1/profile/picture', formData);
    return picture;
  }
);

export const fetchPDFLink = createAsyncThunk(
  'profile/fetchPDFLink',
  async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const {
      data: { data },
    } = await request.post(`/v1/profile/resume/share`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profile, { getState, rejectWithValue }) => {
    try {
      const { id } = getState().profile;

      if (id) {
        await request.put(`/v1/profile/${id}`, profile);
      }

      return profile;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  }
);

const initialState = {
  loading: false,
  id: '',
  displayName: '',
  profilePicture: '',
  fullName: '',
  location: '',
  phoneNumber: '',
  email: '',
  position: '',
  personalStatement: '',
  showLevel: true,
  timeline: [],
  skills: [],
  educations: [],
  languages: [],
  project: [],
  profileStatus: PROFILE_STATUS.NEW,
  toggleFetchProfile: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState: initialState,
  reducers: {
    setProfile: (state, action) => {
      Object.keys(action.payload).forEach((k) => {
        state[k] = action.payload[k];
      });
    },
    resetProfile: (state) => {
      Object.keys(initialState).forEach((k) => {
        state[k] = initialState[k];
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.profilePicture = action.payload;
      })
      .addCase(
        signInWithGoogle.rejected || signInWithFacebook.rejected,
        (state) => {
          state.profileStatus = PROFILE_STATUS.OLD;
        }
      )
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        const profile = action.payload.data;
        if (profile.showLevel === undefined) {
          profile.showLevel = undefined;
        }
        Object.keys(profile).forEach((k) => {
          state[k] = profile[k];
        });
        state.toggleFetchProfile = !state.toggleFetchProfile;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        Object.keys(action.payload).forEach((k) => {
          state[k] = action.payload[k];
        });
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          signInWithGoogle.fulfilled,
          signInWithFacebook.fulfilled,
          signInWithCredentials.fulfilled
        ),
        (state, action) => {
          const { profile } = action.payload.data;
          state.id = profile.id;
          state.fullName = profile.fullName;
          state.email = profile.email;
          state.displayName = profile.displayName;
          state.profilePicture = profile.profilePicture;
          state.profileStatus = PROFILE_STATUS.OLD;
        }
      );
  },
});

export const { resetProfile } = profileSlice.actions;

export const selectProfile = (state) => {
  const {
    id,
    fullName,
    displayName,
    location,
    phoneNumber,
    email,
    position,
    personalStatement,
    showLevel,
    timeline,
    skills,
    educations,
    languages,
    profilePicture,
  } = state.profile;
  return {
    id,
    fullName,
    displayName,
    location,
    phoneNumber,
    email,
    position,
    personalStatement,
    showLevel,
    timeline,
    skills,
    educations,
    languages,
    profilePicture,
  };
};
export const selectProfilePicture = (state) => state.profile.profilePicture;
export const selectDisplayName = (state) => state.profile.displayName;
export const selectLocalProfile = () => (dispatch, getState) => {
  const {
    fullName,
    displayName,
    location,
    phoneNumber,
    email,
    position,
    personalStatement,
    showLevel,
    timeline,
    skills,
    educations,
    languages,
    profilePicture,
  } = getState().profile;

  return {
    fullName,
    displayName,
    location,
    phoneNumber,
    email,
    position,
    personalStatement,
    showLevel,
    timeline,
    skills,
    educations,
    languages,
    profilePicture,
  };
};
export const selectToggleFetchProfile = (state) =>
  state.profile.toggleFetchProfile;
export const selectShowLevel = (state) => state.profile.showLevel;
export const selectProfileLoading = (state) => state.profile.loading;
export const selectProfileProjects = (state) => state.profile.projects;

export const setProfile = (profile) => (dispatch, getState) => {
  dispatch(profileSlice.actions.setProfile(profile));
  const { isAuthenticated } = getState().user;
  if (isAuthenticated) {
    dispatch(updateProfile(profile));
  }
};

export const setShowLevel = (showLevel) => (dispatch, getState) => {
  const profile = { showLevel: showLevel };
  dispatch(profileSlice.actions.setProfile(profile));
  const { isAuthenticated } = getState().user;
  if (isAuthenticated) {
    dispatch(updateProfile(profile));
  }
};

export default profileSlice.reducer;

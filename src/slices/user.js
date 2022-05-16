import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { request, requestEzDesk } from '../request';

export const signUpWithCredentials = createAsyncThunk(
  'user/signUpWithCredentials',
  async (credential, { rejectWithValue }) => {
    try {
      const { data } = await request.post('/v1/user', { ...credential });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signInWithCredentials = createAsyncThunk(
  'user/signInWithCredentials',
  async (credential, { rejectWithValue }) => {
    try {
      const { data } = await request.post('/v1/user/login', { ...credential });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  'user/signInWithGoogle',
  async (
    { email, fullName, displayName, profilePicture },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await request.post('/v1/user/login/oauth/google', {
        email,
        fullName,
        displayName,
        profilePicture,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signInWithFacebook = createAsyncThunk(
  'user/signInWithFacebook',
  async (
    { email, fullName, displayName, profilePicture },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await request.post('/v1/user/login/oauth/facebook', {
        email,
        fullName,
        displayName,
        profilePicture,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendForgotPasswordEmail = createAsyncThunk(
  'user/sendForgotPasswordEmail',
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await request.post('/v1/user/password/recover', {
        email,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendResetPassword = createAsyncThunk(
  'user/sentResetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const { data } = await request.put('/v1/user/password/', {
        token,
        password,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const subscribeWithEmail = createAsyncThunk(
  'user/subscribe',
  async (email, { rejectWithValue }) => {
    try {
      const {
        data: { data },
      } = await request.post(`/v1/misc/subscribe`, {
        email,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyAccount = createAsyncThunk(
  'user/verify',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { data: profileData } = await request.get(
        `v1/user/verify/${id}/${token}`
      );
      return profileData;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const getUserStorageInfo = createAsyncThunk(
  'user/storage',
  async (_, { rejectWithValue, getState }) => {
    try {
      const userId = getState().user.id;
      const { data: profileData } = await request.get(
        `v1/userstorage?userId=${userId}`
      );
      return profileData;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const upgradeStorageRequest = createAsyncThunk(
  'user/upgradeStorageRequest',
  async (formData) => {
    const requestData = {
      ...formData,
      customerName: formData.customerEmail,
      customerPhone: null,
      priority: 'LOW',
      state: 'OPEN',
      workspaceId: '1',
      departmentCode: 'SALE_DEP',
    };
    return await requestEzDesk.post('tickets/create', requestData);
  }
);

const initialState = {
  id: '',
  token: '',
  setting: {},
  isAuthenticated: false,
  sidebarStatus: true,
  publicViewStatus: false,
  welcomeBackStatus: false,
  sidebarVisible: false,
  boundingClientRect: {
    aboutMe: 0,
    education: 0,
    skill: 0,
    timeline: 0,
    project: 0,
    blog: 0,
  },
  didPreviewResume: false,
  currentCapacity: 0,
  totalCapacity: 300,
  availableCapacity: 300,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    changeBoundingClientRect: (state, action) => {
      state.boundingClientRect[action.payload[0]] = action.payload[1];
    },
    resetUser: () => initialState,
    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      Object.keys(action.payload).forEach(
        (k) => (state[k] = action.payload[k])
      );
    },
    toggleSidebarStatus: (state, action) => {
      state.sidebarStatus = action.payload;
    },
    togglePublicViewStatus: (state, action) => {
      state.publicViewStatus = action.payload;
    },
    toggleWelcomeBackStatus: (state, action) => {
      state.welcomeBackStatus = action.payload;
    },
    toggleDidPreviewResume: (state, action) => {
      state.didPreviewResume = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserStorageInfo.fulfilled, (state, action) => {
        const { currentCapacity, totalCapacity } = action.payload.data;
        // set storage info
        state.totalCapacity = totalCapacity;
        state.currentCapacity = currentCapacity;
        state.availableCapacity = totalCapacity - currentCapacity;
      })
      .addMatcher(
        isAnyOf(
          signInWithGoogle.fulfilled,
          signInWithFacebook.fulfilled,
          signInWithCredentials.fulfilled
        ),
        (state, action) => {
          const { id, token, setting } = action.payload.data;
          state.id = id;
          state.token = token;
          state.isAuthenticated = true;
          state.setting = setting;
        }
      );
  },
});

export const {
  changeBoundingClientRect,
  resetUser,
  toggleSidebarStatus,
  togglePublicViewStatus,
  toggleWelcomeBackStatus,
  toggleDidPreviewResume,
} = userSlice.actions;

export const selectAuthenticationStatus = (state) => state.user.isAuthenticated;

export const selectUserId = (state) => state.user.id;

export const selectUserPage = (state) => state.user.setting?.page;
export const selectBoundingClientRect = (state) => {
  return state.user.boundingClientRect;
};
export const selectPublicViewStatus = (state) => state.user.publicViewStatus;
export const selectSidebarStatus = (state) => state.user.sidebarStatus;
export const selectSidebarVisible = (state) => state.user.sidebarVisible;
export const selectWelcomeBackStatus = (state) => {
  if (state.user.isAuthenticated) {
    return false;
  }

  return state.user.welcomeBackStatus;
};
export const selectDidPreviewResume = (state) => state.user.didPreviewResume;

export const selectCurrentCapacity = (state) => state.user.currentCapacity;
export const selectTotalCapacity = (state) => state.user.totalCapacity;
export const selectAvailableCapacity = (state) => state.user.availableCapacity;

export default userSlice.reducer;

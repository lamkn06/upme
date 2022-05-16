import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { request } from '../request';
import { getUserStorageInfo } from './user';

export const getAllProject = createAsyncThunk(
  'project/getAllProject',
  async (_, { getState }) => {
    try {
      const userId = getState().user.id;
      const { data } = await request.get(`v1/project?userId=${userId}`);
      return data;
    } catch (e) {
      console.log(e);
    }
  }
);

export const getProjectById = createAsyncThunk(
  'project/getProjectById',
  async ({ projectId }, { getState }) => {
    try {
      const userId = getState().user.id;
      const { data } = await request.get(`v1/project/${projectId}/?userId=${userId}`);
      return data;
    } catch (e) {
      console.log(e);
    }
  }
);

export const uploadFile = createAsyncThunk(
  'project/uploadFile',
  async (file, { dispatch, getState, rejectWithValue }) => {
    try {
      const userId = getState().user.id;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      const { data } = await request.post(`v1/project/upload`, formData, {
        onUploadProgress: function (progressEvent) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          dispatch(changeCompletedPercent(percent));
        },
      });
      return data;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e);
    }
  }
);

export const uploadThumbnailForNewProject = createAsyncThunk(
  'project/uploadThumbnailForNewProject',
  async ({ file, currentThumbnail = null }, { getState, rejectWithValue }) => {
    try {
      const userId = getState().user.id;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('thumbnail', currentThumbnail);
      const { data } = await request.post(`v1/project/thumbnail`, formData);
      return data;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e);
    }
  }
);

export const uploadProjectThumbnail = createAsyncThunk(
  'project/uploadProjectThumbnail',
  async (
    { projectId, file, currentThumbnail },
    { getState, rejectWithValue }
  ) => {
    try {
      const userId = getState().user.id;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('thumbnail', currentThumbnail);
      const { data } = await request.post(
        `v1/project/${projectId}/thumbnail`,
        formData
      );
      return data;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'project/deleteFile',
  async ({ thumbnail, original }, { getState, rejectWithValue }) => {
    try {
      const userId = getState().user.id;
      const { data } = await request.delete(`v1/project/deletefile`, {
        data: {
          userId: userId,
          thumbnail: thumbnail || null,
          original: original || null,
        },
      });
      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const deleteFileOnEditingProject = createAsyncThunk(
  'project/deleteFileOnEditingProject',
  async ({ projectId, thumbnail, original }, { getState, rejectWithValue }) => {
    try {
      const userId = getState().user.id;
      const { data } = await request.delete(
        `v1/project/${projectId}/deletefile`,
        {
          data: {
            userId: userId,
            original: original || null,
          },
        }
      );
      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (project, { dispatch, getState }) => {
    try {
      const userId = getState().user.id;
      const { data } = await request.post(`v1/project`, {
        userId,
        ...project,
      });
      dispatch(projectSlice.actions.changeUploadedFiles([]));
      dispatch(getAllProject());
      dispatch(getUserStorageInfo()); // Update user storage info after we remove uploaded files
      return data;
    } catch (e) {
      console.log(e);
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async (project, { dispatch, getState }) => {
    try {
      const userId = getState().user.id;
      const { data } = await request.put(`v1/project/${project.id}`, {
        userId,
        ...project,
      });
      dispatch(projectSlice.actions.changeUploadedFiles([]));
      dispatch(getAllProject());
      dispatch(getUserStorageInfo()); // Update user storage info after we remove uploaded files
      return data;
    } catch (e) {
      console.log(e);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (projectId, { dispatch, getState }) => {
    try {
      const userId = getState().user.id;
      const { data } = await request.delete(`v1/project/${projectId}`, {
        data: { userId },
      });
      dispatch(projectSlice.actions.changeUploadedFiles([]));
      dispatch(getAllProject());
      return data;
    } catch (e) {
      console.log(e);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    isUploadingThumbnail: false,
    getAllProjectError: null,
    projects: [],
    uploadedFiles: [],
    tempThumbnail: '',
    tempProjectData: null,
    completedPercent: null,
    projectToView: undefined
  },
  reducers: {
    changeCompletedPercent: (state, action) => {
      state.completedPercent = action.payload;
    },
    changeUploadedFiles: (state, action) => {
      state.uploadedFiles = action.payload;
    },
    changeTemporaryThumbnail: (state, action) => {
      state.tempThumbnail = action.payload;
    },
    changeTempProjectData: (state, action) => {
      state.tempProjectData = {
        ...state.tempProjectData,
        ...action.payload,
      };
    },
    resetTempProjectData: (state) => {
      state.tempProjectData = null;
    },
    setProjectToView: (state, action) => {
      state.projectToView = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProject.fulfilled, (state, action) => {
        state.projects = action.payload.data;
      })
      .addCase(getAllProject.rejected, (state, action) => {
        state.getAllProjectError = action.payload;
      });

    builder.addCase(createProject.fulfilled, (state) => {
      // reset tempThumbnail because it's now submitted
      state.tempThumbnail = null;
    });

    builder.addCase(updateProject.fulfilled, (state) => {
      // reset tempThumbnail because it's now submitted
      state.tempThumbnail = null;
    });

    builder
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploadedFiles.push(action.payload.data);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploadedFiles.push(action.payload.data);
      });

    builder
      .addCase(uploadThumbnailForNewProject.pending, (state) => {
        state.isUploadingThumbnail = true;
      })
      .addMatcher(
        isAnyOf(
          uploadThumbnailForNewProject.fulfilled,
          uploadThumbnailForNewProject.rejected
        ),
        (state) => {
          state.isUploadingThumbnail = false;
        }
      );
  },
});

export const {
  changeCompletedPercent,
  changeUploadedFiles,
  changeTemporaryThumbnail,
  changeTempProjectData,
  resetTempProjectData,
  setProjectToView
} = projectSlice.actions;

export const selectAllProject = (state) => state.project.projects;

export const selectLocalProject = () => (dispatch, getState) => {
  const { projects } = getState().project;
  return {
    projects,
  };
};

export const selectTempProjectData = () => (dispatch, getState) => {
  return getState().project.tempProjectData;
};

export const selectUploadedFiles = (state) => state.project.uploadedFiles;

export const selectThumbnailUploadStatus = (state) =>
  state.project.isUploadingThumbnail;

export const selectTemporaryThumbnail = (state) => state.project.tempThumbnail;

export const selectProjectToView = (state) => state.project.projectToView

export const selectCompletedUploadPercent = (state) =>
  state.project.completedPercent;

export const removeTempThumbnail = () => (dispatch, getState) => {
  const tempThumbnail = getState().project.tempThumbnail;
  if (tempThumbnail) {
    dispatch(deleteFile({ thumbnail: tempThumbnail }));
  }
};

export const removeUploadedFiles = () => (dispatch, getState) => {
  const uploadedFiles = getState().project.uploadedFiles;
  uploadedFiles.forEach((fileObj) => {
    dispatch(deleteFile(fileObj));
  });
};

export const removeNewlyUploadedFilesAndThumbnail = () => (dispatch) => {
  dispatch(removeUploadedFiles());
  dispatch(changeUploadedFiles([]));
  dispatch(removeTempThumbnail());
  dispatch(changeTemporaryThumbnail(null));
};

export const handleCloseNewProjectModal = () => (dispatch) => {
  dispatch(removeNewlyUploadedFilesAndThumbnail());
  dispatch(resetTempProjectData(null));
  dispatch(getUserStorageInfo());
};

export const handleCloseEditProjectModal = () => (dispatch) => {
  dispatch(removeNewlyUploadedFilesAndThumbnail());
  dispatch(getUserStorageInfo()); // Update user storage info after we remove uploaded files
};

export const processDeleteUploadedFile =
  (file, fileIdx) => (dispatch, getState) => {
    dispatch(deleteFile(file));
    const newUploadedList = [...getState().project.uploadedFiles];
    newUploadedList.splice(fileIdx, 1);
    dispatch(changeUploadedFiles(newUploadedList));
  };

export default projectSlice.reducer;

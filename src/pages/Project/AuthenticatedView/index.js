import {
  Box,
  Button,
  AlertDialog,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeTemporaryThumbnail,
  changeUploadedFiles,
  getAllProject,
  selectAllProject,
  selectProjectToView,
  setProjectToView
} from '../../../slices/project';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const CreateModal = loadable(() => import('./CreateModal'));
const EditModal = loadable(() => import('./EditModal'));
const ViewProjectModal = loadable(() => import('./ViewProjectModal'));
const ProjectGrid = loadable(() => import('./ProjectGrid'));

function AuthenticatedView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isOpen: alertIsOpen, onOpen: alertOnOpen, onClose: alertOnClose } = useDisclosure();
  const [isCreateModalOpen, toggleCreateModal] = useState(false);
  const [isEditModalOpen, toggleEditModal] = useState(false);
  const [isViewProjectModalOpen, toggleViewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const projects = useSelector(selectAllProject);
  const projectToView = useSelector(selectProjectToView);
  const cancelRef = useRef();


  useEffect(() => {
    dispatch(getAllProject());
  }, [dispatch]);

  useEffect(() => {
    if (projectToView !== undefined) {
      const project = projects.find(proj => proj._id === projectToView);
      dispatch(setProjectToView(undefined));
      setSelectedProject(project);
      if (project === undefined) {
        alertOnOpen();
        return;
      }
      toggleViewProjectModal(true);
    }
  }, [projectToView])

  const createProject = useCallback(() => {
    dispatch(changeUploadedFiles([]));
    toggleCreateModal(true);
  }, [dispatch]);

  const viewProject = useCallback((project) => {
    setSelectedProject(project);
    toggleViewProjectModal(true);
    window.history?.pushState(null, '', `${window.location.pathname}/projects/${project._id}`);
  }, []);

  const editProject = useCallback((project) => {
    setSelectedProject(project);
    toggleEditModal(true);
    window.history?.pushState(null, '', `${window.location.pathname}/projects/${project._id}`);

  }, []);

  const updateURLPath = useCallback(() => {
    window.history?.pushState(null, '', window.location.pathname.replace(/\/projects([\s\S]*)$/, ''));
  })

  return (
    <Box>
      <ProjectGrid
        projects={projects}
        onCreate={createProject}
        onView={viewProject}
        onEdit={editProject}
      />

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => toggleCreateModal(false)}
      />

      {selectedProject && (
        <>
          <EditModal
            project={selectedProject}
            isOpen={isEditModalOpen}
            onClose={() => {
              toggleEditModal(false);
              setSelectedProject(null);
              updateURLPath();
            }}
          />

          <ViewProjectModal
            project={selectedProject}
            isOpen={isViewProjectModalOpen}
            onClose={() => {
              toggleViewProjectModal(false);
              setSelectedProject(null);
              updateURLPath();
            }}
            onOpenEditModal={() => {
              toggleViewProjectModal(false);
              toggleEditModal(true);
            }}
          />
        </>
      )}

      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={() => {
          updateURLPath();
          alertOnClose();
        }}
        isOpen={alertIsOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{t('Project not found')}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {t('Project not found')}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => {
              updateURLPath();
              alertOnClose();
            }}>
              {t('OK')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}

export default AuthenticatedView;

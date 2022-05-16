import { Box, Heading } from '@chakra-ui/react';
import loadable from '@loadable/component';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectProjectToView,
  setProjectToView
} from '../../../../slices/project';

const ViewProjectModal = loadable(() =>
  import('../../../Project/AuthenticatedView/ViewProjectModal')
);
const ProjectGrid = loadable(() =>
  import('../../../Project/AuthenticatedView/ProjectGrid')
);

function PublicViewProject(props) {
  const projects = props.data;
  const [isViewProjectModalOpen, toggleViewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const projectToView = useSelector(selectProjectToView);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  useEffect(() => {
    if (projectToView !== undefined) {
      const project = projects?.find(proj => proj._id === projectToView);
      if (project !== undefined) {
        setSelectedProject(project);
        toggleViewProjectModal(true);
        dispatch(setProjectToView(undefined));
      }
    }
  }, [projectToView])

  const viewProject = (project) => {
    setSelectedProject(project);
    toggleViewProjectModal(true);
    window.history?.pushState(null, '', `${window.location.pathname}/projects/${project._id}`);
  };

  const updateURLPath = () => {
    window.history?.pushState(null, '', window.location.pathname.replace(/\/projects([\s\S]*)$/, ''));
  };

  return (
    <Box flexGrow={1} py={'40px'}>
      <Heading as={'h5'} mt={'48px'} mb={'48px'} variant={'h5'}>
        {t('Project')}
      </Heading>
      <ProjectGrid projects={projects} onView={viewProject} readOnly />
      {selectedProject && (
        <>
          <ViewProjectModal
            project={selectedProject}
            isOpen={isViewProjectModalOpen}
            onClose={() => {
              updateURLPath();
              toggleViewProjectModal(false)
            }}
            readOnly
          />
        </>
      )}
    </Box>
  );
}

export default PublicViewProject;

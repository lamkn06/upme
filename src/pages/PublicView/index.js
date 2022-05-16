import {
  Box,
  Flex,
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
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  selectLocalProfile,
  fetchProfilePublicView,
  selectToggleFetchProfile,
} from '../../slices/profile';
import {
  selectLocalProject,
  selectProjectToView,
  setProjectToView,
} from '../../slices/project';
import useClientRect from '../../hooks/useClientRect';
import {
  changeBoundingClientRect,
  selectUserPage,
  togglePublicViewStatus,
} from '../../slices/user';
import { useParams } from 'react-router';

const PageNotFound = loadable(() => import('../NotFound'));
const PublicViewPageWrapper = loadable(() =>
  import('../../components/PublicViewPageWraper'));

const PublicViewPersonalInfo = loadable(() =>
  import('./components/PublicViewPersonalInfo')
);
const PublicViewEducation = loadable(() =>
  import('./components/PublicViewEducation')
);
const PublicViewSkill = loadable(() => import('./components/PublicViewSkill'));
const PublicViewExperience = loadable(() =>
  import('./components/PublicViewExperience')
);
const PublicViewProject = loadable(() =>
  import('./components/PublicViewProject')
);
const PublicViewBlog = loadable(() => import('./components/PublicViewBlog'));

function PublicView() {
  const { page: urlPage } = useParams();
  const dispatch = useDispatch();
  const userPage = useSelector(selectUserPage);
  const [profileData, setProfile] = useState({});
  const toggleFetchProfile = useSelector(selectToggleFetchProfile);
  const [personalInfoRect, personalInfoRef, setPersonalInfoRef] = useClientRect();
  const [educationRect, educationRef, setEducationRef] = useClientRect();
  const [skillRect, skillRef, setSkillRef] = useClientRect();
  const [experienceRect, experienceRef, setExperienceRef] = useClientRect();
  const [projectRect, projectRef, setProjectRef] = useClientRect();
  const [blogRect, blogRef, setBlogRef] = useClientRect();
  const [pageNotFound, setPageNotFound] = useState(false);
  const cancelRef = useRef();
  const { t } = useTranslation();

  const { isOpen: alertIsOpen, onOpen: alertOnOpen, onClose: alertOnClose } = useDisclosure();

  const onChangeBoundingClientRectTop = useCallback(
    (name, value) => {
      dispatch(changeBoundingClientRect([name, value]));
    },
    [dispatch]
  );

  const personalInfoData = useMemo(
    () => ({
      personalStatement: profileData.personalStatement,
      fullName: profileData.fullName,
      displayName: profileData.displayName,
      position: profileData.position,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber,
      location: profileData.location,
      profilePicture: profileData.profilePicture,
    }),
    [profileData]
  );

  const educationData = useMemo(() => {
    const sortBigToSmall = (edu1, edu2) => {
      const edu1Date = edu1.educateTo ? moment(edu1.educateTo) : -1;
      const edu2Date = edu2.educateTo ? moment(edu2.educateTo) : -1;
      if (edu1Date > edu2Date) return -1;
      if (edu1Date < edu2Date) return 1;
      return 0;
    };

    const educations = profileData.educations
      ? [...profileData.educations]
      : [];

    if (educations.length > 0) {
      educations.sort(sortBigToSmall);
    }
    return {
      educations,
    };
  }, [profileData]);

  const skillData = useMemo(
    () => ({
      skills: profileData.skills,
      languages: profileData.languages
    }),
    [profileData]
  );

  const experienceData = useMemo(() => {
    const sortBigToSmall = (exp1, exp2) => {
      if (exp1.isCurrent) return -1;
      if (exp2.isCurrent) return 1;
      const exp1Date = exp1.endDate ? moment(exp1.endDate) : -1;
      const exp2Date = exp2.endDate ? moment(exp2.endDate) : -1;
      if (exp1Date > exp2Date) return -1;
      if (exp1Date < exp2Date) return 1;
      return 0;
    };
    const timeline = profileData.timeline ? [...profileData.timeline] : [];
    if (timeline.length > 0) {
      timeline.sort(sortBigToSmall);
    }
    return {
      experiences: timeline,
    };
  }, [profileData]);

  const getProfileData = useCallback(() => {
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
    } = dispatch(selectLocalProfile());

    const {
      projects
    } = dispatch(selectLocalProject());

    setProfile({
      fullName,
      displayName,
      location,
      phoneNumber,
      email,
      position,
      showLevel,
      personalStatement,
      timeline,
      skills,
      educations,
      languages,
      profilePicture,
      projects
    });
  }, [dispatch]);

  const processFetchPublicViewData = useCallback(() => {
    dispatch(fetchProfilePublicView({ page: urlPage }))
      .then((response) => {
        const { data, success } = response.payload;
        if (success) {
          setProfile(data);
          dispatch(togglePublicViewStatus(true));
        }
        else {
          //redirect to HomePage if fetchProfilePublicView not success
          setPageNotFound(true);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }, [dispatch, urlPage]);

  useEffect(() => {
    if (urlPage === userPage) { // exact /publicview path
      getProfileData();
    }
    else (
      processFetchPublicViewData()
    )
  }, [
    dispatch,
    getProfileData,
    processFetchPublicViewData,
    urlPage,
    userPage,
    toggleFetchProfile
  ]);

  const onPageScroll = useCallback(() => {
    if (personalInfoRef.current) {
      onChangeBoundingClientRectTop(
        'personalInfo',
        personalInfoRef.current.getBoundingClientRect().top
      );
    }
    if (educationRef.current) {
      onChangeBoundingClientRectTop(
        'education',
        educationRef.current.getBoundingClientRect().top
      );
    }
    if (skillRef.current) {
      onChangeBoundingClientRectTop(
        'skill',
        skillRef.current.getBoundingClientRect().top
      );
    }
    if (experienceRef.current) {
      onChangeBoundingClientRectTop(
        'experience',
        experienceRef.current.getBoundingClientRect().top
      );
    }
    if (projectRef.current) {
      onChangeBoundingClientRectTop(
        'project',
        projectRef.current.getBoundingClientRect().top
      );
    }
    if (blogRef.current) {
      onChangeBoundingClientRectTop(
        'blog',
        blogRef.current.getBoundingClientRect().top
      );
    }
  }, [
    personalInfoRef,
    blogRef,
    educationRef,
    projectRef,
    skillRef,
    experienceRef,
    onChangeBoundingClientRectTop,
  ]);

  useEffect(() => {
    window.addEventListener('scroll', onPageScroll);
    return () => {
      window.removeEventListener('scroll', onPageScroll);
    };
  }, [onPageScroll]);

  useEffect(() => {
    if (personalInfoRect) {
      onChangeBoundingClientRectTop('personalInfo', personalInfoRect.top);
    }
    else onChangeBoundingClientRectTop('personalInfo', undefined);
  }, [personalInfoRect, onChangeBoundingClientRectTop]);

  useEffect(() => {
    if (educationRect) {
      onChangeBoundingClientRectTop('education', educationRect.top);
    }
    else onChangeBoundingClientRectTop('education', undefined);
  }, [educationRect, onChangeBoundingClientRectTop]);

  useEffect(() => {
    if (skillRect) {
      onChangeBoundingClientRectTop('skill', skillRect.top);
    }
    else onChangeBoundingClientRectTop('skill', undefined);
  }, [onChangeBoundingClientRectTop, skillRect]);

  useEffect(() => {
    if (experienceRect) {
      onChangeBoundingClientRectTop('experience', experienceRect.top);
    }
    else onChangeBoundingClientRectTop('experience', undefined);
  }, [onChangeBoundingClientRectTop, experienceRect]);

  useEffect(() => {
    if (projectRect) {
      onChangeBoundingClientRectTop('project', projectRect.top);
    }
    else onChangeBoundingClientRectTop('project', undefined);
  }, [onChangeBoundingClientRectTop, projectRect]);

  useEffect(() => {
    if (blogRect) {
      onChangeBoundingClientRectTop('blog', blogRect.top);
    }
    else onChangeBoundingClientRectTop('blog', undefined);
  }, [onChangeBoundingClientRectTop, blogRect]);

  const projectToView = useSelector(selectProjectToView);
  useEffect(() => {
    if (projectToView !== undefined && profileData?.projects) {
      const project = profileData.projects?.find(proj => proj._id === projectToView);
      if (project === undefined) {
        dispatch(setProjectToView(undefined));
        alertOnOpen();
        return;
      }
    }
  }, [projectToView, profileData.projects])

  const updateURLPath = useCallback(() => {
    window.history?.pushState(null, '', window.location.pathname.replace(/\/projects([\s\S]*)$/, ''));
  })
  return (
    <>
      {pageNotFound ? <PageNotFound /> :
        <PublicViewPageWrapper profileData={personalInfoData}>
          <Flex direction={'column'} alignItems={'center'} className={'pubicViewContent'} >
            <Flex align={'center'} grow={1} w={'100%'} >
              <Flex ref={setPersonalInfoRef} grow={1}>
                <PublicViewPersonalInfo data={personalInfoData} />
              </Flex>
            </Flex>

            {educationData.educations?.length > 0 && (<Flex
              align={'center'}
              grow={1}
              minH={'50vh'}
              minW={['100%', '730px']}
              maxW={['100%', '80%', "70%"]}
            >
              <Flex ref={setEducationRef} grow={1}>
                <PublicViewEducation data={educationData} />
              </Flex>
            </Flex>)}

            {(skillData.skills?.length > 0 || skillData.languages?.length > 0) && (
              <Flex
                align={'center'}
                grow={1}
                minH={'50vh'}
                minW={['100%', '730px']}
                maxW={['100%', '80%', "70%"]}
              >
                <Flex ref={setSkillRef} grow={1}>
                  <PublicViewSkill data={skillData} showLevel={profileData.showLevel} />
                </Flex>
              </Flex>)}

            {experienceData.experiences?.length > 0 && (<Flex
              align={'center'}
              grow={1}
              minH={'50vh'}
              minW={['100%', '730px']}
              maxW={['100%', '80%', "70%"]}
            >
              <Flex ref={setExperienceRef} grow={1} w={['100%', '730px']}>
                <PublicViewExperience data={experienceData} />
              </Flex>
            </Flex>
            )}
            {profileData.projects?.length > 0 && (<Flex
              align={'flex-start'}
              grow={1}
              minH={'50vh'}
              minW={['100%', '730px']}
              maxW={['100%', '80%', "70%"]}
            >
              <Flex ref={setProjectRef} grow={1}>
                <PublicViewProject data={profileData.projects} />
              </Flex>
            </Flex>)}

            {false && (<Flex
              align={'flex-start'}
              grow={1}
              minH={'70vh'}
              minW={['100%', '730px']}
              maxW={['100%', '80%', "70%"]}
            >
              <Flex ref={setBlogRef} grow={1}>
                <PublicViewBlog />
              </Flex>
            </Flex>)}
            <Box minH={'20vh'}>
            </Box>
          </Flex>
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
        </PublicViewPageWrapper>
      }
    </>
  );
}

export default PublicView;

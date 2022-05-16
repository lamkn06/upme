import { Flex } from '@chakra-ui/react';
import loadable from '@loadable/component';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useClientRect from '../../hooks/useClientRect';
import { changeBoundingClientRect } from '../../slices/user';

const AboutMe = loadable(() => import('../AboutMe'));
const Blog = loadable(() => import('../Blog'));
const Education = loadable(() => import('../Education'));
const PageWrapper = loadable(() => import('../../components/PageWrapper'));
const Project = loadable(() => import('../Project'));
const Skill = loadable(() => import('../Skill'));
const Timeline = loadable(() => import('../Timeline'));

function HomePage() {
  const dispatch = useDispatch();
  const [aboutMeRect, aboutMeRef, setAboutMeRef] = useClientRect();
  const [educationRect, educationRef, setEducationRef] = useClientRect();
  const [skillRect, skillRef, setSkillRef] = useClientRect();
  const [timelineRect, timelineRef, setTimelineRef] = useClientRect();
  const [projectRect, projectRef, setProjectRef] = useClientRect();
  const [blogRect, blogRef, setBlogRef] = useClientRect();
  const onChangeBoundingClientRectTop = useCallback(
    (name, value) => {
      dispatch(changeBoundingClientRect([name, value]));
    },
    [dispatch]
  );
  const onPageScroll = useCallback(() => {
    if (aboutMeRef.current) {
      onChangeBoundingClientRectTop(
        'aboutMe',
        aboutMeRef.current.getBoundingClientRect().top
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
    if (timelineRef.current) {
      onChangeBoundingClientRectTop(
        'timeline',
        timelineRef.current.getBoundingClientRect().top
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
    aboutMeRef,
    blogRef,
    educationRef,
    onChangeBoundingClientRectTop,
    projectRef,
    skillRef,
    timelineRef,
  ]);

  useEffect(() => {
    document.title = 'Upme - Edit Profile';
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onPageScroll);
    return () => {
      window.removeEventListener('scroll', onPageScroll);
    };
  }, [onPageScroll]);

  useEffect(() => {
    if (aboutMeRect) {
      onChangeBoundingClientRectTop('aboutMe', aboutMeRect.top);
    }
  }, [aboutMeRect, onChangeBoundingClientRectTop]);

  useEffect(() => {
    if (educationRect) {
      onChangeBoundingClientRectTop('education', educationRect.top);
    }
  }, [educationRect, onChangeBoundingClientRectTop]);

  useEffect(() => {
    if (skillRect) {
      onChangeBoundingClientRectTop('skill', skillRect.top);
    }
  }, [onChangeBoundingClientRectTop, skillRect]);

  useEffect(() => {
    if (timelineRect) {
      onChangeBoundingClientRectTop('timeline', timelineRect.top);
    }
  }, [onChangeBoundingClientRectTop, timelineRect]);

  useEffect(() => {
    if (projectRect) {
      onChangeBoundingClientRectTop('project', projectRect.top);
    }
  }, [onChangeBoundingClientRectTop, projectRect]);

  useEffect(() => {
    if (blogRect) {
      onChangeBoundingClientRectTop('blog', blogRect.top);
    }
  }, [onChangeBoundingClientRectTop, blogRect]);

  return (
    <PageWrapper>
      <Flex direction={'column'}>
        <Flex
          align={'center'}
          borderBottom={'1px dashed #DBE1E6'}
          grow={1}
          minH={'50vh'}
          pb={'16px'}
        >
          <Flex ref={setAboutMeRef} grow={1}>
            <AboutMe />
          </Flex>
        </Flex>

        <Flex
          align={'center'}
          borderBottom={'1px dashed #DBE1E6'}
          grow={1}
          minH={'50vh'}
          pb={'16px'}
        >
          <Flex ref={setEducationRef} grow={1}>
            <Education />
          </Flex>
        </Flex>

        <Flex
          align={'center'}
          borderBottom={'1px dashed #DBE1E6'}
          grow={1}
          minH={'50vh'}
          pb={'16px'}
        >
          <Flex ref={setSkillRef} grow={1}>
            <Skill />
          </Flex>
        </Flex>

        <Flex
          align={'center'}
          borderBottom={'1px dashed #DBE1E6'}
          grow={1}
          minH={'50vh'}
          pb={'16px'}
        >
          <Flex ref={setTimelineRef} grow={1}>
            <Timeline />
          </Flex>
        </Flex>

        <Flex
          align={'center'}
          borderBottom={'1px dashed #DBE1E6'}
          grow={1}
          mb={'90px'}
          minH={'50vh'}
          pb={'90px'}
        >
          <Flex ref={setProjectRef} grow={1}>
            <Project />
          </Flex>
        </Flex>

        <Flex align={'center'} grow={1} minH={'50vh'}>
          <Flex ref={setBlogRef} grow={1}>
            <Blog />
          </Flex>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}

export default HomePage;

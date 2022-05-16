import { Box, Tooltip, VStack, HStack, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  selectBoundingClientRect,
  selectSidebarStatus,
} from '../../slices/user';
import { ReactComponent as EducationIcon } from '../../images/icons/u_book-reader.svg';
import { ReactComponent as BlogIcon } from '../../images/icons/u_clipboard-alt.svg';
import { ReactComponent as TimelineIcon } from '../../images/icons/u_clock.svg';
import { ReactComponent as ProjectIcon } from '../../images/icons/u_cube.svg';
import { ReactComponent as HomeIcon } from '../../images/icons/u_home-alt.svg';
import { ReactComponent as SkillIcon } from '../../images/icons/u_layer-group.svg';

const items = [
  {
    location: 'personalInfo',
    name: 'Personal info',
    icon: HomeIcon,
  },
  {
    location: 'education',
    name: 'Education',
    icon: EducationIcon,
  },
  {
    location: 'skill',
    name: 'Skill',
    icon: SkillIcon,
  },
  {
    location: 'experience',
    name: 'Experience',
    icon: TimelineIcon,
  },
  {
    location: 'project',
    name: 'Project',
    icon: ProjectIcon,
  },
  {
    location: 'blog',
    name: 'Blog',
    icon: BlogIcon,
  },
];

const PublicViewMenuItems = () => {
  const { t } = useTranslation();
  const [boundingClientRect, sidebarStatus] = [
    useSelector(selectBoundingClientRect),
    useSelector(selectSidebarStatus),
  ];

  const [highlight, setHighlight] = useState('personalInfo');

  const onMenuItemClick = useCallback(
    (view) => {
      switch (view) {
        case 'personalInfo':
          window.scrollTo({
            top: boundingClientRect.personalInfo - 64 + window.scrollY,
          });
          break;
        case 'education':
          window.scrollTo({
            top: boundingClientRect.education - 64 + window.scrollY,
          });
          break;
        case 'skill':
          window.scrollTo({
            top: boundingClientRect.skill - 64 + window.scrollY,
          });
          break;
        case 'experience':
          window.scrollTo({
            top: boundingClientRect.experience - 64 + window.scrollY,
          });
          break;
        case 'project':
          window.scrollTo({
            top: boundingClientRect.project - 64 + window.scrollY,
          });
          break;
        case 'blog':
          window.scrollTo({
            top: boundingClientRect.blog - 64 + window.scrollY,
          });
          break;
        default:
      }
    },
    [boundingClientRect]
  );

  useEffect(() => {
    const min = Math.min(
      Math.abs(boundingClientRect.personalInfo),
      Math.abs(boundingClientRect.blog || Infinity),
      Math.abs(boundingClientRect.education || Infinity),
      Math.abs(boundingClientRect.project || Infinity),
      Math.abs(boundingClientRect.skill || Infinity),
      Math.abs(boundingClientRect.experience || Infinity)
    );

    switch (min) {
      case boundingClientRect.personalInfo:
        setHighlight('personalInfo');
        break;
      case boundingClientRect.education:
        setHighlight('education');
        break;
      case boundingClientRect.skill:
        setHighlight('skill');
        break;
      case boundingClientRect.experience:
        setHighlight('experience');
        break;
      case boundingClientRect.project:
        setHighlight('project');
        break;
      case boundingClientRect.blog:
        setHighlight('blog');
        break;
      default:
    }
  }, [
    boundingClientRect.personalInfo,
    boundingClientRect.blog,
    boundingClientRect.education,
    boundingClientRect.project,
    boundingClientRect.skill,
    boundingClientRect.experience,
  ]);

  return (
    <VStack
      direction={'column'}
      alignItems={'flex-start'}
      spacing={'22px'}
      mt={'46px'}
    >
      {items.map((i) => (
        <HStack
          key={`publicviewMenu_${i.location}`}
          cursor={'pointer'}
          spacing={sidebarStatus ? '12px' : 0}
          onClick={() => onMenuItemClick(i.location)}
          display={boundingClientRect[i.location] !== undefined ? 'flex': 'none'}
        >
          <Tooltip
            isDisabled={sidebarStatus}
            hasArrow
            shouldWrapChildren
            gutter={32}
            placement={'right'}
            label={t(i.name)}
            bg="#666666"
            color="white"
            sx={{
              '.chakra-tooltip__arrow': {
                bg: '#666666',
              },
            }}
          >
            <Box
              as={i.icon}
              fill={highlight === i.location ? 'primary' : 'white'}
            />
          </Tooltip>

          {sidebarStatus && (
            <Text variant={'body1'} color={'white'} ms={'12px'}>
              {t(i.name)}
            </Text>
          )}
        </HStack>
      ))}
    </VStack>
  );
};

export default PublicViewMenuItems;

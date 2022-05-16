import { Box, Tooltip, VStack, Text, HStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ReactComponent as EducationIcon } from '../../images/icons/u_book-reader.svg';
import { ReactComponent as BlogIcon } from '../../images/icons/u_clipboard-alt.svg';
import { ReactComponent as TimelineIcon } from '../../images/icons/u_clock.svg';
import { ReactComponent as ProjectIcon } from '../../images/icons/u_cube.svg';
import { ReactComponent as HomeIcon } from '../../images/icons/u_home-alt.svg';
import { ReactComponent as SkillIcon } from '../../images/icons/u_layer-group.svg';
import {
  selectBoundingClientRect,
  selectSidebarStatus,
} from '../../slices/user';

const MenuItems = () => {
  const { t } = useTranslation();
  const [boundingClientRect, sidebarStatus] = [
    useSelector(selectBoundingClientRect),
    useSelector(selectSidebarStatus),
  ];
  const [highlight, setHighlight] = useState('aboutMe');

  const onMenuItemClick = useCallback(
    (view) => {
      switch (view) {
        case 'aboutMe':
          window.scrollTo({
            top: boundingClientRect.aboutMe - 64 + window.scrollY,
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
        case 'timeline':
          window.scrollTo({
            top: boundingClientRect.timeline - 64 + window.scrollY,
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
      Math.abs(boundingClientRect.aboutMe),
      Math.abs(boundingClientRect.blog),
      Math.abs(boundingClientRect.education),
      Math.abs(boundingClientRect.project),
      Math.abs(boundingClientRect.skill),
      Math.abs(boundingClientRect.timeline)
    );
    switch (min) {
      case boundingClientRect.aboutMe:
        setHighlight('aboutMe');
        break;
      case boundingClientRect.education:
        setHighlight('education');
        break;
      case boundingClientRect.skill:
        setHighlight('skill');
        break;
      case boundingClientRect.timeline:
        setHighlight('timeline');
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
    boundingClientRect.aboutMe,
    boundingClientRect.blog,
    boundingClientRect.education,
    boundingClientRect.project,
    boundingClientRect.skill,
    boundingClientRect.timeline,
  ]);

  return (
    <VStack direction={'column'} alignItems={'flex-start'} spacing={'22px'}>
      <HStack
        cursor={'pointer'}
        spacing={sidebarStatus ? '12px' : 0}
        onClick={() => {
          onMenuItemClick('aboutMe');
        }}
      >
        <Tooltip
          isDisabled={sidebarStatus}
          hasArrow
          shouldWrapChildren
          gutter={32}
          placement={'right'}
          label={t('AboutMe')}
          bg="#666666"
          color="white"
          sx={{
            '.chakra-tooltip__arrow': {
              bg: '#666666',
            },
          }}
        >
          <Box
            as={HomeIcon}
            fill={highlight === 'aboutMe' ? '#06DCFF' : 'white'}
          />
        </Tooltip>

        {sidebarStatus && <Text color={'white'}>{t('AboutMe')}</Text>}
      </HStack>

      <HStack
        cursor={'pointer'}
        spacing={sidebarStatus ? '12px' : 0}
        onClick={() => {
          onMenuItemClick('education');
        }}
      >
        <Tooltip
          isDisabled={sidebarStatus}
          hasArrow
          shouldWrapChildren
          gutter={32}
          placement={'right'}
          label={t('Education')}
          bg="#666666"
          color="white"
          sx={{
            '.chakra-tooltip__arrow': {
              bg: '#666666',
            },
          }}
        >
          <Box
            as={EducationIcon}
            fill={highlight === 'education' ? '#06DCFF' : 'white'}
          />
        </Tooltip>

        {sidebarStatus && <Text color={'white'}>{t('Education')}</Text>}
      </HStack>

      <HStack
        cursor={'pointer'}
        spacing={sidebarStatus ? '12px' : 0}
        onClick={() => {
          onMenuItemClick('skill');
        }}
      >
        <Tooltip
          isDisabled={sidebarStatus}
          hasArrow
          shouldWrapChildren
          gutter={32}
          placement={'right'}
          label={t('Skill')}
          bg="#666666"
          color="white"
          sx={{
            '.chakra-tooltip__arrow': {
              bg: '#666666',
            },
          }}
        >
          <Box
            as={SkillIcon}
            fill={highlight === 'skill' ? '#06DCFF' : 'white'}
          />
        </Tooltip>

        {sidebarStatus && <Text color={'white'}>{t('Skill')}</Text>}
      </HStack>

      <HStack
        cursor={'pointer'}
        spacing={sidebarStatus ? '12px' : 0}
        onClick={() => {
          onMenuItemClick('timeline');
        }}
      >
        <Tooltip
          isDisabled={sidebarStatus}
          hasArrow
          shouldWrapChildren
          gutter={32}
          placement={'right'}
          label={t('Timeline')}
          bg="#666666"
          color="white"
          sx={{
            '.chakra-tooltip__arrow': {
              bg: '#666666',
            },
          }}
        >
          <Box
            as={TimelineIcon}
            fill={highlight === 'timeline' ? '#06DCFF' : 'white'}
          />
        </Tooltip>

        {sidebarStatus && <Text color={'white'}>{t('Timeline')}</Text>}
      </HStack>

      <HStack
        cursor={'pointer'}
        spacing={sidebarStatus ? '12px' : 0}
        onClick={() => {
          onMenuItemClick('project');
        }}
      >
        <Tooltip
          isDisabled={sidebarStatus}
          hasArrow
          shouldWrapChildren
          gutter={32}
          placement={'right'}
          label={t('Project')}
          bg="#666666"
          color="white"
          sx={{
            '.chakra-tooltip__arrow': {
              bg: '#666666',
            },
          }}
        >
          <Box
            as={ProjectIcon}
            fill={highlight === 'project' ? '#06DCFF' : 'white'}
          />
        </Tooltip>

        {sidebarStatus && <Text color={'white'}>{t('Project')}</Text>}
      </HStack>

      <HStack
        cursor={'pointer'}
        spacing={sidebarStatus ? '12px' : 0}
        onClick={() => {
          onMenuItemClick('blog');
        }}
      >
        <Tooltip
          isDisabled={sidebarStatus}
          hasArrow
          shouldWrapChildren
          gutter={32}
          placement={'right'}
          label={t('Blog')}
          bg="#666666"
          color="white"
          sx={{
            '.chakra-tooltip__arrow': {
              bg: '#666666',
            },
          }}
        >
          <Box
            as={BlogIcon}
            fill={highlight === 'blog' ? '#06DCFF' : 'white'}
          />
        </Tooltip>

        {sidebarStatus && <Text color={'white'}>{t('Blog')}</Text>}
      </HStack>
    </VStack>
  );
};

export default MenuItems;

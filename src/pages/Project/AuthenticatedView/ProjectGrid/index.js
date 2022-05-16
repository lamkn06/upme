import {
  Box,
  Center,
  Flex,
  IconButton,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReactComponent as MoreIcon } from '../../../../images/icons/u_ellipsis-h.svg';
import { ReactComponent as AddIcon } from '../../../../images/icons/u_focus-add.svg';
import Placeholder from '../../../../images/assets/upload-placeholder.png';
import { deleteProject } from '../../../../slices/project';

const DeleteConfirmationModal = loadable(() =>
  import('../DeleteConfirmationModal')
);
const OptionButton = loadable(() => import('./OptionButton'));

function ProjectGrid(props) {
  const { projects, onCreate, onView, onEdit, readOnly = false } = props;
  const { t } = useTranslation();
  const [isOpen, toggleOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const dispatch = useDispatch();  
  const onDelete = useCallback((projectId) => {
    toggleOpen(true);
    setSelectedProjectId(projectId);
  }, []);

  const handleDeleteProject = async () => {
    await dispatch(deleteProject(selectedProjectId))
  }

  return (
    <SimpleGrid columns={[1, 3]} gap={'24px'}>
      {!readOnly && (
        <Center
          border={'1px dashed #DBE1E6'}
          cursor={'pointer'}
          h={'233px'}
          rounded={2}
          onClick={onCreate}
        >
          <VStack spacing={'12px'}>
            <AddIcon fill={'#C1C9CD'} height={40} width={40} />

            <Text color={'#C1C9CD'} fontWeight={500}>
              {t('Create a project')}
            </Text>
          </VStack>
        </Center>
      )}

      {projects.map((i) => (
        <Flex
          key={i._id}
          border={'1px solid #DBE1E6'}
          flexDirection={'column'}
          h={'233px'}
        >
          <Image
            src={i.thumbnailDefault}
            fallbackSrc={Placeholder}
            cursor={'pointer'}
            fit={'cover'}
            h={'128px'}
            onClick={() => onView(i)}
          />
          <Box flexGrow={1} p={'16px'}>
            <Flex align={'center'}>
              <Box
                color={'black'}
                fontSize={16}
                fontWeight={500}
                lineHeight={'24px'}
                maxW={'calc(100% - 32px)'}
                overflow={'hidden'}
                textOverflow={'ellipsis'}
                whiteSpace={'nowrap'}
              >
                {i.name}
              </Box>
              {!readOnly && (
                <Popover placement={'bottom-end'}>
                  <PopoverTrigger>
                    <IconButton
                      aria-label={'Edit Project'}
                      icon={<Box as={MoreIcon} fill={'#3F4647'} w={'12px'} />}
                      bg={'light'}
                      border={'1px solid #DBE1E6'}
                      boxSize={'24px'}
                      ms={'auto'}
                      minW={'auto'}
                      p={0}
                    />
                  </PopoverTrigger>
                  <PopoverContent rounded={2} w={'auto'} _focus={{}}>
                    <PopoverBody d={'flex'} flexDir={'column'}>
                      <OptionButton onClick={() => onEdit(i)}>
                        {t('Edit')}
                      </OptionButton>
                      <OptionButton onClick={() => onDelete(i._id)}>
                        {t('Delete')}
                      </OptionButton>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              )}
            </Flex>
            {i.dateCompleted && (
              <Box
                color={'#3F4647'}
                fontSize={14}
                lineHeight={'22px'}
                mt={'2px'}
              >
                {t('Date')}: {new Date(i.dateCompleted).getFullYear()}
              </Box>
            )}
            <Flex mt={'2px'} sx={{ gap: '4px' }} overflow={'hidden'}>
              {i.tags.slice(0, 3).map((i) => (
                <Center
                  key={i.label}
                  border={'1px solid #DBE1E6'}
                  fontSize={12}
                  fontWeight={500}
                  h={'22px'}
                  w={'64px'}
                  rounded={16}
                >
                  {i.label}
                </Center>
              ))}
            </Flex>
          </Box>
        </Flex>
      ))}

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={() => toggleOpen(false)}
        projectId={selectedProjectId}
        onConfirm={handleDeleteProject}
      />
    </SimpleGrid>
  );
}

export default ProjectGrid;

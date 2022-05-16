import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Box,
    Button,
    IconButton,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    useDisclosure,
    Image
} from '@chakra-ui/react';
import { ReactComponent as EditIcon } from '../../../../images/icons/u_edit-alt.svg';
import { useTranslation } from 'react-i18next';


const SortableItem = (props) => {
    const {
        file,
        idx,
        itemAction
    } = props;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.id });
    const { t } = useTranslation();
    const { onOpen, onClose, isOpen } = useDisclosure();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        border: '2px solid gray',
        backgroundColor: '#cccccc',
        zIndex: isDragging ? '100' : 'auto',
        opacity: isDragging ? 0.3 : 1
    };

    const handleDeleteFile = () => {
        itemAction.onDeleteFile(file, idx);
        onClose();
    };

    return (
        <Box ref={setNodeRef} style={style}
            width={['45%', '200px']}
            height={['150px', '200px']}
            margin={['5px', '10px']}
        >
            <Box
                h={'100%'}
                display={'flex'}
                justifyContent={'center'}
                position={'relative'}>
                <div
                    {...listeners}
                    {...attributes}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        zIndex: 1
                    }}
                />
                {file && <Image
                    src={file.originalType === 1 ? file.thumbnail : file.original || URL.createObjectURL(file)}
                    fit={'cover'}
                />}
                <Popover
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                    placement={'bottom-end'}
                >
                    <PopoverTrigger>
                        <IconButton
                            aria-label={'Edit'}
                            icon={<Box as={EditIcon} boxSize={'18px'} fill={'black'} />}
                            boxSize={'30px'}
                            bg={'primary'}
                            pos={'absolute'}
                            top={'10px'}
                            right={'10px'}
                            minW={'auto'}
                            rounded={'full'}
                            zIndex={2}
                        />
                    </PopoverTrigger>
                    <PopoverContent maxW={'110px'} rounded={2} _focus={{}}>
                        <PopoverBody>
                            <Button
                                variant={'ghost'}
                                cursor={'pointer'}
                                fontSize={14}
                                fontWeight={'normal'}
                                p={0}
                                h={'auto'}
                                textTransform={'none'}
                                _hover={{}}
                                onClick={handleDeleteFile}
                            >
                                {t('Delete file')}
                            </Button>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>

            </Box>
        </Box>
    );
};

export default SortableItem;

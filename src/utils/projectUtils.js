import { Image, Box } from '@chakra-ui/react';

export const checkExceedCapacity = (files, availableCapacity) => {
  let totalSize = 0;
  files.forEach((file) => {
    totalSize += file.size;
  });
  return totalSize > availableCapacity;
};

export const displayUploadFileEditMode = (fileData, idx) => {
  if (fileData.type?.includes('video')) {
    // Origin fileData
    return (
      <Box mt={idx > 0 ? '30px' : 0} w={'fit-content'} maxW={'100%'}>
        <video controls={'controls'}>
          <source src={fileData.original || URL.createObjectURL(fileData)} />
        </video>
      </Box>
    );
  }
  if (fileData.originalType === 1) {
    // Uploaded data
    return (
      <Box mt={idx > 0 ? '30px' : 0} w={'fit-content'} maxW={'100%'}>
        <video controls={'controls'}>
          <source src={fileData.original || URL.createObjectURL(fileData)} />
        </video>
      </Box>
    );
  }
  return (
    <Image
      key={fileData.original}
      src={fileData.original || URL.createObjectURL(fileData)}
      mt={idx > 0 ? '30px' : 0}
      maxH={'600px'}
    />
  );
};

import { chakra, Image } from '@chakra-ui/react';

const Video = chakra('video', {
  baseStyle: {
    maxH: '600px',
    w: 'auto',
  },
});

const DisplayFile = ({ file }) => {
  if (file.type?.includes('video')) {
    // Origin fileData
    return (
      <Video controls>
        <source src={file.original || URL.createObjectURL(file)} />
      </Video>
    );
  }

  if (file.originalType === 1) {
    // Uploaded data
    return (
      <Video controls>
        <source src={file.original || URL.createObjectURL(file)} />
      </Video>
    );
  }

  return (
    <Image src={file.original || URL.createObjectURL(file)} maxH={'600px'} />
  );
};

export default DisplayFile;

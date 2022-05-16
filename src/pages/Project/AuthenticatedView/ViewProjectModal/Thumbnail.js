import { Box, chakra, Image } from '@chakra-ui/react';

const Video = chakra('video', {
  baseStyle: {
    w: '100%'
  }
})

const Thumbnail = ({ thumbnail }) => {
  if (!thumbnail) return null
  if (thumbnail && thumbnail.originalType === 1) {
    //Video
    return (
      <Box w={['100%', 'auto']} key={thumbnail.original}
        height={'100%'}
      >
        <Video
          controls={"controls"}
          h={['inherit', '100%']}
          w={['inherit', 'auto']}
        >
          <source src={thumbnail.original || URL.createObjectURL(thumbnail)} />
        </Video>
      </Box>
    )
  }

  return (
    <Image
      mx={'auto'}
      w={['100%', 'auto']}
      h={['auto', 'auto']}
      maxH={['unset','100%']}
      src={thumbnail.original || URL.createObjectURL(thumbnail)}
    />
  )
}

export default Thumbnail
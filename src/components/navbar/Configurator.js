// Chakra Imports
import {
  Button,
  Box,
  Flex,
  Icon,
  Text,
  Image,
  useColorModeValue,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
  SimpleGrid,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Light from 'assets/img/layout/Light.png';
import Dark from 'assets/img/layout/Dark.png';
import coffeeTime from 'assets/img/coffeeTime.png';
// Assets
import {
  MdSettings,
  MdFullscreen,
  MdOutlineFullscreenExit,
} from 'react-icons/md';
import ConfiguratorRadio from './ConfiguratorRadio';
import { HSeparator } from 'components/separator/Separator';
export default function HeaderLinks(props) {
  //eslint-disable-next-line
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navbarIcon = useColorModeValue('black', 'white');
  const textColor = useColorModeValue('black', 'white');


  const bgSeparator = useColorModeValue('white', '#363840');
  const activeShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.22)',
    'none',
  );
  const activeBg = useColorModeValue('#EDDBC0', '#FFF8F0');
  const Bg = useColorModeValue('guardianLight.150', 'guardianDark.100');
  const drawerBg = useColorModeValue('guardianLight.100', 'guardianDark.200');

  const fullscreenBorder = useColorModeValue(
    'secondaryGray.100',
    'whiteAlpha.200',
  );
  const fullscreenBg = useColorModeValue(
    'rgba(11,11,11,0)',
    'rgba(11,11,11,0)',
  );
  const configuratorShadow = useColorModeValue(
    '-20px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '-22px 32px 51px 4px rgba(0, 0, 0, 0.5)',
  );

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Watch for fullscreenchange
  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);
  return (
    <>
      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={onOpen}
      >
        <Icon me="10px" h="18px" w="18px" color={navbarIcon} as={MdSettings} />
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === 'rtl' ? 'left' : 'right'}
        blockScrollOnMount={false}
      >
        <DrawerOverlay />
        <DrawerContent
          boxShadow={configuratorShadow}
          w={{ base: 'calc(100vw - 32px)', md: '400px' }}
          maxW={{ base: 'calc(100vw - 32px)', md: '400px' }}
          ms={{
            base: '0px',
            sm: '16px',
          }}
          me={{
            base: '16px',
          }}
          my={{
            sm: '16px',
          }}
          borderRadius="16px"
          bg={drawerBg}
        >
          <DrawerHeader
            w={{ base: '100%', md: '400px' }}
            pt="24px"
            pb="0px"
            px="24px"
          >

            <DrawerCloseButton color={textColor} />
            <Flex alignItems="center">
              <Flex
                h="48px"
                w="48px"
                me="20px"
                borderRadius="999px"
              //bgGradient="linear(to-b, brand.400, brand.600)"
              >
                <Image src={coffeeTime} />
              </Flex>
              <Box>
                <Text color={textColor} fontSize="xl" fontWeight="700">
                  Configurator
                </Text>
              </Box>
            </Flex>
            <HSeparator my="30px" bg={bgSeparator} />
          </DrawerHeader>
          <DrawerBody
            pt="0px"
            pb="24px"
            w={{ base: '100%', md: '400px' }}
            maxW="unset"
          >
            <Flex flexDirection="column">
              <Text color={textColor} mb="12px" fontWeight={'700'}>
                Color Mode
              </Text>
              <SimpleGrid columns={2} gap="20px" mb="30px">
                <ConfiguratorRadio
                  onClick={colorMode === 'dark' ? toggleColorMode : null}
                  active={colorMode === 'dark' ? false : true}
                  label={<Text>Light</Text>}
                >
                  <Image
                    src={Light}
                    maxW={{ base: '100%', md: '130px' }}
                    borderRadius="8px"
                  />
                </ConfiguratorRadio>
                <ConfiguratorRadio
                  onClick={colorMode === 'light' ? toggleColorMode : null}
                  active={colorMode === 'light' ? false : true}
                  label={<Text>Dark</Text>}
                >
                  <Image
                    src={Dark}
                    maxW={{ base: '100%', md: '130px' }}
                    borderRadius="8px"
                  />
                </ConfiguratorRadio>
              </SimpleGrid>
            </Flex>
            <HSeparator my="30px" bg={bgSeparator} />
            <Button
              h="max-content"
              w="100%"
              py="16px"
              border="1px solid"
              display={'flex'}
              justifyContent="center"
              alignItems="center"
              bg={fullscreenBg}
              _hover={{ background: Bg, boxShadow: activeShadow }}
              _focus={{ background: Bg, boxShadow: activeShadow }}
              _active={{ background: activeBg, boxShadow: activeShadow }}
              borderColor={fullscreenBorder}
              onClick={() => {
                isFullscreen
                  ? document.exitFullscreen()
                  : document.body.requestFullscreen();
              }}
            >
              {isFullscreen ? 'Exit fullscreen' : 'Fullscreen mode'}
              <Icon
                ms="6px"
                h="18px"
                w="18px"
                color={textColor}
                as={isFullscreen ? MdOutlineFullscreenExit : MdFullscreen}
              />
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

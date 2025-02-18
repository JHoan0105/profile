// Chakra imports
import {
  Box,
  useDisclosure,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import Footer from './components/FooterProfile';
import Section from './components/section'
import FixedPlugin from 'components/fixedPlugin/FixedPlugin'
// Layout components
import Sidebar from './components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import routes from 'routes';

// Custom Chakra theme
export default function Dashboard(props) {

  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [mini, setMini] = useState(false);
  const [hovered, setHovered] = useState(false);
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== '/profile/full-screen-maps';
  };
  const getActiveRoute = (routes) => {
    let activeRoute = 'Profile';
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbar(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].secondary;
        }
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      if (route.layout === '/Profile') {
        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      }
      if (route.collapse) {
        return getRoutes(route.items);
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = 'ltr';
  const { onOpen } = useDisclosure();
  const bg = useColorModeValue('background.100', 'background.900');
  return (
    <Box bg={bg} h="100vh" w="100vw" >
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar
          hovered={hovered}
          setHovered={setHovered}
          mini={mini}
          routes={routes}
          display="none"
          {...rest}
        />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={
            mini === false
              ? { base: '100%', xl: 'calc( 100% - 400px )' }
              : mini === true && hovered === true
                ? { base: '100%', xl: 'calc( 100% - 400px )' }
                : { base: '100%', xl: 'calc( 100% - 300px )' }
          }
          maxWidth={
            mini === false
              ? { base: '100%', xl: 'calc( 100% - 400px )' }
              : mini === true && hovered === true
                ? { base: '100%', xl: 'calc( 100% - 400px )' }
                : { base: '100%', xl: 'calc( 100% - 300px )' }
          }
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          {/*Items*/}
          <Box ml='30px'>
            <Section headerSample='headerSample'/>
            <SimpleGrid
              columns={{ sm: 2, md: 2, lg: 2 }}
            >
              <Box>
                <Section
                  header={<>Education
                <br />
                    Algonquin College (Ottawa, ON)
                  </>
              }
                  rightText='2021-2023'
                  contentHeader='Computer Engineering Technology - Computing Science'
                  additional={<>(Ontario College Advanced Diploma)
                    <br />
                    Graduated with Honours
                    <br />
                    GPA 3.93/4.0
                  </>
                  }
                  listItems={[]}
                />
                <Section
                  header={<> Work Experience
                    <br />
                    Guardian Mobility (Ottawa, ON)
                  </>}
                  subTitle='Aerospace and Defence - Aerial Software and Hardware Solution'
                  rightText='2023-Dec 2024'
                  contentHeader='IT Technical Support and Software Developer'
                  listItems={['Technical Support - Through Calls, Emails, Video Calls',
                    'Analyze, Troubleshoot, Identify Root Causes and Resolve Issues',
                    'Prepared training slides, Provided Platform user training (webinar)',
                    'Assist customer with importing KML files (editing file to be compatible with application)',
                    'Platform Testing'
                  ]}
                  subListItem='Web application development'
                  subList={['Develop features based on use cases and requirements',
                    'Optimize application performance through code review',
                    'Integrate third-party API to enhance user experience',
                    'Collaborated closely with designer, product managers and system engineer to deliver high-quality features on time'
                  ]}
                />
                <Section
                  header='Flexus Electronics Inc. (Kanata, ON)'
                  subTitle='Parts and Supplies'
                  rightText='Summer 2022'
                  contentHeader='Assembler'
                  listItems={['Reading Schematics and Assembling wires and connectors',
                    'Preparing wires and cables to Assemble - Crimping and Stripping Wires, Labelling',
                  'Supply Management - Ensure all parts and tools available in workshop area to complete work order']}
                />
                <Section
                  header='Crazy Pho You (Ottawa, ON)'
                  subTitle='Restaurant'
                  rightText='2017-2020'
                  contentHeader='Owner/Operator'
                  listItems={['Supply Management and Inventory Control',
                    'Resource Management - Hiring, Training, and contracting',
                    'Bookkeeping - Reports Filing, Payroll management and filing, Record Revenue and Expenses',
                    'Administrative duties - collaborating with related-personnel, keeping up with health and safety standard',
                  'Operating Duties - cooking, serving, cleaning, and all other required operating labour work']}
                />
                <Section
                  header={<>
                    Project
                    <br />
                    Mechanic To You (Ottawa, ON)
                  </>}
                  subTitle='School Project'
                  rightText='2022-2023'
                  contentHeader='Mobile App Software Development'
                  listItems={['Android UI implemented with various NuGet Packages (Xamarin Forms, Community tool kit, Xamarin Essentials, and SQLite PCL)',
                    'Restful API implementation (C# application)',
                    'MariaDb database of Mechanic to You implementation',
                    'Ubuntu with Apache web server application',
                    'Project Management']}
                />
                <Section
                  header='Additional Skills'
                  listItems={[
                    'Excellent time management, organizational and project management skills',
                    'Quick to adapt to working environment',
                    'Scrupulous communication and working habit']}
                />
              </Box>
              {/*right column*/}
              <Box>
                <Section
                  header={<>
                    Program-Related Skills
                    <br />
                    Data Structure
                  </>}
                  listItems={[
                    'Binary Tree, Heap, Stack, Queue, Deque, and Linked list.',
                    'Multi-threaded programming in C, C++, C# and Java',
                    'Implementation of FSM\'s Moore and Mealy models.',
                    'GUI programming using Java Swing and implemented MVC',
                    'REST architectural style programming.',
                  'Understanding and implementation of database design normalized to 3NF.']}
                />
                <Section
                  header='Web Programming'
                  listItems={[
                    'HTML, JavaScript, and PHP web design.',
                    'C# web application programming designing both MVC and MVVM with utilization of ORM.',
                    'Implemented JWT tokens and OAuth2',
                    'Implemented WebSocket',
                    'Implemented and design RESTful API in Node.js using Express']}
                />
                <Section
                  header='Numerical Programming and Statistical Analysis'
                  listItems={[
                    'RStudio programming using numerical theories for plotting, building graphs and finding statistics.',
                    'Utilizing known techniques for deriving derivatives and integrals on complex functions.',
                    'Utilization of machine learning algorithm(k - means, KNN, k - clustering) and understanding of the many other']}
                />
                <Section
                  header='Network Programming'
                  listItems={[
                    'Java socket programming using JDBC tools, java.io and java.net libraries for database queries and to implement multi - threaded connections with attention to concurrency and thread safety.',
                    'Tracking TCP and UDP connections using Wireshark and Packet Tracer.',
                    'Simulating switch adapters using Packet Tracer.',
                    'MQTT programming using Node-RED (IoT)']}
                />
                <Section
                  header='Real Time Programming'
                  listItems={[
                    'Neutrino RTOS/ Momentics IDE.',
                    'Processes, Threads and Resources management.',
                    'Inter-process communication.']}
                />
                <Section
                  header='Assembly/Processor Programming'
                  listItems={[
                    'Using ASM IDE assembler and Dragon12 processor simulator to make calculations using looping conditions and labels on arrays as well as utilizing the stack.',
                    'Programmed a counter display using an API to count in both HEX and BCD']}
                />
                <Section
                  header='Compiler'
                  listItems={[
                    'Simulate lexical and syntactical analyzers in C using VS to compile.',
                    'Knowledge of NFA and DFA machine and CFG rules.',
                    'Knowledge of semantic analyzer, intermediate states and optimizers.']}
                />
                <Section
                  header='Debugger'
                  listItems={[
                    'GDB and Valgrind tools',
                    'C/C++ cassert/assert.h and Java JUnit API.']}
                />
              </Box>
            </SimpleGrid>
            <Section
              header='Certifications, Training, and Professional Development'
              listItems={[
                'Udemy Certificate of Completion - TOGAF Enterprise Architecture 2024',
                'Udemy Certificate of Completion - CCBA-IIBA 2024',
                'Udemy Certificate of Completion - CompTIA A+ Core 1 (220-1101) 2024',
                'Udemy Certificate of Completion - CompTIA A+ Core 2 (220-1102) 2024',
                'Linkedin Learning Certificate of Completion - Azure Active Directory: Basics (2022)',
                'PCAP Programming Essentials in Python Statement of Achievement - OpenEDG Python Institute (2021)',
                'NDG Linux Essential Course Completion Certificate - Network Development Group (2021)',
                'Food Handler Certifications - Ontario Health Approved (2018)',
                'Smart Serve Ontario Certification - Alcohol and Gaming Commission of Ontario Approved (2017)'
              ]}
            />
            <Section
              header='References'
              subTitle='Available Upon Request'
            />
          </Box>
          <Box>
            <Footer />
            <FixedPlugin />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}

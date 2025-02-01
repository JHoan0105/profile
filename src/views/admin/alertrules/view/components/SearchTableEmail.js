/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import getAlertRuleEmailList from 'services/alertrules/getAlertRuleEmailList';
import setEmailList from 'services/alertrules/setEmailList';
import { EMAIL_REGEX, MAX_ACTIVE_EMAILS } from 'variables/constants'
import { jsonIt, jsonToString } from 'tools/codec'

// Imports
import {
  Button,
  Flex,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Select,
} from "@chakra-ui/react";
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import React, { useMemo, useEffect, useState, useRef } from "react";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import the icons
import Card from 'components/card/Card'

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import InputField from "components/fields/InputField";

// Default function
function SearchTable2(props) {
  const [tableData, setTableData] = useState([]);
  const { columnsData } = props;
  const accountInfo = getAccountInfo();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;
  const toast = useToast();
  const [activeEmails, setActiveEmails] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState()
  const [newEmail, setNewEmail] = useState('');
  const cancelRef = useRef();
  const bgAlertbox = useColorModeValue('white', 'guardianDark.500');

  const fetchData = async () => {
    try {
      const response = await getAlertRuleEmailList(currentAccountNumber);
      setTableData(response);
      const active = response.filter(item => item.enabled).map(item => item.email);
      setActiveEmails(active);
      console.log('Alert rule email list: ', response);
    } catch (error) {
      console.error("Error fetching accounts data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // get filters here
    const storedFilters = localStorage.getItem('filters');
    if (storedFilters) {
      setFilters(() => jsonIt(storedFilters));
    }
  }, [])
  useEffect(() => {
    setPageSize(Number(filters?.list?.alertemail || 10))
  }, [filters])

  const handleEnable = async (row, enableState) => {
    const updatedActiveEmails = [...activeEmails];
    const clickedEmail = row.email;
    if (!updatedActiveEmails.includes(clickedEmail)) {
      updatedActiveEmails.push(clickedEmail);
    }
    if (updatedActiveEmails.length > MAX_ACTIVE_EMAILS) {
      onFailed(`Cannot have more than ${MAX_ACTIVE_EMAILS} active emails.`);
      return;
    }
    const emailList = updatedActiveEmails.join(';');
    try {
      const result = await setEmailList(currentAccountNumber, emailList);
      if (result) {
        onSuccess(`Successfully saving new recipient`);
        fetchData();
      } else {
        onFailed('something went wrong');
      }
    } catch (error) {
      const tmp = error.toString();
      console.log("Error", tmp);
      onFailed(tmp);
    }
  };

  const handleDisable = async (row, enableState) => {
    const updatedActiveEmails = activeEmails.filter(email => email !== row.email);
    if (updatedActiveEmails.length === 0) {
      onFailed('Cannot have less than 1 active email.');
      return;
    }
    const emailList = updatedActiveEmails.join(';');
    try {
      const result = await setEmailList(currentAccountNumber, emailList);
      if (result) {
        onSuccess(`Successfully updated recipients`);
        fetchData();
      } else {
        onFailed('something went wrong');
      }
    } catch (error) {
      const tmp = error.toString();
      console.log("Error", tmp);
      onFailed(tmp);
    }
  };

  const onFailed = (s) => {
    (() => {
      toast({
        title: s || 'Failed updating recipients',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = (s) => {
    (() => {
      toast({
        title: s || 'Successfully updated recipients',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    })()
  }

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    gotoPage,
    pageCount,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setGlobalFilter,
    state,
    initialState,
    setPageSize,
  } = tableInstance;
  initialState.pageSize = 10;
  const createPages = (count) => {
    let arrPageCount = [];
    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }
    return arrPageCount;
  };

  const { pageIndex, pageSize } = state;
  const textColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const brandColor = useColorModeValue("brand.500", "brand.400");

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSaveEmail = async () => {
    if (EMAIL_REGEX.test(newEmail)) {
      // Validate email format

      // Get current active emails
      const updatedActiveEmails = [...activeEmails];

      // Add the new email if it's not already included
      if (!updatedActiveEmails.includes(newEmail)) {
        updatedActiveEmails.push(newEmail);
      }

      // Check if the number of emails exceeds MAX_ACTIVE_EMAILS
      if (updatedActiveEmails.length > MAX_ACTIVE_EMAILS) {
        toast({
          title: `Cannot have more than ${MAX_ACTIVE_EMAILS} active emails.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Create a ";" delimited list of emails
      const emailList = updatedActiveEmails.join(';');

      try {
        // Save the updated email list to the database
        const result = await setEmailList(currentAccountNumber, emailList);

        if (result) {
          // On Success
          onSuccess('Successfully saved new email address');
          fetchData(); // Refresh data after saving

          // Close the dialog
          handleDialogClose();
        } else {
          onFailed('Something went wrong while saving');
        }
      } catch (error) {
        console.error('Error saving email:', error);
        onFailed(error.toString());
      }
    } else {
      // Invalid email format
      toast({
        title: 'Invalid email address',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };


  return (
    <Card>
      <Flex
        direction='column'
        w='100%'
        overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Flex
          align={{ sm: "flex-start", lg: "flex-start" }}
          justify={{ sm: "space-between", lg: "space-between" }} // Changed justify property to space-between for both screen sizes
          w='100%'
          px='22px'
          mb='36px'
          ml={{ base: "0", lg: "-10px", xl: "-20px" }} // Adjusting margin-left for larger screens
        >
          <SearchBar
            onChange={(e) => setGlobalFilter(e.target.value)}
            h='44px'
            w={{ lg: "35%" }}
            ml={{ base: "0", lg: "10px", xl: "20px" }} // Adjusting margin-left for larger screens
            borderRadius='16px'
          />
          {(accountInfo?.isGuardianAdmin || accountInfo?.isAccountManagement) && activeEmails.length < MAX_ACTIVE_EMAILS ? (
            <Button
              width='160px'
              variant='brand'
              color='white'
              fontSize='sm'
              fontWeight='500'
              _hover={{ bg: "brand.600" }}
              _active={{ bg: "brand.500" }}
              _focus={{ bg: "brand.500" }}
              onClick={() => {
                setNewEmail('');
                setIsDialogOpen(true);
              }}
            >
              Add Email
            </Button>
          ) : null}
        </Flex>
        <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe='10px'
                    key={index}
                    borderColor={borderColor}>
                    <Flex
                      justify='space-between'
                      align='center'
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color='#F26539'>
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "EMAIL") {
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "ENABLED") {
                      if (row.original.enabled) {
                        data = (
                          <FaCheckCircle
                            color="green"
                            title="enabled"
                            size={20}
                            style={{ marginLeft: '15px', cursor: 'pointer' }}
                            onClick={() => handleDisable(row.original, false)} // Call handleClick function on click
                          />
                        );
                      } else {
                        data = (
                          <FaTimesCircle
                            color="red"
                            title="disabled"
                            size={20}
                            style={{ marginLeft: '15px', cursor: 'pointer' }}
                            onClick={() => handleEnable(row.original, false)} // Call handleClick function on click
                          />
                        );
                      }
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor={borderColor}>
                        {data}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Flex
          direction={{ sm: "column", md: "row" }}
          justify='space-between'
          align='center'
          w='100%'
          px={{ md: "22px" }}>
          <Text
            pr='5px'
            fontSize='xs'
            color='guardianColor.100'
            fontWeight='normal'
            mb={{ sm: "24px", md: "0px" }}>
            Showing {pageSize * pageIndex + 1} to{" "}
            {pageSize * (pageIndex + 1) <= tableData.length
              ? pageSize * (pageIndex + 1)
              : tableData.length}{" "}
            of {tableData.length} entries
          </Text>
          <Flex align='center'>
            <Select
              fontSize='sm'
              h='25px'
              borderRadius='10%'
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                localStorage.setItem('filters', jsonToString(({ ...filters, list: { ...filters?.list, alertemail: e.target.value } })));
              }
              }>
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='40'>40</option>
              <option value='100'>100</option>
            </Select>
            <Text
              pl='5px'
              me='10px'
              minW='max-content'
              fontSize='xs'
              color='guardianColor.100'
              fontWeight='normal'>
              entries per page
            </Text>
          </Flex>
          <Stack direction='row' alignSelf='flex-end' spacing='4px' ms='auto'
          >
            <Button
              variant='no-effects'
              onClick={() => previousPage()}
              transition='all .5s ease'
              size='small'
              w='25px'
              h='25px'
              borderRadius='50%'
              bg='transparent'
              border='1px solid'
              borderColor={useColorModeValue("gray.200", "white")}
              display={
                tableData.length / pageSize > 4 ? "none" : canPreviousPage ? "flex" : "none"
              }
              _hover={{
                bg: "whiteAlpha.100",
                opacity: "0.7",
              }}>
              <Icon as={MdChevronLeft} w='16px' h='16px' color={textColor} />
            </Button>
            {tableData.length / pageSize > 4 ? (
              <NumberInput
                max={pageCount - 1}
                min={1}
                w='75px'
                mx='6px'
                defaultValue='1'
                onChange={(e) => gotoPage(e)}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper onClick={() => nextPage()} />
                  <NumberDecrementStepper onClick={() => previousPage()} />
                </NumberInputStepper>
              </NumberInput>
            ) : (
              createPages(pageCount).map((pageNumber, index) => {
                return (
                  <Button
                    size='small'
                    variant='no-effects'
                    transition='all .5s ease'
                    onClick={() => gotoPage(pageNumber - 1)}
                    w='25px'
                    h='25px'
                    borderRadius='50%'
                    bg={
                      pageNumber === pageIndex + 1 ? brandColor : "transparent"
                    }
                    border={
                      pageNumber === pageIndex + 1
                        ? "none"
                        : "1px solid lightgray"
                    }
                    _hover={
                      pageNumber === pageIndex + 1
                        ? {
                          opacity: "0.7",
                        }
                        : {
                          bg: "whiteAlpha.100",
                        }
                    }
                    key={index}>
                    <Text
                      fontSize='xs'
                      color={pageNumber === pageIndex + 1 ? "#fff" : textColor}>
                      {pageNumber}
                    </Text>
                  </Button>
                );
              })
            )}
            <Button
              variant='no-effects'
              onClick={() => nextPage()}
              transition='all .5s ease'
              size='small'
              w='25px'
              h='25px'
              borderRadius='50%'
              bg='transparent'
              border='1px solid'
              borderColor={useColorModeValue("gray.200", "white")}
              display={tableData.length / pageSize > 4 ? "none" : canNextPage ? "flex" : "none"}
              _hover={{
                bg: "whiteAlpha.100",
                opacity: "0.7",
              }}>
              <Icon as={MdChevronRight} w='16px' h='16px' color={textColor} />
            </Button>
          </Stack>
        </Flex>
      </Flex>

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={bgAlertbox}>
            <AlertDialogHeader color={textColor} fontSize="lg" fontWeight="bold">
              Add Email Address
            </AlertDialogHeader>

            <AlertDialogBody color={textColor} mb={0}>
              <InputField
                id='newEmailAddress'
                label=''
                placeholder='Enter email address'
                onChange={(e) => setNewEmail(e.target.value)}
                value={newEmail}
                mb={-1}
                mt={-3}
              />
            </AlertDialogBody>

            <AlertDialogFooter mt={0}>
              <Button
                _hover={{ backgroundColor: "brand.400" }}
                backgroundColor={"green.500"}
                ref={cancelRef}
                colorScheme="blue"
                onClick={handleDialogClose}
              >
                Cancel
              </Button>
              <Button
                _hover={{ backgroundColor: "brand.400" }}
                backgroundColor={"green.500"}
                colorScheme="blue"
                onClick={handleSaveEmail} ml={3}
              >
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
}

export default SearchTable2;


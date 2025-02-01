/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
import deleteSubAccount from 'services/manageAccounts/deleteSubAccount'
import addSubAccount from 'services/manageAccounts/addSubAccount'
import checkAccountNumber from 'services/account/checkAccountNumber'
import {jsonIt, jsonToString } from 'tools/codec'

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
  Select,
} from "@chakra-ui/react";
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import React, { useMemo, useState, useEffect } from "react";

import { MdChevronRight, MdChevronLeft } from "react-icons/md";

import Card from "components/card/Card.js";

import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import the icons

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Default function
function AccountTable(props) {

  const { columnsData, tableData, subAccounts, setSubAccounts, useremail, adminAccount, setAddSubAccount } = props;
  const toast = useToast();

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const [filters, setFilters] = useState()

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize:5
      },
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

  initialState.pageSize = 5

  const createPages = (count) => {
    let arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };

  const { pageIndex, pageSize } = state;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const brandColor = useColorModeValue("brand.500", "brand.400");

  useEffect(() => {
    // get filters here
    const storedFilters = localStorage.getItem('filters');
    if (storedFilters) {
      setFilters(() => jsonIt(storedFilters));
    }
  }, [])
  useEffect(() => {
    setPageSize(Number(filters?.list?.usersaccounts || 5))
  }, [filters])

  const handleAdd = async (accountnumber) => {
    try {
      const accountChecked = await checkAccountNumber(accountnumber);
      const selectedAccount = await checkAccountNumber(adminAccount);

      const result = await addSubAccount(accountnumber, accountChecked?.name, useremail, adminAccount, selectedAccount?.name)
      if (result?.status) {
        onSuccess(`Successfully saving new recipient`);
        setAddSubAccount(accountnumber)
      } else {
        console.log('CHECKING ACCOUNTS',accountChecked, selectedAccount)
        onFailed(result?.message || 'something went wrong.');
      }
    } catch (error) {
      const tmp = error.toString();
      console.log("Error", tmp);
      onFailed(tmp);
    }
  };

  const handleRemove = async (accountnumber) => {

    try {
      const result = await deleteSubAccount(accountnumber, useremail)
      if (result?.status) {
        onSuccess(`Successfully updated recipients`);
        setSubAccounts(accountnumber)
      } else {
        onFailed(result?.message|| 'something went wrong.');
      }
    } catch (error) {
      const tmp = error.toString();
      console.log("Error", tmp);
      onFailed(tmp);
    }
  };



  const onFailed = () => {

    (() => {
      toast({
        title: 'Failed to update subaccount(s).',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = () => {

    (() => {
      toast({
        title: 'Successfully updated user\'s subaccount(s).',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    })()
  }

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
            w={{ lg: "390px" }}
            ml={{ base: "0", lg: "10px", xl: "20px" }} // Adjusting margin-left for larger screens
            borderRadius='16px'
          />
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
                    let data = '';
                    if (cell.column.Header === 'NAME') {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === 'NUMBER') {
                      data = (
                        <Text
                          me="10px"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === 'ADD/REMOVE') {
                      if (subAccounts?.some(a=> a?.account_number === row.original?.account_number)) {
                        data = (
                          <FaCheckCircle
                            color="green"
                            title="Click to remove subaccount"
                            size={20}
                            style={{ marginLeft: '15px', cursor: 'pointer' }}
                            onClick={() => handleRemove(row.original?.account_number)} // Call handleClick function on click
                          />
                        );
                      } else {
                        data = (
                          <FaTimesCircle
                            color="red"
                            title="Click to add subaccount"
                            size={20}
                            style={{ marginLeft: '15px', cursor: 'pointer' }}
                            onClick={() => handleAdd(row.original?.account_number)} // Call handleClick function on click
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
                localStorage.setItem('filters', jsonToString(({ ...filters, list: { ...filters?.list, usersaccounts: e.target.value } })));
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
    </Card>
  );
}

export default AccountTable;

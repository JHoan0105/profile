/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import { PATH_NAME } from 'variables/constants'
import { jsonIt, jsonToString } from 'tools/codec'

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
  Select,
} from "@chakra-ui/react";
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import the icons

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Default function
function DeviceList(props) {
  const { columnsData, tableData, children } = props;
  const accountInfo = getAccountInfo();
  const columns = useMemo(() => columnsData || [], [columnsData]);
  const data = useMemo(() => tableData || [], [tableData]);
  const [filters, setFilters] = useState();
  const nav = useNavigate();

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
    setPageSize,
    state,
    initialState,
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
  useEffect(() => {
    // get filters here
    const storedFilters = localStorage.getItem('filters');
    if (storedFilters) {
      setFilters(() => jsonIt(storedFilters));
    }
  }, [])
  useEffect(() => {
    setPageSize(Number(filters?.list?.devices || 10))
  }, [filters])

  return (
    <>
      <Flex
        direction='column'
        w='100%'
        css={{
          overflowX: 'scroll',
          '@media screen and (min-width: 48em)': {
            overflowX: 'auto',
          },
        }}>
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
          {children}

          {(accountInfo?.isGuardianAdmin || accountInfo?.isCertusProvisioning) ? (
            <Button
              width='110px'
              variant='brand'
              color='white'
              fontSize='sm'
              fontWeight='500'
              _hover={{ bg: "brand.600" }}
              _active={{ bg: "brand.500" }}
              _focus={{ bg: "brand.500" }}
              onClick={() => nav(PATH_NAME.DEVICES_CREATE)}
            >
              Create Device
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
                  {/* DEBUG : ALL HEADER FIELDS USED FOR DEBUGGING -- Prod: remove accountNumber bundle and SIM*/}
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "Identifier") {
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "Model") {
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "IMEI") {
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "Activation Date") {
                      const joinDate = new Date(cell.value);
                      // Set the time to 23:59:59
                      joinDate.setHours(23, 59, 59);
                      const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
                      const formattedDate = joinDate.toLocaleDateString('en-US', options);
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {formattedDate !== 'Invalid Date' ? formattedDate : ''}
                        </Text>
                      );
                    } else if (cell.column.Header === "Deactivation Date") {
                      const joinDate = new Date(cell.value);
                      // Set the time to 23:59:59
                      joinDate.setHours(23, 59, 59);
                      const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
                      const formattedDate = joinDate.toLocaleDateString('en-US', options);
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {formattedDate !== 'Invalid Date' ? formattedDate : ''}
                        </Text>
                      );
                    } else if (cell.column.Header === "Active") {
                      if (cell.value === true) {

                        data = (
                          <Flex justifyContent="left">
                            <FaCheckCircle color="green" size={20} style={{ marginLeft: '15px' }} />
                          </Flex>
                        );
                      } else {
                        data = (
                          <Flex justifyContent="left">
                            <FaTimesCircle color="red" size={20} style={{ marginLeft: '15px' }} />
                          </Flex>
                        );
                      }
                    } else if (cell.column.Header === "ACTIONS") {
                      const info = tableData.find(i => i.id === cell.value);
                      data = (
                        <Text
                          as={Link}
                          to={`${PATH_NAME.DEVICE_VIEW}?account=${info?.accountNumber}&id=${info.imei}`}
                          cursor='pointer'
                          color={brandColor}
                          textDecoration='underline'
                          fontSize='md'
                          fontWeight='500'
                          id={cell.value}>
                          View
                        </Text>
                      );
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
                localStorage.setItem('filters', jsonToString(({ ...filters, list: { ...filters?.list, devices: e.target.value } })));
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
                pageSize === 5 ? "none" : canPreviousPage ? "flex" : "none"
              }
              _hover={{
                bg: "whiteAlpha.100",
                opacity: "0.7",
              }}>
              <Icon as={MdChevronLeft} w='16px' h='16px' color={textColor} />
            </Button>
            {tableData.length / pageSize > 15 ? (
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
              display={pageSize === 5 ? "none" : canNextPage ? "flex" : "none"}
              _hover={{
                bg: "whiteAlpha.100",
                opacity: "0.7",
              }}>
              <Icon as={MdChevronRight} w='16px' h='16px' color={textColor} />
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
}

export default DeviceList;

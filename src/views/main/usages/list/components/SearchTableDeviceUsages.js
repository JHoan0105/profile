/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports

import { formatBytes } from 'tools/stringFormat'

import {
  Box,
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
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { FaExclamationCircle } from 'react-icons/fa'; // Import the icons
import { GrBusinessService } from "react-icons/gr";

import { FaCircle } from 'react-icons/fa6';

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Default function
function DeviceUsageSearchTable({ columnsData, tableData, onViewClick }) {

  const columns = useMemo(() => columnsData || [], [columnsData]);
  const data = useMemo(() => tableData || [], [tableData]);
  const [filters, setFilters] = useState();

  const [selectedRowIndex, setSelectedRowIndex] = useState(-1); // State to track selected row index, initialized to -1 (no selection)

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 5
      }
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
    setPageSize,                                        // use to set the page size dynamically
  } = tableInstance;
  initialState.pageSize = 5;                            // set the intial page size state
  const createPages = (count) => {
    let arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };

  const { pageIndex, pageSize, sortBy, globalFilter } = state;

  const textColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const brandColor = useColorModeValue("brand.500", "brand.400");
  const selectedColor = useColorModeValue("gray.300", "gray.700");

  // Function to handle click on "View" link
  const handleViewClick = (rowIndex, rowData) => {
    setSelectedRowIndex(rowIndex); // Update selected row index state
    onViewClick(rowData?.imei); // Call parent function to show chart
  };
  useEffect(() => {
    setSelectedRowIndex(() => { })
  }, [globalFilter, sortBy])

  useEffect(() => {
    // get filters here
    const storedFilters = localStorage.getItem('filters');
    if (storedFilters) {
      setFilters(() => JSON.parse(storedFilters));
    }
  }, [])
  useEffect(() => {
    setPageSize(Number(filters?.list?.usages || 5))
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
        }}
      >
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
        <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px' >
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe='10px'
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex
                      justify='space-between'
                      align='center'
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color='#F26539'
                    >
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              const isSelected = selectedRowIndex === rowIndex; // Check if current row is selected

              return (
                <Tr
                  {...row.getRowProps()}
                  key={rowIndex}
                  onClick={() => handleViewClick(rowIndex, row.original)} // Handle click on row to select
                  cursor='pointer'
                  bg={isSelected ? selectedColor : 'transparent'} // Apply selected row background color
                >
                  {row.cells.map((cell, cellIndex) => {
                    let data = "";
                    if (cell.column.Header === "Identifier") {
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "Type") {
                      data = (
                        <Box display='flex'>
                          <Text fontSize='md' color={textColor} fontWeight='500' mr='10px' title={row.original.isPool?'': row.original?.bundleUniqueName }>
                            {cell.value}
                          </Text>
                          {
                            row.original.isPool ? (<GrBusinessService color='green' fontWeight='500' title={'Pooled : '+ row.original?.bundleUniqueName} />) :
                              (
                                <Text>&nbsp;</Text>
                              )
                          }
                        </Box>
                      );
                    } else if (cell.column.Header === "Active") {
                      data = (

                        <Box display="grid" gridTemplateColumns="10% 90%" alignItems="center" gap="15px">
                          {cell?.value === -1 ? (
                            <FaExclamationCircle color="#FF8000" size={20} style={{ marginLeft: '5px' }} title='Device not on Account' /> // Orange
                          ) :
                            (< FaCircle color={cell.value ? "#3FAF13" : "#D61F1F"} size={20} style={{ marginLeft: '5px' }} title='Active' />)}
                        </Box>
                      );
                    } else if (cell.column.Header === "Plan Size") {
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {formatBytes(cell.value)}
                        </Text>
                      );
                    } else if (cell.column.Header === "Current Month") {
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {formatBytes(row.original?.monthlyDataUsages[row.original?.monthlyDataUsages?.length - 1])}
                        </Text>
                        //</Box>
                      );
                    } else if (cell.column.Header === "Previous Month") {
                      data = (
                        <Box display="grid" gridTemplateColumns="100%" alignItems="center" gap="15px">
                          <Text color={textColor} fontSize='md' fontWeight='500'>
                            {formatBytes(row.original?.monthlyDataUsages[row.original?.monthlyDataUsages?.length - 2])}
                          </Text>
                        </Box>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={cellIndex}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor={borderColor}
                      >
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
                localStorage.setItem('filters', JSON.stringify(({ ...filters, list: { ...filters?.list, usages: e.target.value } })));
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
                tableData.length / pageSize > 15 ? "none" : canPreviousPage ? "flex" : "none"
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
                    onClick={() => { gotoPage(pageNumber - 1); setSelectedRowIndex(() => { }) }}
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
              onClick={() => { nextPage(); setSelectedRowIndex(() => { }) }}
              transition='all .5s ease'
              size='small'
              w='25px'
              h='25px'
              borderRadius='50%'
              bg='transparent'
              border='1px solid'
              borderColor={useColorModeValue("gray.200", "white")}
              display={tableData.length/pageSize > 15 ? "none" : canNextPage ? "flex" : "none"}
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

export default DeviceUsageSearchTable;


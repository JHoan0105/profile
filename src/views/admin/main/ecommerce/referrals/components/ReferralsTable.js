import {
  Avatar,
  Button,
  Flex,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

function UserReportsTable(props) {
  const { columnsData, tableData } = props;

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
    initialState,
    setPageSize,
    state,
  } = tableInstance;
  initialState.pageSize = 6;
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
  return (
    <>
      <Flex
        direction='column'
        w='100%'
        overflowX={{ sm: "scroll", lg: "hidden" }}>
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
                      color='gray.400'>
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
                    if (cell.column.Header === "USER NAME") {
                      data = (
                        <Flex align='center'>
                          <Avatar
                            src={cell.value[1]}
                            h='60px'
                            w='60px'
                            me='10px'
                          />
                          <Text
                            color={textColor}
                            fontSize='md'
                            fontWeight='500'>
                            {cell.value[0]}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "VALUE") {
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "PROFIT") {
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "ORDERS") {
                      data = (
                        <Text color={textColor} fontSize='md' fontWeight='500'>
                          {cell.value}
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
          <Flex align='center'>
            <Text
              me='10px'
              minW='max-content'
              fontSize='sm'
              color='gray.500'
              fontWeight='normal'>
              Show rows per page
            </Text>
            <Select
              fontSize='sm'
              variant='main'
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}>
              <option value='6'>6</option>
              <option value='7'>7</option>
              <option value='8'>8</option>
              <option value='9'>9</option>
              <option value='10'>10</option>
            </Select>
          </Flex>
          <Stack direction='row' alignSelf='flex-end' spacing='4px' ms='auto'>
            <Button
              variant='no-effects'
              onClick={() => previousPage()}
              transition='all .5s ease'
              w='40px'
              h='40px'
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
            {pageSize === 5 ? (
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
                    variant='no-effects'
                    transition='all .5s ease'
                    onClick={() => gotoPage(pageNumber - 1)}
                    w='40px'
                    h='40px'
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
                      fontSize='sm'
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
              w='40px'
              h='40px'
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

export default UserReportsTable;

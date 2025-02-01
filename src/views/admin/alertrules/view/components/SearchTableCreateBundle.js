// Guardian imports
import CreateRuleThresholds from "views/admin/alertrules/view/components/CreateRuleThresholds";
import getAlertRuleBundleList from 'services/alertrules/getAlertRuleBundleList';
import { PATH_NAME } from 'variables/constants'
import { jsonIt, jsonToString } from 'tools/codec'

import { RULES } from '../CreateAlertRule'
// Imports
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
import { useNavigate } from 'react-router-dom';
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import the icons
import Card from 'components/card/Card'

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Default function
function SearchTableCreateBundle(props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);                      // State to manage dialog visibility
  const [filters, setFilters] = useState()                                      // load user's preference
  const cancelRef = useRef();                                                   // Ref to handle dialog cancellation
  const { ruleData, columnsData, accountInfo, jwtAccountInfo, updateRule } = props;
  const bgAlertbox = useColorModeValue('white', 'guardianDark.500');
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;
  const nav = useNavigate();

  const fetchData = async () => {
    try {
      const pool = await getAlertRuleBundleList(currentAccountNumber, false, ruleData.thresholds, 'POOL');

      const tmp = pool.map(i => {
        updateRule({ type: RULES.SELECTPOOL, payload: { poolID: i.poolID, name:i.name, id: false } })
        return { poolID: i.poolID, id: false, enabled: false }
      })

        console.log('Alert rule pool list: ', tmp);

    } catch (error) {
      console.error("Error fetching accounts data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSelected = (rule) => {
    updateRule({ type: RULES.SELECTPOOL, payload: { poolID: rule.poolID, name: rule.name, id: true } })

  }

  const handleRemoveSelected = (rule) => {
    updateRule({ type: RULES.SELECTPOOL, payload: { poolID: rule.poolID, name:rule.name, id: false } })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  }

  const handleDialogConfirm = async () => {

    handleDialogClose();
    nav(PATH_NAME.ALERT_LIST);
  }

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => ruleData.deviceList, [ruleData.deviceList]);
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
    setPageSize,
    initialState,
  } = tableInstance;
  initialState.pageSize = 5;
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
    setPageSize(Number(filters?.list?.alertcreatebundle || 10))
  }, [filters])


  return (
    <>
      <Card
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
          <Button
            _hover={{ bg: "brand.600" }}
            _active={{ bg: "brand.500" }}
            _focus={{ bg: "brand.500" }}
            variant='brand'
            px='24px'
            fontSize='sm'
            fontWeight='700'
            onClick={() => {
              if (jwtAccountInfo?.isGuardianAdmin || jwtAccountInfo.isAlertManagement) {
                if (ruleData.usageType === 'DEVICE') {
                  updateRule({ type: RULES.UPDATE, payload: { name: 'usageType', value: 'POOL' } })
                } else {
                  updateRule({ type: RULES.UPDATE, payload: { name: 'usageType', value: 'DEVICE' } })
                }
                updateRule({ type: RULES.RESET })
              } else {
                return null
              }
            }}
          >
            {ruleData.usageType === 'DEVICE' ? "Create Pool Rule" : "Create Device Rule"}
          </Button>
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
                    if (cell.column.Header === "PLAN NAME") {
                      data = (
                        <Text
                          color={textColor}
                          fontSize='md'
                          fontWeight='500'
                          title={row.original.poolID }
                        >
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "SELECT") {
                      if (row.original?.id ?? false) {
                        data = (
                          <FaCheckCircle
                            color="green"
                            title="Disable device"
                            size={20}
                            style={{ marginLeft: '15px', cursor: 'pointer' }} // Change cursor to pointer on hover
                            onClick={() => handleRemoveSelected(row.original, false)} // Call handleClick function on click
                          />
                        );
                      } else {
                        data = (
                          <FaTimesCircle
                            color="red"
                            title="Enable device"
                            size={20}
                            style={{ marginLeft: '15px', cursor: 'pointer' }} // Change cursor to pointer on hover
                            onClick={() => handleAddSelected(row.original, false)} // Call handleClick function on click
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
            {pageSize * (pageIndex + 1) <= ruleData?.deviceList?.length
              ? pageSize * (pageIndex + 1)
              : ruleData?.deviceList?.length}{" "}
            of {ruleData?.deviceList?.length} entries
          </Text>
          <Flex align='center'>
            <Select
              fontSize='sm'
              h='25px'
              borderRadius='10%'
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                localStorage.setItem('filters', jsonToString(({ ...filters, list: { ...filters?.list, alertcreatebundle: e.target.value } })));
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
                ruleData?.deviceList?.length / pageSize > 9 ? "none" : canPreviousPage ? "flex" : "none"
              }
              _hover={{
                bg: "whiteAlpha.100",
                opacity: "0.7",
              }}>
              <Icon as={MdChevronLeft} w='16px' h='16px' color={textColor} />
            </Button>
            {ruleData?.deviceList?.length / pageSize > 9 ? (
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
              display={ruleData?.deviceList?.length / pageSize > 9 ? "none" : canNextPage ? "flex" : "none"}
              _hover={{
                bg: "whiteAlpha.100",
                opacity: "0.7",
              }}>
              <Icon as={MdChevronRight} w='16px' h='16px' color={textColor} />
            </Button>
          </Stack>
        </Flex>
      </Card>

      {/* AlertDialog for disabling the last enabled IMEI */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={bgAlertbox}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Device
            </AlertDialogHeader>

            <AlertDialogBody>
              Removing the last enabled IMEI will delete the entire rule. Are you sure you want to proceed?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDialogConfirm} ml={3}>
                Disable
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box mt='30px'>
        <CreateRuleThresholds
          ruleData={ruleData}
          updateRule={updateRule}
          type='POOL'
        />
      </Box>
    </>
  );
}

export default SearchTableCreateBundle;


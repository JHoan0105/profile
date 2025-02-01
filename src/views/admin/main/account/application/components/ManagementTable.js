import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Chakra imports
import {
  Avatar,
  Badge,
  Icon,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card.js";
import Menu from "components/menu/MainMenu";

// Assets
import { MdEdit } from "react-icons/md";

function ManagementTable(props) {
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

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  const textColor = useColorModeValue("guardianDark.100", "white");
  const borderColor = useColorModeValue("secondaryGray.400", "whiteAlpha.100");

  return (
    <Card>
      <Flex
        direction='column'
        w='100%'
        overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Flex
          align={{ lg: "center" }}
          justify={{ base: "space-between" }}
          w='100%'
          px='20px'
          mb='20px'>
          <Text
            color={textColor}
            fontSize='xl'
            fontWeight='600'
            lineHeight='100%'>
            Team Management
          </Text>
          <Menu />
        </Flex>
        <Table {...getTableProps()} variant='simple' color='gray.500'>
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
                    if (cell.column.Header === "Name") {
                      data = (
                        <Flex align='center'>
                          <Avatar
                            src={cell.value[2]}
                            w='36px'
                            h='36px'
                            me='8px'
                            borderRadius='14px'
                          />
                          <Flex direction='column'>
                            <Text
                              color={textColor}
                              fontSize='sm'
                              fontWeight='700'>
                              {cell.value[0]}
                            </Text>
                            <Text
                              color='secondaryGray.500'
                              fontSize='sm'
                              fontWeight='600'>
                              {cell.value[1]}
                            </Text>
                          </Flex>
                        </Flex>
                      );
                    } else if (cell.column.Header === "Date") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='600'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "Permissions") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='600'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "Status") {
                      data = (
                        <Badge
                          colorScheme={
                            cell.value === "REJECTED" ? "red" : "green"
                          }
                          color={
                            cell.value === "REJECTED" ? "red.500" : "green.500"
                          }
                          fontSize='sm'
                          fontWeight='600'>
                          {cell.value.toLowerCase()}
                        </Badge>
                      );
                    } else if (cell.column.Header === "Price") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='600'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === " ") {
                      data = (
                        <Flex cursor='pointer' h='max-content' w='max-content'>
                          <Icon
                            color='secondaryGray.500'
                            as={MdEdit}
                            w='20px'
                            h='20px'
                          />
                        </Flex>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "120px", md: "200px", lg: "auto" }}
                        borderColor='transparent'
                        mt='20px !important'
                        py='10px !important'>
                        {data}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Flex>
    </Card>
  );
}

export default ManagementTable;

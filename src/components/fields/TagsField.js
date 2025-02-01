// Chakra imports
import {
  Flex,
  Box,
  FormLabel,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import React, { useState, useEffect } from "react";

function TagsField({ label, id, onChange, selectedTags }) {

  const initialTags = selectedTags || [];
  const [tags, setTags] = useState(initialTags);
  const [inputValues, setInputValues] = useState(''); // Add inputValues state

  useEffect(() => {
    // Update tags state when selectedTags prop changes
    setTags(selectedTags || []);
  }, [selectedTags]);


  /*
  const handleKeyPress = (e) => {
    console.log("handleKeyPress");
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTag = {
        name: e.target.value.trim(),
        id: Date.now(), // Using timestamp as a unique ID
      };
      setTags([...tags, newTag]);
      e.target.value = "";
      if (onChange) {
        onChange([...tags, newTag]);
      }
    }
  };
  */
  function isValidNumber(input) {
    const regex = /^\d{8}$/;
    return regex.test(input);
  }

  function isGroupedAccounts(input) {
    const regExGroup = /(?:\d{8}[,|;])*(?:\d{8})/;
    const match = input.match(regExGroup)
    if (match) {
      const regex = /\b\d{8}\b/g;
      const matches = match[0].match(regex);
      const tmp = matches.map(v => { return typeof v ==='string'? v: v.toString() })
      const unique = new Set([...tags, ...tmp])

      const newTags = [...unique]
      console.log("UNIQUE ACCOUNT NUMBER ", unique, newTags)
      setTags(() => [...newTags]);
      onChange([...newTags]);
      return;
    }
  }

  //This only accept integer and you can specify max of left digits. 
  //Maybe need to change in futur to accept parameter from props for other uses. 11111111
  const handleKeyPress = (e) => {
    const valid = isValidNumber(parseInt(e.target.value?.trim())) &&
      (!(e.key === 'Control') || !(e.ctrlKey && e.key === "v")) &&
      !(tags.some((v) => v == e.target.value))

    switch (valid) {
      case true: {
        setInputValues(() => e.target.value)
        break;
      }
      case false: {
        setInputValues(() => '')
        return;
      }
      default:
        console.error("UNKNOWN ASSIGNMENT STATE")
        return;
    }
    if (tags.some((v) => v === e.target.value)) {
      setInputValues(() => '')
      return
    }
    setTags(() => [...tags, e.target.value]);
    onChange([...tags, e.target.value]);
    setInputValues(() => '')

  };


  const removeTag = (tagId) => {
    const updatedTags = tags.filter((tag) => tag !== tagId);
    setTags(() => updatedTags);
    onChange(updatedTags);
  };

  let borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  let bg = useColorModeValue("brand.500", "brand.400");

  return (
    <Box>
      <FormLabel htmlFor={id} fontWeight="bold" fontSize="sm" mb="8px">
        {label}
      </FormLabel>
      <Flex
        direction="row"
        p="12px"
        wrap="wrap"
        bg="transparent"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="16px"
        focus={{ borderColor: "teal.300" }}
        minH="40px"
        h="stretch"
        cursor="text"
      >
        {tags.map((tag, index) => (
          <Tag
            fontSize="xs"
            h="25px"
            mb="6px"
            me="6px"
            borderRadius="12px"
            variant="solid"
            bg={bg}
            key={index}
          >
            <TagLabel w="100%">{tag}</TagLabel>
            <TagCloseButton
              justifySelf="flex-end"
              color="white"
              onClick={() => removeTag(tag)}
            />
          </Tag>
        ))}
        <Input
          id="inputNumber"
          variant="main"
          bg="transparent"
          border="none"
          focus="none"
          p="0px"
          onChange={(e) => {
            if (isNaN(e.target.value)) {
              isGroupedAccounts(e.target.value)
              return
            } else if (e.target.value.match(/\s/)) {
              return
            } else if (!isValidNumber(e.target.value) && e.target.value.length <= 7) {
              setInputValues(() => e.target.value)
            } else {
              handleKeyPress(e)
            }
          }}
          fontSize="sm"
          value={inputValues}
        //placeholder="Press Enter to add tag"
        />
      </Flex>
    </Box>
  );
}

export default TagsField;
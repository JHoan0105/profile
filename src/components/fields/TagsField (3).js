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
import React, { useState } from "react";

function TagsField({ label, id, placeholderTags, onChange }) {
  const initialTags = placeholderTags || [];
  const [tags, setTags] = useState(initialTags);

  const handleKeyPress = (e) => {
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

  const removeTag = (tagId) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);
    if (onChange) {
      onChange(updatedTags);
    }
  };

  let borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  let bg = useColorModeValue("brand.500", "brand.400");

  return (
    <Box>
      <FormLabel htmlFor={id} fontWeight='bold' fontSize='sm' mb='8px'>
        {label}
      </FormLabel>
      <Flex
        direction='row'
        p='12px'
        wrap='wrap'
        bg='transparent'
        border='1px solid'
        borderColor={borderColor}
        borderRadius='16px'
        _focus={{ borderColor: "teal.300" }}
        minH='40px'
        h='stretch'
        cursor='text'
      >
        {tags.map((tag, index) => (
          <Tag
            fontSize='xs'
            h='25px'
            mb='6px'
            me='6px'
            borderRadius='12px'
            variant='solid'
            bg={bg}
            key={index}
          >
            <TagLabel w='100%'>{tag.name}</TagLabel>
            <TagCloseButton
              justifySelf='flex-end'
              color='white'
              onClick={() => removeTag(tag.id)}
            />
          </Tag>
        ))}
        <Input
          variant='main'
          bg='transparent'
          border='none'
          _focus='none'
          p='0px'
          onKeyDown={(e) => handleKeyPress(e)}
          fontSize='sm'
          //placeholder="Press Enter to add tag"
        />
      </Flex>
    </Box>
  );
}

export default TagsField;

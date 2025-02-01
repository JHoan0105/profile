
/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports

import { useEffect, useRef, useState } from "react";
import { Icon, IconButton, Input, InputGroup, InputLeftElement, useColorModeValue } from '@chakra-ui/react';


const SearchableDropdown = (props) => { 

const { options, label, id, selectedVal, handleChange, variant, background, children, placeholder, borderRadius, ...rest } = props;

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

    const searchIconColor = useColorModeValue('gray.700', 'white');
    const inputBg = useColorModeValue('white', 'black');
    const inputText = useColorModeValue('black', 'white');

  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option) => {
    setQuery(() => "");
    handleChange(option[label]);
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e) {
    setIsOpen(e && e.target === inputRef.current);
  }

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;

    return "";
  };

  const filter = (options) => {
    return options.filter(
      //(option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
      option => option
    );
  };

    return (
    <InputGroup  w={{ base: '100%', md: '200px' }} spacing={{ base: "20px", xl: "20px" }} mb='10px'
            ml='24px' {...rest}>
    <div className="dropdown">
      <div className="control">
       <div className="selected-value">
          <Input
            display='flex'
            variant='search'
            fontSize='sm'
            color={inputText}
            fontWeight='500'
            _placeholder={{ color: 'gray.400', fontSize: '14px' }}
            borderRadius={borderRadius ? borderRadius : '30px'}
            placeholder={placeholder ? placeholder : 'Search...'}
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name="searchTerm"
            onChange={(e) => {
              setQuery(e.target.value);
              handleChange(null);
            }}
            onClick={toggle}
          />
        </div>
        <div className={`arrow ${isOpen ? "open" : ""}`}></div>
      </div>

      <div className={`options ${isOpen ? "open" : ""}`}>
        {filter(options).map((option, index) => {
          return (
            <div
              onClick={() => selectOption(option)}
              className={`option ${
                option[label] === selectedVal ? "selected" : ""
              }`}
              key={`${id}-${index}`}
            >
              {option[label]}
            </div>
          );
        })}
      </div>
            </div>
    </InputGroup>
  );
};

export default SearchableDropdown;

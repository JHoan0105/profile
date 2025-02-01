/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import change from 'services/auth/changePass';
import { passwordValidator } from 'tools/validators'
import { MINIMUM_PASSWORD_REQ, CHANGE_PASSWORD, CONFIRM_PASSWORD  } from 'variables/constants'

// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  Text,
  Icon,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import InputField from "components/fields/InputField";
import React, {useState, useRef} from "react";
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

// Default function
export default function Password(props) {
    const { ...rest } = props;
    const accountInfo = getAccountInfo();
    const [showNew, setShowNew] = useState(false);                  // show password
    const [showOld, setShowOld] = useState(false);                  // show old password
    const [showConfirm, setShowConfirm] = useState(false);          // show confirm password
    const [failed, setFailed] = useState(false);                    // failed state to show error message
    const [loading, setLoading] = useState(false);              
    const [errorMessage, setErrorMessage] = useState(null);         // error message
    const toast = useToast();
    let msg = useRef(null);                                         // error and warning messages

    const [data, setData] = useState({
        old: '',
        new: '',
        confirm: ''
    })                                                              // hold user's input on changing password
    const handleShowOld = () => setShowOld(!showOld);
    const handleShowNew = () => setShowNew(!showNew);
    const handleShowConfirm = ()=> setShowConfirm (!showConfirm);
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = "secondaryGray.600";

    const OnChange = (k, v) => {
        setData(e=>({
            ...e,
            [k]:v
        }))    
    }
    const ShowText = ()=> {
      return <Text     
                color='Red'
                fontSize="md"
                w="100%"
                fontWeight="500"
                mb='20px'
                display={failed ? 'show':'none'}
            >
                {msg?.current || "Update password failed."}
            </Text>
    };
    const onFailed = () => {
        setFailed(true);
        setLoading(false);
        (() => {
            toast({
                title: 'Failed change password.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        })()
    }
    const onSuccess = () => {
        // Clear the input fields
        setData({
            old: '',
            new: '',
            confirm: ''
        });

        setFailed(false);
        setLoading(false);
        (() => {
            toast({
                title: 'Successfully changed password',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        })()
    }

    const updatePassword = async ()=>{
      msg.current = "";

      // Ensure parameters are not empty
      if (data.new !== data.confirm ) {
        msg.current = CONFIRM_PASSWORD
        setErrorMessage(CONFIRM_PASSWORD);
        onFailed();
        return;
      }
      if (data.new === data.old ) {
        msg.current = CHANGE_PASSWORD;
        setErrorMessage(CHANGE_PASSWORD);
        onFailed();  
        return;
      }
      if (!passwordValidator(data.new)) {
        msg.current = MINIMUM_PASSWORD_REQ
        setErrorMessage(MINIMUM_PASSWORD_REQ);
        onFailed();
        return;
      }

      setLoading(false);
      setFailed(false);

      try {
          // API request update password - require email, oldPassword, newPassword
          const update = await change(accountInfo.email,data.old,data.new); 
          if (!update) {
              msg.current.innerText = "Error : failed udpate.";
              (() => { onFailed(); })()
              return;
          }
          else {
              //On Success Toast message
              onSuccess();
          }
      } catch(error) {
          console.log("request error");
          (() => { onFailed(); })()  
      }
  }

  // Chakra Color Mode

  return (
    <Card {...rest}>
      <Flex direction='column' mb='30px' ms='10px' width='100%'>
        <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
          Change Password
        </Text>
      </Flex>
      <FormControl>
              <InputGroup display='block'>
              <InputField
                width='125%'
                isRequired={true}
                type={showOld ? 'text' : 'password'}
                variant="auth"
                value = {data.old}
                onChange={(e)=>OnChange('old',e.target.value)}
                mb='25px'
                id='old'
                label='Password*'
                placeholder='Password'
              />
             <InputRightElement display="flex" alignItems="center" mt="30px" width="5rem">
             <Icon
                color={textColorSecondary}
                _hover={{ cursor: 'pointer' }}
                as={showOld ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={handleShowOld}
            />
             </InputRightElement>   
         </InputGroup>
              <InputGroup display='block'>
              <InputField
                width='125%'
                isRequired={true}
                type={showNew ? 'text' : 'password'}
                variant="auth"
                value = {data.new}
                onChange={(e)=>OnChange('new',e.target.value)}
                mb='25px'
                id='new'
                label='New Password*'
                placeholder='New Password'
              />
             <InputRightElement display="flex" alignItems="center" mt="30px" width="5rem">
             <Icon
                color={textColorSecondary}
                _hover={{ cursor: 'pointer' }}
                as={showNew ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={handleShowNew}
            />
             </InputRightElement>   
         </InputGroup>
         <InputGroup display='block'>
              <InputField                
                isRequired={true}
                type={showConfirm ? 'text' : 'password'}
                variant="auth"
                value = {data.confirm}
                onChange={(e)=>OnChange('confirm',e.target.value)}
                mb='25px'
                id='confirm'
                label='New Password Confirmation*'
                placeholder='Confirm New Password'
              />
               <InputRightElement display="flex" alignItems="center" mt="30px" width="5rem" >
                 <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={showConfirm ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleShowConfirm}
                />
               </InputRightElement>   
         </InputGroup>
        <ShowText errorMessage={errorMessage} />      
        <Button
         isLoading = {loading}
         width='100%'
         variant='brand'
         color='white'
         fontSize='sm'
         fontWeight='500'
         _hover={{ bg: "brand.600" }}
         _active={{ bg: "brand.500" }}
         _focus={{ bg: "brand.500" }}
         onClick = {updatePassword}
        >
        Change Password
        </Button>
      </FormControl>
    </Card>
  );
}

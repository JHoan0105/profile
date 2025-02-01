import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    InputGroup,
    Text,
    Icon,
    useToast,
    InputRightElement,
    useDisclosure
} from '@chakra-ui/react'
import React, { useState, useRef } from 'react';
import InputField from "components/fields/InputField";
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import updateUser from 'services/updateInfo'

export default function ConfirmThis(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { loading, setLoading } = useState(false);
    const [showPass, setShowPass] = useState(false);
    const {
        user,
        twofa,
        control
    } = props;
    const textColorSecondary = "secondaryGray.600";
    const toast = useToast();
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const secret = useRef(null)
    let msg = useRef(null);
    // show password field
    const handleShowPass = () => {
        setShowPass(!showPass);
    };
    const onFailed = (e) => {
        secret.current = '';
        (() => {
            toast({
                title: 'Update failed.',
                description: msg.current,
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
        })()
        msg.current = '';
    }
    const onSuccess = () => {
        (() => {
            toast({
                title: 'Update',
                status: "success",
                description: msg.current,
                duration: 7000,
                isClosable: true,
            })
        })()
        msg.current = "";

    }
    const confirmUpdate = async() => {

        if (secret?.current ==='') {
            msg.current = "Enter your password to confirm changes";
            (() => onClose())()
            onFailed();
            return;
        }
        if (secret.current.length < 8) {
            msg.current = "Invalid password.";
            (() => onClose())()
            onFailed(); 
            return;
        }
        // TODO: Add regEx to password validation here to reduce server request

        const e = btoa(encodeURIComponent(sessionStorage.email));
        const p = btoa(encodeURIComponent(secret.current));
        const id = e + '.' + p;
        const updateReq = await updateUser(id, user.firstname, user.lastname, user.position, sessionStorage._2fa);

        if (!updateReq) {
            msg.current = "Server refused request.";
            (() => onClose())()
            onFailed();
            return;
        }
        msg.current = "Update Successful!";
        onSuccess();
        (() => onClose())()
    }
 
    return (
        <>
            <Button onClick={onOpen}>Save Changes1</Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Changes</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Text
                                mb='10px'
                                fontWeight="1000"
                                fontSize='lg'
                            >{(user.email).toUpperCase()}</Text>
                            <InputGroup display='block'>
                            <InputField
                                ref={secret}
                                isRequired={true}
                                type={showPass ? 'text' : 'password'}
                                variant="auth"
                                onChange={(e)=> secret.current = e.target.value }
                                mb='5px'
                                id='pass'
                                label='Password*'
                                placeholder='Password'
                            />
                            <InputRightElement display="flex" mb='10px' mt="31px" width="5rem">
                                <Icon
                                    color={textColorSecondary}
                                    _hover={{ cursor: 'pointer' }}
                                    as={showPass ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                    onClick={handleShowPass}
                                />
                            </InputRightElement></InputGroup>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} isLoading={loading} onClick={confirmUpdate}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
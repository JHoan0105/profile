/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports


// Chakra import
import { Flex, Text, useColorModeValue, useTheme } from '@chakra-ui/react';
import React from "react";

import {
	buildStyles,
	CircularProgressbarWithChildren,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Custom components
import Card from 'components/card/Card';
export default function ActiveDevices( props ) {
	const { numberActiveDevice, numberOfDevices, ...rest } = props;


	// Chakra Color Mode
	const textColorMode = useColorModeValue('secondaryGray.900', 'white');
	const theme = useTheme();
	const textColor = textColorMode.includes('.')
		? theme.colors[textColorMode.split('.')[0]][textColorMode.split('.')[1]]
		: textColorMode;

	return (
		<Card
			justifyContent='center'
			alignItems="center"
			flexDirection="column"
			textAlign="center"
			w="100%"
			{...rest}
		>
			<Text
				color={textColor}
				fontSize="lg"
				fontWeight="700"
				mb="10px"
				mx="auto"
				title={ `${numberOfDevices} account total devices`}
			>
				Active Device
			</Text>
			<Flex
				justifyContent="center"
				alignItems="center"
				w="100%"
				px="10px"
				mb="8px"
			/>
			<CircularProgressbarWithChildren
				value={(numberActiveDevice / numberOfDevices) * 100}
				text={`${numberActiveDevice}`}
				styles={buildStyles({
					pathColor: '#F26539', // Color of the progress path
					textColor: textColor, // Color of the text inside the progress bar
					trailColor: '#959596', // Color of the trail (the part not yet filled)
					backgroundColor: '#FFFFFF', // Background color
				})}
			>
			</CircularProgressbarWithChildren>

		</Card>
	);
}

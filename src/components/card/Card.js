import { Box, useStyleConfig } from "@chakra-ui/react";
function Card(props) {
  const { variant, children, style, ...rest } = props;
  const styles = useStyleConfig("Card", { variant });

  // Merge the Chakra UI styles with custom styles
  const mergedStyles = {
    ...styles,
    minWidth: style?.minWidth || 'auto',
    minHeight: style?.minHeight || 'auto', 
    ...style 
  };

  return (
    <Box __css={mergedStyles} {...rest} mt={{ sm: "-35px", md: "-50px", lg: "0px", xl: "0px", "2xl": "0px" }}>
      {children}
    </Box>
  );
}

export default Card;

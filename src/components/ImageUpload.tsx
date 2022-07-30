import { ChangeEvent, useRef, useState, useEffect } from "react";
import {
  AspectRatioProps,
  Image,
  ImageProps,
  Input,
  InputProps,
  Box,
  Spinner,
  Icon,
  Text,
  Button,
} from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/system";
import { FaUpload } from "react-icons/fa";

export interface ImageUploadProps
  extends Omit<AspectRatioProps, "onChange">,
    Pick<ImageProps, "alt" | "src">,
    Pick<InputProps, "accept"> {
  onChange?: (file: File) => void;
  isLoading?: boolean;
  label?: string;
}

export const ImageUpload = forwardRef<ImageUploadProps, "image">(
  (props, ref) => {
    const { src, alt, accept, onChange, isLoading, label, ...rest } = props;
    const [previewUrl, setPreviewUrl] = useState(props.src);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (props.src) {
        setPreviewUrl(props.src);
      }
    }, [props.src]);

    const handlePickImage = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      onChange?.(file);

      // preview image
      const inMemoryImage = URL.createObjectURL(file);
      setPreviewUrl(inMemoryImage);
    };

    return (
      <Box
        position="relative"
        w={rest.w}
        h={rest.h}
        border="solid gray 1px"
        borderRadius="lg"
        cursor="pointer"
        onClick={handlePickImage}
      >
        {/* overlay */}
        <Box
          display={isLoading ? "block" : "none"}
          position="absolute"
          w="100%"
          h="100%"
          bg="rgb(54 64 84 / 44%)"
          top="0"
          left="0"
          zIndex={3}
        />
        <Spinner
          display={isLoading ? "block" : "none"}
          color="white"
          size="xl"
          position="absolute"
          top="50%"
          left="50%"
          mt="-15px"
          ml="-15px"
          zIndex={4}
        />
        <Box w="0px" h="0px">
          <Input
            ref={inputRef}
            onChange={handleFileChange}
            visibility="hidden"
            type="file"
            accept={accept}
          />
        </Box>

        {/* icon and information */}
        {previewUrl ? null : (
          <Box
            textAlign="center"
            position="absolute"
            top="50%"
            left="50%"
            w="100%"
            transform="translate(-50%, -50%)"
          >
            <Icon as={FaUpload} />
            <Text>{label ? label : "Upload Gambar"}</Text>
          </Box>
        )}

        <Image
          objectFit="contain"
          position="relative"
          w={rest.w}
          h={rest.h}
          ref={ref}
          src={previewUrl}
          alt={alt}
        />

        {/* change button */}
        {previewUrl ? (
          <Button
            shadow="md"
            size="sm"
            position="absolute"
            right="2"
            bottom="2"
          >
            Ubah
            <Icon ml="2" as={FaUpload} />
          </Button>
        ) : null}
      </Box>
    );
  }
);

ImageUpload.defaultProps = {
  ratio: 1,
  w: "100%",
  h: "300px",
  accept: "image/*",
};

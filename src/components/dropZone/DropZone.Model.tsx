export type dropZoneProps = {
    imgFormat: string[];
    setTime?: number;
    onImageUpload: (file: File, base64Img: string) => void;
  }
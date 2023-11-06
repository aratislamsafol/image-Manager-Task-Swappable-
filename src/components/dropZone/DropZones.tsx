import style from '../../assets/module/addImage.module.css';
import { useState, useEffect } from 'react';
import Input from '../input/Input';
import {dropZoneProps} from './DropZone.Model';

export default function Dropzone({ onImageUpload, imgFormat = [], setTime }: dropZoneProps): JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<{ status: boolean, msg: string }>({
    status: false, msg: ''
  });

  // Drag And Drop
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(true);
  };

  // Function for base64 and Data onLoad
  const dataOnLoad = (file: File): void => {
    if (file && isSupportedImageFormat(file, imgFormat)) {
      if (file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target!.result as string;
          onImageUpload(file, base64Image);
        };
        reader.readAsDataURL(file);
      } else {
        setError({
          status: true,
          msg: 'Maximum image size is 5 MB',
        });
      }
    } else {
      setError({
        status: true,
        msg: 'File type Invalid',
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    setIsDragging(false);
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    files.map((file) => dataOnLoad(file));
  };

  // Image Uploader
  const handleImageUploader = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => dataOnLoad(file));
  };

  const isSupportedImageFormat = (file: File, imgFormat: string[]): boolean => {
    if (imgFormat.length === 0) {
      return true;
    }
    const conCatData = imgFormat.map((element) => 'image/' + element);
    return conCatData.includes(file.type);
  };

  useEffect(() => {
    if (!error.status) return;
    const timer = setTimeout(() => {
      setError({ status: false, msg: '' })
    }, setTime?setTime:400 )

    return () => clearTimeout(timer)

  }, [error.status, setTime])

  console.log(error.status)
  return (
    <div className="">
      {error.status?
      <div className={`${style.container} ${style.invalid_item_container}`}>
          <label className={style.addImageIcon}>
            <p>{error.msg}</p>
          </label>
        </div>:
        <div className={`${isDragging} ${style.container}`} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragOver={(event) => event.preventDefault()}>
          <Input type="file" className={style.dropzone_input} accept={imgFormat.join(',')} id="file-input" onChange={handleImageUploader} multiple />
          <label id="file-input-label" htmlFor="file-input">
            <i className="fa-solid fa-image"></i>Add Images
          </label>
        </div>
      }
    </div>
  );
}


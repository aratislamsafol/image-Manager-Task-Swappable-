import React, { useState } from 'react';
import Dropzone from './dropZone/DropZones';
import initialState from './data/data.json';
import Input from './input/Input';
import { ImageProps, ImageManagerProps } from './ImageManagerModel';

const ImageManager = ({ selectLimit }: ImageManagerProps) => {
    const [images, setImages] = useState<ImageProps[]>(initialState);
    const [draggedImage, setDraggedImage] = useState<number | null>(null);
    const [selectedImg, setSelectedImg] = useState<number[]>([]);
    const imgFormat: string[] = ['jpg', 'jpeg', 'png', 'webp'];
    const [selectAllChecked, setSelectAllChecked] = useState(true);

    const onDropStart = (event: React.DragEvent<HTMLDivElement>, id: number) => {
        setDraggedImage(id);
        event.dataTransfer.setData('text/plain', id.toString());
    };

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };
    
    
    const onDrop = (event: React.DragEvent<HTMLDivElement>, id: number) => {
        event.preventDefault();

        const draggedId = event.dataTransfer.getData('text/plain');
        const updatedImages = images.slice();
        const fromIndex = images.findIndex((image) => image.id === parseInt(draggedId, 10));
        const toIndex = images.findIndex((image) => image.id === id);
        if (fromIndex !== -1 && toIndex !== -1) {
            const [movedImage] = updatedImages.splice(fromIndex, 1);
            updatedImages.splice(toIndex, 0, movedImage);
            setImages(updatedImages);
            setDraggedImage(null);
        }
    };

    const onSelected = (id: number) => {
        if (selectedImg.includes(id)) {
            const newImgIds = selectedImg.filter((sImg) => sImg !== id);
            setSelectedImg(newImgIds);
        } else if (!selectLimit || selectedImg.length < selectLimit) {
            setSelectedImg([...selectedImg, id]);
        }
    };

    const handleSelectAllChange = () => {
        if (selectAllChecked) {
            setSelectedImg([]); 
        } else {
            const allImageIds = images.map((image) => image.id);
            setSelectedImg(allImageIds); 
        }
        setSelectAllChecked(selectAllChecked);
    };

    const onDeleted = () => {
        const remainingImages = images.filter((image) => !selectedImg.includes(image.id));
        setImages(remainingImages);
        setSelectedImg([]);
    };

    function getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const handleImageUpload = (file: File, base64Image: string): void => {
        const newFile: ImageProps = {
            id: 0,
            url: '',
            file_name: '',
            createdAt: '',
        };
        newFile.id = getRandomInt(1000, 10000);
        newFile.url = base64Image;
        newFile.file_name = file.name.split('.')[0];
        newFile.createdAt = file.lastModified;
        setImages((prevImages) => [...prevImages, newFile]);
    }

    return (
        <div className="gallery">
            <div className="wrapper">
                {selectedImg.length > 0 ? (
                    <div className="actionContent">
                        <div className="total_selected_img">
                            <input type="checkbox" name="" id="" checked={selectAllChecked}
                                onChange={handleSelectAllChange} />
                            <p>{selectedImg.length} img Selected</p>
                        </div>
                        <button onClick={onDeleted}>Delete Files</button>
                    </div>
                ) : (
                    <div className="actionContent">
                        <p>Gallery</p>
                    </div>
                )}
                <div className="mainContent" style={{position:'relative'}}>
                        <div className="itemLayout ">
                        {images.map((image, index) => (
                            <div key={image.id} className={`item hide ${image.id === draggedImage ? 'dragging' : ''} ${index === 0 ? 'big' : ''} ${
                                    selectedImg.includes(image.id) ? 'activeShadow' : ''
                                } `}
                                draggable={true}
                                onDragStart={(e) => {onDropStart(e, image.id)}}
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, image.id)}>
                                <img src={image.url} style={{visibility: 'hidden', cursor: 'grab'}} key={`Image ${image.id}`} />
                            </div>
                        ))}
       
                        <Dropzone onImageUpload={handleImageUpload} imgFormat={imgFormat} setTime={3000} />
                        </div>

                        <div className="itemLayout" style={{position:'absolute', top:0, left:0}}>
                            {images.map((image, index) => (
                                <div key={image.id}  className={`item ${image.id === draggedImage ? 'dragging' : ''} ${index === 0 ? 'big' : ''} ${selectedImg.includes(image.id)?'activeShadow':''} `} draggable={true} onDragStart={(e) => {onDropStart(e, image.id)}} onDragOver={onDragOver} onDrop={(e) => onDrop(e, image.id)} style={{transformOrigin: '200px 200px', transition: 'transform 200ms linear 200s', transform:'translate3d(0,0,0), scaleX(1), scaleY(1)'}}>
                                   
                                    <img src={image.url} alt={`Image ${image.id}`} />
                                    <Input type="checkbox"  checked={selectedImg.includes(image.id)} name="" id="" className={selectedImg.includes(image.id)?'active':''}
                                        onChange={() => onSelected(image.id)}
                                        disabled={
                                            !!selectLimit &&
                                            selectedImg.length >= selectLimit &&
                                            !selectedImg.includes(image.id)
                                        }
                                    />
                                    <div className="overlay"></div>
                                </div>
                            ))}
                            <Dropzone onImageUpload={handleImageUpload} imgFormat={imgFormat} setTime={10000} />
                        </div>
                </div>
               
            </div>
        </div>
    );
};

export default ImageManager;

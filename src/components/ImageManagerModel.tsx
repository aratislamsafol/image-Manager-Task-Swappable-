export type ImageProps = {
    id: number;
    url: string;
    file_name: string;
    createdAt: string | number;
}
export type ImageManagerProps = {
    selectLimit?: number;
}
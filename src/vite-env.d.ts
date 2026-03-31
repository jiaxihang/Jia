/// <reference types="vite/client" />

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    const src: string;
    export default src;
}

declare module 'virtual:posts' {
    import type { BlogPost } from './data/posts';

    export const posts: BlogPost[];
}

declare module 'virtual:columns' {
    import type { ColumnEntry } from './data/columns';

    export const columnEntries: ColumnEntry[];
}
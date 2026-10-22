export interface Crumbs {
    Text: string;
    OnClick?(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void; // Change to anchor element
}

export interface PageBreadCrumbsProps {
    Links: Array<Crumbs>;
    Active: string;
}
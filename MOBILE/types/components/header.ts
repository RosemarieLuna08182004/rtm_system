
export interface HeaderProps {
    tintColor?: string;
    visible?: string;
    ToggleFetch?: boolean;
    title?: string;
}

export interface ProfileHeaderProps {
    name: string;
    username: string;
    avatarUrl: string;
};

export const imageInitial : ProfileHeaderProps = {
    name: "Guest",
    username: "guest@rtm.com",
    avatarUrl: "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
}

export interface SecondaryHeaderProps {
    title:string;
    subtitle?:string;
    termStatus?:string;
    chapterId?:number;
    userTermsId?:number;
    termId?:number;
    isTermLine?:boolean;
  
}
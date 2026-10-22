export interface Logs {
    CreatedBy?:number
    DateCreated?:Date|string
    UpdatedBy?:number
    DateUpdated?:Date|string
}

export enum NodeEnvironment {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development',
    TESTING = 'testing'
}
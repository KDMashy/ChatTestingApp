export interface IMessageDto {
    created_at?: string,
    sender: string,
    receiver: string,
    message: string,
    side?:boolean
}
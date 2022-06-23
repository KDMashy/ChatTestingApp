export interface IMessageDto {
    id: number,
    sender: string,
    receiver: string,
    message: string,
    sent_date: string,
    edited: number,
    deleted: number,
    sent?:boolean,
    side?:boolean
}
export const ChatUtils = ({
    /**
   * 
   * @param collection generic for the lists that is in response
   * @param list List to fill up
   * @returns list of messages
   */
  loadMessages(collection: any, list: any, loginName: string, collectionName: string) {
    collection.forEach((item: any) => {
      let newMessage = {
        id: item.id,
        sender: item.sender,
        receiver: item.receiver,
        message: item.message,
        sent_date: item.sent_date,
        edited: item.edited,
        sent: false,
        side: false
      };
      if(item.sender === loginName){
        newMessage.side = true;
      }

      if(collectionName === 'sent'){
        newMessage.sent=true;
      }
      list.push(newMessage);
    });
    return list;
  }
});
export const ChatUtils = ({
    /**
   * 
   * @param collection generic for the lists that is in response
   * @param list List to fill up
   * @returns list of messages
   */
  loadMessages(collection: any, list: any, loginName: string) {
    collection.forEach((item: any) => {
      let newMessage = {
        sender: item.sender,
        receiver: item.receiver,
        message: item.message,
        side: false
      };
      if(item.sender === loginName){
        newMessage.side = true;
      }
      list.push(newMessage);
    });
    return list;
  }
});
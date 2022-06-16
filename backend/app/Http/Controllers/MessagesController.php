<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Messages;
use App\Models\NewMessages;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\Cache;
use stdClass;

class MessagesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    private function getAuth() {
        require_once('AuthController.php');
        return new AuthController;
    }

    /**
     * Authenticated user name
     */
    public function getAuthUserName() {
        $object = json_encode($this->getAuth()->me());
        $name = explode(",", $object);
        return $name = rtrim(substr($name[2], 8), '"');
    }

    /**
     * User names to send message to
     */
    public function getUsersToChat() {
        $users = User::all();
        $names = [];

        foreach($users as $user){
            array_push($names, $user->name);
        }

        return response()->json([
            'users' => $names,
        ]);
    }

    public function sendMessage() {
        $message = NewMessages::create([
            'sender' => $this->getAuthUserName(),
            'receiver' => request()->get('receiver'),
            'message' => request()->get("message"),
        ]);

        return response()->json([
            'sentMessage' => $message,
        ]);
    }

    /**
     * Set new message readed on being seen
     */
    public function seenCheck() {
        $newMessages = NewMessages::where([
                ['sender', request()->get('name')],
                ['receiver', $this->getAuthUserName()]
            ])
            ->get();

        foreach($newMessages as $message){
            Messages::create([
                'sender' => $message->sender,
                'receiver' => $message->receiver,
                'message' => $message->message
            ]);

            NewMessages::where('id', $message->id)->delete();
        }

        return response()->json([
            'message' => 'Seen messages',
        ]);
    }

    private function messagesQuery() {
        return  Messages::select('created_at','sender','receiver','message')
            ->where([
                ['sender', $this->getAuthUserName()],
                ['receiver', request()->get('name')]
            ])
            ->orWhere([
                ['sender', request()->get('name')],
                ['receiver', $this->getAuthUserName()]
            ])
            ->get();
    }

    private function messageCache() {
        return Cache::remember('message-cache', 60, function() {
            return $this->messagesQuery();
        });
    }

    public function getMessages() {
        /**
         * Get readed messages
         */
        $read = '';
        if(Cache::get('message-cache') &&
         Cache::get('cached-user') == request()->get('name')){
            $read = Cache::get('message-cache');
        } else {
            $read = $this->messagesQuery();
            $this->messageCache();
            Cache::remember('cached-user', 60, function() {
                return request()->get('name');
            });
        }

        /**
         * Get new messages
         */
        $unreaded = NewMessages::select('created_at','sender','receiver','message')
            ->where('receiver', $this->getAuthUserName())
            ->where('sender', request()->get('name'))
            ->get();

        $sent = NewMessages::select('created_at','sender','receiver','message')
            ->where('sender', $this->getAuthUserName())
            ->where('receiver', request()->get('name'))
            ->get();

        /**
         * If needed, update cache
         */
        if(count($unreaded) > 0){
            $this->seenCheck();

            Cache::forget('message-cache');
            $this->messageCache();

            if(count($sent) > 0 && $this->getAuthUserName() != request()->get('name')){
                return response()->json([
                    'readed' => $read,
                    'unreaded' => $unreaded,
                    'sent' => $sent
                ]);
            } else {
                return response()->json([
                    'readed' => $read,
                    'unreaded' => $unreaded
                ]);
            }
        }

        if(count($sent) > 0 && $this->getAuthUserName() != request()->get('name')){
            return response()->json([
                'readed' => $read,
                'sent' => $sent
            ]);
        }

        return response()->json([
            'readed' => $read
        ]);
    }

    /**
     * Check if theres new message from somebody
     */
    public function getUnreadedShow() {
        $unreaded = NewMessages::where('receiver', $this->getAuthUserName())
            ->get();

        $chat = array();
        foreach($unreaded as $unread){
            if(!in_array($unread->sender, $chat)){
                array_push($chat, $unread->sender);
            }
        }

        if(count($chat) <= 0){
            $chat = 'nope';
        }

        return response()->json([
            'received' => $chat
        ]);
    }
}

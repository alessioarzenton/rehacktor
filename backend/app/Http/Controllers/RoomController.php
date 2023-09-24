<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Twilio\Rest\Client;
use Twilio\Jwt\AccessToken;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Twilio\Jwt\Grants\VideoGrant;
use Illuminate\Support\Facades\Auth;
use Twilio\Exceptions\TwilioException;
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{
    public function __construct(){
        $this->middleware("auth:api", [ "except" => [ "roomsByGame", "roomsActive"] ] );
    }

    public function create(Request $request){

        $user = Auth::user();

        if(Room::where('user_id', $user->id)->where('closed_at',null)->first()) {
            return response()->json([
                'success' => false,
                'message' => "This user has already an active room"
            ], 400); # bad request
        }

        $validator = Validator::make($request->all(),[
            'game_id' => 'required|numeric',
            'game_name' => 'required|string',
            'max_seats_available' => 'required|numeric|between:1,10',
        ]);

        if($validator->fails()){
            return response()->json([
                'success' => false,
                'message' => $validator->messages()->toArray()
            ], 400); # bad request
        }

        $newRoom = Room::create([
            'user_id' => $user->id, 
            'game_id' => $request->game_id,
            'game_name' => $request->game_name,
            'max_seats_available' => $request->max_seats_available
        ]);  


        // Account SID and Auth Token at twilio.com/console
        $sid = getenv("TWILIO_ACCOUNT_SID");
        $userSid = getenv("TWILIO_USER_SID");
        $token = getenv("TWILIO_AUTH_TOKEN");

        $twilio = new Client($sid, $token);
   
        $room_name =  "rehacktor_" . $newRoom->id;
        $room = $twilio->video->v1->rooms->create(["uniqueName" => $room_name]);

        // Genero un access token per Client-JS

        // A unique identifier for this user
        $identity = $room_name;

        // Create access token, which we will serialize and send to the client
        $token = new AccessToken(
            $userSid,   # Twilio USER SID
            $sid,       # Twilio API SID
            $token,     # Twilio SECRET
            3600, $identity);

        // Create Video grant
        $videoGrant = new VideoGrant();
        $videoGrant->setRoom($room_name);
        
        // Add grant to token
        $token->addGrant($videoGrant);

        return response()->json([
            "status" => "ok",
            "room_id" => $newRoom->id,
            "twillio" => [
                "room_sid" => $room->sid,
                "room_name" => $room_name,
                "jwt" => $token->toJWT()
            ]
        ], 201);
    }

    public function close(){
        $activeRoom = Room::where('user_id',Auth::user()->id)->where('closed_at',null)->first();

        if(!$activeRoom) {
            return response()->json(["status"=>"ok, no room"], 200);
        }

        $activeRoom->closed_at = Carbon::now()->format('d-M-Y H:i:s');
        $activeRoom->save();   
            
        $room_name =  "rehacktor_" . $activeRoom->id;

        $sid = getenv("TWILIO_ACCOUNT_SID");
        $token = getenv("TWILIO_AUTH_TOKEN");

        $twilio = new Client($sid, $token);
        
        try {

            $room = $twilio->video->v1->rooms($room_name)->update("completed");

        } catch (TwilioException $e) {
            return response()->json(["status"=>"ok, room closed. was already colosed on twilio"], 200);
        }
        

        return response()->json(["status"=>"ok, room closed"], 200);
    }

    public function join(Request $request)
    {
        $user = Auth::user();
        
        $room_id = $request->input('room_id');
        
        $room = Room::find($room_id);

        if($room->closed_at) {
            return response()->json("room closed");
        }

        if($room->seats == $room->max_seats_available) {
            return response()->json("no more seats available");
        }

        $room->seats++;

        $room->save();

        $room_name =  "rehacktor_" . $room->id;

        $sid = getenv("TWILIO_ACCOUNT_SID");
        $token = getenv("TWILIO_AUTH_TOKEN"); // Secret
        $userSid = getenv("TWILIO_USER_SID");
  
        $identity = "User Watcher " . $user->id . " on room " . $room->id; 

        // Create access token, which we will serialize and send to the client
        $token = new AccessToken(
            $userSid,   # USER SID
            $sid,       # API SID
            $token,     # SECRET
            3600, $identity);

        // Create Video grant
        $videoGrant = new VideoGrant();
        $videoGrant->setRoom($room_name); 

        // Add grant to token
        $token->addGrant($videoGrant);

        return response()->json([
            'jwt' => $token->toJWT(),
            'room_name' => $room_name
        ]);
    }

    public function streamerInfo(Room $room){
        
        $streamer_id = $room->user->name;
        $game_name = $room->game_name;      
        
        return response()->json([
            'streamer' => $streamer_id,
            'game_name' => $game_name
        ]); 
        
    }

    public function roomsActive(Request $request) {
        $rooms = Room::with('user:id,name')->where('closed_at',null)->get();
        return response()->json($rooms);
    }   

    public function roomsByGame(Request $request) {
        $rooms = Room::with('user:id,name')->where('game_id',$request->game_id)->where('closed_at',null)->get();
        return response()->json($rooms);
    }
}

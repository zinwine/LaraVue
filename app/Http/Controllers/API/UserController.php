<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\User;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(\Gate::allows('isAdmin') || \Gate::allows('isAuthor')){
            return User::latest()->paginate(2);
        }
    }

    public function search()
    {
        if(\Request::get('s') && \Request::get('s') != ""){
            $search = \Request::get('s');
            $users = User::where('name', 'LIKE', "%$search%")
            ->orWhere('email', 'LIKE', "%$search%")
            ->orWhere('type', 'LIKE', "%$search%")
            ->paginate(5);
        }else{
            $users = User::latest()->paginate(2);
        }
        return $users;
    }

    public function profile()
    {
        return auth('api')->user();
    }

    public function Updaterofile(Request $request)
    {
        $user = auth('api')->user();

        $image= $request->file('image');
        $imageName = uniqid().'_'.$image->getClientOriginalName();
        $image->move(public_path().'/uploads/gallery/',$imageName);

        return $request->photo;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required | min: 3 | max: 50',
            'email' => 'required | min: 3 | max: 50',
            'password' => 'required | min: 6 | max: 50',
            'type' => 'required'
        ]);

        if($request->photo == null){
            $img = "avatar04.png";
        }else{
            $img = $request->photo;
        }
 
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'photo' => $img,
            'type' => $request->type,
            'bio' => $request->bio
        ]);
            // return $request->password;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'name' => 'required | min: 3 | max: 50',
            'email' => 'required | min: 3 | email | max: 50',
            'password' => 'required | min: 6 | max: 50',
            'type' => 'required'
        ]);

        $user = User::findOrFail($id);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->type = $request->type;
        $user->bio = $request->bio;
        $user->photo = $request->photo;
        $user->update();

        // $user->update($request->all());

        return "success updated $id";
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->authorize('isAdmin');
        User::find($id)->delete();
    }
}

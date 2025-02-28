<?php

namespace App\Http\Controllers;
use App\Mail\SendWelcomeMail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class OTPController extends Controller
{
    public function sendEmail()
    {
        $mailData = [
            'title' => 'TESTING MAIL NI ',
            'body' => 'FROM LARAVEL NI TOMAS AND FRIENDS'
        ];

        Mail::to('occ.vacalares.tomjoseph111@gmail.com')->send(new SendWelcomeMail($mailData));
        dd('Email is sent successfully.');
    }

    public function sendOtp(Request $request)
    {
        $validatedData = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);
 
        $user = User::where('email', $validatedData['email'])->first();

        if (!$user || !Hash::check($validatedData['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);  
        }
 
        $otp = random_int(100000, 999999);
 
        $user->otp = $otp;
        $user->otp_expiry = now()->addMinutes(5);
        $user->save();
 
        $mailData = [
            'title' => 'Your OTP Code',
            'body' => "Your OTP code is $otp. It will expire in 5 minutes.",
        ];

        Mail::to($user->email)->send(new SendWelcomeMail($mailData));

        return response()->json(['message' => 'OTP sent to your email.']);
    }

    public function verifyOtp(Request $request)
    {
        $validatedData = $request->validate([
            'email' => ['required', 'string', 'email'],
            'otp' => ['required', 'integer'],
        ]);
 
        $user = User::where('email', $validatedData['email'])->first();

        if (!$user || $user->otp !== $validatedData['otp'] || $user->otp_expiry < now()) {
            return response()->json([
                'message' => 'Invalid or expired OTP.',
            ], 401);  
        }
 
        $user->otp = null;
        $user->save();

        // Create token after OTP verification
        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'message' => 'Login successful.',
        ]);
    }
    public function validateCredentials(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            return response()->json(['valid' => true]);
        } else {
            return response()->json(['valid' => false], 401);
        }
    }

}

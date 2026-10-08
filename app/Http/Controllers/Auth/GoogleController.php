<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::findOrCreateFromGoogle($googleUser);

            if ($user->is_banned) {
                return redirect()->route('login')->with('error', 'Your account has been suspended.');
            }

            Auth::login($user, remember: true);

            return redirect()->route($user->isAdmin() ? 'admin.dashboard' : 'home')
                ->with('success', 'Successfully logged in with Google! Welcome to Ketab-Khana.');

        } catch (\Exception $e) {
            return redirect()->route('login')
                ->with('error', 'Google login failed. Please try again or use email login.');
        }
    }
}

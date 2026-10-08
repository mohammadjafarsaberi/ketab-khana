<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $route = $request->user()->isAdmin() ? 'admin.dashboard' : 'home';

        return redirect()->intended(route($route, absolute: false));
    }
}

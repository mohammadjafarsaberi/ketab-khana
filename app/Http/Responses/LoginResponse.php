<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $redirect = $request->string('redirect')->toString();

        if (str_starts_with($redirect, '/') && ! str_starts_with($redirect, '//')) {
            $request->session()->put('url.intended', $redirect);
        }

        $route = $request->user()->isAdmin() ? 'admin.dashboard' : 'home';

        return redirect()->intended(route($route, absolute: false));
    }
}

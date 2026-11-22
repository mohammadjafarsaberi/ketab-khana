<?php

arch('controllers follow the controller naming convention')
    ->expect('App\Http\Controllers')
    ->classes()
    ->toHaveSuffix('Controller');

arch('form requests follow the request naming convention')
    ->expect('App\Http\Requests')
    ->classes()
    ->toHaveSuffix('Request');

arch('policies follow the policy naming convention')
    ->expect('App\Policies')
    ->classes()
    ->toHaveSuffix('Policy');

arch('models do not depend on the HTTP layer')
    ->expect('App\Models')
    ->not->toUse('App\Http');

arch('application code does not use debugging functions')
    ->expect(['dd', 'dump', 'ray'])
    ->not->toBeUsed();
